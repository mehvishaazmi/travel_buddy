# TravelBuddy Database Documentation

## Database

* PostgreSQL (Supabase)

## Tables

### users

Stores application users.

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| clerk_id   | text      |
| email      | text      |
| created_at | timestamp |

### trips

Stores trip information.

| Column      | Type      |
| ----------- | --------- |
| id          | uuid      |
| user_id     | text      |
| destination | text      |
| days        | integer   |
| budget      | numeric   |
| plan        | jsonb     |
| created_at  | timestamp |
| invite_code | text      |

### trip_members

Stores members participating in trips.

### trip_requests

Stores requests to join trips.

### messages

Stores direct messages between users.

### buddy_profiles

Stores travel buddy profiles and preferences.

### saved_buddies

Stores saved buddy connections.

### expenses

Stores trip expenses.

### expense_splits

Stores expense distribution among members.

### settlements

Stores payment settlement records.
