import { PersonalityAnalyzer } from "@/components/personality-analyzer";
export default async function Home() {
	const npub =
		"npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m"; // 実際のnpub値に置き換えてください

	const response = await fetch("http://localhost:3000/api/nostr", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			npub: npub,
		}),
	});
	const data = await response.json();
	console.log(data);
	return (
		<>
			<PersonalityAnalyzer />
		</>
	);
}
