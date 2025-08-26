# Vercel Deployment Setup

## Why Switch to Vercel?

- ✅ **Better Performance** - Global CDN, faster than GitHub Pages
- ✅ **Bot + App in One Place** - Both frontend and Telegram bot
- ✅ **Auto-Deploy** - Push to GitHub = instant deploy
- ✅ **Preview Deployments** - Every PR gets a preview URL
- ✅ **Free Tier** - 100GB bandwidth, unlimited deployments

## Initial Setup (One-Time)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import `muminoff/retail-calc` repository
5. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

### Step 2: Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

Add your bot token:
```
Name: BOT_TOKEN
Value: [Your Telegram Bot Token]
```

### Step 3: Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Build your app
3. Deploy to production
4. Give you a URL like: `https://retail-calc.vercel.app`

## Auto-Deployment is Already Set Up!

Once connected, Vercel automatically:
- **Deploys on push to `main`** → Production
- **Deploys on PR** → Preview URL
- **No workflow files needed** - It just works!

## Your App Structure on Vercel

```
https://your-app.vercel.app/
├── /                    # Your calculator app
├── /api/telegram        # Telegram bot webhook
└── /assets/*           # Static files
```

## Update Your Telegram Bot

### 1. Set New Webhook
Visit this URL once after deployment:
```
https://your-app.vercel.app/api/telegram
```

### 2. Update Mini App URL
Go to @BotFather:
1. `/mybots`
2. Select your bot
3. Bot Settings → Menu Button
4. Send new URL: `https://your-app.vercel.app`

## Deployment Status

Check deployments:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. See all deployments with logs

## Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain (e.g., `calc.yourdomain.com`)
3. Update DNS records as shown
4. SSL certificate auto-configured

## Environment Variables for Production

```env
BOT_TOKEN=your_telegram_bot_token
# Add any other variables here
```

## Build Settings (Already Configured)

In `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Monitoring

- **Functions Tab**: See bot webhook logs
- **Analytics Tab**: Track usage
- **Speed Insights**: Performance metrics

## Rollback Deployments

If something breaks:
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Pull environment variables
vercel env pull

# Dev with Vercel environment
vercel dev
```

## Costs

**Free Tier Includes:**
- 100GB Bandwidth
- Unlimited deployments
- 100,000 serverless function invocations
- SSL certificates
- Global CDN

Perfect for this project!

## Troubleshooting

### App not deploying?
- Check build logs in Vercel Dashboard
- Verify `npm run build` works locally

### Bot not responding?
- Check Functions logs
- Verify BOT_TOKEN is set
- Visit `/api/telegram` to reset webhook

### Wrong URL?
- Update in @BotFather
- Check `vercel.json` configuration

## Migration Complete! 🎉

Your app is now:
1. **Faster** - Vercel Edge Network
2. **Simpler** - No GitHub Actions needed
3. **Unified** - Bot + App together
4. **Free** - Everything on free tier

Every push to GitHub now auto-deploys to Vercel!