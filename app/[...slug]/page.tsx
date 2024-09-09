"use client";
import React, { useEffect, useState } from "react";
import supabase from "../utils/supabase/client";
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
import { Zap, Share2, Check } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";

type UserData = {
	userId: string;
	userNpub: string;
	userPicture: string;
	userAbst: string;
	userRoast: string;
	relayServer: string;
};

export default function PersonalityAnalyzer() {
  const router = useRouter();
  const pathname = usePathname().replace(/^\/+/, "");
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [copySuccess, setCopySuccess] = useState(false);
	const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
					"user_id, user_npub, user_picture, user_abst, user_roast, relay_server"
				)
				.eq("user_npub", pathname)
				.single();
			console.log("Data:", data);

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
				relayServer: data.relay_server,
			};
			setUserData(formattedUserData);
			setLoading(false);
		};

		fetchUserData();
	}, [pathname, router]);

	const handleShare = async () => {
		if (!userData) return;

		const shareData = {
			title: "Nostr Personality Analyzer",
			text: `Check out ${userData.userId}'s personality analysis!`,
			url: window.location.href,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
				setToastMessage("Shared successfully!");
				setShowToast(true);
			} catch (err) {
				console.error("Error sharing:", err);
				await navigator.clipboard.writeText(window.location.href);
				setToastMessage("URL Copied!");
				setShowToast(true);
			}
		} else {
			await navigator.clipboard.writeText(window.location.href);
			setToastMessage("URL Copied!");
			setShowToast(true);
		}

		setTimeout(() => setShowToast(false), 3000);
	};

  const handleDonate = () => {
		setShowDonatePopup(true);
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
			<Card className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl bg-gray-900/80 text-purple-50 border-purple-500 shadow-2xl shadow-purple-500/20 backdrop-blur-sm relative overflow-hidden z-10">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient"></div>
				<Link href="/">
					<CardHeader className="border-b border-purple-700">
						<CardTitle className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Nostr Personality Analyzer
						</CardTitle>
						<CardDescription className="text-center text-purple-300 text-sm md:text-base lg:text-lg">
							Discover insights from your Nostr posts
						</CardDescription>
					</CardHeader>
				</Link>
				<CardContent className="space-y-4 mt-4 md:mt-6 lg:mt-8">
					<div className="flex flex-col md:flex-row items-center md:space-x-6">
						<img
							src={userData.userPicture || "/image.png"}
							alt="User Icon"
							className="h-24 md:h-32 lg:h-40 rounded-full"
						/>
						<div className="text-purple-100 text-center md:text-left mt-4 md:mt-0 w-full">
							<h2 className="text-xl md:text-2xl lg:text-3xl font-bold py-2">
								@{userData.userId}
							</h2>
							<div
								className="text-xs md:text-sm lg:text-base font-semibold py-1 cursor-pointer hover:text-purple-300"
								onClick={() => {
									navigator.clipboard.writeText(userData.userNpub).then(() => {
										setCopySuccess(true);
										setTimeout(() => setCopySuccess(false), 2000);
									});
								}}
							>
								#{userData.userNpub}
							</div>
							{copySuccess && (
								<p className="text-green-500 py-1 text-xs md:text-sm">
									Copied npub!
								</p>
							)}
							<p className="text-xs md:text-sm lg:text-base break-words">
								{userData.userAbst}
							</p>
						</div>
					</div>
					<div className="space-y-2">
						<Label className="text-purple-300 text-base md:text-lg lg:text-xl font-semibold">
							Roast
						</Label>
						<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-3 md:p-4 lg:p-5 text-purple-100 text-sm md:text-base lg:text-lg">
							{userData.userRoast}
						</div>
					</div>
					<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
						<Button
							onClick={handleDonate}
							className="w-full md:w-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
						>
							Donate <Zap className="ml-2 h-4 w-4 animate-pulse" />
						</Button>
						<Button
							onClick={handleShare}
							className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
						>
							Share Analysis <Share2 className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</CardContent>
				<div className="flex flex-col md:flex-row md:justify-between md:items-center p-4">
					<Link href="https://x.com/maobushi">
						<CardFooter className="text-center md:text-left text-purple-400 text-xs md:text-sm">
							Made by @maobushi
						</CardFooter>
					</Link>

					<CardFooter className="text-center md:text-right text-purple-400 text-xs md:text-sm mt-2 md:mt-0">
						#npub1kmwnwx58pl2fqjzpkqzk9ejuxev76xcv0yr9yenpnzx7te2kx46s93hlht
					</CardFooter>
				</div>
			</Card>

			<Dialog open={showDonatePopup} onOpenChange={setShowDonatePopup}>
				<DialogContent className="bg-gray-900 text-purple-50 border-purple-500">
					<DialogHeader>
						<DialogTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Donate
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label className="text-purple-300">Bitcoin Address</Label>
							<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-2 text-purple-100 break-all text-xs md:text-sm lg:text-base">
								bc1qmpsd298hs9anwetalnrntq55fen994mht60w5d
							</div>
						</div>
						<div>
							<Label className="text-purple-300">Lightning Network</Label>
							<div className="bg-gray-800/50 border border-purple-500 rounded-lg p-2 text-purple-100 break-all text-xs md:text-sm lg:text-base">
								secretbeef91@walletofsatoshi.com
							</div>
						</div>
					</div>
					<DialogClose asChild>
						<Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
							Close
						</Button>
					</DialogClose>
				</DialogContent>
			</Dialog>

			{showToast && (
				<Toast className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded-md flex items-center">
					<Check className="mr-2" /> {toastMessage}
				</Toast>
			)}
		</div>
	);
}