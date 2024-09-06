"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Zap, Sparkles, Share2 } from "lucide-react";

export function PersonalityAnalyzer() {
	const [publicKey, setPublicKey] = useState("");
	const [relay, setRelay] = useState("relay.damus.io");
	const [language, setLanguage] = useState("en");
	const [analysis, setAnalysis] = useState<Record<string, string>>({});
	const [isAnalyzing, setIsAnalyzing] = useState(false);

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

	const handleAnalyze = () => {
		// 公開鍵の形式をチェック
		const publicKeyPattern = /^npub1[a-zA-Z0-9]{58}$/; // 例: npub1から始まる58文字の英数字
		if (!publicKey || !publicKeyPattern.test(publicKey)) {
			alert("有効な公開鍵を入力してください。"); // エラーメッセージ
			return; // 公開鍵が無効な場合は処理を中断
		}
		setIsAnalyzing(true);
		setTimeout(() => {
			setAnalysis({
				roast:
					"Your tweets are as decentralized as your personality - scattered all over the place and hard to make sense of.",
			});
			setIsAnalyzing(false);
		}, 3000);
	};

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
					{publicKey && ( // 公開鍵が入力されている場合のみ表示
						<div className="flex justify-between items-center space-x-4">
							<div className="flex-1">
								<Label htmlFor="relay" className="text-purple-300">
									Relay
								</Label>
								<Select value={relay} onValueChange={setRelay}>
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
									</SelectContent>
								</Select>
							</div>
							<div className="flex-1">
								<Label htmlFor="language" className="text-purple-300">
									Language
								</Label>
								<Select value={language} onValueChange={setLanguage}>
									<SelectTrigger className="bg-gray-800/50 border-purple-500 text-purple-100 focus:ring-2 focus:ring-purple-500 transition-all duration-300">
										<SelectValue placeholder="Select Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="zh">中文</SelectItem>
										<SelectItem value="jp">日本語</SelectItem>
										<SelectItem value="es">Español</SelectItem>
										<SelectItem value="fr">Français</SelectItem>
										<SelectItem value="de">Deutsch</SelectItem>
										<SelectItem value="ko">한국어</SelectItem>
									</SelectContent>
								</Select>
							</div>
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
					{analysis.roast && (
						<div className="mt-6 space-y-4 animate-fadeIn">
							<div className="space-y-2">
								<Label className="text-purple-300 text-lg font-semibold">
									Roast
								</Label>
								<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-4 text-purple-100">
									{analysis.roast}
								</div>
							</div>
						</div>
					)}
					{analysis.roast && (
						<Button
							onClick={() => setIsPremium(true)}
							className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
						>
							Donate <Zap className="ml-2 h-4 w-4 animate-pulse" />
						</Button>
					)}
					{analysis.roast && (
						<Button
							onClick={handleShare}
							className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
						>
							Share Analysis <Share2 className="ml-2 h-4 w-4" />
						</Button>
					)}
				</CardContent>
				<CardFooter className="text-center text-purple-400 text-sm">
					Made by @maobushi
				</CardFooter>
			</Card>
		</div>
	);
}
