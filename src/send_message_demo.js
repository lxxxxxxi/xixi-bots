import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const token = process.env.XXXXXX_BOT_TOKEN;
const bot = new Telegraf(token);

const filePath = path.join(process.cwd(), 'chatIds.json');

let chatIds = {};
if (fs.existsSync(filePath)) {
    chatIds = JSON.parse(fs.readFileSync(filePath));
    console.log("🚀 ~ chatIds:", chatIds)
}


function saveChatId(userName, chatId) {
    if (!chatIds[chatId]) {
        chatIds[chatId] = userName;
        fs.writeFileSync(filePath, JSON.stringify(chatIds, null, 2));
    }
}

bot.on('message', (ctx) => {
    const chatId = ctx.from.id;
    const userName = ctx.from.id + " " + ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`;
    saveChatId(userName, chatId);

    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        console.log("Group Chat ID:", ctx.chat.id);
        ctx.reply(`This group's chat ID is: ${ctx.chat.id}`);
    }
});

bot.start((ctx) => {
    const chatId = ctx.from.id;
    const userName = ctx.from.id + " " + ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`;
    saveChatId(userName, chatId);

    ctx.reply(`Hello ${ctx.from.username || ctx.from.first_name + " " + ctx.from.last_name}!`);
});

bot.launch();
