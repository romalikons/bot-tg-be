const express = require('express');
const Receipt = require('../models/receiptModel');

const router = express.Router();

// Route to add a new receipt
router.post('/receipts', async (req, res) => {
    const { date, total, fiscal_id, phone_number, shop_id } = req.body;

    try {
        const newReceipt = new Receipt({
            date,
            total,
            fiscal_id,
            phone_number,
            shop_id,
        });

        await newReceipt.save();
        res.status(201).json({ message: 'Receipt added successfully', receipt: newReceipt });
    } catch (error) {
        res.status(400).json({ message: 'Error adding receipt', error: error.message });
    }
});

module.exports = router;
