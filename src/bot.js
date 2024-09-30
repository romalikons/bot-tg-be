require('dotenv').config(); // Load environment variables from .env file
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const api = require('./api/index'); // Import the API
const commandHandlers = require('./handlers');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Start the API server
api; // Automatically starts the API server

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Handle the "/start" command to show the main menu
bot.start(async (ctx) => {
    await commandHandlers.start(ctx); // Call the start handler
});

// Handle text input from the keyboard
bot.hears('Sales', async (ctx) => {
    await commandHandlers.sales(ctx);
});

bot.hears('My receipts', async (ctx) => {
    await commandHandlers.receipts(ctx);
});

bot.hears('Write feedback', async (ctx) => {
    await commandHandlers.feedback(ctx);
});

// Handle callback queries for receipts
bot.action(/receipt_(.+)/, async (ctx) => {
    const receiptId = ctx.match[1];
    const receipt = await Receipt.findById(receiptId);

    if (receipt) {
        ctx.reply(`Receipt Details:\nDate: ${receipt.date.toLocaleDateString()}\nTotal: ${receipt.total} UAH\nFiscal ID: ${receipt.fiscal_id}\nShop ID: ${receipt.shop_id}`);
    } else {
        ctx.reply('Receipt not found.');
    }
});

// Start the bot
bot.launch()
    .then(() => console.log('Bot is running'))
    .catch((err) => console.error('Bot launch error:', err));
