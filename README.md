# Polly - Next.js Polling Application

Polly is a modern polling application built with Next.js and Shadcn UI components. It allows users to create, share, and vote on polls.

## Features

- **User Authentication**: Register and login functionality
- **Create Polls**: Create custom polls with multiple options
- **Vote on Polls**: Cast votes and see real-time results
- **User Profiles**: View and edit user profiles

## Project Structure

```
├── app/
│   ├── auth/                  # Authentication related pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── layout.tsx         # Layout for auth pages
│   ├── polls/                 # Poll related pages
│   │   ├── [id]/              # Individual poll page
│   │   ├── create/            # Create poll page
│   │   ├── page.tsx           # Polls listing page
│   │   └── layout.tsx         # Layout for poll pages
│   ├── profile/               # User profile page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                # UI components
│   └── ui/                    # Shadcn UI components
└── lib/                       # Utility functions
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

- **Next.js**: React framework for server-rendered applications
- **Shadcn UI**: Component library built on Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Static type checking

## Future Enhancements

- Real-time updates with WebSockets
- Social sharing functionality
- Advanced poll analytics
- Poll categories and tags
- Admin dashboard
