// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 5001;

// Initialize Anthropic SDK
const anthropic = new Anthropic({
    apiKey: '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',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..index.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/quiz.html'));
});

app.get('/points', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/points.html'));
});

// Claude API endpoint
app.post('/send-to-claude', async (req, res) => {
    let { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt mangler i forespørgslen.' });
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8192,
            temperature: 1,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ]
        });

        console.log('Claude API response:', response);
        res.json({ response: response.content[0].text });
    } catch (error) {
        console.error('Fejl ved kald af Claude API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Der opstod en fejl under kaldet til Claude API.' });
    }
});

// Quiz spørgsmål endpoint
app.post('/questions', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Tekst mangler i forespørgslen.' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: `Generer 5 multiple choice spørgsmål baseret på denne tekst. 
                                For hvert spørgsmål, lav 4 svarmuligheder og marker det korrekte svar.
                                Format svaret som JSON array:
                                [
                                    {
                                        "question": "spørgsmålstekst",
                                        "options": ["svar1", "svar2", "svar3", "svar4"],
                                        "correctAnswer": 0
                                    }
                                ]
                                
                                Tekst: ${text}

                                Regler for spørgsmål:
                                1. Spørgsmålene skal teste forståelse af historiens indhold
                                2. Svarmulighederne skal være klart forskellige
                                3. Der må kun være ét korrekt svar
                                4. Spørgsmålene skal være på dansk
                                5. Sværhedsgraden skal variere fra let til svær`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse response og send
        const questions = JSON.parse(response.data.choices[0].message.content);
        res.json({ questions });

    } catch (error) {
        console.error('Fejl ved generering af spørgsmål:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Der opstod en serverfejl',
        message: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});