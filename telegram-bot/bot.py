#!/usr/bin/env python3
"""
Telegram Bot for Savdo Kalkulyatori Mini App
"""

import os
import logging
from typing import Optional
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot configuration
BOT_TOKEN = os.getenv('BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://muminoff.com/retail-calc/')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button to launch the Mini App."""
    user = update.effective_user
    
    # Create the Mini App button
    keyboard = [
        [
            InlineKeyboardButton(
                text="🧮 Kalkulyatorni ochish",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"Assalomu alaykum, {user.first_name}! 👋\n\n"
        "Savdo Kalkulyatori Mini App-ga xush kelibsiz!\n\n"
        "Bu bot orqali siz:\n"
        "• Mahsulot narxini hisoblashingiz\n"
        "• Valyuta kursini ko'rishingiz\n"
        "• DataMatrix kod yaratishingiz mumkin\n\n"
        "Boshlash uchun quyidagi tugmani bosing:",
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    help_text = """
🔹 *Yordam*

*Asosiy buyruqlar:*
/start - Botni ishga tushirish va kalkulyatorni ochish
/help - Yordam olish
/about - Bot haqida ma'lumot

*Kalkulyator xususiyatlari:*
• Asl narxni belgilash (KRW)
• Og'irlik bo'yicha pochta xarajatini hisoblash
• Foyda foizini sozlash
• Real vaqtda valyuta kursini olish
• DataMatrix kod yaratish

*Muammo bo'lsa:* @your_username
    """
    
    await update.message.reply_text(
        help_text, 
        parse_mode='Markdown'
    )

async def about(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send information about the bot."""
    about_text = """
📊 *Savdo Kalkulyatori*

Versiya: 1.0.0
Yaratilgan: 2025

Bu bot savdogarlar uchun narxlarni hisoblashda yordam beradi.

• Real valyuta kurslari
• Avtomatik narx hisoblash
• DataMatrix kod generatsiyasi

Web versiya: https://muminoff.com/retail-calc/
    """
    
    await update.message.reply_text(
        about_text, 
        parse_mode='Markdown'
    )

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log errors caused by updates."""
    logger.warning('Update "%s" caused error "%s"', update, context.error)

def main() -> None:
    """Start the bot."""
    # Check if token is set
    if BOT_TOKEN == 'YOUR_BOT_TOKEN_HERE':
        logger.error("Please set your bot token in BOT_TOKEN environment variable!")
        return
    
    # Create the Application
    application = Application.builder().token(BOT_TOKEN).build()

    # Register command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("about", about))

    # Register error handler
    application.add_error_handler(error_handler)

    # Run the bot until the user presses Ctrl-C
    logger.info("Starting bot...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()