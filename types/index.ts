// types/index.ts

export type DayPlan = {
  day: number;
  title: string;
  activities: string[];
};

export type TripPlan = {
  itinerary: DayPlan[];
  budget: Record<string, string>;
  tips?: string[];
  places?: string[];
};

export type Trip = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  created_at: string;
  invite_code?: string;
  plan?: TripPlan;
};

export type TripWithMembers =
  Trip & {
    membersCount: number;
  };

export type Member = {
  id: string;
  user_id: string;
  user_name: string;
  role?: string;
};

export type BuddyProfile = {
  id?: string;
  user_id: string;
  name: string;
  age?: number;
  city?: string;
  bio?: string;
  interests?: string[];
  avatar_initials?: string;
  gradient?: string;
  is_verified?: boolean;
};

export type Expense = {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  amount: number;
  category?: string;
  paid_by?: string;
  paid_by_name?: string;
  created_at?: string;
};

export type ExpenseSplit = {
  id?: string;
  expense_id: string;
  user_id: string;
  amount: number;
};

export type Settlement = {
  id?: string;
  trip_id: string;

  payer_user_id: string;
  receiver_user_id: string;

  payer_name?: string;
  receiver_name?: string;

  amount: number;

  razorpay_payment_id?: string;

  status?: string;
};