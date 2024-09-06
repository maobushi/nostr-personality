import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });

import { NextResponse } from "next/server";

export async function POST(request: Request) {
	console.log("request received");
	const res = await request.json();
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: res.systemMessage },
			{
				role: "user",
				content: res.userMessage,
			},
		],
	});
	console.log(completion.choices[0].message);
	return NextResponse.json({
		message: completion.choices[0].message,
	});
}
