/* ============================================ */
/* AI KNOWLEDGE CHATBOT - MAIN APPLICATION    */
/* ============================================ */

// ====================
// CONFIGURATION
// ====================

/**
 * Subject mapping: To add a new subject, simply add one line here
 * Format: subjectKey: "path/to/jsonfile.json"
 */
const subjects = {
    Math: "data/math.json",
    Science: "data/science.json",
    Computer: "data/computer.json",
    English: "data/english.json",
    General_conversation: "data/general_conversation.json",
    Education: "data/education.json",
    Relationship: "data/relationship.json",
    Technology: "data/technology.json",
    Daily_life: "data/daily_life.json",
    Web_Tech_1:"data/Web_Technologies_1.json",
    Cyber_threat_intelligence_unit1: "data/cyber_threat_intelligence_unit1.json"
};

// Global state
let loadedData = {}; // Stores loaded JSON data
let chatHistory = []; // Optional: Store chat history

// ====================
// DOM ELEMENTS
// ====================

const subjectDropdown = document.getElementById('subjectDropdown');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatArea = document.getElementById('chatArea');

// ====================
// INITIALIZATION
// ====================

/**
 * Initialize the application
 */
function init() {
    populateSubjectDropdown();
    attachEventListeners();
    loadChatHistory(); // Optional: Load from localStorage
}

/**
 * Populate subject dropdown dynamically
 */
function populateSubjectDropdown() {
    // Add "All Subjects" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = '🌐 All Subjects';
    subjectDropdown.appendChild(allOption);

    // Add individual subjects
    Object.keys(subjects).forEach(subjectKey => {
        const option = document.createElement('option');
        option.value = subjectKey;
        option.textContent = capitalizeFirstLetter(subjectKey);
        subjectDropdown.appendChild(option);
    });
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}

// ====================
// MESSAGE HANDLING
// ====================

/**
 * Handle send message action
 */
async function handleSendMessage() {
    const question = userInput.value.trim();
    
    if (!question) {
        return; // Don't send empty messages
    }

    // Disable input while processing
    setInputState(false);

    // Display user message
    displayUserMessage(question);

    // Clear input
    userInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get selected subject
    const selectedSubject = subjectDropdown.value;

    // Process question and get answer
    const response = await getAnswer(question, selectedSubject);

    // Hide typing indicator
    hideTypingIndicator();

    // Display AI response
    displayAIMessage(response.answer, response.subject);

    // Re-enable input
    setInputState(true);

    // Focus back on input
    userInput.focus();

    // Save to chat history (optional)
    saveChatHistory();
}

/**
 * Get answer based on question and selected subject
 */
async function getAnswer(question, selectedSubject) {
    try {
        if (selectedSubject === 'all') {
            // Search across all subjects
            return await searchAllSubjects(question);
        } else {
            // Search in specific subject
            return await searchSubject(question, selectedSubject);
        }
    } catch (error) {
        console.error('Error getting answer:', error);
        return {
            answer: "Sorry, I encountered an error while processing your question. Please try again.",
            subject: null
        };
    }
}

/**
 * Search across all subjects
 */
async function searchAllSubjects(question) {
    // Load all subjects if not already loaded
    await loadAllSubjects();

    let bestMatch = null;
    let bestScore = 0;
    let bestSubject = null;

    // Search through all subjects
    Object.keys(loadedData).forEach(subjectKey => {
        const data = loadedData[subjectKey];
        const result = findBestMatch(question, data.qa);

        if (result && result.score > bestScore) {
            bestScore = result.score;
            bestMatch = result.answer;
            bestSubject = data.subject;
        }
    });

    if (bestMatch && bestScore > 0) {
        return {
            answer: bestMatch,
            subject: bestSubject
        };
    } else {
        return {
            answer: "Sorry, I couldn't find an answer to your question. Please try asking differently or select a specific subject.",
            subject: null
        };
    }
}

/**
 * Search in a specific subject
 */
async function searchSubject(question, subjectKey) {
    // Load subject data if not already loaded
    if (!loadedData[subjectKey]) {
        await loadSubjectData(subjectKey);
    }

    const data = loadedData[subjectKey];
    const result = findBestMatch(question, data.qa);

    if (result && result.score > 0) {
        return {
            answer: result.answer,
            subject: data.subject
        };
    } else {
        return {
            answer: `Sorry, I couldn't find an answer in ${data.subject}. Please try asking differently.`,
            subject: data.subject
        };
    }
}

/**
 * Load all subjects
 */
async function loadAllSubjects() {
    const promises = Object.keys(subjects).map(subjectKey => {
        if (!loadedData[subjectKey]) {
            return loadSubjectData(subjectKey);
        }
        return Promise.resolve();
    });

    await Promise.all(promises);
}

/**
 * Load a specific subject's data
 */
async function loadSubjectData(subjectKey) {
    try {
        const response = await fetch(subjects[subjectKey]);
        if (!response.ok) {
            throw new Error(`Failed to load ${subjectKey} data`);
        }
        const data = await response.json();
        loadedData[subjectKey] = data;
    } catch (error) {
        console.error(`Error loading ${subjectKey}:`, error);
        // Create empty data structure for failed loads
        loadedData[subjectKey] = {
            subject: capitalizeFirstLetter(subjectKey),
            qa: []
        };
    }
}

