# Polling App

A Next.js application for creating and participating in polls.

## Features

- User authentication (login, register, forgot password)
- Create polls with multiple options
- Vote on polls
- View poll results in real-time
- Responsive design with Shadcn UI components

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/                # Authentication routes
│   │   │   ├── login/             # Login page
│   │   │   ├── register/          # Registration page
│   │   │   └── forgot-password/   # Password reset page
│   │   ├── polls/                 # Poll-related routes
│   │   │   ├── [id]/              # Individual poll page
│   │   │   └── create/            # Create poll page
│   │   ├── layout.tsx             # Root layout with navigation
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── auth/                  # Authentication components
│   │   ├── polls/                 # Poll-related components
│   │   ├── ui/                    # Shadcn UI components
│   │   └── nav.tsx                # Navigation component
│   └── lib/
│       └── utils.ts               # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Supabase (Authentication & Database)

## Database Setup

This project uses Supabase for authentication and database. Follow these steps to set up your database:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and add your Supabase credentials
3. Set up the database schema by following the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. Apply the SQL migration to create the necessary tables by following the instructions in [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)

## Future Enhancements

- Poll analytics and statistics
- Social sharing features
- Poll expiration settings
- Custom poll themes
- Email notifications for poll results
