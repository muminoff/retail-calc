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

## Deployment to Cloudflare Pages

### Method 1: Using Cloudflare Dashboard

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Create a new project and upload the `dist` folder

### Method 2: Using Wrangler CLI

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Build and deploy:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

### Method 3: Git Integration

1. Push your code to GitHub/GitLab

2. Connect your repository in Cloudflare Pages dashboard

3. Set build configuration:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18 or later

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