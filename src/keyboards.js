function getMainMenu() {
    return {
        reply_markup: {
            keyboard: [
                [{ text: 'Sales' }, { text: 'My receipts' }],
                [{ text: 'Write feedback' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
        },
    };
}

module.exports = { getMainMenu };
