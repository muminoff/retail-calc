# Telegram Mini App Setup Guide

## Step 1: Create Your Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/start` to BotFather
3. Send `/newbot` to create a new bot
4. Choose a display name (e.g., "Savdo Kalkulyatori")
5. Choose a username (must end with `bot`, e.g., `savdo_calc_bot`)
6. **Save the token** you receive (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Configure Mini App

### Method 1: Set Menu Button (Recommended)
1. Send `/mybots` to BotFather
2. Select your bot
3. Click "Bot Settings"
4. Click "Menu Button"
5. Click "Configure menu button"
6. Send this URL: `https://muminoff.com/retail-calc/`
7. Send button text: `🧮 Kalkulyator`

### Method 2: Use Inline Button (Via Bot)
The bot will show an inline button to open the Mini App.

## Step 3: Set Bot Commands

1. Send `/mybots` to BotFather
2. Select your bot
3. Click "Edit Bot"
4. Click "Edit Commands"
5. Send these commands:
```
start - Kalkulyatorni ochish
help - Yordam olish
about - Bot haqida ma'lumot
```

## Step 4: Choose Bot Implementation

### Option A: Node.js Bot (Recommended - matches your tech stack)

```bash
cd telegram-bot-node
npm install

# Copy and edit .env file
cp .env.example .env
# Add your BOT_TOKEN to .env file

# Run the bot
npm start
```

### Option B: Python Bot

```bash
cd telegram-bot
pip install -r requirements.txt

# Copy and edit .env file
cp .env.example .env
# Add your BOT_TOKEN to .env file

# Run the bot
python bot.py
```

## Step 5: Test Your Bot

1. Find your bot in Telegram (search by the username you chose)
2. Send `/start`
3. Click the "🧮 Kalkulyatorni ochish" button
4. Your calculator Mini App should open!

## Step 6: Deploy the Bot (Production)

### Option 1: Deploy to Railway (Free tier available)

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project → Deploy from GitHub repo
4. Select the `telegram-bot-node` folder
5. Add environment variable: `BOT_TOKEN`
6. Deploy!

### Option 2: Deploy to VPS

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone your-repo
cd telegram-bot-node
npm install

# Create .env with your BOT_TOKEN
nano .env

# Start with PM2
pm2 start bot.js --name savdo-bot
pm2 save
pm2 startup
```

### Option 3: Deploy to Heroku

Create `Procfile`:
```
worker: node bot.js
```

Deploy and set `BOT_TOKEN` in Config Vars.

## Step 7: Mini App Features

Your Mini App already has:
- ✅ Mobile-responsive design
- ✅ Real exchange rates
- ✅ DataMatrix generation
- ✅ Price calculation

## Troubleshooting

### Bot not responding?
- Check BOT_TOKEN is correct
- Make sure bot is running (`npm start` or `python bot.py`)
- Check console for errors

### Mini App not opening?
- Verify the URL is correct: `https://muminoff.com/retail-calc/`
- Check if the website is accessible
- Try clearing Telegram cache

### Need to change the URL?
1. Update `.env` file with new WEBAPP_URL
2. Update menu button in BotFather
3. Restart the bot

## Security Notes

- **Never commit** your BOT_TOKEN to Git
- Use environment variables for sensitive data
- Keep your bot token secret

## Next Steps

1. Customize bot messages in the bot code
2. Add more commands if needed
3. Implement data exchange between Mini App and bot (optional)
4. Add analytics to track usage

## Support

For issues with:
- Bot setup: Check Telegram's [Bot API docs](https://core.telegram.org/bots)
- Mini App: Check [Telegram Mini Apps docs](https://core.telegram.org/bots/webapps)
- Your app: Check the console logs