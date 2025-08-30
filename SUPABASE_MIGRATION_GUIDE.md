# Supabase Migration Guide

This guide provides instructions for applying the SQL migration to your Supabase database to set up the polls application schema.

## Prerequisites

1. A Supabase account and project
2. Supabase project URL and anon key (public)
3. Access to the Supabase dashboard or CLI

## Option 1: Apply Migration via Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Navigate to the SQL Editor
4. Create a new query
5. Copy the contents of the SQL migration file from `supabase/migrations/20230701000000_create_polls_schema.sql`
6. Paste the SQL into the query editor
7. Run the query

## Option 2: Apply Migration via Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Apply the migration:
   ```bash
   supabase db push
   ```

## Verifying the Migration

After applying the migration, verify that the following tables and views have been created:

- `polls` - Stores poll information
- `poll_options` - Stores options for each poll
- `votes` - Stores user votes on poll options
- `poll_results` - View that aggregates vote counts

You can check these in the Supabase Dashboard under "Database" > "Tables".

## Environment Variables

Ensure your application has the correct environment variables set:

1. Create a `.env.local` file in the root of your project (if not already present)
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Testing the Schema

You can test the schema by creating a poll through the application UI or by inserting test data directly.

### Option 1: Using the Sample Data Script

We've provided a sample data script that creates test polls, options, and votes:

1. Navigate to the SQL Editor in your Supabase Dashboard
2. Open the file `supabase/sample_data.sql` from this project
3. Copy the contents and paste them into the SQL Editor
4. Run the script

This will create three sample polls with options and votes to test the functionality.

### Option 2: Manual Test Data

Alternatively, you can manually insert test data:

```sql
-- Insert a test poll
INSERT INTO polls (title, description, created_by)
VALUES ('Test Poll', 'This is a test poll', 'anonymous');

-- Get the poll ID
SELECT id FROM polls WHERE title = 'Test Poll' ORDER BY created_at DESC LIMIT 1;

-- Insert poll options (replace poll_id with the actual ID)
INSERT INTO poll_options (poll_id, text)
VALUES 
  (poll_id, 'Option 1'),
  (poll_id, 'Option 2'),
  (poll_id, 'Option 3');

-- Insert a test vote (replace poll_id and option_id with actual IDs)
INSERT INTO votes (poll_id, option_id, voter_id)
VALUES (poll_id, option_id, 'test-user');

-- Query poll results
SELECT * FROM poll_results WHERE poll_id = poll_id;
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your Supabase user has the necessary permissions to create tables and functions.

2. **Table Already Exists**: If you see errors about tables already existing, you may need to drop the existing tables first or modify the migration to use `CREATE TABLE IF NOT EXISTS`.

3. **RLS Policy Errors**: If you encounter issues with Row Level Security policies, ensure you understand the security implications and adjust as needed.

4. **Function Creation Errors**: If the `get_poll_results` function fails to create, check your PostgreSQL version compatibility.

### Getting Help

If you encounter issues with the migration, check the Supabase documentation or community forums:

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com)