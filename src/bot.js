require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

// Initialize bot with token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Define a Mongoose schema and model for storing updates
const updateSchema = new mongoose.Schema({
    update_id: Number,
    message: Object,
    date: { type: Date, default: Date.now }
});

const Update = mongoose.model('Update', updateSchema);

// Connect to MongoDB
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Handle connection issues and send error message
bot.use(async (ctx, next) => {
    if (mongoose.connection.readyState !== 1) {
        ctx.reply("sorry I can't connect to my DB");
    } else {
        await next();
    }
});

// Save updates to MongoDB
bot.on('text', async (ctx) => {
    const newUpdate = new Update({
        update_id: ctx.update.update_id,
        message: ctx.message
    });

    try {
        await newUpdate.save();
        console.log('Update saved:', ctx.update.update_id);
    } catch (error) {
        console.error('Error saving update:', error);
    }

    ctx.reply('Message received and saved to DB');
});

// Start the bot and connect to the DB
(async () => {
    await connectToDB();
    bot.launch();
    console.log('Bot started');
})();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
