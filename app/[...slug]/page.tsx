"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Zap, Share2 } from "lucide-react";

export default function PersonalityAnalyzer() {
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

	const handleShare = () => {
		const shareText = `Check out my Nostr Personality Analysis!\n\nRoast: ${analysis.roast}\n\nAnalyze your own Nostr personality at https://nostr-analyzer.example.com`;
		if (navigator.share) {
			navigator
				.share({
					title: "My Nostr Personality Analysis",
					text: shareText,
					url: "https://nostr-analyzer.example.com",
				})
				.catch((error) => console.log("Error sharing", error));
		} else {
			// Fallback for browsers that don't support the Web Share API
			navigator.clipboard
				.writeText(shareText)
				.then(() => {
					alert("Analysis copied to clipboard! Share it with your friends.");
				})
				.catch((error) => console.log("Error copying to clipboard", error));
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4 overflow-x-hidden">
			<div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat opacity-10 z-0"></div>
			<Card className="w-full max-w-4xl bg-gray-900/80 text-purple-50 border-purple-500 shadow-2xl shadow-purple-500/20 backdrop-blur-sm relative overflow-hidden z-10">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient"></div>
				<CardHeader className="border-b border-purple-700">
					<CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
						Nostr Personality Analyzer
					</CardTitle>
					<CardDescription className="text-center text-purple-300">
						Discover insights from your Nostr tweets
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6 mt-6">
					<div className="flex flex-col items-center">
						<img
							src="https://image.nostr.build/ba439818fe712a3740d1c1ec218474c5153f5161d72379510a62ff35696c6950.jpg"
							alt="User Icon"
							className="w-32 h-32 rounded-full"
						/>
						<div className="text-purple-100 text-center">
							<h2 className="text-2xl font-bold py-4">@maobushi</h2>
							<p className="text-sm">
								AIエージェントによるツイート分析に基づくと、ぶしおbotは30代の男性で、テクノロジーと暗号通貨に精通したフリーランスのエンジニアです。ユーモアのセンスがあり、皮肉な観察力を持っています。
							</p>
						</div>
					</div>
					<div className="space-y-2">
						<Label className="text-purple-300 text-lg font-semibold">
							Roast
						</Label>
						<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-4 text-purple-100">
							ぶしおbotさん、あなたのツイートを見ていると、まるで暗号通貨の価格チャートのようですね。上がったり下がったりして、結局何も残らない。自己紹介が長すぎて書けないって言ってますが、実は書くことがないだけじゃないですか？ノストラダムスの予言より曖昧な投稿ばかりで、フォロワーは解読に疲れ果てているでしょう。ハリーポッターのイベントに一人で参加するなんて、魔法使いになりたい中二病かと思いました。ベトナムの湿度に文句言ってますが、あなたの存在感の方がよっぽど薄いですよ。写真を捨てる話、まるで恋愛経験がないかのような書き方ですね。結局、あなたの人生も、ツイートと同じくらい中身がないんじゃないですか？
						</div>
					</div>
					<Button
						onClick={() => setIsPremium(true)}
						className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
					>
						Donate <Zap className="ml-2 h-4 w-4 animate-pulse" />
					</Button>
					<Button
						onClick={handleShare}
						className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
					>
						Share Analysis <Share2 className="ml-2 h-4 w-4" />
					</Button>
				</CardContent>
				<CardFooter className="text-center text-purple-400 text-sm">
					Made by @maobushi
				</CardFooter>
			</Card>
		</div>
	);
}
