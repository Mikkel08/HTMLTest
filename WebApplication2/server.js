// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5001;

// Middleware
app.use(cors()); // Allow CORS for all origins
app.use(bodyParser.json()); // Parse JSON bodies

// Endpoint to handle requests to Claude API
app.options('/send-to-claude', cors()); // Handle preflight request
app.post('/send-to-claude', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt mangler i forespørgslen.' });
    }

    console.log('Modtog en anmodning til /send-to-claude med prompt:', prompt);

    try {
        // Sending request to Claude API
        const response = await axios.post(
            'https://api.anthropic.com/v1/complete', // Opdateret endpoint URL
            {
                model: 'claude-2.1',
                max_tokens_to_sample: 1024,
                prompt: `\n\nHuman: ${prompt}\n\nAssistant:`, // Tilpasning af prompt-format
            },
            {
                headers: {
                    'x-api-key': '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',
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                },
            }
        );

        console.log('Succesfuldt svar fra Claude API:', response.data);
        res.json({ response: response.data });
    } catch (error) {
        console.error('Fejl ved kald af Claude API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Der opstod en fejl under kaldet til Claude API.' });
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});
