import WebSocket from "ws"; // 修正: デフォルトインポートに変更
import { nip19 } from "nostr-tools";
import { NextResponse } from "next/server";

function cleanContent(content: string) {
	// 型を指定
	content = content.replace(/https?:\/\/\S+/g, "");
	content = content.replace(/nostr:note\S+/g, "");
	return content
		.split("\n")
		.filter((line) => line.trim() !== "")
		.join("\n")
		.trim();
}

function queryRelay(relay: string, pubkey: string) {
	// 型を指定
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(relay);
		ws.on("open", () => {
			const subId = Math.random().toString(36).substring(2, 15);
			const req = JSON.stringify([
				"REQ",
				subId,
				{
					authors: [pubkey],
					kinds: [0, 1],
					limit: 3000,
				},
			]);
			ws.send(req);
		});
		const events = {
			metadata: null,
			posts: [] as string[], // ここで型を指定
		};
		const timeout = setTimeout(() => {
			ws.close();
			resolve(events);
		}, 10000); // 10秒のタイムアウト
		ws.on("message", (data: WebSocket.Data) => {
			// 型を指定
			const message = JSON.parse(data.toString()); // Bufferを文字列に変換
			if (message[0] === "EVENT" && message[2]) {
				if (message[2].kind === 0) {
					events.metadata = message[2];
				} else if (message[2].kind === 1) {
					const cleanedContent = cleanContent(message[2].content);
					if (cleanedContent) {
						events.posts.push(cleanedContent);
					}
				}
			}
		});
		ws.on("close", () => {
			clearTimeout(timeout);
			resolve(events);
		});
		ws.on("error", (error) => {
			reject(error);
		});
	});
}

export async function POST(request: Request) {
	const req = await request.json();

	console.log("=========================res.query", req);
	if (!req || typeof req.npub !== "string") {
		// 修正: npubの型チェックを追加
		return NextResponse.json({
			error: `Missing or invalid npub parameter: ${req}`,
		});
	}

	try {
		const pubkey: any = nip19.decode(req.npub).data; // 修正: req.npubを使用
		const relays = ["wss://relay.damus.io"];
		let accountInfo: { name?: string; created_at?: string } | null = null; // 型を指定
		let allPosts: string[] = []; // 型を指定

		for (const relay of relays) {
			try {
				const events: any = await queryRelay(relay, pubkey);
				if (events.metadata && !accountInfo) {
					const parsedContent = JSON.parse(events.metadata.content as string); // 型アサーションを追加
					accountInfo = {
						name: parsedContent.name || parsedContent.display_name,
						created_at: new Date(
							events.metadata.created_at * 1000
						).toISOString(),
					};
				}
				allPosts = allPosts.concat(events.posts);
			} catch (error) {
				console.error(`Error querying ${relay}:`, error);
			}
		}

		// 重複を削除
		const uniquePosts = [...new Set(allPosts)];

		// JSONオブジェクトを作成
		const result = {
			account: accountInfo,
			posts: uniquePosts,
		};

		NextResponse.json(result);
	} catch (error) {
		console.error("Error processing request:", error);
		NextResponse.json({ error: "Internal Server Error" });
	}

	return NextResponse.json({ message: "Hello, World!" });
}
