# Supabase Setup Guide for Polling App

This guide will help you set up the Supabase database for the polling application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A new Supabase project

## Environment Variables

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase URL and anon key from your Supabase project dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema Setup

### Option 1: Using the SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20230701000000_create_polls_schema.sql`
5. Run the query

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Database Schema

The polling app uses the following tables:

### polls

Stores information about each poll:

- `id`: UUID primary key
- `title`: Poll title/question
- `description`: Optional poll description
- `created_at`: Timestamp of creation
- `created_by`: User ID of creator (nullable for anonymous polls)

### poll_options

Stores options for each poll:

- `id`: UUID primary key
- `poll_id`: Foreign key to polls table
- `text`: Option text
- `created_at`: Timestamp of creation

### votes

Stores user votes:

- `id`: UUID primary key
- `poll_id`: Foreign key to polls table
- `option_id`: Foreign key to poll_options table
- `user_id`: User ID (nullable for anonymous votes)
- `ip_address`: IP address (for anonymous votes)
- `created_at`: Timestamp of vote

### poll_results View

A view that aggregates vote counts for each option:

- `poll_id`: Poll ID
- `option_id`: Option ID
- `text`: Option text
- `vote_count`: Number of votes for this option

## Row Level Security Policies

The schema includes RLS policies to ensure data security:

- Anyone can read polls and options
- Only authenticated users can create polls
- Only the creator can update or delete their polls
- Anyone can vote, but only once per poll (enforced by application logic)

## Testing the Setup

After setting up the database, you can test it by:

1. Starting the development server: `npm run dev`
2. Creating a new poll at `/polls/create`
3. Viewing the poll and voting

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Verify that the SQL migration ran successfully
3. Check the Supabase logs for any errors
4. Ensure your RLS policies are correctly configured