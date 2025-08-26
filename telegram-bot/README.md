# Telegram Bot for Savdo Kalkulyatori

This bot integrates the Savdo Kalkulyatori web app as a Telegram Mini App.

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Savdo Kalkulyatori")
4. Choose a username for your bot (must end with `bot`, e.g., `savdo_calc_bot`)
5. Save the bot token you receive

### 2. Configure the Mini App

1. Send `/mybots` to BotFather
2. Select your bot
3. Click "Bot Settings" → "Menu Button" → "Configure menu button"
4. Send the URL: `https://muminoff.com/retail-calc/`
5. Send the button text: "🧮 Kalkulyator"

### 3. Set Bot Commands (Optional)

Send these commands to BotFather:
```
/setcommands
```
Then paste:
```
start - Botni ishga tushirish
help - Yordam olish
about - Bot haqida
```

### 4. Install Dependencies

```bash
cd telegram-bot
pip install -r requirements.txt
```

### 5. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your BOT_TOKEN
```

### 6. Run the Bot

```bash
python bot.py
```

Or with environment variables:
```bash
BOT_TOKEN="your_token_here" python bot.py
```

### 7. Deploy Options

#### Option A: Run on VPS/Server

```bash
# Install dependencies
pip install -r requirements.txt

# Run with systemd (create service file)
sudo nano /etc/systemd/system/telegram-bot.service
```

Service file content:
```ini
[Unit]
Description=Telegram Bot for Savdo Kalkulyatori
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/telegram-bot
Environment="BOT_TOKEN=your_token_here"
ExecStart=/usr/bin/python3 /path/to/telegram-bot/bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
```

#### Option B: Deploy to Cloud (Heroku/Railway)

Create `Procfile`:
```
worker: python bot.py
```

Deploy and set BOT_TOKEN environment variable in your cloud platform.

## Bot Features

- **Start Command**: Opens the Mini App calculator
- **Help Command**: Shows usage instructions
- **About Command**: Shows bot information
- **Mini App Button**: Direct access to the calculator

## Testing

1. Open your bot in Telegram
2. Send `/start`
3. Click the "🧮 Kalkulyatorni ochish" button
4. The Mini App should open with your calculator

## Troubleshooting

- **Bot not responding**: Check if BOT_TOKEN is set correctly
- **Mini App not opening**: Verify WEBAPP_URL is accessible
- **Commands not working**: Ensure bot is running and check logs

## Support

For issues, check the logs or contact the developer.