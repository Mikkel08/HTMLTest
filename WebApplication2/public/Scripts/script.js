// script.js
let storyContent = ''; // Gør variablen global
document.addEventListener("DOMContentLoaded", function () {
    // Cache DOM elements
    const sendButton = document.getElementById("sendButton");
    const inputContainer = document.getElementById("inputContainer");
    const responseBox = document.getElementById("responseBox");
    const generateImageButton = document.getElementById("generateImageButton");
    const generatedStory = document.getElementById("generatedStory");
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Initialize
    let storyContent = localStorage.getItem('generatedStory') || '';  // <-- NY LINJE
    updateInputFields();

    // Main story generation function
    async function sendTestRequest() {
        sendButton.disabled = true;
        sendButton.classList.add('loading');
        sendButton.innerHTML = 'Sender...';

        const prompt = createPrompt();

        try {
            const response = await fetch('http://localhost:5001/send-to-claude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Netværksrespons var ikke ok');
            }

            const data = await response.json();
            storyContent = data.response || 'Ingen svar modtaget fra Claude';

            // Update UI
            localStorage.setItem('generatedStory', storyContent);
            generatedStory.textContent = storyContent;
            responseBox.classList.remove("hidden");
            inputContainer.classList.add("hidden");

        } catch (error) {
            console.error('Fejl ved kald til Claude:', error);
            alert('Der opstod en fejl ved kald til Claude API. Prøv igen senere.');
        } finally {
            sendButton.disabled = false;
            sendButton.classList.remove('loading');
            sendButton.innerHTML = 'Send til Claude';
        }
    }
// generate
    window.generateImages = async function() {
        console.log('Starting image generation with story:', storyContent);

        try {
            const response = await fetch('http://localhost:5001/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `Create a children's book style illustration for this story: ${storyContent}`
                })
            });

            console.log('Image generation response status:', response.status);

            if (!response.ok) {
                throw new Error('Fejl ved billedgenerering');
            }

            const data = await response.json();
            console.log('Received image data:', data);

            if (data.imageUrl) {
                console.log('Adding image to container:', data.imageUrl);

                // Find eller opret container
                let imgContainer = document.getElementById('imagesContainer');
                if (!imgContainer) {
                    console.log('Creating new imagesContainer');
                    imgContainer = document.createElement('div');
                    imgContainer.id = 'imagesContainer';
                    // Indsæt containeren efter confirmationMessage
                    const confirmationMessage = document.getElementById('confirmationMessage');
                    confirmationMessage.parentNode.insertBefore(imgContainer, confirmationMessage.nextSibling);
                }

                const img = document.createElement('img');
                img.src = data.imageUrl;
                img.alt = 'Generated story illustration';
                img.style.maxWidth = '100%';  // Gør billedet responsivt
                img.style.height = 'auto';
                img.style.marginTop = '1rem';
                img.style.borderRadius = '8px';

                imgContainer.innerHTML = ''; // Clear previous images
                imgContainer.appendChild(img);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    };
    // Helper functions
    function createPrompt() {
        const inputs = {
            niveau: document.getElementById('niveau').value,
            laengde: document.getElementById('laengde').value,
            fokusomraader: document.getElementById('fokusomraader').value,
            hovedpersonen: document.getElementById('hovedpersonen').value,
            vejrEllerSaeson: document.getElementById('vejrEllerSaeson').value,
            lokation: document.getElementById('lokation').value,
            kulturelleElementer: document.getElementById('kulturelleElementer').value,
            personligeTraek: document.getElementById('personligeTraek').value,
            laeserensNavn: document.getElementById('laeserensNavn').value,
            magiEllerSuperkraefter: document.getElementById('magiEllerSuperkraefter').value,
            karakterensKaeldyr: document.getElementById('karakterensKaeldyr').value
        };

        // Save to localStorage
        Object.entries(inputs).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        return `You are tasked with writing a children's text in Danish. Follow these instructions carefully to create an appropriate text:

1. Writing Level: The text should be written at a ${inputs.niveau} level, measured on a scale from 0 to 10.
2. Text Length: The text should be ${inputs.laengde} characters long, including spaces.
3. Focus Areas: ${inputs.fokusomraader}
4. Main Character Name: The main character's name should be ${inputs.hovedpersonen}.
5. Season or Weather: ${inputs.vejrEllerSaeson}
6. Location Details: ${inputs.lokation}
7. Cultural Elements: ${inputs.kulturelleElementer}
8. Personal Traits: ${inputs.personligeTraek}
9. Reader's Name: ${inputs.laeserensNavn}
10. Magic or Superpowers: ${inputs.magiEllerSuperkraefter}
11. Character Pets: ${inputs.karakterensKaeldyr}`;
    }

    function updateInputFields() {
        const defaultValues = {
            niveau: '5',
            laengde: '200',
            fokusomraader: 'eventyr, humor',
            hovedpersonen: 'Emil',
            vejrEllerSaeson: 'solrig sommerdag',
            lokation: 'park',
            kulturelleElementer: 'traditionel mad',
            personligeTraek: 'nysgerrig',
            laeserensNavn: 'Mikkel',
            magiEllerSuperkraefter: 'usynlighed',
            karakterensKaeldyr: 'hund'
        };

        Object.entries(defaultValues).forEach(([key, defaultValue]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = localStorage.getItem(key) || defaultValue;
            }
        });
    }

    // Event listeners
    generateImageButton.addEventListener('click', () => {
        generateImageButton.style.backgroundColor = '#007bff';
        generateImageButton.disabled = true;
        confirmationMessage.style.display = 'block';
        confirmationMessage.textContent = 'Generating images… Please wait.';

        generateImages().then(() => {
            generateImageButton.style.backgroundColor = '';
            generateImageButton.disabled = false;
            confirmationMessage.textContent = 'Images generated successfully!';
        }).catch(error => {
            console.error('Error generating images:', error);
            confirmationMessage.textContent = 'Error generating images. Please try again.';
            generateImageButton.disabled = false;
        });
    });

    // Make functions available globally
    window.sendTestRequest = sendTestRequest;
    window.showInputFields = function() {
        inputContainer.classList.remove("hidden");
        responseBox.classList.add("hidden");
    };
    window.goToQuiz = function() {
        window.location.href = 'generate_questions.html';
    };
});