# 🤖 Navi AI - Intelligent Knowledge Assistant

**Created by Ashish Gupta**

A fully browser-based intelligent AI chatbot that answers questions across multiple subjects using smart keyword matching. Built with pure HTML, CSS, and Vanilla JavaScript - no frameworks, no backend required!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🌟 Features

### Core Features
- **🔐 User Authentication**: Secure login with username/email or guest mode
- **⏱️ Session Management**: Auto-logout after 2 minutes of inactivity with activity tracking
- **🆘 Comprehensive Help**: 500+ Q&As about all Navi AI features in searchable database
- **Smart AI-Like Matching**: Uses keyword extraction and scoring algorithm (not exact match)
- **Multi-Subject Search**: Search across all subjects or filter by specific topics
- **Glassmorphism UI**: Beautiful black & white modern design with glass effects
- **Typing Indicator**: Realistic "AI is typing..." animation
- **Mobile Responsive**: Works perfectly on all devices
- **No Dependencies**: Pure vanilla JavaScript - no libraries needed
- **Offline Ready**: Runs completely in the browser
- **Easy Extensibility**: Add new subjects with just ONE line of code
- **Language Support**: English and basic Hindi keyword matching

### 🔒 Security & Storage Features
- **User Authentication**: Login system with username/email or guest mode
- **Session Management**: Auto-logout after 2 minutes of inactivity
- **Encrypted Local Storage**: Chat history is encrypted using XOR encryption before storing
- **Secure Data Handling**: All sensitive data is protected with custom encryption key
- **Privacy First**: All data stays in your browser, nothing sent to servers
- **Persistent History**: Conversations saved securely across sessions
- **User-Specific Storage**: Each user has isolated encrypted chat history

### 📤 Import/Export Capabilities
- **Export as Text**: Download chat history as formatted .txt file
- **Export as PDF**: Print/save conversations as PDF documents
- **Import Conversations**: Import previously exported .txt files to restore or merge chat history
- **Clear History**: Remove all chat data with one click
- **Timestamped Exports**: Each export includes user info, creation date and time

### 🆕 Comprehensive Help System
- **500+ Q&As**: Extensive FAQ database covering all Navi AI features
- **9 Categories**: Getting Started, Login & Authentication, Chat Features, Import & Export, Session Management, Data & Security, Troubleshooting, Advanced Features, Tips & Tricks
- **Searchable Knowledge Base**: Get help about login, features, security, troubleshooting, and more
- **Usage Guidelines**: Best practices, tips, and tricks for optimal experience

---

## 📁 Project Structure

```
modal/
├── index.html                           # Main HTML file
├── css/
│   └── style.css                       # Glassmorphism styling
├── js/
│   └── app.js                          # Core logic + encryption + exports
├── data/
│   ├── math.json                       # Mathematics Q&A (12 items)
│   ├── science.json                    # Science Q&A (12 items)
│   ├── computer.json                   # Computer Science Q&A (13 items)
│   ├── english.json                    # English Language Q&A (13 items)
│   ├── general_conversation.json       # General Q&A (100+ items)
│   ├── education.json                  # Education tips (100 items)
│   ├── relationship.json               # Relationship advice (100 items)
│   ├── technology.json                 # Tech topics (50 items)
│   ├── daily_life.json                 # Daily life tips (100 items)
│   ├── Web_Technologies_1.json         # Web tech Q&A
│   ├── cyber_threat_intelligence_unit1.json  # Cyber security
│   └── navi_ai_help.json               # 🆕 Navi AI Help & FAQ (500 Q&As)
├── login/
│   ├── index.html                      # Login/authentication page
│   ├── auth.js                         # Authentication logic
│   ├── styles.css                      # Login page styling
│   └── README.md                       # Login system documentation
└── README.md                           # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Quick Start

1. **Open the Login Page**
   - Navigate to `login/index.html` to start

2. **Login or Use Guest Mode**
   - Enter username (min 3 characters) and email, or
   - Click "Continue as Guest" for quick access

3. **Start Chatting**
   - Select a subject from the dropdown
   - Type your question in the input box
   - Get instant AI responses

4. **Manage Your Data**
   - Export your conversations anytime
   - Import previous conversations
   - Clear history when needed

### Installation

1. **Clone or download this repository**

   ```bash
   git clone <repository-url>
   cd modal
   ```

2. **Open in browser**

   - Open `login/index.html` to start with authentication, or
   - Open `index.html` directly (will redirect to login), or
   - Use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000

     # Node.js (with http-server)
     npx http-server
     ```
   - Then navigate to `http://localhost:8000/login/`

3. **Start using Navi AI!**

   - Login with credentials or use guest mode
   - Select a subject or "All Subjects"
   - Type your question
   - Get instant AI-like responses
   - Export or clear history using control panel buttons

---

## 🔐 Authentication & Security

### Login System
Navi AI features a comprehensive authentication system located in the `login/` folder:

**Login Options:**
- **Username + Email**: Register with username (min 3 chars) and valid email
- **Guest Mode**: Quick access without credentials
- **Auto-Login**: Automatically logs you in on return visits (unless manually logged out)

