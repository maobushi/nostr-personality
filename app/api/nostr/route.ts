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
	username: string;
	decoded_pubkey: string;
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
		return NextResponse.json(
			{ message: "Internal Server Error", error: (error as Error).message },
			{ status: 500 }
		);
	}
}

function removeUrls(text: string): string {
	const urlRegex = /(https?:\/\/[^\s]+)|(nostr:[^\s]+)/g;
	return text.replace(urlRegex, "").trim();
}

function removeNostrOxtrDev(text: string): string {
	return text.replace(/nostr\.oxtr\.dev/g, "").trim();
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
			username: "",
			decoded_pubkey: nip19.npubEncode(pubkey),
		};
		const contents: string[] = [];
		let metadataReceived = false;
		let postsReceived = false;

		ws.on("open", () => {
			const subId = Math.random().toString(36).substring(2, 15);
			const requestMetadata: [string, string, object] = [
				"REQ",
				`${subId}_metadata`,
				{
					authors: [pubkey],
					kinds: [0],
					limit: 1,
				},
			];
			const requestPosts: [string, string, object] = [
				"REQ",
				`${subId}_posts`,
				{
					authors: [pubkey],
					kinds: [1],
					limit: 1500,
				},
			];
			ws.send(JSON.stringify(requestMetadata));
			ws.send(JSON.stringify(requestPosts));
		});

		ws.on("message", (data: WebSocket.RawData) => {
			try {
				const [eventType, subId, event]: [string, string, NostrEvent] =
					JSON.parse(data.toString());

				if (eventType === "EVENT") {
					if (event.kind === 0 && subId.endsWith("_metadata")) {
						metadataReceived = true;
						try {
							const metadata = JSON.parse(event.content);
							userData.profile_picture_url = metadata.picture || "";
							userData.username = metadata.name || metadata.displayName || "";
						} catch (error) {
							// Error handling for metadata parsing
						}
					} else if (event.kind === 1 && subId.endsWith("_posts")) {
						const cleanContent = removeUrls(event.content);
						const finalContent = removeNostrOxtrDev(cleanContent);
						if (finalContent) {
							contents.push(finalContent);
						}
					}
				} else if (eventType === "EOSE") {
					if (subId.endsWith("_metadata")) {
						metadataReceived = true;
					} else if (subId.endsWith("_posts")) {
						postsReceived = true;
					}

					if (metadataReceived && postsReceived) {
						userData.content = contents.join("\n");
						ws.close();
						resolve(userData);
					}
				}
			} catch (error) {
				// Error handling for message processing
			}
		});

		ws.on("error", (error: Error) => {
			reject(error);
		});

		ws.on("close", () => {
			// WebSocket closed
		});

		setTimeout(() => {
			ws.close();
			if (
				contents.length > 0 ||
				userData.profile_picture_url ||
				userData.username
			) {
				userData.content = contents.join("\n");
				resolve(userData);
			} else {
				reject(new Error("Timeout while fetching user data"));
			}
		}, 60000); // 60 seconds timeout
	});
}