const User = require('./models/userModel');
const Log = require('./models/logModel');
const Receipt = require('./models/receiptModel'); // Import the Receipt model
const { getMainMenu } = require('./keyboards');
const { normalizePhoneNumber } = require('./utils');  // Import the utility function

// Save log of every update
async function saveLog(ctx) {
    try {
        const newLog = new Log({
            update_id: ctx.update.update_id,
            message: ctx.update
        });
        await newLog.save();
        console.log('Update logged:', ctx.update.update_id);
    } catch (error) {
        console.error('Error logging update:', error);
    }
}

// Save user to the database
async function saveUser(ctx) {
    const { id, first_name, last_name, username } = ctx.message.from;

    try {
        const existingUser = await User.findOne({ user_id: id });
        if (!existingUser) {
            const newUser = new User({
                user_id: id,
                first_name,
                last_name,
                username
            });
            await newUser.save();
            console.log('New user saved:', id);
        } else {
            console.log('User already exists:', id);
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

// Command Handlers
const startHandler = async (ctx) => {
    await saveUser(ctx);
    await saveLog(ctx);
    ctx.reply('Welcome to our store bot! Please select an option:', getMainMenu());
};

const salesHandler = async (ctx) => {
    await saveLog(ctx);
    ctx.reply('Here are the current sales...');
};

const receiptsHandler = async (ctx) => {
    await saveLog(ctx);
    const user = await User.findOne({ user_id: ctx.message.from.id });

    if (user && user.phone_number) {
        const receipts = await Receipt.find({
            phone_number: user.phone_number,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        if (receipts.length > 0) {
            const buttons = receipts.map(receipt => ({
                text: `${receipt.date.toLocaleDateString()} - ${receipt.total} UAH`,
                callback_data: `receipt_${receipt._id}`
            }));

            ctx.reply('Here are your receipts from the last 30 days:', {
                reply_markup: {
                    inline_keyboard: [buttons]
                }
            });
        } else {
            ctx.reply('You have no receipts in the last 30 days.');
        }
    } else {
        ctx.reply('Please share your contact to retrieve your receipts:', {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [[{ text: 'Share my contact', request_contact: true }]]
            }
        });
    }
};

const feedbackHandler = async (ctx) => {
    await saveLog(ctx);
    ctx.reply('Please write your feedback...');
};

const textHandler = async (ctx) => {
    await saveUser(ctx);
    await saveLog(ctx);
    ctx.reply('Message received and saved!');
};

const contactHandler = async (ctx) => {
    const phoneNumber = normalizePhoneNumber(ctx.message.contact.phone_number);

    if (phoneNumber) {
        await User.findOneAndUpdate(
            { user_id: ctx.message.from.id },
            { phone_number: phoneNumber },
            { new: true }
        );
        ctx.reply('Thank you! Your phone number has been saved.');
    } else {
        ctx.reply('Invalid phone number format. Please try again.');
    }
};

// Combine handlers into a single object
const commandHandlers = {
    start: startHandler,
    sales: salesHandler,
    receipts: receiptsHandler,
    feedback: feedbackHandler,
    text: textHandler,
    contact: contactHandler
};

// Export the command handlers
module.exports = commandHandlers;