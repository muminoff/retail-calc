# Project Structure

## Root Directory
```
warehouse/
├── src/                    # Source code
├── public/                 # Static assets
├── api/                    # Vercel serverless functions
├── telegram-bot-node/      # Telegram bot code
├── dist/                   # Build output (gitignored)
└── node_modules/           # Dependencies (gitignored)
```

## Source Structure
```
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   └── Calculator.tsx     # Main calculator component
├── lib/                   # Utility functions
│   └── utils.ts          # Helper utilities
├── types/                 # TypeScript type definitions
├── assets/               # Images and static resources
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── index.css            # Global styles with Tailwind
└── vite-env.d.ts        # Vite type definitions
```

## Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript config (references)
- `tsconfig.app.json` - App TypeScript config
- `tailwind.config.js` - Tailwind CSS config
- `postcss.config.js` - PostCSS config
- `eslint.config.js` - ESLint configuration
- `vercel.json` - Vercel deployment config

## API Structure
- `api/telegram.js` - Telegram webhook handler

## Documentation
- `README.md` - Project overview and setup
- `VERCEL_DEPLOYMENT.md` - Vercel deployment guide
- `VERCEL_BOT_DEPLOYMENT.md` - Bot deployment guide
- `TELEGRAM_BOT_SETUP.md` - Telegram bot setup