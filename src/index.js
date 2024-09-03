import express from 'express';
import faston_bot from './faston_app.js';
import kg_bot from './kgbot.js';

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Health');
});

// app.get('/bot1', (req, res) => {
//     res.status(200).send('Bot1 webhook processed');
// });

// // Webhook route for bot2
// app.get('/bot2', (req, res) => {
//     res.status(200).send('Bot2 webhook processed');
// });

// app.use(await bot.createWebhook({ domain: "https://xixi-bots.vercel.app/bot1" }));
// app.use('/bot1', faston_bot.webhookCallback('/bot1'));

const domain = 'https://xixi-bots.vercel.app';
app.use(await faston_bot.createWebhook({ domain, path: '/bot1' }));
app.use(await kg_bot.createWebhook({ domain, path: '/bot2' }));

export default app;
