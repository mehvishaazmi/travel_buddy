"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  Shield,
  Sparkles,
  Mountain,
  Camera,
  Utensils,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Highlight = {
  icon: typeof Mountain;
  label: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  summary: string;
  items: string[];
};

type Review = {
  name: string;
  role: string;
  initials: string;
  rating: number;
  text: string;
};

type Buddy = {
  name: string;
  role: string;
  initials: string;
};

type TripDetail = {
  id: string;
  title: string;
  location: string;
  countryLine: string;
  hero: string;
  gallery: string[];
  type: "Adventure" | "Honeymoon" | "Family" | "Weekend";
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  duration: number;
  nights: number;
  groupSize: number;
  price: number;
  oldPrice: number;
  dateLabel: string;
  guestsLabel: string;
  overviewTitle: string;
  overviewText: string;
  highlights: Highlight[];
  facts: [string, string][];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  buddies: Buddy[];
  reviews: Review[];
};

const SHARED_BUDDIES: Buddy[] = [
  { name: "Aarav S.", role: "Photographer · Mumbai", initials: "AS" },
  { name: "Léa M.", role: "Designer · Paris", initials: "LM" },
  { name: "Kenji T.", role: "Engineer · Tokyo", initials: "KT" },
  { name: "Priya R.", role: "Writer · Bengaluru", initials: "PR" },
  { name: "Noah B.", role: "Chef · Berlin", initials: "NB" },
];

