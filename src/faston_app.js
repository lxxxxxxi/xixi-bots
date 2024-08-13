import { Telegraf } from 'telegraf';
import { createInterface } from "readline";
import axios from "axios";
// import path from 'path';
// import fs from 'fs';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

const accessToken = await question("Enter your bot access token: ");
const bot = new Telegraf(accessToken);

const checkBot = async () => {
    const url = `https://api.telegram.org/bot${accessToken}/getMe`;
    try {
        const response = await axios.get(url);
        if (response.data.ok) {
            console.log('Bot token is valid. Bot information:', response.data.result);
            return response.data.result;
        } else {
            console.error('Invalid bot token:', response.data);
            process.exit(1);
        }
    } catch (error) {
        console.error('Error checking bot token:', error);
        process.exit(1);
    }
};

const botInfo = await checkBot();
bot.botInfo = botInfo;
bot.reaction("👍", () => {
    console.log("added")
});

bot.telegram.getMe().then((res) => console.log(`Bot started on https://t.me/${res.username}`))

console.log('Configuring bot commands...');

// const imagePath = path.join(process.cwd(), 'image.png');
// const imageBuffer = fs.readFileSync(imagePath);

bot.start((ctx) => {
    // ctx.replyWithPhoto({ source: imageBuffer }, {
    //     caption: 'Welcome!!!',
    //     reply_markup: {
    //         inline_keyboard: [
    //             [
    //                 {
    //                     text: "开始线上", web_app: {
    //                         url: `https://mini-app-gray.vercel.app/`
    //                     }
    //                 },
    //                 {
    //                     text: "开始本地", web_app: {
    //                         url: `https://2aa1-14-154-27-19.ngrok-free.app/`
    //                     }
    //                 },
    //                 {
    //                     text: "关于我们", callback_data: "about_us"
    //                 }
    //             ],
    //         ],
    //         one_time_keyboard: false,
    //     }
    // });

    ctx.reply(`Hey ${ctx.from.username || ctx.from.first_name + " " + ctx.from.last_name} - welcome to Faston Swap! ⚡️

Your one-stop cross chain bridge which support 200+ blockchains and 3000+ tokens.

Here’s what you can do with Faston now:
🌞 Farm Faston Points for FREE and secure early user benefits + airdrops.  
🧑 Invite Friends: Bring your friends and family for more FPs! More friends = more FPs
🥊 Complete Quests: Finish tasks to rack up even more FPs!

💎 Join Node and earn 50% profit of Faston Swap.

Join our announcements channel to get the latest updates and the best ways to get $FAST.`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Launch Faston", web_app: {
                            url: `https://farm.faston.app/`
                        }
                    }
                ],
                [
                    {
                        text: "Join Community",
                        url: "https://t.me/FastonSwap"
                    }
                ]
            ],
            one_time_keyboard: false,
        },
        one_time_keyboard: false,
    })
});


// // set commands
// bot.telegram.setMyCommands([
//     { command: 'start', description: '/start' },
// ]);

// Start bot
console.log('Launching bot...');
bot.launch(() => console.log("Bot is starting!")).then(() => {
    console.log('Bot launched successfully');
    process.exit(0)
}).catch((error) => {
    console.error('Error launching bot:', error);
    process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))