**Session Management:**
- **2-Minute Inactivity Timeout**: Automatic logout after 2 minutes of no activity
- **Activity Tracking**: Mouse movement, keyboard input, scrolling, and clicks reset the timer
- **Manual Logout**: Click logout link to end session and prevent auto-login
- **Smart Re-Login**: Auto-login works after timeout or browser close, but NOT after manual logout

**Data Isolation:**
- Each user has separate encrypted storage
- Chat histories are user-specific
- Guest mode has its own isolated storage

### Encrypted Storage
Navi AI uses XOR-based encryption to protect your chat history in localStorage:

```javascript
// Data is encrypted before storage
encryptedData = encrypt(chatHistory) → Base64 encoded
localStorage.setItem('naviAI_chatHistory', encryptedData)

// Data is decrypted when retrieved
retrievedData = localStorage.getItem('naviAI_chatHistory')
chatHistory = decrypt(retrievedData)
```

### Privacy Guarantees
- ✅ All data stored locally in your browser
- ✅ No server communication or data transmission
- ✅ Encrypted storage prevents casual access
- ✅ Clear history option for complete data removal
- ✅ No cookies, trackers, or analytics

---

## 📤 Export Features

### Export as Text File
- Click **Export TXT** button in control panel
- Downloads: `NaviAI_Chat_YYYY-MM-DD.txt`
- Format: Plain text with sender labels
- Includes: Header, timestamp, all messages

### Export as PDF
- Click **Export PDF** button
- Opens print dialog automatically
- Select "Save as PDF" from print destinations
- Formatted HTML with styling preserved
- Includes: Navi AI branding, timestamp, formatted messages

### Clear History
- Click **Clear** button (red trash icon)
- Confirmation dialog before deletion
- Removes all encrypted data from localStorage
- Resets chat to welcome message only

---

## 🔐 Security Features

### Encrypted Storage
Navi AI uses XOR-based encryption to protect your chat history in localStorage:

```javascript
// Data is encrypted before storage
encryptedData = encrypt(chatHistory) → Base64 encoded
localStorage.setItem('naviAI_chatHistory', encryptedData)

// Data is decrypted when retrieved
retrievedData = localStorage.getItem('naviAI_chatHistory')
chatHistory = decrypt(retrievedData)
```

### Privacy Guarantees
- ✅ All data stored locally in your browser
- ✅ No server communication or data transmission
- ✅ Encrypted storage prevents casual access
- ✅ Clear history option for complete data removal
- ✅ No cookies, trackers, or analytics

---

## 📤 Export Features

### Export as Text File
- Click **Export TXT** button in control panel
- Downloads: `NaviAI_Chat_YYYY-MM-DD.txt`
- Format: Plain text with sender labels
- Includes: Header, timestamp, all messages

### Export as PDF
- Click **Export PDF** button
- Opens print dialog automatically
- Select "Save as PDF" from print destinations
- Formatted HTML with styling preserved
- Includes: Navi AI branding, timestamp, formatted messages

### Clear History
- Click **Clear** button (red trash icon)
- Confirmation dialog before deletion
- Removes all encrypted data from localStorage
- Resets chat to welcome message only

---

## 💡 Usage Examples

### Example Questions to Try:

**Navi AI Help & FAQ:**
- "How do I login?"
- "What is the inactivity timeout?"
- "How do I export my chats?"
- "Is my data secure?"
- "How do I import conversations?"
- "What happens when I logout?"

**General Conversation:**
- "Hello"
- "What's your name?"
- "Who created you?"
- "What is artificial intelligence?"

**Mathematics:**
- "What is the Pythagorean theorem?"
- "Explain prime numbers"
- "How to calculate circle area?"

**Science:**
- "What is photosynthesis?"
- "Tell me about gravity"
- "Explain the water cycle?"

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

### Login Issues?

- Ensure username is at least 3 characters
- Verify email format is valid
- Check if localStorage is enabled
- Clear manual logout flag: `localStorage.removeItem('naviAI_manualLogout')`

### Auto-Logout Issues?

- Timer is 2 minutes - move mouse to reset
- Check if activity listeners are working
- See [login/README.md](login/README.md) for session details

### Import/Export Issues?

- Verify file format is correct (.txt with YOU: / NAVI AI: prefixes)
- Check file encoding is UTF-8
- Ensure browser allows downloads
- For PDF: use modern browser with print-to-PDF support

### Need More Help?

Check the **Navi AI Help & FAQ** subject with 500+ Q&As covering all features and common issues!

---

## 📈 Future Enhancements

Potential features to add:

- [x] Export chat history as text/PDF ✅
- [x] User authentication system ✅
- [x] Import conversations ✅
- [x] Session management with auto-logout ✅
- [x] Comprehensive help system (500+ Q&As) ✅
- [ ] Voice input support
- [ ] Multi-language UI
- [ ] Theme switcher (dark/light mode)
- [ ] Admin panel to edit Q&A
- [ ] Search within chat history
- [ ] Related questions suggestions
- [ ] Feedback system (helpful/not helpful)
- [ ] Browser extension version

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

Created with ❤️ by Ashish Gupta

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
