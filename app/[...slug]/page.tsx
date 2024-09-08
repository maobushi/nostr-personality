"use client";
import supabase from "../utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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

type UserData = {
	userId: string;
	userNpub: string;
	userPicture: string;
	userAbst: string;
	userRoast: string;
	userLanguage: string;
	relayServer: string;
};

export default function PersonalityAnalyzer() {
	const router = useRouter();
	const pathname = usePathname().replace(/^\/+/, "");
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [copySuccess, setCopySuccess] = useState(false); // コピー成功の状態を追加

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

		const fetchUserData = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("user_table")
				.select(
					"user_id, user_npub, user_picture, user_abst, user_roast, user_language, relay_server"
				)
				.eq("user_id", pathname)
				.single();

			if (error) {
				console.error("Error fetching user data:", error);
				if (error.code === "PGRST116") {
					console.log("User does not exist.");
					router.push("/");
				}
				setLoading(false);
				return;
			}

			if (!data) {
				console.log("No user data found.");
				router.push("/");
				setLoading(false);
				return;
			}

			const formattedUserData: UserData = {
				userId: data.user_id,
				userNpub: data.user_npub,
				userPicture: data.user_picture,
				userAbst: data.user_abst,
				userRoast: data.user_roast,
				userLanguage: data.user_language,
				relayServer: data.relay_server,
			};
			console.log("User data:", formattedUserData);
			setUserData(formattedUserData);
			setLoading(false);
		};

		fetchUserData();
	}, [pathname, router]);

	const handleShare = () => {
		if (!userData) return;

		const shareText = `Check out my Nostr Personality Analysis!\n\nRoast: ${userData.userRoast}\n\nAnalyze your own Nostr personality at https://nostr-analyzer.example.com`;

		if (navigator.share) {
			navigator
				.share({
					title: "My Nostr Personality Analysis",
					text: shareText,
					url: "https://nostr-analyzer.example.com",
				})
				.catch((error) => console.error("Error sharing", error));
		} else {
			navigator.clipboard
				.writeText(shareText)
				.then(() => {
					alert("Analysis copied to clipboard! Share it with your friends.");
				})
				.catch((error) => console.error("Error copying to clipboard", error));
		}
	};

	if (loading) {
		return (
			<div className="text-3xl loading-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center min-h-screen font-bold">
				Loading...
			</div>
		);
	}

	if (!userData) {
		return null;
	}

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
							Discover insights from your Nostr tweets
						</CardDescription>
					</CardHeader>
				</Link>
				<CardContent className="space-y-6 mt-6">
					<div className="flex flex-col items-center">
						<img
							src={
								userData.userPicture ||
								"https://image.nostr.build/ba439818fe712a3740d1c1ec218474c5153f5161d72379510a62ff35696c6950.jpg"
							}
							alt="User Icon"
							className="w-32 h-32 rounded-full"
						/>
						<div className="text-purple-100 text-center">
							<h2 className="text-2xl font-bold py-2">{userData.userId}</h2>
							<div
								className="text-sm font-semibold py-2 cursor-pointer hover:text-purple-300"
								onClick={() => {
									navigator.clipboard.writeText(userData.userNpub).then(() => {
										setCopySuccess(true); // コピー成功時に状態を更新
										setTimeout(() => setCopySuccess(false), 2000); // 2秒後にメッセージを消す
									});
								}}
							>
								#{userData.userNpub}
							</div>
							{copySuccess && (
								<p className="text-green-500 py-2">Coppied npub!</p>
							)}{" "}
							<p className="text-sm">{userData.userAbst}</p>
						</div>
					</div>
					<div className="space-y-2">
						<Label className="text-purple-300 text-lg font-semibold">
							Roast
						</Label>
						<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-4 text-purple-100">
							{userData.userRoast}
						</div>
					</div>
					<Button
						onClick={() => {
							/* setIsPremium(true) */
						}}
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