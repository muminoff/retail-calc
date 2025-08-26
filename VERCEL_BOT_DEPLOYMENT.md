# Deploy Telegram Bot to Vercel (Free)

## Why Vercel?
- ✅ **100% Free** for personal use
- ✅ **No server needed** - serverless functions
- ✅ **Auto-deploy** from GitHub
- ✅ **Easy setup** (5 minutes)

## Step 1: Create Bot on Telegram

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot`
3. Choose name: "Savdo Kalkulyatori"
4. Choose username: `your_name_calc_bot` (must end with 'bot')
5. **Copy the token** (looks like: `1234567890:ABCdef...`)

## Step 2: Deploy to Vercel

### Method A: One-Click Deploy (Easiest)

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository: `muminoff/retail-calc`
5. Add Environment Variable:
   - Name: `BOT_TOKEN`
   - Value: `[paste your bot token]`
6. Click "Deploy"

### Method B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable
vercel env add BOT_TOKEN production
# Paste your bot token when prompted

# Redeploy
vercel --prod
```

## Step 3: Set Webhook

After deployment, visit your Vercel URL:
```
https://your-app.vercel.app/api/telegram
```

This will automatically set up the webhook.

## Step 4: Configure Menu Button

1. Go to [@BotFather](https://t.me/botfather)
2. Send `/mybots`
3. Select your bot
4. Bot Settings → Menu Button
5. Send URL: `https://muminoff.com/retail-calc/`
6. Send text: `🧮 Kalkulyator`

## Step 5: Test Your Bot

1. Find your bot in Telegram (search by username)
2. Send `/start`
3. Click "🧮 Kalkulyatorni ochish"
4. Your calculator opens!

## Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
BOT_TOKEN=your_bot_token_here
```

## How It Works

1. User sends message to bot
2. Telegram sends webhook to Vercel function
3. Function processes message and responds
4. User sees response with Mini App button

## Monitoring

Check function logs in Vercel Dashboard:
- Go to Functions tab
- Click on `api/telegram`
- View real-time logs

## Troubleshooting

### Bot not responding?
1. Check Vercel function logs
2. Verify BOT_TOKEN is set correctly
3. Visit `https://your-app.vercel.app/api/telegram` to reset webhook

### Mini App not opening?
1. Check Menu Button configuration in BotFather
2. Verify URL is correct: `https://muminoff.com/retail-calc/`

## Costs

**Vercel Free Tier includes:**
- 100GB bandwidth/month
- 100,000 function invocations/month
- More than enough for a Telegram bot!

## Alternative Free Options

If you prefer other platforms:

### 1. **Netlify Functions** (Similar to Vercel)
- Create `netlify/functions/telegram.js`
- Deploy to Netlify
- Set environment variables

### 2. **Cloudflare Workers** (100k requests/day free)
- Even faster globally
- Similar serverless setup

### 3. **Deno Deploy** (Unlimited requests)
- Simple TypeScript/JavaScript
- Direct GitHub integration

### 4. **Railway** (Free trial)
- Full Node.js bot
- $5 credit monthly

## Security

- Never commit BOT_TOKEN to Git
- Use environment variables
- Webhook is secure (HTTPS required)

## Next Steps

1. ✅ Bot is running on Vercel
2. ✅ Mini App is on GitHub Pages
3. ✅ Everything is FREE!
4. Optional: Add more bot commands in `api/telegram.js`