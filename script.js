document.addEventListener('DOMContentLoaded', () => {
    // --- Recommendation Logic ---
    const form = document.getElementById('recommendation-form');
    const loadingSpinner = document.getElementById('loading-spinner'); // This is in index.html but not used, can be removed later.
    const pageTransitionOverlay = document.getElementById('page-transition-overlay');
    const errorMessageContainer = document.getElementById('error-message');
    const submitButton = document.getElementById('get-recommendations');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const apiKey = document.getElementById('api-key').value.trim();
        if (!apiKey) {
            alert('Please enter your Deepseek API Key.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Generating...';
        errorMessageContainer.classList.add('hidden');

        const mediaType = document.getElementById('media-type').value;
        const genre = document.getElementById('genre').value;
        const keywords = document.getElementById('keywords').value;
        const mood = document.getElementById('mood').value;
        const similarTitles = document.getElementById('similar-titles').value;
        const era = document.getElementById('era').value;
        const complexity = document.getElementById('complexity').value;
        const avoid = document.getElementById('avoid').value;

        const prompt = `
            You are a world-class recommendation engine AI, like the one used by Netflix. Your task is to provide 3 highly personalized recommendations based on the user's detailed preferences.
            For each recommendation, you MUST provide:
            1. A title.
            2. A one-sentence tagline.
            3. A short, compelling synopsis (2-3 sentences).
            4. A "Why it's a match" section that directly connects to the user's input (mood, keywords, similar titles, etc.).
            
            Format the output for EACH recommendation EXACTLY as follows, using "|||" as a separator between fields and "---" as a separator between recommendations. Do not add any extra text, titles, or formatting.

            Title: [Title of Movie/Show/Book]|||Tagline: [Tagline]|||Synopsis: [Synopsis]|||Why it's a match: [Explanation]
            ---
            Title: [Title of Movie/Show/Book]|||Tagline: [Tagline]|||Synopsis: [Synopsis]|||Why it's a match: [Explanation]
            ---
            Title: [Title of Movie/Show/Book]|||Tagline: [Tagline]|||Synopsis: [Synopsis]|||Why it's a match: [Explanation]

            User Preferences:
            - Type of Media: ${mediaType}
            - Preferred Genre(s): ${genre}
            - Keywords (themes, actors, directors, authors): ${keywords}
            - Desired Mood: ${mood}
            - Similar Titles Enjoyed: ${similarTitles}
            - Preferred Era: ${era}
            - Preferred Complexity: ${complexity}
            - Content to Avoid: ${avoid}

            Generate 3 recommendations now.
        `;

        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { "role": "system", "content": "You are a world-class recommendation engine AI." },
                        { "role": "user", "content": prompt }
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }

            const data = await response.json();
            const recommendationText = data.choices[0].message.content;
            
            // Save results to session storage to pass to the next page
            sessionStorage.setItem('recommendations', recommendationText);

            // Trigger page transition and redirect
            pageTransitionOverlay.classList.add('is-active');
            setTimeout(() => {
                window.location.href = 'recommendations.html';
            }, 500); // Match transition duration

        } catch (error) {
            console.error('Error fetching recommendations:', error);
            errorMessageContainer.textContent = `Failed to get recommendations. ${error.message}`;
            errorMessageContainer.classList.remove('hidden');
        } finally {
            // Re-enable button on error
            submitButton.disabled = false;
            submitButton.textContent = 'Find My Story';
        }
    });
});
                    
                    