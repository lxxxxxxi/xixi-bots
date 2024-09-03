import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
const token = process.env.XXXXXX_BOT_TOKEN;
const bot = new Telegraf(token);
async function broadcast(users) {
    console.log(`开始广播消息到 ${users.length} 个用户`);
    for (const userId of users) {
        try {
            await bot.telegram.sendMessage(userId, 'Hello from the bot!');
            console.log(`成功发送消息到用户 ${userId}`);
        }
        catch (error) {
            console.error(`向用户 ${userId} 发送消息失败:`, error);
        }
    }
    console.log('广播完成');
}
await broadcast([5443686788, 5434528858]);
const filePath = path.join(process.cwd(), 'chatIds.json');
let chatIds = {};
if (fs.existsSync(filePath)) {
    chatIds = JSON.parse(fs.readFileSync(filePath));
    console.log("🚀 ~ chatIds:", chatIds);
}
function saveChatId(userName, chatId) {
    if (!chatIds[chatId]) {
        chatIds[chatId] = userName;
        try {
            console.log("save:", JSON.stringify(chatIds, null, 2));
            fs.writeFileSync(filePath, JSON.stringify(chatIds, null, 2));
        }
        catch (error) {
            console.error('Error saving chatId:', error);
        }
    }
}
bot.on('message', (ctx) => {
    console.log(ctx.chat);
    console.log(ctx.from);
    const chatId = ctx.chat.id;
    const userName = ctx.from.id + " " + ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`;
    saveChatId(userName, chatId);
    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        console.log("Group Chat ID:", ctx.chat.id);
        ctx.reply(`This group's chat ID is: ${ctx.chat.id}`);
    }
});
bot.catch((error, ctx) => {
    console.error('Bot error:', error);
    ctx.reply('An error occurred while processing your request.');
});
bot.hears("text", ctx => ctx.reply("Hello"));
bot.command("start", (ctx) => {
    console.log(222222);
    ctx.reply(`Hello ${ctx.from.username || ctx.from.first_name + " " + ctx.from.last_name}!`);
    console.log(ctx.chat);
    console.log(ctx.from);
    const chatId = ctx.from.id;
    const userName = ctx.from.id + " " + ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`;
    saveChatId(userName, chatId);
});
bot.start((ctx) => {
    // ctx.reply(`Hello ${ctx.from.username || ctx.from.first_name + " " + ctx.from.last_name}!`);
    console.log(ctx.chat);
    console.log(ctx.from);
    const chatId = ctx.from.id;
    const userName = ctx.from.id + " " + ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`;
    saveChatId(userName, chatId);
});
bot.launch();
