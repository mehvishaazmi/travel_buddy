import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { destination, days, budget } = await req.json();

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: "Missing destination, days or budget" },
        { status: 400 }
      );
    }

    const prompt = `You are a travel planning assistant. Create a detailed ${days}-day trip plan for ${destination} with a total budget of ₹${budget}.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3"]
    }
  ],
  "budget": {
    "hotel": "₹XXXX",
    "food": "₹XXXX",
    "transport": "₹XXXX",
    "activities": "₹XXXX"
  },
  "places": ["place 1", "place 2", "place 3", "place 4", "place 5"],
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4"]
}

Rules:
- Budget values must add up to roughly ₹${budget}
- Activities should be specific to ${destination}
- Places should be real attractions in ${destination}
- Tips should be practical and specific to ${destination}
- Return ONLY the JSON, nothing else`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    const cleaned = text.replace(/```json|```/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      console.error("Groq JSON parse failed:", cleaned);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });

  } catch (err: any) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "AI request failed" },
      { status: 500 }
    );
  }
}