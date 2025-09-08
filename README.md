# Cine-Lit: Your Story Awaits

A sophisticated web application that provides personalized recommendations across movies, TV shows, and books based on your preferences.

## Overview

Cine-Lit is an AI-powered recommendation engine that helps you discover your next favorite story. Whether you're looking for a thought-provoking movie, an engaging TV series, or a captivating book, Cine-Lit curates personalized suggestions based on your specific tastes and preferences.

## Features

- **Personalized Recommendations**: Get tailored suggestions based on your genre preferences, mood, and interests
- **Multi-format Support**: Discover content across movies, TV shows, and books
- **Advanced Filtering**: Refine recommendations by era, complexity, and specific themes to avoid
- **Beautiful UI**: Elegant glass-morphism design with smooth transitions
- **Privacy-Focused**: Your API key is stored locally in your browser only

## How to Use

1. **Enter Your API Key**: You'll need a Deepseek API key to use the recommendation engine
2. **Set Your Preferences**: 
   - Select your preferred media type (movies, TV shows, books, or any)
   - Specify genres, keywords, and desired mood
   - List similar titles you've enjoyed
   - Set era and complexity preferences
   - Mention anything you'd like to avoid
3. **Get Recommendations**: Click "Find My Story" to generate your personalized suggestions
4. **Review Results**: Explore your curated selections with detailed explanations for each recommendation

## Technical Requirements

- Modern web browser with JavaScript enabled
- Deepseek API account and API key

## File Structure

```
cine-lit/
├── index.html          # Main application interface
├── recommendations.html # Results display page
├── style.css           # Styling and animations
├── script.js           # Main application logic
├── recommendations.js  # Results page functionality
└── README.md           # This file
```

## API Integration

Cine-Lit uses the Deepseek API to generate recommendations. Your API key is:
- Stored only in your browser's local storage
- Never shared with any server except Deepseek's API
- Required for the recommendation functionality to work

## Browser Compatibility

This application works best on modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- ES6+ JavaScript features
- Fetch API

## Development

To modify or extend this project:

1. Clone or download the project files
2. Ensure all files are in the same directory
3. Open `index.html` in a browser to test
4. Modify styles in `style.css` or logic in the JavaScript files as needed

## Privacy Notice

Cine-Lit respects your privacy:
- No user data is stored on any server
- Your preferences and API key remain in your browser
- The application only communicates with Deepseek's API for recommendations

## Support

For issues with recommendations, check your API key validity and ensure you have sufficient credits in your Deepseek account.

## License

This project is provided as-is for educational and personal use.