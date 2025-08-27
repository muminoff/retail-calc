const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Bot configuration
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://muminoff.com/retail-calc/';

// Check if token is provided
if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
  console.error('Please set your bot token in BOT_TOKEN environment variable!');
  process.exit(1);
}

// Create bot instance
const bot = new Telegraf(BOT_TOKEN);

// Start command
bot.start((ctx) => {
  const userName = ctx.from.first_name || 'Foydalanuvchi';
  
  ctx.reply(
    `Assalomu alaykum, ${userName}! 👋\n\n` +
    `Savdo Kalkulyatori Mini App-ga xush kelibsiz!\n\n` +
    `Bu bot orqali siz:\n` +
    `• Mahsulot narxini hisoblashingiz\n` +
    `• Valyuta kursini ko'rishingiz mumkin\n\n` +
    `Boshlash uchun quyidagi tugmani bosing:`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🧮 Kalkulyatorni ochish', WEBAPP_URL)]
    ])
  );
});

// Help command
bot.help((ctx) => {
  ctx.replyWithMarkdown(`
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

*Muammo bo'lsa:* @your_username
  `);
});

// About command
bot.command('about', (ctx) => {
  ctx.replyWithMarkdown(`
📊 *Savdo Kalkulyatori*

Versiya: 1.0.0
Yaratilgan: 2025

Bu bot savdogarlar uchun narxlarni hisoblashda yordam beradi.

• Real valyuta kurslari
• Avtomatik narx hisoblash

Web versiya: ${WEBAPP_URL}
  `);
});

// Handle Mini App data (when Mini App sends data back)
bot.on('web_app_data', (ctx) => {
  const data = ctx.webAppData.data;
  console.log('Received data from Mini App:', data);
  
  // You can process the data here
  ctx.reply(`Ma'lumotlar qabul qilindi: ${data}`);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot started successfully!');
  console.log('Mini App URL:', WEBAPP_URL);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));