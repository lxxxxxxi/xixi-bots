import express from 'express';
import faston_bot from './faston_app';

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Health');
});

app.get('/bot1', (req, res) => {
    res.status(200).send('Bot1 webhook processed');
});

// Webhook route for bot2
app.get('/bot2', (req, res) => {
    res.status(200).send('Bot2 webhook processed');
});

app.use(await bot.createWebhook({ domain: "https://xixi-bots.vercel.app/bot1" }));

export default app;
