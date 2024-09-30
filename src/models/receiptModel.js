const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    fiscal_id: { type: String, required: true },
    phone_number: { type: String, required: true },
    shop_id: { type: String, required: true }
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
