// Utility function to normalize phone numbers
function normalizePhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if it starts with '0' and convert to +380 format
    if (digits.startsWith('0')) {
        return '+38' + digits; // Assuming the number is in the format 095XXXXXXX
    } else if (digits.length === 9) {
        return '+380' + digits; // For numbers like 951234567
    } else if (digits.startsWith('380') && digits.length === 12) {
        return phone;
    }
    else {
        return null; // Invalid format
    }
}

module.exports = { normalizePhoneNumber };
