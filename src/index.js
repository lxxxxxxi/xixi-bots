import express from 'express';

const app = express();

app.post('/bot1', (req, res) => {
    res.status(200).send('Bot1 webhook processed');
});

// Webhook route for bot2
app.post('/bot2', (req, res) => {
    res.status(200).send('Bot2 webhook processed');
});

export default app;
