import { Telegraf } from 'telegraf';
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.XXXXXX_BOT_TOKEN;
const bot = new Telegraf(token);
// Set the bot API endpoint
// app.use(await bot.createWebhook({ domain: "https://xixi-bots.vercel.app/" }));
bot.hears("text", ctx => ctx.reply("Hello"));
const checkBot = async () => {
    const url = `https://api.telegram.org/bot${token}/getMe`;
    console.log("url", url);
    try {
        const response = await axios.get(url);
        if (response.data.ok) {
            console.log('Bot token is valid. Bot information:', response.data.result);
            return response.data.result;
        }
        else {
            console.error('Invalid bot token:', response.data);
            throw new Error('Invalid bot token');
        }
    }
    catch (error) {
        console.error('Error checking bot token:', error);
        throw error;
    }
};
bot.reaction("👍", () => {
    console.log("added");
});
bot.start((ctx) => {
    ctx.reply(`Hey ${ctx.from.username || ctx.from.first_name + " " + ctx.from.last_name} - welcome to Faston Swap! ⚡️

Your one-stop cross chain bridge which support 200+ blockchains and 3000+ tokens.

Here's what you can do with Faston now:
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
    });
});
// 初始化函数
const init = async () => {
    try {
        const botInfo = await checkBot();
        bot.botInfo = botInfo;
        console.log(`Bot started on https://t.me/${botInfo.username}`);
    }
    catch (error) {
        console.error('Failed to initialize bot:', error);
    }
};
init();
export default bot;