const TRIP_DETAILS: Record<string, TripDetail> = {
  "1": {
    id: "1",
    title: "Cliffside Sunsets & Caldera Cruise",
    location: "Santorini, Greece",
    countryLine: "Santorini · Greece",
    hero: "/dest-santorini.jpg",
    gallery: [
      "/dest-santorini.jpg",
      "/dest-santorini.jpg",
      "/hero-travel.jpg",
      "/dest-swiss.jpg",
      "/dest-bali.jpg",
    ],
    type: "Honeymoon",
    featured: true,
    rating: 4.9,
    reviewsCount: 312,
    duration: 7,
    nights: 6,
    groupSize: 8,
    price: 1240,
    oldPrice: 1490,
    dateLabel: "Jun 12",
    guestsLabel: "2 adults",
    overviewTitle: "A romantic island escape across Santorini’s iconic caldera",
    overviewText:
      "Wake up to whitewashed cliffside stays, cruise through volcanic waters, and end each evening with golden-hour sunsets over the Aegean. This experience blends romance, sailing, food, and slow luxury.",
    highlights: [
      { icon: Mountain, label: "Caldera cliffside viewpoints" },
      { icon: Camera, label: "Sunset photography in Oia" },
      { icon: Utensils, label: "Wine tasting & seaside dining" },
      { icon: Sparkles, label: "Private catamaran sunset cruise" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Apr – Oct"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Greek"],
      ["Vibe", "Romantic & scenic"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Fira",
        summary:
          "Arrival, boutique check-in, caldera walk, and welcome dinner overlooking the sea.",
        items: ["Airport transfer", "Cliffside check-in", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Oia & Sunset Trail",
        summary:
          "Explore Oia’s lanes, hidden viewpoints, artisan shops, and end with the island’s most famous sunset.",
        items: ["Oia village tour", "Photo stops", "Sunset trail"],
      },
      {
        day: 3,
        title: "Catamaran Cruise",
        summary:
          "Day at sea with swimming stops, volcanic beaches, and a sunset dinner on board.",
        items: ["Catamaran cruise", "Swimming stop", "Dinner at sea"],
      },
    ],
    inclusions: [
      "6 nights boutique accommodation",
      "Daily breakfast",
      "Catamaran cruise experience",
      "Airport & local transfers",
      "Curated sunset dinner reservation",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal shopping",
      "Optional spa treatments",
    ],
    buddies: SHARED_BUDDIES,
    reviews: [
      {
        name: "Sara Lin",
        role: "Couple trip",
        initials: "SL",
        rating: 5,
        text: "The sunset cruise and boutique stay were magical. Every detail felt premium.",
      },
      {
        name: "Marco D.",
        role: "Photographer",
        initials: "MD",
        rating: 5,
        text: "Santorini looked unreal. Great pacing and beautiful viewpoints.",
      },
      {
        name: "Ines K.",
        role: "Honeymoon",
        initials: "IK",
        rating: 4,
        text: "Beautifully curated and very romantic. We loved the sea-view dinner.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Rice Terraces & Wellness Retreat",
    location: "Ubud, Bali",
    countryLine: "Ubud · Bali, Indonesia",
    hero: "/dest-bali.jpg",
    gallery: [
      "/dest-bali.jpg",
      "/hero-travel.jpg",
      "/dest-bali.jpg",
      "/dest-santorini.jpg",
      "/dest-tokyo.jpg",
    ],
    type: "Honeymoon",
    featured: true,
    rating: 4.8,
    reviewsCount: 528,
    duration: 9,
    nights: 8,
    groupSize: 10,
    price: 890,
    oldPrice: 1090,
    dateLabel: "Jul 04",
    guestsLabel: "2 adults",
    overviewTitle: "Slow mornings, jungle villas, and a wellness-first Bali escape",
    overviewText:
      "This retreat is designed around balance: sunrise yoga, waterfalls, healing cuisine, and peaceful stays near Bali’s rice terraces. It’s ideal for travelers who want calm, beauty, and mindful luxury.",
    highlights: [
      { icon: Mountain, label: "Rice terrace sunrise walks" },
      { icon: Camera, label: "Waterfall photo sessions" },
      { icon: Utensils, label: "Healthy Balinese dining" },
      { icon: Sparkles, label: "Yoga & spa rituals" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "May – Sep"],
      ["Group size", "6 – 10 travelers"],
      ["Languages", "English, Bahasa"],
      ["Vibe", "Wellness & nature"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Villa Check-in",
        summary:
          "Settle into your Ubud villa, slow evening walk, and nourish with a farm-to-table welcome meal.",
        items: ["Villa check-in", "Evening walk", "Wellness dinner"],
      },
      {
        day: 2,
        title: "Yoga & Rice Fields",
        summary:
          "Morning yoga flow followed by a guided walk across iconic rice terraces and hidden cafés.",
        items: ["Yoga session", "Rice terrace walk", "Healthy brunch"],
      },
      {
        day: 3,
        title: "Waterfalls & Spa",
        summary:
          "Chase waterfalls, enjoy curated wellness treatments, and unwind with live acoustic music.",
        items: ["Waterfall trail", "Spa session", "Live music evening"],
      },
    ],
    inclusions: [
      "8 nights villa stay",
      "Daily breakfast",
      "Yoga sessions",
      "One spa treatment",
      "Airport transfer",
    ],
    exclusions: [
      "Flights",
      "Personal expenses",
      "Optional excursions",
      "Travel insurance",
    ],
    buddies: SHARED_BUDDIES,
    reviews: [
      {
        name: "Meera J.",
        role: "Wellness traveler",
        initials: "MJ",
        rating: 5,
        text: "So peaceful and beautifully organized. The yoga mornings were my favorite.",
      },
      {
        name: "Theo R.",
        role: "Remote worker",
        initials: "TR",
        rating: 5,
        text: "Exactly the reset I needed. Ubud felt calm and inspiring.",
      },
      {
        name: "Anika P.",
        role: "Couple getaway",
        initials: "AP",
        rating: 4,
        text: "Great villas and very relaxing schedule. Spa day was excellent.",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Neon Nights & Hidden Alleyways",
    location: "Tokyo, Japan",
    countryLine: "Tokyo · Japan",
    hero: "/dest-tokyo.jpg",
    gallery: [
      "/dest-tokyo.jpg",
      "/dest-tokyo.jpg",
      "/hero-travel.jpg",
      "/dest-santorini.jpg",
      "/dest-bali.jpg",
    ],
    type: "Weekend",
    rating: 4.9,
    reviewsCount: 421,
    duration: 6,
    nights: 5,
    groupSize: 8,
    price: 1560,
    oldPrice: 1780,
    dateLabel: "Sep 10",
    guestsLabel: "1 adult",
    overviewTitle: "Fast-paced city energy with food, fashion, and hidden local gems",
    overviewText:
      "Tokyo gives you futuristic districts, quiet shrines, ramen counters, and late-night neon all in one trip. This itinerary balances city highlights with hidden alleyways and culture-rich neighborhoods.",
    highlights: [
      { icon: Mountain, label: "Skyline city viewpoints" },
      { icon: Camera, label: "Shibuya & neon street photography" },
      { icon: Utensils, label: "Curated ramen & sushi spots" },
      { icon: Sparkles, label: "Nightlife in hidden alleys" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Mar – May, Oct – Nov"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Japanese"],
      ["Vibe", "City & culture"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Shibuya",
        summary:
          "Check in, hit Shibuya Crossing, and begin the trip with a nightlife orientation.",
        items: ["Hotel check-in", "Shibuya Crossing", "Evening food walk"],
      },
      {
        day: 2,
        title: "Asakusa & Akihabara",
        summary:
          "Blend traditional temples with electric pop culture districts in one full city day.",
        items: ["Senso-ji visit", "Street snacks", "Akihabara arcade trail"],
      },
      {
        day: 3,
        title: "Hidden Tokyo",
        summary:
          "Explore tucked-away alley bars, design neighborhoods, and local café culture.",
        items: ["Design district", "Café crawl", "Alley bar evening"],
      },
    ],
    inclusions: [
      "5 nights central stay",
      "Metro travel pass",
      "Food walk experience",
      "City guide support",
      "Cultural district tours",
    ],
    exclusions: [
      "Flights",
      "Visa fees",
      "Personal shopping",
      "Optional theme park tickets",
    ],
    buddies: SHARED_BUDDIES,
    reviews: [
      {
        name: "Riku M.",
        role: "City explorer",
        initials: "RM",
        rating: 5,
        text: "Loved the mix of local and iconic. Tokyo never felt overwhelming with this plan.",
      },
      {
        name: "Nina C.",
        role: "Solo traveler",
        initials: "NC",
        rating: 5,
        text: "The hidden alleyway night tour was unforgettable.",
      },
      {
        name: "Sam K.",
        role: "Food lover",
        initials: "SK",
        rating: 4,
        text: "Amazing food curation. Would absolutely book again.",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Matterhorn Trekking Expedition",
    location: "Zermatt, Switzerland",
    countryLine: "Zermatt · Switzerland",
    hero: "/dest-swiss.jpg",
    gallery: [
      "/dest-swiss.jpg",
      "/dest-swiss.jpg",
      "/hero-travel.jpg",
      "/dest-tokyo.jpg",
      "/dest-santorini.jpg",
    ],
    type: "Adventure",
    rating: 4.9,
    reviewsCount: 198,
    duration: 8,
    nights: 7,
    groupSize: 8,
    price: 1820,
    oldPrice: 2090,
    dateLabel: "Aug 02",
    guestsLabel: "2 adults",
    overviewTitle: "Alpine trekking with dramatic mountain views and premium stays",
    overviewText:
      "Built for mountain lovers, this trip blends scenic rail journeys, glacier viewpoints, alpine trekking, and warm chalet evenings beneath the Matterhorn.",
    highlights: [
      { icon: Mountain, label: "Matterhorn trekking routes" },
      { icon: Camera, label: "Alpine viewpoint photography" },
      { icon: Utensils, label: "Swiss mountain dining" },
      { icon: Sparkles, label: "Chalet evenings & scenic rail rides" },
    ],
    facts: [
      ["Difficulty", "Moderate"],
      ["Best season", "Jun – Sep"],
      ["Group size", "6 – 8 travelers"],
      ["Languages", "English, German"],
      ["Altitude", "Up to 3,100 m"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zermatt",
        summary:
          "Scenic rail arrival, chalet check-in, and your first Matterhorn golden-hour view.",
        items: ["Rail arrival", "Chalet stay", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Mountain Trails",
        summary:
          "Full-day guided hike through alpine routes and panoramic ridge viewpoints.",
        items: ["Guided trek", "Mountain lunch", "Scenic photo stops"],
      },
      {
        day: 3,
        title: "Glacier & Scenic Train",
        summary:
          "Explore glacier panoramas and unwind with one of Europe’s most scenic train journeys.",
        items: ["Glacier viewpoint", "Train ride", "Village evening"],
      },
    ],
    inclusions: [
      "7 nights chalet stay",
      "Breakfasts",
      "Guided trekking support",
      "Scenic rail segment",
      "Local transfers",
    ],
    exclusions: [
      "Flights",
      "Travel insurance",
      "Personal equipment rentals",
      "Lunches & optional upgrades",
    ],
    buddies: SHARED_BUDDIES,
    reviews: [
      {
        name: "Luca F.",
        role: "Trekker",
        initials: "LF",
        rating: 5,
        text: "The mountain views were unreal. Perfectly organized for an active trip.",
      },
      {
        name: "Emma S.",
        role: "Nature traveler",
        initials: "ES",
        rating: 5,
        text: "Zermatt was stunning and the chalet stay felt cozy and premium.",
      },
      {
        name: "Arjun B.",
        role: "Adventure group",
        initials: "AB",
        rating: 4,
        text: "Great guides and solid pacing. Loved the rail journey.",
      },
    ],
  },
  "5": {
    id: "5",
    title: "Coastal Drive & Pastel de Nata Tour",
    location: "Lisbon, Portugal",
    countryLine: "Lisbon · Portugal",
    hero: "/hero-travel.jpg",
    gallery: ["/hero-travel.jpg", "/dest-santorini.jpg", "/dest-bali.jpg", "/dest-tokyo.jpg", "/dest-swiss.jpg"],
    type: "Weekend",
    rating: 4.7,
    reviewsCount: 264,
    duration: 5,
    nights: 4,
    groupSize: 8,
    price: 760,
    oldPrice: 920,
    dateLabel: "May 22",
    guestsLabel: "2 adults",
    overviewTitle: "A compact coastal city trip full of food, views, and day drives",
    overviewText:
      "This Lisbon route combines bright streets, iconic trams, coastal drives, and classic Portuguese flavors in a short and easy getaway.",
    highlights: [
      { icon: Mountain, label: "Coastal viewpoint stops" },
      { icon: Camera, label: "Colorful old-town photography" },
      { icon: Utensils, label: "Pastel de nata tasting trail" },
      { icon: Sparkles, label: "Golden-hour seaside drive" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Apr – Jun, Sep – Oct"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Portuguese"],
      ["Vibe", "Food & coastal city"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Old Lisbon",
        summary: "Discover Alfama, trams, tiled streets, and a sunset miradouro.",
        items: ["City walk", "Tram ride", "Sunset viewpoint"],
      },
      {
        day: 2,
        title: "Belém & Food Trail",
        summary: "Visit riverside monuments and taste Lisbon’s iconic pastry culture.",
        items: ["Belém tower", "Food tasting", "Riverside evening"],
      },
      {
        day: 3,
        title: "Coastal Drive",
        summary: "A scenic route to nearby beaches and cliffside cafés outside the city.",
        items: ["Coastal drive", "Beach stop", "Café break"],
      },
    ],
    inclusions: ["4 nights stay", "Breakfast", "Food walk", "Local transit support", "Coastal day trip"],
    exclusions: ["Flights", "Insurance", "Shopping", "Optional nightlife experiences"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Clara T.", role: "Weekend traveler", initials: "CT", rating: 5, text: "Perfect short trip with great food and beautiful viewpoints." },
      { name: "Vikram N.", role: "City explorer", initials: "VN", rating: 4, text: "Easy, fun, and very photogenic. Great value for a short break." },
      { name: "Luis P.", role: "Food lover", initials: "LP", rating: 5, text: "Loved the pastry trail and old-city walk." },
    ],
  },
  "6": {
    id: "6",
    title: "Surf, Sunsets & Beach Clubs",
    location: "Canggu, Bali",
    countryLine: "Canggu · Bali, Indonesia",
    hero: "/dest-bali.jpg",
    gallery: ["/dest-bali.jpg", "/hero-travel.jpg", "/dest-bali.jpg", "/dest-santorini.jpg", "/dest-tokyo.jpg"],
    type: "Adventure",
    rating: 4.6,
    reviewsCount: 392,
    duration: 7,
    nights: 6,
    groupSize: 10,
    price: 980,
    oldPrice: 1140,
    dateLabel: "Jun 18",
    guestsLabel: "2 adults",
    overviewTitle: "Energetic beach days with surf lessons and Bali nightlife",
    overviewText:
      "Canggu is about movement and fun: surf mornings, beach cafés, coworking cool, and sunset clubs. Great for younger travelers who want a social Bali experience.",
    highlights: [
      { icon: Mountain, label: "Beach and cliff escapes" },
      { icon: Camera, label: "Sunset beach photography" },
      { icon: Utensils, label: "Trendy cafés & brunch culture" },
      { icon: Sparkles, label: "Surf lessons & beach clubs" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "May – Sep"],
      ["Group size", "6 – 10 travelers"],
      ["Languages", "English, Bahasa"],
      ["Vibe", "Social & beach"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Chill",
        summary: "Check in, beach walk, and Canggu welcome dinner.",
        items: ["Check-in", "Beach walk", "Dinner"],
      },
      {
        day: 2,
        title: "Surf School",
        summary: "Morning surf lesson and relaxed evening at a sunset spot.",
        items: ["Surf lesson", "Beach lunch", "Sunset session"],
      },
      {
        day: 3,
        title: "Cafés & Clubs",
        summary: "Café hopping by day, lively social nightlife by evening.",
        items: ["Brunch crawl", "Shopping stop", "Beach club night"],
      },
    ],
    inclusions: ["6 nights stay", "Surf lesson", "Breakfasts", "Airport transfer", "Hosted social events"],
    exclusions: ["Flights", "Insurance", "Personal shopping", "Optional extra surf sessions"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Aisha K.", role: "Beach traveler", initials: "AK", rating: 5, text: "Fun, social, and full of energy. Great if you like beach culture." },
      { name: "Daniel P.", role: "Surf beginner", initials: "DP", rating: 4, text: "Loved the surf day and relaxed pace." },
      { name: "Nora V.", role: "Solo traveler", initials: "NV", rating: 5, text: "Very easy to make friends on this trip." },
    ],
  },
  "7": {
    id: "7",
    title: "Lemon Groves & Coastal Villages",
    location: "Amalfi Coast, Italy",
    countryLine: "Amalfi Coast · Italy",
    hero: "/dest-santorini.jpg",
    gallery: ["/dest-santorini.jpg", "/hero-travel.jpg", "/dest-swiss.jpg", "/dest-bali.jpg", "/dest-tokyo.jpg"],
    type: "Family",
    rating: 4.8,
    reviewsCount: 287,
    duration: 6,
    nights: 5,
    groupSize: 8,
    price: 1390,
    oldPrice: 1590,
    dateLabel: "Jul 14",
    guestsLabel: "3 travelers",
    overviewTitle: "Relaxed village-hopping along one of Europe’s most iconic coasts",
    overviewText:
      "This trip focuses on postcard towns, sea-view roads, lemon groves, and beautiful meals by the water. Great for families and easygoing travelers.",
    highlights: [
      { icon: Mountain, label: "Scenic coastal roads" },
      { icon: Camera, label: "Village photo walks" },
      { icon: Utensils, label: "Italian seaside dining" },
      { icon: Sparkles, label: "Boat and beach time" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "May – Sep"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Italian"],
      ["Vibe", "Scenic & family-friendly"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Positano",
        summary: "Arrival by coast, village stroll, and family dinner with sea views.",
        items: ["Transfer", "Village walk", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Amalfi & Ravello",
        summary: "Explore charming towns, gardens, and lemon-inspired local flavors.",
        items: ["Town visits", "Garden views", "Local lunch"],
      },
      {
        day: 3,
        title: "Boat Day",
        summary: "Spend a day on the water with swimming and hidden cove stops.",
        items: ["Boat trip", "Swimming stop", "Coastline views"],
      },
    ],
    inclusions: ["5 nights stay", "Breakfast", "Boat day", "Local transfers", "Guided town visits"],
    exclusions: ["Flights", "Insurance", "Personal purchases", "Optional private upgrades"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Paula R.", role: "Family traveler", initials: "PR", rating: 5, text: "Beautiful, easy, and full of memorable villages." },
      { name: "Jon M.", role: "Food traveler", initials: "JM", rating: 4, text: "The views and meals were the best part." },
      { name: "Elisa G.", role: "Group trip", initials: "EG", rating: 5, text: "A gorgeous and comfortable coast trip." },
    ],
  },
  "8": {
    id: "8",
    title: "Temples, Tea & Bamboo Forests",
    location: "Kyoto, Japan",
    countryLine: "Kyoto · Japan",
    hero: "/dest-tokyo.jpg",
    gallery: ["/dest-tokyo.jpg", "/dest-tokyo.jpg", "/hero-travel.jpg", "/dest-santorini.jpg", "/dest-bali.jpg"],
    type: "Family",
    rating: 4.9,
    reviewsCount: 356,
    duration: 5,
    nights: 4,
    groupSize: 8,
    price: 1180,
    oldPrice: 1360,
    dateLabel: "Oct 05",
    guestsLabel: "2 adults",
    overviewTitle: "A quieter Japan journey through heritage, tea culture, and timeless beauty",
    overviewText:
      "Kyoto is all about calm detail: temple mornings, bamboo groves, refined tea experiences, and evenings that feel poetic rather than rushed.",
    highlights: [
      { icon: Mountain, label: "Temple garden viewpoints" },
      { icon: Camera, label: "Bamboo forest photography" },
      { icon: Utensils, label: "Tea ceremony & local cuisine" },
      { icon: Sparkles, label: "Cultural walks & heritage stays" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Mar – Apr, Oct – Nov"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Japanese"],
      ["Vibe", "Culture & heritage"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Old Kyoto",
        summary: "Check in, temple district walk, and quiet traditional dinner.",
        items: ["Ryokan stay", "Temple district", "Dinner"],
      },
      {
        day: 2,
        title: "Arashiyama",
        summary: "Bamboo forest, scenic river area, and a tea ceremony experience.",
        items: ["Bamboo grove", "Tea ceremony", "River walk"],
      },
      {
        day: 3,
        title: "Shrines & Streets",
        summary: "Explore heritage lanes, local craft stores, and hidden shrine paths.",
        items: ["Shrine trail", "Craft market", "Heritage stroll"],
      },
    ],
    inclusions: ["4 nights stay", "Breakfast", "Tea ceremony", "Local transit support", "Temple district tour"],
    exclusions: ["Flights", "Insurance", "Shopping", "Optional private guides"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Mika T.", role: "Cultural traveler", initials: "MT", rating: 5, text: "Elegant, peaceful, and beautifully paced." },
      { name: "Rohan D.", role: "Family trip", initials: "RD", rating: 5, text: "A wonderful introduction to traditional Japan." },
      { name: "Sofia L.", role: "Slow traveler", initials: "SL", rating: 4, text: "Loved the tea ceremony and atmosphere." },
    ],
  },
  "9": {
    id: "9",
    title: "Rockies Lake Loop Adventure",
    location: "Banff, Canada",
    countryLine: "Banff · Canada",
    hero: "/dest-swiss.jpg",
    gallery: ["/dest-swiss.jpg", "/hero-travel.jpg", "/dest-swiss.jpg", "/dest-tokyo.jpg", "/dest-santorini.jpg"],
    type: "Adventure",
    rating: 4.8,
    reviewsCount: 221,
    duration: 8,
    nights: 7,
    groupSize: 8,
    price: 1670,
    oldPrice: 1890,
    dateLabel: "Sep 21",
    guestsLabel: "2 adults",
    overviewTitle: "A national-park adventure around lakes, forests, and mountain roads",
    overviewText:
      "Perfect for outdoors lovers, this Banff route loops through glacier lakes, scenic drives, and easy-to-moderate adventure stops with unforgettable Canadian Rockies landscapes.",
    highlights: [
      { icon: Mountain, label: "Rockies hiking viewpoints" },
      { icon: Camera, label: "Lake photography stops" },
      { icon: Utensils, label: "Mountain lodge dining" },
      { icon: Sparkles, label: "Scenic drives & wildlife moments" },
    ],
    facts: [
      ["Difficulty", "Moderate"],
      ["Best season", "Jun – Sep"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English"],
      ["Vibe", "Outdoor & scenic"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Banff",
        summary: "Check in, town walk, and evening at a mountain-view lodge.",
        items: ["Check-in", "Town walk", "Lodge dinner"],
      },
      {
        day: 2,
        title: "Lake Loop",
        summary: "Visit iconic glacier-fed lakes and short scenic trails.",
        items: ["Lake Louise", "Scenic trail", "Photo stops"],
      },
      {
        day: 3,
        title: "Adventure Day",
        summary: "Optional outdoor activities and panoramic mountain roads.",
        items: ["Adventure option", "Mountain route", "Sunset stop"],
      },
    ],
    inclusions: ["7 nights stay", "Breakfast", "Scenic route support", "National park transfers", "Guided trail day"],
    exclusions: ["Flights", "Insurance", "Equipment rentals", "Optional adventure upgrades"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Chris H.", role: "Nature traveler", initials: "CH", rating: 5, text: "Absolutely stunning lakes and excellent pacing." },
      { name: "Dev P.", role: "Adventure traveler", initials: "DP", rating: 4, text: "Great landscapes and smooth logistics." },
      { name: "Lina W.", role: "Photographer", initials: "LW", rating: 5, text: "One of the most photogenic trips I’ve done." },
    ],
  },
  "10": {
    id: "10",
    title: "Souks, Spices & Sahara Stars",
    location: "Marrakech, Morocco",
    countryLine: "Marrakech · Morocco",
    hero: "/hero-travel.jpg",
    gallery: ["/hero-travel.jpg", "/dest-santorini.jpg", "/dest-bali.jpg", "/dest-tokyo.jpg", "/dest-swiss.jpg"],
    type: "Adventure",
    rating: 4.7,
    reviewsCount: 189,
    duration: 6,
    nights: 5,
    groupSize: 8,
    price: 920,
    oldPrice: 1080,
    dateLabel: "Nov 11",
    guestsLabel: "2 adults",
    overviewTitle: "Markets, riads, desert tones, and one unforgettable night sky",
    overviewText:
      "This trip mixes Marrakech’s sensory energy with desert calm. Expect vibrant souks, spice-heavy dining, riad stays, and one magical starlit desert evening.",
    highlights: [
      { icon: Mountain, label: "Desert viewpoint journey" },
      { icon: Camera, label: "Colorful market photography" },
      { icon: Utensils, label: "Traditional Moroccan dining" },
      { icon: Sparkles, label: "Sahara-style stargazing night" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Oct – Apr"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Arabic, French"],
      ["Vibe", "Culture & desert"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Marrakech Arrival",
        summary: "Riad check-in, market walk, and rooftop dinner in the old city.",
        items: ["Riad stay", "Souk walk", "Rooftop dinner"],
      },
      {
        day: 2,
        title: "Culture & Color",
        summary: "Explore gardens, crafts, and vibrant architecture through the medina.",
        items: ["Garden visit", "Craft markets", "Street food"],
      },
      {
        day: 3,
        title: "Desert Evening",
        summary: "Head out for a desert-style evening with stars, music, and calm.",
        items: ["Desert drive", "Camp dinner", "Night sky viewing"],
      },
    ],
    inclusions: ["5 nights stay", "Breakfast", "Riad stay", "Desert excursion", "Local guide support"],
    exclusions: ["Flights", "Insurance", "Shopping", "Optional hammam/spa"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Leila A.", role: "Culture traveler", initials: "LA", rating: 5, text: "So colorful and immersive. The desert evening was special." },
      { name: "Omkar S.", role: "Solo traveler", initials: "OS", rating: 4, text: "Great markets and very memorable food." },
      { name: "Julia F.", role: "Couple trip", initials: "JF", rating: 5, text: "A beautiful mix of energy and calm." },
    ],
  },
  "11": {
    id: "11",
    title: "Overwater Villa Honeymoon Escape",
    location: "Maldives",
    countryLine: "Maldives · Indian Ocean",
    hero: "/dest-bali.jpg",
    gallery: ["/dest-bali.jpg", "/hero-travel.jpg", "/dest-santorini.jpg", "/dest-bali.jpg", "/dest-swiss.jpg"],
    type: "Honeymoon",
    featured: true,
    rating: 5.0,
    reviewsCount: 412,
    duration: 5,
    nights: 4,
    groupSize: 4,
    price: 2480,
    oldPrice: 2790,
    dateLabel: "Dec 03",
    guestsLabel: "2 adults",
    overviewTitle: "A luxury island stay built for romance, privacy, and sea views",
    overviewText:
      "Think turquoise water, overwater villas, private dinners, spa moments, and zero rush. This is a polished honeymoon escape with luxurious simplicity.",
    highlights: [
      { icon: Mountain, label: "Private island views" },
      { icon: Camera, label: "Lagoon & villa photography" },
      { icon: Utensils, label: "Private beach dinners" },
      { icon: Sparkles, label: "Spa and sunset cruise" },
    ],
    facts: [
      ["Difficulty", "Easy"],
      ["Best season", "Nov – Apr"],
      ["Group size", "2 – 4 travelers"],
      ["Languages", "English"],
      ["Vibe", "Luxury & romance"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival by Speedboat",
        summary: "Check into your overwater villa and begin with a sunset welcome evening.",
        items: ["Villa check-in", "Lagoon time", "Sunset dinner"],
      },
      {
        day: 2,
        title: "Spa & Lagoon Day",
        summary: "A slow day of snorkeling, spa rituals, and uninterrupted ocean views.",
        items: ["Snorkeling", "Spa session", "Private dining"],
      },
      {
        day: 3,
        title: "Cruise & Relax",
        summary: "Sunset cruise and free time to enjoy the resort and water.",
        items: ["Sunset cruise", "Beach time", "Luxury dinner"],
      },
    ],
    inclusions: ["4 nights villa stay", "Breakfast", "Airport/resort transfers", "One spa treatment", "Sunset cruise"],
    exclusions: ["Flights", "Insurance", "Premium dining upgrades", "Personal shopping"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Ira N.", role: "Honeymoon", initials: "IN", rating: 5, text: "Absolutely dreamy. The villa and dinner setup were perfect." },
      { name: "Kabir L.", role: "Luxury traveler", initials: "KL", rating: 5, text: "Peaceful, stunning, and worth every bit." },
      { name: "Mona D.", role: "Couple trip", initials: "MD", rating: 5, text: "The most relaxing stay we’ve had." },
    ],
  },
  "12": {
    id: "12",
    title: "Northern Lights & Glacier Trek",
    location: "Reykjavik, Iceland",
    countryLine: "Reykjavik · Iceland",
    hero: "/dest-santorini.jpg",
    gallery: ["/dest-santorini.jpg", "/dest-swiss.jpg", "/hero-travel.jpg", "/dest-tokyo.jpg", "/dest-bali.jpg"],
    type: "Adventure",
    rating: 4.8,
    reviewsCount: 174,
    duration: 7,
    nights: 6,
    groupSize: 8,
    price: 1740,
    oldPrice: 1960,
    dateLabel: "Jan 14",
    guestsLabel: "2 adults",
    overviewTitle: "An Icelandic route of glaciers, dramatic terrain, and aurora nights",
    overviewText:
      "Ideal for cold-weather adventurers, this journey includes glacier landscapes, black-sand scenery, and the possibility of unforgettable northern lights nights.",
    highlights: [
      { icon: Mountain, label: "Glacier viewpoints and hikes" },
      { icon: Camera, label: "Aurora and landscape photography" },
      { icon: Utensils, label: "Nordic dining experiences" },
      { icon: Sparkles, label: "Northern lights chasing" },
    ],
    facts: [
      ["Difficulty", "Moderate"],
      ["Best season", "Sep – Mar"],
      ["Group size", "4 – 8 travelers"],
      ["Languages", "English, Icelandic"],
      ["Vibe", "Epic & adventurous"],
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Reykjavik",
        summary: "Check in, city orientation, and a first glimpse of Icelandic culture.",
        items: ["Check-in", "City walk", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Waterfalls & Black Sand",
        summary: "A full scenic day of natural landmarks and dramatic coastal terrain.",
        items: ["Waterfall route", "Black sand beach", "Landscape stops"],
      },
      {
        day: 3,
        title: "Glacier & Aurora",
        summary: "Glacier-focused experience followed by an evening aurora watch.",
        items: ["Glacier hike", "Hot drink stop", "Northern lights watch"],
      },
    ],
    inclusions: ["6 nights stay", "Breakfast", "Glacier excursion", "Aurora outing", "Local transport"],
    exclusions: ["Flights", "Insurance", "Cold-weather gear rentals", "Optional spa experiences"],
    buddies: SHARED_BUDDIES,
    reviews: [
      { name: "Helena V.", role: "Adventure traveler", initials: "HV", rating: 5, text: "Iceland felt cinematic. The aurora night was incredible." },
      { name: "Raghav M.", role: "Nature lover", initials: "RM", rating: 4, text: "Amazing landscapes and good logistics." },
      { name: "Tara C.", role: "Photographer", initials: "TC", rating: 5, text: "An unforgettable route with stunning scenery." },
    ],
  },
};

const defaultTrip = TRIP_DETAILS["1"];

const TripDetails = () => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const params = useParams();

  const trip = useMemo(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!id) return defaultTrip;
    return TRIP_DETAILS[id] ?? defaultTrip;
  }, [params]);

  useEffect(() => {
    const onScroll = () => setShowStickyCTA(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-12">
        <div className="container">
          <Link
            href="/explore"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-smooth hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Explore
          </Link>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-5">
            <div className="group relative h-[420px] overflow-hidden rounded-3xl shadow-elevated lg:h-[560px]">
              <img
                src={trip.hero}
                alt={`${trip.title} trip hero`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

              <div className="absolute left-4 top-4 flex gap-2">
                <Badge className="border-0 bg-background/90 text-foreground shadow-soft backdrop-blur-md hover:bg-background">
                  {trip.type}
                </Badge>
                {trip.featured && (
                  <Badge className="border-0 bg-accent text-accent-foreground shadow-warm hover:bg-accent">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="absolute right-4 top-4 flex gap-2">
                <button className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition-bounce hover:scale-110">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition-bounce hover:scale-110">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sm:p-8">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <MapPin className="h-4 w-4" />
                  {trip.countryLine}
                </div>
                <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {trip.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <strong>{trip.rating}</strong>
                    <span className="opacity-80">({trip.reviewsCount} reviews)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 opacity-90">
                    <Clock className="h-4 w-4" /> {trip.duration} days · {trip.nights} nights
                  </span>
                  <span className="inline-flex items-center gap-1.5 opacity-90">
                    <Users className="h-4 w-4" /> Group of {trip.groupSize}
                  </span>
                </div>
              </div>
            </div>

            <aside className="self-start rounded-3xl border border-border/60 bg-card p-6 shadow-elevated sm:p-7 lg:sticky lg:top-28">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold tracking-tight">
                  ${trip.price}
                </span>
                <span className="text-sm text-muted-foreground">/ person</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="line-through">${trip.oldPrice}</span> · Save this week
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-secondary/70 p-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Date
                  </div>
                  <div className="mt-0.5 font-medium">{trip.dateLabel}</div>
                </div>
                <div className="rounded-xl bg-secondary/70 p-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> Guests
                  </div>
                  <div className="mt-0.5 font-medium">{trip.guestsLabel}</div>
                </div>
              </div>

              <Button variant="hero" size="xl" className="mt-5 w-full">
                Book Now
              </Button>
              <Button variant="outline" size="lg" className="mt-2 w-full rounded-xl">
                <MessageCircle className="h-4 w-4" /> Chat with host
              </Button>

              <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Free cancellation up to 7 days before departure
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Overview
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {trip.overviewTitle}
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-foreground/75">
              {trip.overviewText}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-hero shadow-glow">
                    <h.icon className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <span className="text-sm font-medium">{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 gradient-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              Trip facts
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {trip.facts.map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-border/60 pb-3 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 gradient-soft">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Itinerary
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your day-by-day journey
            </h2>
          </div>

          <ol className="relative ml-3 mt-12 space-y-8 border-l-2 border-dashed border-border sm:ml-4">
            {trip.itinerary.map((d) => (
              <li key={d.day} className="relative pl-8 sm:pl-10">
                <span className="absolute -left-[18px] top-0 grid h-9 w-9 place-items-center rounded-full gradient-hero text-xs font-bold text-primary-foreground shadow-glow">
                  D{d.day}
                </span>
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-smooth hover:shadow-card">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      Day {d.day} · {d.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">~ 8 hrs activity</span>
                  </div>
                  <p className="mt-2 text-pretty leading-relaxed text-foreground/75">{d.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {d.items.map((it) => (
                      <Badge
                        key={it}
                        variant="secondary"
                        className="rounded-full bg-secondary/80 font-medium text-foreground/80"
                      >
                        {it}
                      </Badge>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Gallery
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Moments from the trip
              </h2>
            </div>
            <Button variant="ghost" className="rounded-xl">
              View all photos
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {trip.gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl shadow-soft transition-smooth hover:shadow-card",
                  i === 0 && "col-span-2 row-span-2 aspect-square md:aspect-auto",
                  i !== 0 && "aspect-square"
                )}
              >
                <img
                  src={src}
                  alt={`Trip gallery ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 transition-smooth group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 gradient-soft">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Pricing
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Transparent breakdown
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft lg:col-span-2">
              <h3 className="font-display text-lg font-semibold">Cost details</h3>
              <ul className="mt-5 divide-y divide-border/60">
                {[
                  ["Accommodation", `$${Math.round(trip.price * 0.5)}`],
                  ["Meals & dining", `$${Math.round(trip.price * 0.17)}`],
                  ["Experiences & activities", `$${Math.round(trip.price * 0.21)}`],
                  ["Transfers & local travel", `$${Math.round(trip.price * 0.08)}`],
                  ["Service fees", `$${Math.round(trip.price * 0.04)}`],
                ].map(([k, v]) => (
                  <li key={k} className="flex justify-between py-3 text-sm">
                    <span className="text-foreground/80">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t-2 border-dashed border-border pt-4">
                <span className="font-display text-lg font-semibold">Total per person</span>
                <span className="text-gradient font-display text-2xl font-bold">
                  ${trip.price}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  Inclusions
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                  {trip.inclusions.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <X className="h-4 w-4" />
                  </span>
                  Exclusions
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                  {trip.exclusions.map((i) => (
                    <li key={i} className="flex gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Location
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Where you'll be
            </h2>
          </div>

          <div className="relative mt-10 h-[360px] overflow-hidden rounded-3xl border border-border/60 bg-secondary shadow-elevated sm:h-[440px]">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.18), transparent 50%), radial-gradient(circle at 70% 70%, hsl(var(--accent) / 0.15), transparent 50%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.4,
              }}
            />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
              <span className="relative grid h-14 w-14 place-items-center rounded-full gradient-hero shadow-glow animate-pulse">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </span>
              <div className="rounded-xl glass px-4 py-2 text-sm font-semibold shadow-soft">
                {trip.location}
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <Button variant="glass" size="sm" className="rounded-xl">
                Open in maps
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 gradient-soft">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Travel buddies
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Who's going on this trip
              </h2>
              <p className="mt-3 text-foreground/70">
                A hand-matched group of {trip.buddies.length} verified travelers.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              See all buddies
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trip.buddies.map((b) => (
              <div
                key={b.name}
                className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-hero font-semibold text-primary-foreground shadow-glow">
                  {b.initials}
                </div>
                <div className="mt-3 text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.role}</div>
                <Button variant="ghost" size="sm" className="mt-3 w-full rounded-lg text-xs">
                  Say hi
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Reviews
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                What travelers say
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-3 shadow-soft">
              <span className="font-display text-3xl font-bold">{trip.rating}</span>
              <div className="text-xs">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <div className="mt-0.5 text-muted-foreground">{trip.reviewsCount} reviews</div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {trip.reviews.map((r) => (
              <figure
                key={r.name}
                className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition-smooth hover:shadow-card"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "h-4 w-4",
                        j < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-pretty leading-relaxed text-foreground/80">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full gradient-hero text-sm font-semibold text-primary-foreground shadow-glow">
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <div
        className={cn(
          "fixed bottom-4 inset-x-4 z-40 transition-all duration-500 sm:bottom-6 sm:right-6 sm:inset-x-auto",
          showStickyCTA
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        )}
      >
        <div className="glass flex items-center gap-4 rounded-2xl p-3 pl-5 shadow-elevated sm:min-w-[420px]">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">
              {trip.title} · {trip.duration} days
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold">${trip.price}</span>
              <span className="text-xs text-muted-foreground">/ person</span>
            </div>
          </div>
          <Button variant="hero" size="lg" className="shrink-0 rounded-xl shadow-glow">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;