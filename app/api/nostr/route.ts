import { NextRequest, NextResponse } from "next/server";
import WebSocket from "ws";
import { nip19 } from "nostr-tools";

interface RequestBody {
	npub: string;
	relayUrl: string;
}

interface NostrEvent {
	id: string;
	pubkey: string;
	created_at: number;
	kind: number;
	tags: string[][];
	content: string;
	sig: string;
}

interface UserData {
	account_id: string;
	profile_picture_url: string;
	content: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: RequestBody = await request.json();
		const { npub, relayUrl } = body;
		if (!npub || !relayUrl) {
			return NextResponse.json(
				{ message: "Missing npub or relayUrl in the request body" },
				{ status: 400 }
			);
		}
		const pubkey = nip19.decode(npub).data as string;
		const userData = await fetchNostrUserData(pubkey, relayUrl);
		return NextResponse.json(userData);
	} catch (error) {
		console.error("Error fetching user data:", error);
		return NextResponse.json(
			{ message: "Internal Server Error", error: (error as Error).message },
			{ status: 500 }
		);
	}
}

function removeUrls(text: string): string {
	// This regex matches URLs and nostr: protocol links
	const urlRegex = /(https?:\/\/[^\s]+)|(nostr:[^\s]+)/g;
	return text.replace(urlRegex, "").trim();
}

async function fetchNostrUserData(
	pubkey: string,
	relayUrl: string
): Promise<UserData> {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(relayUrl);
		const userData: UserData = {
			account_id: pubkey,
			profile_picture_url: "",
			content: "",
		};
		const contents: string[] = [];

		ws.on("open", () => {
			const subId = Math.random().toString(36).substring(2, 15);
			const requestEvent: [string, string, object] = [
				"REQ",
				subId,
				{
					authors: [pubkey],
					kinds: [0, 1], // kind 0 for metadata, kind 1 for posts
					limit: 100,
				},
			];
			ws.send(JSON.stringify(requestEvent));
			console.log("Request sent:", requestEvent);
		});

		ws.on("message", (data: WebSocket.RawData) => {
			const [eventType, , event]: [string, unknown, NostrEvent] = JSON.parse(
				data.toString()
			);
			if (eventType === "EVENT") {
				if (event.kind === 0) {
					// Metadata event
					const metadata = JSON.parse(event.content);
					userData.profile_picture_url = metadata.picture || "";
				} else if (event.kind === 1) {
					// Post event
					const cleanContent = removeUrls(event.content);
					if (cleanContent) {
						contents.push(cleanContent);
					}
				}
			} else if (eventType === "EOSE") {
				// End of Stored Events
				userData.content = contents.join("\n");
				ws.close();
				resolve(userData);
			}
		});

		ws.on("error", (error: Error) => {
			reject(error);
		});

		// Set a timeout in case the relay doesn't respond
		setTimeout(() => {
			ws.close();
			if (contents.length > 0 || userData.profile_picture_url) {
				userData.content = contents.join("\n");
				resolve(userData);
			} else {
				reject(new Error("Timeout while fetching user data"));
			}
		}, 30000); // 30 seconds timeout
	});
}
