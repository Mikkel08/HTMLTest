// scripts/script.js
document.addEventListener("DOMContentLoaded", function () {
    // Gør knappen aktiv
    const sendButton = document.getElementById("sendButton");
    const inputContainer = document.getElementById("inputContainer");
    const responseBox = document.getElementById("responseBox");

    async function sendTestRequest() {
        sendButton.disabled = true;
        sendButton.classList.add('loading');
        sendButton.innerHTML = 'Sender...';

        const prompt = createPrompt();

        try {
            const response = await fetch('http://localhost:5001/send-to-claude', { // Bemærk porten 5001
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

            document.getElementById('responseBox').innerHTML = `
                <h3>Claude Resultat:</h3>
                <p>${data.response.completion || 'Ingen svar modtaget fra Claude'}</p>
                <button onclick="showInputFields()">Vis Inputfelter</button>
                <button onclick="goToQuiz()">Gå til Quiz</button>
            `;

            inputContainer.classList.add("hidden");
            responseBox.classList.remove("hidden");
        } catch (error) {
            console.error('Fejl ved kald til Claude:', error);
            alert('Der opstod en fejl ved kald til Claude API. Prøv igen senere.');
        } finally {
            sendButton.disabled = false;
            sendButton.classList.remove('loading');
            sendButton.innerHTML = 'Send til Claude';
        }
    }

    function createPrompt() {
        const niveau = document.getElementById('niveau').value;
        const laengde = document.getElementById('laengde').value;
        const fokusomraader = document.getElementById('fokusomraader').value;
        const hovedpersonen = document.getElementById('hovedpersonen').value;
        const vejrEllerSaeson = document.getElementById('vejrEllerSaeson').value;
        const lokation = document.getElementById('lokation').value;
        const kulturelleElementer = document.getElementById('kulturelleElementer').value;
        const personligeTraek = document.getElementById('personligeTraek').value;
        const laeserensNavn = document.getElementById('laeserensNavn').value;
        const magiEllerSuperkraefter = document.getElementById('magiEllerSuperkraefter').value;
        const karakterensKaeldyr = document.getElementById('karakterensKaeldyr').value;

        return `You are tasked with writing a children's text in Danish. Follow these instructions carefully to create an appropriate text:

1. Writing Level: The text should be written at a ${niveau} level, measured on a scale from 0 to 10.

2. Text Length: The text should be ${laengde} characters long, including spaces.

3. Focus Areas: ${fokusomraader}

4. Main Character Name: The main character's name should be ${hovedpersonen}.

5. Season or Weather: ${vejrEllerSaeson}

6. Location Details: ${lokation}

7. Cultural Elements: ${kulturelleElementer}

8. Personal Traits: ${personligeTraek}

9. Reader's Name: ${laeserensNavn}

10. Magic or Superpowers: ${magiEllerSuperkraefter}

11. Character Pets: ${karakterensKaeldyr}`;
    }

    window.sendTestRequest = sendTestRequest;

    window.showInputFields = function () {
        inputContainer.classList.remove("hidden");
        responseBox.classList.add("hidden");
    };

    window.goToQuiz = function () {
        alert("Dette vil tage dig til quizzen. Quiz-funktionaliteten skal implementeres.");
    };
});
