const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
bot.setWebHook(`https://joke-tg-bot.onrender.com/bot${process.env.TELEGRAM_BOT_TOKEN}`);

app.use(express.json());

app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to the Joke Bot! 🎉", {
        reply_markup: {
            keyboard: [
                [{ text: "Get a Joke 😂" }],
                [{ text: "Help 🆘" }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    });
});

const sayJoke = async (msg) => {
    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const { setup, punchline } = response.data;
        bot.sendMessage(msg.chat.id, `${setup} 🤔💭\n\n${punchline} 😂😂😂`);
    } catch (error) {
        bot.sendMessage(msg.chat.id, "Oops! Something went wrong.");
    }
};

bot.on("message", (msg) => {
    if (msg.text.toLowerCase() === "get a joke 😂") {
        sayJoke(msg);
    } else if (msg.text.toLowerCase() === "help 🆘") {
        bot.sendMessage(msg.chat.id, "Type /start to see the menu or /joke to get a random joke.");
    } else {
        bot.sendMessage(msg.chat.id, "I don't understand that. Try using the menu.");
    }
});
