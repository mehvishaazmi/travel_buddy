import { NextResponse } from "next/server";

const randomPick = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export async function POST(req: Request) {
  try {
    const { destination, days, budget } = await req.json();

    await new Promise((res) => setTimeout(res, 1200)); // delay

    const placesPool = [
      "Beach",
      "Fort",
      "Temple",
      "Market",
      "Museum",
      "Waterfall",
      "Cafe",
      "Viewpoint",
    ];

    const activitiesPool = [
      "Explore local attractions",
      "Try street food",
      "Take photos",
      "Shopping",
      "Relax at scenic spot",
      "Enjoy nightlife",
    ];

    const itinerary = Array.from({ length: Number(days) }, (_, i) => ({
      day: i + 1,
      title:
        i === 0
          ? "Arrival & Check-in"
          : randomPick([
              "Adventure Day",
              "Exploration Day",
              "Relax & Enjoy",
            ]),
      activities: Array.from({ length: 3 }, () =>
        randomPick(activitiesPool)
      ),
    }));

    const plan = {
      itinerary,
      budget: {
        hotel: `₹${Math.floor(budget * 0.4)}`,
        food: `₹${Math.floor(budget * 0.2)}`,
        transport: `₹${Math.floor(budget * 0.2)}`,
        activities: `₹${Math.floor(budget * 0.2)}`,
      },
      places: Array.from({ length: 5 }, () =>
        `${destination} ${randomPick(placesPool)}`
      ),
      tips: [
        "Carry sunscreen",
        "Book tickets early",
        "Keep emergency cash",
        "Stay hydrated",
      ],
    };

    return NextResponse.json({ plan });

  } catch {
    return NextResponse.json({ error: "Mock AI failed" }, { status: 500 });
  }
}