// ====================
// SMART MATCHING ALGORITHM
// ====================

/**
 * Find the best matching answer using keyword scoring
 * This creates an "AI feel" by scoring matches rather than exact matching
 */
function findBestMatch(question, qaArray) {
    const questionKeywords = extractKeywords(question);
    
    if (questionKeywords.length === 0) {
        return null;
    }

    let bestMatch = null;
    let bestScore = 0;

    qaArray.forEach(qa => {
        const storedQuestionKeywords = extractKeywords(qa.question);
        const score = calculateMatchScore(questionKeywords, storedQuestionKeywords);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = qa.answer;
        }
    });

    // Threshold: Only return if score is significant
    // Adjust this value to make matching more/less strict
    if (bestScore >= 0.3) {
        return {
            answer: bestMatch,
            score: bestScore
        };
    }

    return null;
}

/**
 * Extract keywords from text (normalize, remove punctuation, split)
 * Supports English and basic Hindi
 */
function extractKeywords(text) {
    // Normalize: lowercase
    let normalized = text.toLowerCase();

    // Remove punctuation (keep alphanumeric, spaces, and Unicode for Hindi)
    normalized = normalized.replace(/[^\w\s\u0900-\u097F]/g, ' ');

    // Split into words and filter out common stop words
    const stopWords = new Set([
        'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
        'could', 'can', 'may', 'might', 'must', 'what', 'which', 'who', 'when',
        'where', 'why', 'how', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'between', 'under', 'again', 'further',
        'then', 'once', 'here', 'there', 'all', 'both', 'each', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
        'same', 'so', 'than', 'too', 'very', 'me', 'my', 'i', 'you', 'your'
    ]);

    const words = normalized.split(/\s+/).filter(word => {
        return word.length > 1 && !stopWords.has(word);
    });

    return words;
}

/**
 * Calculate match score between two keyword arrays
 * Returns a value between 0 and 1
 */
function calculateMatchScore(keywords1, keywords2) {
    if (keywords1.length === 0 || keywords2.length === 0) {
        return 0;
    }

    let matchCount = 0;

    keywords1.forEach(keyword1 => {
        keywords2.forEach(keyword2 => {
            // Exact match
            if (keyword1 === keyword2) {
                matchCount += 1;
            }
            // Partial match (one contains the other)
            else if (keyword1.includes(keyword2) || keyword2.includes(keyword1)) {
                matchCount += 0.7;
            }
            // Similar words (Levenshtein-like simple check)
            else if (areSimilar(keyword1, keyword2)) {
                matchCount += 0.5;
            }
        });
    });

    // Normalize score based on the average length of keyword arrays
    const avgLength = (keywords1.length + keywords2.length) / 2;
    const score = matchCount / avgLength;

    return Math.min(score, 1); // Cap at 1
}

/**
 * Simple similarity check for words
 */
function areSimilar(word1, word2) {
    // Check if words start with same 3 characters (for simple similarity)
    if (word1.length >= 3 && word2.length >= 3) {
        return word1.substring(0, 3) === word2.substring(0, 3);
    }
    return false;
}

// ====================
// UI DISPLAY FUNCTIONS
// ====================

/**
 * Display user message in chat
 */
function displayUserMessage(message) {
    const messageElement = createMessageElement(message, 'user');
    chatArea.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Display AI message in chat
 */
function displayAIMessage(message, subject) {
    const messageElement = createMessageElement(message, 'ai', subject);
    chatArea.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Create a message element
 */
function createMessageElement(text, type, subject = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `message-avatar ${type}-avatar`;
    avatarDiv.textContent = type === 'user' ? 'You' : 'AI';

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Subject badge (only for AI messages with subject)
    if (type === 'ai' && subject) {
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'subject-badge';
        badgeDiv.textContent = subject;
        contentDiv.appendChild(badgeDiv);
    }

    // Message bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${type}-bubble`;
    bubbleDiv.innerHTML = formatMessage(text);

    contentDiv.appendChild(bubbleDiv);

    // Assemble
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
}

/**
 * Format message text (convert newlines to <br>, etc.)
 */
function formatMessage(text) {
    return text.replace(/\n/g, '<br>');
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message ai-message typing-indicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar ai-avatar';
    avatarDiv.textContent = 'AI';

    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        dotsDiv.appendChild(dot);
    }

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(dotsDiv);

    chatArea.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Set input state (enabled/disabled)
 */
function setInputState(enabled) {
    userInput.disabled = !enabled;
    sendButton.disabled = !enabled;
    subjectDropdown.disabled = !enabled;
}

// ====================
// UTILITY FUNCTIONS
// ====================

/**
 * Capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ====================
// CHAT HISTORY (OPTIONAL)
// ====================

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
    try {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            chatHistory = JSON.parse(history);
            // Optionally restore messages to UI
            // Not implemented to keep welcome message clean
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
    try {
        // Extract text from chat area
        const messages = Array.from(chatArea.querySelectorAll('.message'))
            .map(msg => ({
                type: msg.classList.contains('user-message') ? 'user' : 'ai',
                text: msg.querySelector('.message-bubble').textContent
            }));
        
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// ====================
// START APPLICATION
// ====================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

