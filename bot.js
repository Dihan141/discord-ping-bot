require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Your Discord user ID to block from being pinged
const myUserID = '934363410672541696'; 

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    if (message.content.startsWith("!ping")) {
        const args = message.content.split(" ");

        // Check if at least one user is mentioned
        if (message.mentions.users.size === 0 || args.length < 3) {
            return message.reply("❌ Usage: `!ping @User1 @User2 3` (replace 3 with ping count)");
        }

        const usersToPing = message.mentions.users; // Get all mentioned users
        const pingCount = parseInt(args[args.length - 1], 10); // Get last argument as ping count

        if (isNaN(pingCount) || pingCount <= 0) {
            return message.reply("❌ Please provide a valid ping count (e.g., `!ping @User1 @User2 5`)");
        }

        if (pingCount > 20) {
            return message.reply("❌ too many pings");
        }

        // Send pings for each mentioned user
        for (let i = 0; i < pingCount; i++) {
            usersToPing.forEach(user => {
                if (user.id !== myUserID) {
                    message.channel.send(`<@${user.id}>`);
                }
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay 0.1 sec between pings
        }
    }
});

client.login(process.env.TOKEN);
app.get('/', (req, res) => {
    res.json({msg: 'got response'})
})
app.listen(port, () => {
    console.log(`ping bot listening on port ${port}`)
})
