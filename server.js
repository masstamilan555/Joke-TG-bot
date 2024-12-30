import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

// Create a new bot instance
const app = new TelegramBot("7595102596:AAFseQnhpR-hSSTlst25i6UcphbuQ_oEwdg", { polling: true });

// Function to fetch and send a joke
const sayJoke = async (msg) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const { setup, punchline } = response.data;

        app.sendMessage(msg.chat.id, `${setup} 🤔💭\n\n${punchline} 😂😂😂`);
    } catch (error) {
        console.error(error);
        app.sendMessage(msg.chat.id, "Oops! I couldn't fetch a joke at the moment. Please try again later.");
    }
};

// Respond to the /start command with a custom menu
app.onText(/\/start/, (msg) => {
    app.sendMessage(msg.chat.id, "Welcome to the Joke Bot! 🎉", {
        reply_markup: {
            keyboard: [
                [{ text: "Get a Joke 😂" }],
                [{ text: "Help 🆘" }]
            ],
            resize_keyboard: true, // Adjust keyboard size for mobile
            one_time_keyboard: false // Keep the menu persistent
        }
    });
});

// Handle menu options
app.on('message', (msg) => {
    const text = msg.text?.toLowerCase();

    if (text === "get a joke 😂") {
        sayJoke(msg);
    } else if (text === "help 🆘") {
        app.sendMessage(msg.chat.id, "Use the menu or type:\n/start - Start the bot\n/joke - Get a random joke");
    } else {
        app.sendMessage(msg.chat.id, "I don't understand that command. Try using the menu or typing /start.");
    }
});
