# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Telegram Mini App called "Savdo Kalkulyatori" for trade price calculations. It's a React TypeScript application that runs inside Telegram, built with Vite and deployed on Vercel.

## Essential Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production (includes TypeScript check)
npm run lint         # Check code quality
npm run preview      # Preview production build

# Deployment (auto-deploys on push to main)
vercel              # Deploy to staging
vercel --prod       # Deploy to production
```

## Architecture

The app is structured as:
- **Frontend**: React SPA with Telegram Mini Apps SDK integration
- **UI Layer**: shadcn/ui components (Radix UI based) with Tailwind CSS
- **Backend**: Serverless functions in `/api` directory for Telegram bot webhooks
- **State**: Component-level state management with React hooks
- **Routing**: Single-page app with conditional rendering

Key architectural decisions:
- Path aliases: `@/` maps to `src/` directory
- UI components follow shadcn/ui pattern in `src/components/ui/`
- Serverless functions handle Telegram bot interactions
- Environment variables prefixed with `VITE_` for client-side access

## Development Workflow

1. **Before making changes**: Run `npm run dev` to start development server
2. **After making changes**: Run `npm run lint` and fix any issues
3. **Before committing**: Run `npm run build` to ensure TypeScript compilation succeeds
4. **Deployment**: Push to `main` branch triggers automatic Vercel deployment

## Code Conventions

- **Components**: Functional components with TypeScript, named exports preferred
- **Styling**: Use Tailwind utility classes with `cn()` helper for conditional classes
- **Types**: Define interfaces/types in component files or `src/types/`
- **Imports**: Use `@/` prefix for src imports (e.g., `@/components/ui/button`)

## Testing Single Components

To test individual components in isolation:
```bash
# Start dev server and navigate to component
npm run dev
# Modify App.tsx temporarily to render only the component you're testing
```

## Environment Variables

Client-side variables must be prefixed with `VITE_`:
```env
VITE_API_URL=your_api_url
VITE_BOT_TOKEN=your_bot_token
```

Server-side variables in Vercel:
```env
BOT_TOKEN=telegram_bot_token
```