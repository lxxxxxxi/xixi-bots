
// 展示普通键盘的命令
// bot.command('show_keyboard', (ctx) => {
//     ctx.reply('Here is your keyboard', Markup.keyboard([
//         ['Button 1', 'Button 2'],
//         ['Button 3', 'Button 4']
//     ]).resize());
// });

// bot.command('show_keyboard', (ctx) => {
//     ctx.reply('Here is your keyboard', Markup.inlineKeyboard([
//         [Markup.button.webApp('Open bilibili', 'https://www.bilibili.com/')]
//     ]));
// });

// // 删除普通键盘并展示内联键盘的命令
// bot.command('remove_keyboard', (ctx) => {
//     // 删除普通键盘
//     ctx.reply('Removing keyboard...', Markup.removeKeyboard())
//         .then(() => {
//             // 添加内联键盘
//             return ctx.reply('Here is your inline keyboard', Markup.inlineKeyboard([
//                 [Markup.button.callback('Inline Button 1', 'btn1')],
//                 [Markup.button.callback('Inline Button 2', 'btn2')]
//             ]));
//         });
// });


import { Telegraf } from 'telegraf';
import { createInterface } from "readline";
import axios from "axios";
import path from 'path';
import fs from 'fs';
const imagePath = path.join(process.cwd(), 'img.jpg');
const imageBuffer = fs.readFileSync(imagePath);

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

bot.start((ctx) => {
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