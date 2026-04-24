import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { destination, days, budget } = await req.json();

    const prompt = `
You are a travel planner API.

Return ONLY valid JSON. No explanation, no text outside JSON.

Destination: ${destination}
Days: ${days}
Budget: ${budget}

JSON format:

{
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "activities": ["string", "string"]
    }
  ],
  "budget": {
    "stay": "string",
    "food": "string",
    "travel": "string",
    "activities": "string"
  },
  "places": ["string"],
  "tips": ["string"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a strict JSON generator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    let result = completion.choices[0]?.message?.content || "";

    // 🧠 CLEAN RESPONSE (VERY IMPORTANT)
    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

try {
  const cleaned = result.trim().replace(/```json|```/g, "");
  parsed = JSON.parse(cleaned);
} catch (err) {
  console.error("JSON parse error:", err);
  return NextResponse.json({ plan: null, raw: result });
}

return NextResponse.json({ plan: parsed });

  } catch (error: any) {
    console.error("AI ERROR:", error);

    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 }
    );
  }
}