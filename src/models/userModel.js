const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    first_name: String,
    last_name: String,
    username: String,
    phone_number: String  // New field for phone number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
