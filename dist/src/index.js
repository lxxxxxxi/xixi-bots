import express from 'express';
import faston_bot from './xx_bot/xx.js';
import kg_bot from './kg_bot/kgbot.js';
const app = express();
app.get('/', (req, res) => {
    res.status(200).send('Health');
});
// app.get('/bot1', (req, res) => {
//     res.status(200).send('Bot1 webhook processed');
// });
const domain = 'https://xixi-bots.vercel.app';
app.use(await faston_bot.createWebhook({ domain, path: '/bot1' }));
app.use(await kg_bot.createWebhook({ domain, path: '/bot2' }));
export default app;
