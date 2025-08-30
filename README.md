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

## Future Enhancements

- User authentication with NextAuth.js
- Database integration (e.g., PostgreSQL, MongoDB)
- Poll analytics and statistics
- Social sharing features
- Poll expiration settings
- Custom poll themes
