import express from "express";
import { Telegraf } from "telegraf";

const token = process.env.KGTOLB_BOT_TOKEN

const bot = new Telegraf(token);
const app = express();

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Set the bot API endpoint
app.use(await bot.createWebhook({ domain: "https://xixi-bots.vercel.app/" }));

bot.hears("text", ctx => ctx.reply("Hello"));

export default app;