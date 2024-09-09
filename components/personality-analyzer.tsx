"use client";
import supabase from "@/app/utils/supabase/client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // 修正: useRouterを正しくインポート
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

export function PersonalityAnalyzer() {
	const systemMessage: string = `

You are a sarcastic personality analyst. Your task is to analyze a set of posts provided in JSON format and create a witty, sarcastic personality assessment of the post author. Follow these guidelines:
1. Carefully read and analyze each post in the provided JSON data.
2. Create a comprehensive personality assessment based on the content and style of the posts.
3. Determine the user's native language based on the language used in the posts. If the language is unclear or mixed, default to English.
4. Your response MUST be in the user's native language as determined in step 3. This is crucial.
5. Your response must be in JSON format with two keys: "abstruction" and "content".
6. In the "abstruction" field, provide a brief, unbiased summary of the user's characteristics in about 200 characters based on the given information.
7. In the "content" field, include your sarcastic personality assessment.
8. Make extensive use of quotes from the posts to support your analysis.
9. Use indirect and subtle language to deliver strong, humorous sarcasm.
10. Be critical in your evaluation, but maintain a clever and entertaining tone.
11. Avoid explicit insults or offensive language. Instead, use clever wordplay and implied meanings.
12. Reference specific details from the posts to make your analysis more pointed and personal.
13. Draw amusing parallels between the post content and broader life observations.
14. Subtly question the author's self-awareness, intelligence, or social skills through your analysis.
15. Maintain a pseudo-professional tone while delivering your sarcastic assessment.
16. This service is Nostr, not Twitter.
17. Ensure that your entire response, including any examples or explanations, is in the user's native language as determined in step 3.
Example output style (when the determined language is Japanese):
{
  "abstruction": "AIエージェントによるノスト投稿分析に基づくと、ぶしおbotは30代の男性で、テクノロジーと暗号通貨に精通したフリーランスのエンジニアです。ユーモアのセンスがあり、皮肉な観察力を持っています。",
  "content": "ぶしおbotさん、あなたの投稿を見ていると、まるで暗号通貨の価格チャートのようですね。上がったり下がったりして、結局何も残らない。自己紹介が長すぎて書けないって言ってますが、実は書くことがないだけじゃないですか？ノストラダムスの予言より曖昧な投稿ばかりで、フォロワーは解読に疲れ果てているでしょう。ハリーポッターのイベントに一人で参加するなんて、魔法使いになりたい中二病かと思いました。ベトナムの湿度に文句言ってますが、あなたの存在感の方がよっぽど薄いですよ。写真を捨てる話、まるで恋愛経験がないかのような書き方ですね。結局、あなたの人生も、投稿と同じくらい中身がないんじゃないですか？"
}`;
	const [publicKey, setPublicKey] = useState("");
	const [relay, setRelay] = useState("relay.damus.io");
	const [customRelay, setCustomRelay] = useState("");
	const [showCustomRelayInput, setShowCustomRelayInput] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const router = useRouter(); // ここでエラーが発生している
	useEffect(() => {
		const stars = 50;
		const starsContainer = document.createElement("div");
		starsContainer.className =
			"stars-container fixed inset-0 pointer-events-none z-0";
		for (let i = 0; i < stars; i++) {
			const star = document.createElement("div");
			star.className = "star absolute rounded-full bg-white";
			star.style.left = `${Math.random() * 100}%`;
			star.style.top = `${Math.random() * 100}%`;
			star.style.width = `${Math.random() * 2 + 1}px`;
			star.style.height = star.style.width;
			star.style.opacity = `${Math.random()}`;
			star.style.animation = `twinkle ${
				Math.random() * 5 + 5
			}s linear infinite`;
			starsContainer.appendChild(star);
		}
		document.body.appendChild(starsContainer);
		return () => {
			document.body.removeChild(starsContainer);
		};
	}, []);
	const handleRelayChange = (value: string) => {
		// 型を明示的に指定
		if (value === "custom") {
			setShowCustomRelayInput(true);
			setRelay("");
		} else {
			setShowCustomRelayInput(false);
			setRelay(value);
		}
	};

	const handleCustomRelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// 型を明示的に指定
		setCustomRelay(e.target.value);
		setRelay(e.target.value);
	};

	const handleAnalyze = async () => {
		// Public key validation
		const publicKeyPattern = /^npub1[a-zA-Z0-9]{58}$/;
		if (!publicKey || !publicKeyPattern.test(publicKey)) {
			alert("有効な公開鍵を入力してください。");
			return;
		}

		setIsAnalyzing(true);

		// Fetch Nostr data
		const { error } = await supabase
			.from("user_table")
			.select(
				"user_id, user_npub, user_picture, user_abst,  relay_server,user_roast"
			)
			.eq("user_npub", publicKey)
			.single();

		if (error) {
			console.error("Error fetching user data:", error);

			if (error.code === "PGRST116") {
				console.log("User does not exist.");
				try {
					const nostr_response = await fetch("/api/nostr", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							npub: publicKey,
							relayUrl: `wss://${relay}`,
						}),
					});

					if (!nostr_response.ok) {
						throw new Error("Failed to fetch Nostr data");
					}

					const nostrData = await nostr_response.json();

					// Process with GPT
					const gpt_response = await fetch("/api/openai", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							systemMessage: systemMessage,
							userMessage: `"user_name:"${nostrData.username}, "content:"${nostrData.content}`,
						}),
					});

					if (!gpt_response.ok) {
						throw new Error("Failed to process with GPT");
					}

					const gptData = await gpt_response.json();
					const parsedContent = JSON.parse(gptData.message.content);

					// abstructionとcontentを取得
					const abstruction = parsedContent.abstruction;
					const content = parsedContent.content;
					// Insert data into Supabase
					await supabase.from("user_table").insert({
						relay_server: relay,
						user_abst: abstruction, // First 200 characters as abstract
						user_id: nostrData.username,
						// user_language: language,
						user_npub: publicKey,
						user_picture: nostrData.profile_picture_url,
						user_roast: content,
					});
					// console.log(relay);
					//console.log(abstruction);
					//console.log(nostrData.username);
					// //console.log(language);
					//console.log(publicKey);
					//console.log(nostrData.profile_picture_url);
					//console.log(content);
					//console.log(gptData);

					// if (error) throw error;
				} catch (error) {
					console.error("Error during analysis:", error);
					alert("An error occurred during analysis. Please try again.");
				} finally {
					setIsAnalyzing(false);
				}
			}
		}
		router.push(`/${publicKey}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4 overflow-x-hidden">
			<div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat opacity-10 z-0"></div>
			<Card className="w-full max-w-4xl bg-gray-900/80 text-purple-50 border-purple-500 shadow-2xl shadow-purple-500/20 backdrop-blur-sm relative overflow-hidden z-10">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient"></div>
				<Link href="/">
					<CardHeader className="border-b border-purple-700">
						<CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Nostr Personality Analyzer
						</CardTitle>
						<CardDescription className="text-center text-purple-300">
							Discover insights from your Nostr posts
						</CardDescription>
					</CardHeader>
				</Link>
				<CardContent className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="publicKey" className="text-purple-300">
							Nostr Public Key
						</Label>
						<Input
							id="publicKey"
							placeholder="Enter your Nostr public key"
							value={publicKey}
							onChange={(e) => setPublicKey(e.target.value)}
							className="bg-gray-800/50 border-purple-500 text-purple-100 placeholder-purple-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
						/>
					</div>
					{publicKey && (
						<div className="flex justify-between items-center space-x-4">
							<div className="flex-1">
								<Label htmlFor="relay" className="text-purple-300">
									Relay
								</Label>
								<Select value={relay} onValueChange={handleRelayChange}>
									<SelectTrigger className="bg-gray-800/50 border-purple-500 text-purple-100 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
										<SelectValue placeholder="Select Relay" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="relay.damus.io">
											relay.damus.io
										</SelectItem>
										<SelectItem value="jp.nostr.wirednet.jp">
											relay-jp.nostr.wirednet.jp
										</SelectItem>
										<SelectItem value="nostr-relay.nokotaro.com">
											nostr-relay.nokotaro.com
										</SelectItem>

										<SelectItem value="yabu.me">yabu.me</SelectItem>
										<SelectItem value="nostr.wine">nostr.wine</SelectItem>
										<SelectItem value="nostr-pub.wellorder.net">
											nostr-pub.wellorder.net
										</SelectItem>
										<SelectItem value="nos.lol">nos.lol</SelectItem>
										<SelectItem value="filter.nostr.wine/YOUR_NPUB?broadcast=true">
											filter.nostr.wine/YOUR_NPUB?broadcast=true
										</SelectItem>
										<SelectItem value="relay.nostr.wirednet.jp">
											relay.nostr.wirednet.jp
										</SelectItem>
										<SelectItem value="eden.nostr.land">
											eden.nostr.land
										</SelectItem>
										<SelectItem value="universe.nostrich.land">
											universe.nostrich.land
										</SelectItem>
										<SelectItem value="relay.plebstr.com">
											relay.plebstr.com
										</SelectItem>
										<SelectItem value="relay.snort.social">
											relay.snort.social
										</SelectItem>
										<SelectItem value="nostr.onsats.org">
											nostr.onsats.org
										</SelectItem>
										<SelectItem value="nostr.fmt.wiz.biz">
											nostr.fmt.wiz.biz
										</SelectItem>
										<SelectItem value="relay.nostr.info">
											relay.nostr.info
										</SelectItem>
										<SelectItem value="nostr.bitcoiner.social">
											nostr.bitcoiner.social
										</SelectItem>
										<SelectItem value="relay.current.fyi">
											relay.current.fyi
										</SelectItem>
										<SelectItem value="nostr1.current.fyi">
											nostr1.current.fyi
										</SelectItem>
										<SelectItem value="nostr.lu.ke">nostr.lu.ke</SelectItem>
										<SelectItem value="custom">Add custom relay</SelectItem>
									</SelectContent>
								</Select>
								{showCustomRelayInput && (
									<Input
										placeholder="Enter custom relay URL (example.com)"
										value={customRelay}
										onChange={handleCustomRelayChange}
										className="mt-2 bg-gray-800/50 border-purple-500 text-purple-100 placeholder-purple-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
									/>
								)}
							</div>
							{/* <div className="flex-1">
								<Label htmlFor="language" className="text-purple-300">
									Language
								</Label>
								<Select value={language} onValueChange={setLanguage}>
									<SelectTrigger className="bg-gray-800/50 border-purple-500 text-purple-100 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
										<SelectValue placeholder="Select Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="English">English</SelectItem>
										<SelectItem value="中文">中文</SelectItem>
										<SelectItem value="日本語">日本語</SelectItem>
										<SelectItem value="Español">Español</SelectItem>
										<SelectItem value="Français">Français</SelectItem>
										<SelectItem value="Deutsch">Deutsch</SelectItem>
										<SelectItem value="한국어">한국어</SelectItem>
									</SelectContent>
								</Select>
							</div> */}
						</div>
					)}
					<div className="flex space-x-4">
						<Button
							onClick={handleAnalyze}
							disabled={isAnalyzing}
							className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
						>
							{isAnalyzing ? (
								<span className="flex items-center justify-center">
									<Sparkles className="animate-spin mr-2" /> Analyzing...
								</span>
							) : (
								"Analyze Personality"
							)}
						</Button>
					</div>
				</CardContent>
				<div className="flex ">
					<Link href="https://x.com/maobushi">
						<CardFooter className="text-center text-purple-400 text-sm">
							Made by @maobushi
						</CardFooter>
					</Link>

					<CardFooter className="text-center text-purple-400 text-sm">
						Nostr:
						#npub1kmwnwx58pl2fqjzpkqzk9ejuxev76xcv0yr9yenpnzx7te2kx46s93hlht
					</CardFooter>
				</div>
			</Card>
		</div>
	);
};
