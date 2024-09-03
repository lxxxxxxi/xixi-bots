import express from 'express';

const app = express();

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Something broke!');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.post('/bot1', (req, res) => {
    const { body } = req;
    console.log('Bot1 webhook received:', body);
    res.status(200).send('Bot1 webhook processed');
});

// Webhook route for bot2
app.post('/bot2', (req, res) => {
    const { body } = req;
    console.log('Bot2 webhook received:', body);
    res.status(200).send('Bot2 webhook processed');
});
