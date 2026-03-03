# AI Student Toolkit

A comprehensive AI-powered study companion for students with homework help, step-by-step explanations, formula sheets, calculators, converters, flashcards, and practice quizzes.

## Features

- **Authentication**: Secure login with email/password and Google OAuth via Supabase
- **Profile Management**: Customizable user profiles with avatars
- **Study Tools**: Multiple educational tools and resources
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and Framer Motion

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd ai-app-ver2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Configure Authentication settings:
   - Set Site URL to `http://localhost:5173` (for development)
   - Add redirect URLs: `http://localhost:5173/auth`, `http://localhost:5173/**`
   - Enable Google OAuth if desired (requires Google Cloud Console setup)
3. Copy your Supabase credentials to the `.env` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── pages/             # Page components
├── integrations/      # External service integrations (Supabase)
└── main.tsx           # App entry point
```

## Authentication

The app uses Supabase for authentication with support for:
- Email/password signup and login
- Email verification
- Password reset
- Google OAuth (requires configuration)
- Guest mode for browsing without account

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push your changes
5. Open a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
