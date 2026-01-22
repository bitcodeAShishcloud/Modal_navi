# 🤖 AI Knowledge Chatbot

A fully browser-based AI-like chatbot that intelligently answers questions across multiple subjects using smart keyword matching. Built with pure HTML, CSS, and Vanilla JavaScript - no frameworks, no backend required!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🌟 Features

- **Smart AI-Like Matching**: Uses keyword extraction and scoring algorithm (not exact match)
- **Multi-Subject Search**: Search across all subjects or filter by specific topics
- **ChatGPT-Style UI**: Beautiful, modern interface with smooth animations
- **Typing Indicator**: Realistic "AI is typing..." animation
- **Mobile Responsive**: Works perfectly on all devices
- **No Dependencies**: Pure vanilla JavaScript - no libraries needed
- **Offline Ready**: Runs completely in the browser
- **Easy Extensibility**: Add new subjects with just ONE line of code
- **Chat History**: Automatically saved to localStorage
- **Language Support**: English and basic Hindi keyword matching

---

## 📁 Project Structure

```
modal/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling (ChatGPT-like UI)
├── js/
│   └── app.js             # Core application logic
├── data/
│   ├── math.json          # Mathematics Q&A
│   ├── science.json       # Science Q&A
│   ├── computer.json      # Computer Science Q&A
│   └── english.json       # English Language Q&A
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd modal
   ```

2. **Open in browser**
   - Simply double-click `index.html`, or
   - Right-click `index.html` → Open with → Your browser, or
   - Use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (with http-server)
     npx http-server
     ```
   - Then navigate to `http://localhost:8000`

3. **Start chatting!**
   - Select a subject or "All Subjects"
   - Type your question
   - Get instant AI-like responses

---

## 💡 Usage Examples

### Example Questions to Try:

**Mathematics:**
- "What is the Pythagorean theorem?"
- "Explain prime numbers"
- "How to calculate circle area?"

**Science:**
- "What is photosynthesis?"
- "Tell me about gravity"
- "Explain the water cycle"

**Computer Science:**
- "What is an algorithm?"
- "Difference between RAM and ROM?"
- "Explain machine learning"

**English:**
- "What is a metaphor?"
- "Difference between affect and effect?"
- "Explain active voice"

The chatbot uses smart keyword matching, so you can ask questions in different ways and still get relevant answers!

---

## 🔧 How It Works

### Smart Matching Algorithm

1. **Text Normalization**: Converts questions to lowercase, removes punctuation
2. **Keyword Extraction**: Splits into words, filters out stop words
3. **Scoring System**: Compares keywords with stored questions
   - Exact match: 1.0 point
   - Partial match: 0.7 points
   - Similar words: 0.5 points
4. **Best Match Selection**: Returns answer with highest score (threshold: 0.3)

### Subject Selection Logic

- **Single Subject**: Loads and searches only that subject's JSON
- **All Subjects**: Uses `Promise.all()` to load all JSON files simultaneously, searches across all data, returns best match with subject badge

---

## ➕ Adding New Subjects (SUPER EASY!)

This is the most powerful feature! To add a new subject:

### Step 1: Create JSON File
Create `data/history.json`:
```json
{
  "subject": "History",
  "qa": [
    {
      "question": "Who was the first president of the USA?",
      "answer": "George Washington was the first president of the United States, serving from 1789 to 1797."
    },
    {
      "question": "When did World War II end?",
      "answer": "World War II ended in 1945. Germany surrendered in May and Japan in September after the atomic bombings."
    }
  ]
}
```

### Step 2: Add ONE Line to JavaScript
Open `js/app.js` and find the `subjects` object (around line 18):

```javascript
const subjects = {
    math: "data/math.json",
    science: "data/science.json",
    computer: "data/computer.json",
    english: "data/english.json",
    history: "data/history.json"  // ← Just add this line!
};
```

**That's it!** No HTML changes, no CSS changes needed. The dropdown updates automatically! 🎉

---

## 📝 JSON Format

All subject JSON files must follow this format:

```json
{
  "subject": "Subject Name",
  "qa": [
    {
      "question": "Question text here?",
      "answer": "Detailed answer here."
    },
    {
      "question": "Another question?",
      "answer": "Another answer."
    }
  ]
}
```

### Best Practices:
- Write questions naturally (how users would ask)
- Provide clear, concise answers
- Include multiple variations of similar questions
- Use proper grammar and punctuation

---

## 🎨 Customization

### Change Colors
Edit `css/style.css`:
```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
```

### Adjust Matching Sensitivity
Edit `js/app.js` (line ~233):
```javascript
// Current threshold: 0.3 (30% match required)
if (bestScore >= 0.3) {
    // Lower = more lenient, Higher = stricter
}
```

### Modify Typing Delay
Search for `showTypingIndicator()` in `js/app.js` and adjust timeout durations.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, animations, gradients, media queries
- **Vanilla JavaScript (ES6+)**: 
  - Async/await
  - Promises
  - Fetch API
  - localStorage
  - DOM manipulation

**No frameworks. No libraries. No dependencies.**

---

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 47+

All modern browsers are fully supported!

---

## 📱 Mobile Support

Fully responsive design with:
- Touch-optimized controls
- Adaptive layouts
- Optimized font sizes
- Smooth scrolling
- Gesture support

---

## 🔒 Privacy & Data

- **100% Client-Side**: All processing happens in your browser
- **No Server Calls**: No data sent to external servers
- **localStorage Only**: Chat history saved locally on your device
- **Offline Capable**: Works without internet after first load

---

## 🐛 Troubleshooting

### JSON Not Loading?
- Check file paths are correct
- Ensure JSON syntax is valid (use [JSONLint](https://jsonlint.com/))
- Check browser console for errors (F12)

### Answers Not Matching?
- Add more question variations to JSON
- Lower the matching threshold in code
- Check for typos in questions

### Styling Issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file is loading
- Verify browser compatibility

---

## 📈 Future Enhancements

Potential features to add:
- [ ] Export chat history as text/PDF
- [ ] Voice input support
- [ ] Multi-language UI
- [ ] Theme switcher (dark/light mode)
- [ ] Admin panel to edit Q&A
- [ ] Search history
- [ ] Related questions suggestions
- [ ] Feedback system (helpful/not helpful)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Created with ❤️ by [Your Name]

---

## 🙏 Acknowledgments

- Inspired by ChatGPT's conversational UI
- Built for educational purposes
- Perfect for learning vanilla JavaScript

---

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the code comments for detailed explanations

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

**Built with pure HTML, CSS, and JavaScript - proving you don't always need frameworks to build something amazing! 🚀**
