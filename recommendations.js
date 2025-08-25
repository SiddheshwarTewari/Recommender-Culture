document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('recommendations-result');
    const recommendationsContainer = document.getElementById('results-section');
    const pageTransitionOverlay = document.getElementById('page-transition-overlay');
    const backButton = document.getElementById('back-button');

    // Fade in the page content
    recommendationsContainer.style.opacity = 1;

    const recommendationText = sessionStorage.getItem('recommendations');

    if (recommendationText) {
        const recommendations = recommendationText.split('---').filter(r => r.trim());
        let htmlContent = '';

        recommendations.forEach((rec, index) => {
            const parts = rec.split('|||').reduce((acc, part) => {
                const [key, ...value] = part.split(':');
                if (key && value.length > 0) {
                    acc[key.trim().toLowerCase()] = value.join(':').trim();
                }
                return acc;
            }, {});

            if (parts.title) {
                htmlContent += `
                    <div class="recommendation-card" style="animation-delay: ${index * 0.2}s">
                        <h3>${parts.title}</h3>
                        <p><em>${parts.tagline || ''}</em></p>
                        <p>${parts.synopsis || 'No synopsis available.'}</p>
                        <p><strong>Why it's a match:</strong> ${parts["why it's a match"] || 'No reason provided.'}</p>
                    </div>
                `;
            }
        });

        if (htmlContent) {
            resultContainer.innerHTML = htmlContent;
        } else {
            resultContainer.innerHTML = `<p class="glass-card">The AI returned a response that could not be parsed. Please try again.</p>`;
        }
        // Clean up storage
        sessionStorage.removeItem('recommendations');
    } else {
        resultContainer.innerHTML = `<p class="glass-card">No recommendations found. Please go back and generate them.</p>`;
    }

    // Handle back navigation with transition
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        pageTransitionOverlay.classList.add('is-active');
        setTimeout(() => {
            window.location.href = backButton.href;
        }, 500);
    });
});
