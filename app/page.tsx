import { PersonalityAnalyzer } from "@/components/personality-analyzer";
export default function Home() {
	// const response = await fetch("http://localhost:3000/api/nostr", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		npub: "npub1kmwnwx58pl2fqjzpkqzk9ejuxev76xcv0yr9yenpnzx7te2kx46s93hlht",
	// 		relayUrl: "wss://relay.damus.io",
	// 	}),
	// });

	// const data = await response.json();
	return (
		<>
			<PersonalityAnalyzer />
		</>
	);
}
