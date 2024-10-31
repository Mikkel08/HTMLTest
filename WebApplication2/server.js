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

    try {
        // Sending request to Claude API
        const response = await axios.post(
            'https://api.anthropic.com/v1/complete', // Update with the correct Claude API URL
            {
                model: 'claude-2.1',
                max_tokens_to_sample: 1024,
                prompt: prompt,
                stop: '\n\nHuman:'
            },
            {
                headers: {
                    'x-api-key': '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',
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
            }
        );

        res.json({ response: response.data });
    } catch (error) {
        console.error('Fejl ved kald af Claude API:', error);
        res.status(500).json({ error: 'Der opstod en fejl under kaldet til Claude API.' });
    }
});

// Endpoint to handle requests to OpenAI API for question generation
app.options('/generate-questions', cors()); // Handle preflight request
app.post('/generate-questions', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Tekst mangler i forespørgslen.' });
    }

    try {
        // Sending request to OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: `Lav 5 spørgsmål baseret på følgende tekst:\n\n${text}\n\nSpørgsmål:`
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json'
                },
            }
        );

        res.json({ questions: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Fejl ved kald af OpenAI API:', error);
        res.status(500).json({ error: 'Der opstod en fejl under kaldet til OpenAI API.' });
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});
