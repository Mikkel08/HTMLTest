// scripts/dalle.js
document.addEventListener("DOMContentLoaded", function () {
    const generateImageButton = document.getElementById("generateImageButton");
    const responseBox = document.getElementById("responseBox");

    generateImageButton.addEventListener("click", async function () {
        const generatedStory = localStorage.getItem('generatedStory');

        if (!generatedStory) {
            alert('Ingen historie tilgængelig til billedgenerering. Generer en historie først.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({prompt: generatedStory})
            });

            if (!response.ok) {
                throw new Error('Fejl ved generering af billede');
            }

            const data = await response.json();
            displayImages(data.images); // Antager, at DALL·E returnerer et array af billed-URLs

        } catch (error) {
            console.error('Fejl ved kald til DALL·E:', error);
            alert('Der opstod en fejl ved billedgenerering. Prøv igen senere.');
        }
    });

    function displayImages(images) {
        const imagesContainer = document.getElementById("imagesContainer");
        imagesContainer.innerHTML = ''; // Ryd tidligere billeder

        images.forEach(imageUrl => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Generated image';
            imgElement.style.width = '100%'; // Juster størrelsen
            imgElement.style.borderRadius = '8px';
            imagesContainer.appendChild(imgElement);
        });
    }
});