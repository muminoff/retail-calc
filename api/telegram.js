// Vercel Serverless Function for Telegram Bot
export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const WEBAPP_URL = 'https://muminoff.com/retail-calc/';
  
  if (req.method === 'POST') {
    const { message } = req.body;
    
    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;
      const firstName = message.from.first_name || 'Foydalanuvchi';
      
      let responseText = '';
      let replyMarkup = null;
      
      if (text === '/start') {
        responseText = `Assalomu alaykum, ${firstName}! 👋\n\n` +
          `Savdo Kalkulyatori Mini App-ga xush kelibsiz!\n\n` +
          `Bu bot orqali siz:\n` +
          `• Mahsulot narxini hisoblashingiz\n` +
          `• Valyuta kursini ko'rishingiz mumkin\n\n` +
          `Boshlash uchun quyidagi tugmani bosing:`;
        
        replyMarkup = {
          inline_keyboard: [[
            {
              text: '🧮 Kalkulyatorni ochish',
              web_app: { url: WEBAPP_URL }
            }
          ]]
        };
      } else if (text === '/help') {
        responseText = `🔹 *Yordam*\n\n` +
          `*Asosiy buyruqlar:*\n` +
          `/start - Kalkulyatorni ochish\n` +
          `/help - Yordam olish\n` +
          `/about - Bot haqida ma'lumot\n\n` +
          `*Kalkulyator xususiyatlari:*\n` +
          `• Asl narxni belgilash (KRW)\n` +
          `• Pochta xarajatini hisoblash\n` +
          `• Foyda foizini sozlash\n` +
          `• Real valyuta kursi`;
      } else if (text === '/about') {
        responseText = `📊 *Savdo Kalkulyatori*\n\n` +
          `Versiya: 1.0.0\n` +
          `Yaratilgan: 2025\n\n` +
          `Real valyuta kurslari bilan ishlaydi.\n\n` +
          `Web: ${WEBAPP_URL}`;
      }
      
      if (responseText) {
        // Send message back to Telegram
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: responseText,
              parse_mode: 'Markdown',
              reply_markup: replyMarkup
            })
          }
        );
        
        const result = await telegramResponse.json();
        res.status(200).json({ ok: true, result });
      } else {
        res.status(200).json({ ok: true, message: 'No action needed' });
      }
    } else {
      res.status(200).json({ ok: true, message: 'No message' });
    }
  } else if (req.method === 'GET') {
    // Set webhook
    const webhookUrl = `https://${req.headers.host}/api/telegram`;
    const setWebhook = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`
    );
    const result = await setWebhook.json();
    res.status(200).json({ webhook: webhookUrl, result });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}