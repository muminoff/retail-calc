# Savdo Kalkulyatori - Telegram Mini App

A Telegram Mini App for trade price calculations.

## Tech Stack

- **React** with TypeScript
- **Vite** for build tooling
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Telegram Mini Apps SDK** for Telegram integration
- **Cloudflare Pages** for deployment

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub

2. Import project on [Vercel](https://vercel.com):
   - Connect GitHub repository
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. Add environment variables:
   - `BOT_TOKEN` for Telegram bot

4. Every push to `main` auto-deploys!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Features on Vercel

- ✅ Auto-deploy on Git push
- ✅ Preview deployments for PRs
- ✅ Telegram bot webhook support
- ✅ Global CDN
- ✅ Free SSL
- ✅ Zero configuration needed

## Telegram Bot Setup

1. Create a new bot using [@BotFather](https://t.me/botfather)

2. Enable Mini App for your bot:
   - Send `/newapp` to BotFather
   - Select your bot
   - Enter your Cloudflare Pages URL
   - Choose a short name for the app

3. Test your Mini App:
   - Open your bot in Telegram
   - Click the Menu button or send `/start`
   - Your Mini App should open

## Features

- ✅ Calculate retail prices for products
- ✅ Original price slider (500-50,000 KRW with 500 KRW steps)
- ✅ Weight-based shipping calculation (15,000 KRW/kg)
- ✅ Adjustable profit margin (0-80%)
- ✅ Real-time KRW to UZS exchange rate
- ✅ Automatic price rounding to nearest 1,000 UZS
- ✅ Detailed cost breakdown
- ✅ Dark/Light theme support (follows Telegram theme)
- ✅ User authentication via Telegram


## Project Structure

```
warehouse/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── public/
│   └── _redirects        # Cloudflare Pages redirects
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Environment Variables (Optional)

If you need to add environment variables, create a `.env` file:

```env
VITE_API_URL=your_api_url
VITE_BOT_TOKEN=your_bot_token
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## License

Private