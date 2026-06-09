-- TravelBuddy Database Schema
-- Generated from Supabase

CREATE TABLE users (
id UUID PRIMARY KEY,
clerk_id TEXT,
email TEXT,
created_at TIMESTAMP
);

CREATE TABLE trips (
id UUID PRIMARY KEY,
user_id TEXT,
destination TEXT,
days INTEGER,
budget NUMERIC,
plan JSONB,
created_at TIMESTAMP,
invite_code TEXT
);

CREATE TABLE trip_members (
id UUID PRIMARY KEY,
trip_id UUID,
user_id TEXT,
user_name TEXT,
joined_at TIMESTAMP,
role TEXT
);

CREATE TABLE trip_requests (
id UUID PRIMARY KEY,
trip_id UUID,
requester_user_id TEXT,
owner_user_id TEXT,
status TEXT,
created_at TIMESTAMP
);

CREATE TABLE messages (
id UUID PRIMARY KEY,
sender_id TEXT,
receiver_id TEXT,
content TEXT,
created_at TIMESTAMP
);

CREATE TABLE buddy_profiles (
id UUID PRIMARY KEY,
user_id TEXT,
name TEXT,
age INTEGER,
city TEXT,
bio TEXT,
interests TEXT[],
avatar_initials TEXT,
gradient TEXT,
is_verified BOOLEAN,
created_at TIMESTAMP
);

CREATE TABLE saved_buddies (
id UUID PRIMARY KEY,
saver_user_id TEXT,
saved_user_id TEXT,
created_at TIMESTAMP
);

CREATE TABLE expenses (
id UUID PRIMARY KEY,
trip_id UUID,
user_id TEXT,
title TEXT,
amount NUMERIC,
created_at TIMESTAMP,
category TEXT,
paid_by_name TEXT,
split_count INTEGER,
paid_by TEXT
);

CREATE TABLE expense_splits (
id UUID PRIMARY KEY,
expense_id UUID,
user_id TEXT,
user_name TEXT,
amount NUMERIC,
is_paid BOOLEAN,
created_at TIMESTAMP,
amount_owed NUMERIC
);

CREATE TABLE settlements (
id UUID PRIMARY KEY,
trip_id UUID,
payer_user_id TEXT,
receiver_user_id TEXT,
payer_name TEXT,
receiver_name TEXT,
amount NUMERIC,
razorpay_payment_id TEXT,
status TEXT,
created_at TIMESTAMP
);
