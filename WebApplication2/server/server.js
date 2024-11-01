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
    res.sendFile(path.join(__dirname, '../public/index.html')); // Korrigeret sti til index.html
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/quiz.html'));
});

app.get('/points', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/points.html'));
});

// Claude API endpoint
app.post('/send-to-claude', async (req, res) => {
    let {prompt} = req.body;

    if (!prompt) {
        return res.status(400).json({error: 'Prompt mangler i forespørgslen.'});
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
        res.json({response: response.content[0].text});
    } catch (error) {
        console.error('Fejl ved kald af Claude API:', error.response ? error.response.data : error.message);
        res.status(500).json({error: 'Der opstod en fejl under kaldet til Claude API.'});
    }
});

// Quiz spørgsmål endpoint
app.post('/questions', async (req, res) => {
    const {text} = req.body;

    if (!text) {
        return res.status(400).json({error: 'Tekst mangler i forespørgslen.'});
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
        res.json({questions});

    } catch (error) {
        console.error('Fejl ved generering af spørgsmål:', error);
        res.status(500).json({error: error.message});
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


// Tilføj denne rute til din server.js
app.post('/generate-image', async (req, res) => {
    console.log('Modtog image generation request:', req.body);
    try {
        const { prompt } = req.body;

        console.log('Kalder DALL-E med prompt:', prompt);

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt + ", children's book style, digital art, vibrant colors",
                n: 1,
                size: "1024x1024"
            })
        });

        console.log('DALL-E response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DALL-E API Error:', errorData);
            throw new Error(`DALL-E API fejl: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('DALL-E success! Image URL:', data.data[0].url);

        res.json({ imageUrl: data.data[0].url });

    } catch (error) {
        console.error('Server Error i generate-image:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});