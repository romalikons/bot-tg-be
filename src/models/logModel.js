const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    update_id: Number,
    message: Object,
    date: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
