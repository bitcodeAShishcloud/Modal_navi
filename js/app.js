/* ============================================ */
/* AI KNOWLEDGE CHATBOT - MAIN APPLICATION    */
/* ============================================ */

// ====================
// AUTHENTICATION
// ====================

let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

function getCurrentUser() {
    const session = sessionStorage.getItem('naviAI_session');
    if (session) return JSON.parse(session);
    
    const encrypted = localStorage.getItem('naviAI_user');
    if (!encrypted) return null;
    
    try {
        const KEY = 'NaviAI_SecureAuth_2026';
        const text = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < text.length; i++) {
            decrypted += String.fromCharCode(
                text.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length)
            );
        }
        const user = JSON.parse(decrypted);
        sessionStorage.setItem('naviAI_session', JSON.stringify(user));
        return user;
    } catch (e) {
        return null;
    }
}

function checkAuthentication() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login/index.html';
        return false;
    }
    displayUserInfo(user);
    startInactivityTimer();
    return true;
}

function startInactivityTimer() {
    // Clear any existing timer
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    // Set new timer
    inactivityTimer = setTimeout(() => {
        console.log('⏰ Auto-logout due to inactivity');
        autoLogout();
    }, INACTIVITY_TIMEOUT);
    
    console.log('⏱️ Inactivity timer started (2 minutes)');
}

function resetInactivityTimer() {
    if (inactivityTimer) {
        startInactivityTimer();
    }
}

function autoLogout() {
    alert('You have been logged out due to 2 minutes of inactivity.');
    sessionStorage.clear();
    window.location.href = 'login/index.html';
}

function manualLogout() {
    if (confirm('Are you sure you want to logout? Your data will be saved.')) {
        // Clear timer on manual logout
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        // Set flag to prevent auto-login
        localStorage.setItem('naviAI_manualLogout', 'true');
        sessionStorage.clear();
        window.location.href = 'login/index.html';
    }
}

// Track user activity
function setupActivityListeners() {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    
    console.log('👀 Activity monitoring enabled');
}

function displayUserInfo(user) {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const logoutHtml = `<span style="color: #a0a0a0;">Welcome, </span><strong style="color: #fff;">${user.username}</strong><span style="color: #606060;"> | </span><a href="#" id="logoutBtn" style="color: #ff6b6b; text-decoration: none; font-weight: 600;">Logout</a>`;
        subtitle.innerHTML = logoutHtml;
        
        setTimeout(() => {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    manualLogout();
                });
            }
        }, 100);
    }
    console.log('✅ Authenticated as:', user.username);
}

function getUserStorageKey(baseKey) {
    const user = getCurrentUser();
    return user ? `${baseKey}_${user.userId}` : baseKey;
}

// ====================
// CONFIGURATION
// ====================

/**
 * Subject mapping: To add a new subject, simply add one line here
 * Format: subjectKey: "path/to/jsonfile.json"
 */
const subjects = {
    navi_ai_help: "data/navi_ai_help.json",
    math: "data/math.json",
    science: "data/science.json",
    computer: "data/computer.json",
    english: "data/english.json",
    general_conversation: "data/general_conversation.json",
    education: "data/education.json",
    relationship: "data/relationship.json",
    technology: "data/technology.json",
    daily_life: "data/daily_life.json",
    Web_Technologies: "data/Web_Technologies_1.json",
    cyber_threat_intelligence_unit1: "data/cyber_threat_intelligence_unit1.json"
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
    if (!checkAuthentication()) return;
    setupActivityListeners();
    populateSubjectDropdown();
    attachEventListeners();
    loadChatHistory();
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
    
    // Import, Export and clear buttons
    const importBtn = document.getElementById('importBtn');
    const importFileInput = document.getElementById('importFileInput');
    const exportTextBtn = document.getElementById('exportTextBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (importBtn) importBtn.addEventListener('click', () => importFileInput.click());
    if (importFileInput) importFileInput.addEventListener('change', handleImportFile);
    if (exportTextBtn) exportTextBtn.addEventListener('click', exportAsText);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportAsPDF);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearChatHistory);
}

// ====================
// IMPORT FUNCTIONALITY
// ====================

/**
 * Handle file import
 */
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileType = file.name.toLowerCase();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let importedMessages = [];
            
            // Check file type and parse accordingly
            if (fileType.endsWith('.pdf')) {
                alert('⚠️ PDF import requires conversion. Please export your chat as TXT format for import.');
                event.target.value = '';
                return;
            } else if (fileType.endsWith('.txt')) {
                // Parse text format
                importedMessages = parseTextFormat(content);
            } else {
                alert('❌ Unsupported file format. Please use TXT files only.');
                event.target.value = '';
                return;
            }
            
            if (importedMessages.length === 0) {
                alert('❌ No valid messages found in the file.');
                return;
            }
            
            // Confirm import
            const mergeChoice = confirm(
                `Found ${importedMessages.length} messages.\\n\\n` +
                `Click OK to MERGE with current history\\n` +
                `Click Cancel to REPLACE current history`
            );
            
            if (mergeChoice === null) return;
            
            // Merge or replace
            if (mergeChoice) {
                chatHistory = [...chatHistory, ...importedMessages];
            } else {
                chatHistory = importedMessages;
                chatArea.innerHTML = '';
            }
            
            saveChatHistory();
            
            // Display imported messages
            importedMessages.forEach(msg => {
                const messageElement = createMessageElement(msg.content, msg.type);
                chatArea.appendChild(messageElement);
            });
            
            scrollToBottom();
            alert(`✅ Successfully imported ${importedMessages.length} messages!`);
            console.log('✅ Import complete:', importedMessages.length, 'messages');
            
        } catch (error) {
            alert('❌ Error importing file: ' + error.message);
            console.error('Import error:', error);
        }
        
        event.target.value = '';
    };
    
    reader.onerror = () => alert('❌ Error reading file');
    reader.readAsText(file);
}

/**
 * Parse text format
 */
function parseTextFormat(content) {
    const messages = [];
    const lines = content.split('\\n');
    let currentMessage = null;
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip headers and empty lines
        if (!line || line.startsWith('NAVI AI - Chat') || 
            line.startsWith('=====') || line.startsWith('Created by') || 
            line.startsWith('Exported:') || line.startsWith('User:')) {
            continue;
        }
        
        // Detect user message
        if (line.match(/^(YOU:|🙋)/)) {
            if (currentMessage) messages.push(currentMessage);
            currentMessage = {
                type: 'user',
                content: line.replace(/^(YOU:|🙋)\\s*/, ''),
                timestamp: new Date().toISOString()
            };
        }
        // Detect AI message
        else if (line.match(/^(NAVI AI:|🤖)/)) {
            if (currentMessage) messages.push(currentMessage);
            currentMessage = {
                type: 'ai',
                content: line.replace(/^(NAVI AI:|🤖)\\s*/, ''),
                timestamp: new Date().toISOString()
            };
        }
        // Continue current message
        else if (currentMessage) {
            currentMessage.content += ' ' + line;
        }
    }
    
    if (currentMessage) messages.push(currentMessage);
    return messages;
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
function displayUserMessage(message, shouldSave = true) {
    const messageElement = createMessageElement(message, 'user');
    chatArea.appendChild(messageElement);
    scrollToBottom();
    if (shouldSave) {
        saveChatHistory();
    }
}

/**
 * Display AI message in chat
 */
function displayAIMessage(message, subject, shouldSave = true) {
    const messageElement = createMessageElement(message, 'ai', subject);
    chatArea.appendChild(messageElement);
    scrollToBottom();
    if (shouldSave) {
        saveChatHistory();
    }
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
// SECURITY & ENCRYPTION
// ====================

/**
 * Simple encryption key (in production, use more secure methods)
 */
const ENCRYPTION_KEY = 'NaviAI_SecureKey_2026';

/**
 * Simple XOR-based encryption for localStorage
 */
function encryptData(data) {
    try {
        const text = JSON.stringify(data);
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            encrypted += String.fromCharCode(
                text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
            );
        }
        return btoa(encrypted); // Base64 encode
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

/**
 * Decrypt data from localStorage
 */
function decryptData(encryptedData) {
    try {
        const encrypted = atob(encryptedData); // Base64 decode
        let decrypted = '';
        for (let i = 0; i < encrypted.length; i++) {
            decrypted += String.fromCharCode(
                encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
            );
        }
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

// ====================
// CHAT HISTORY MANAGEMENT
// ====================

/**
 * Load chat history from localStorage (user-specific)
 */
function loadChatHistory() {
    try {
        const storageKey = getUserStorageKey('naviAI_chatHistory');
        const encryptedHistory = localStorage.getItem(storageKey);
        if (encryptedHistory) {
            const history = decryptData(encryptedHistory);
            if (history && Array.isArray(history)) {
                chatHistory = history;
                // Restore messages to UI (excluding welcome message)
                restoreChatMessages(history);
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

/**
 * Restore chat messages to UI
 */
function restoreChatMessages(messages) {
    // Only restore if there are messages and user wants to see them
    if (messages && messages.length > 0) {
        messages.forEach(msg => {
            if (msg.type === 'user') {
                displayUserMessage(msg.text, false);
            } else {
                displayAIMessage(msg.text, msg.subject || 'General', false);
            }
        });
    }
}

/**
 * Save chat history to localStorage with encryption
 */
function saveChatHistory() {
    try {
        // Extract messages from chat area
        const messages = Array.from(chatArea.querySelectorAll('.message'))
            .filter(msg => !msg.querySelector('.typing-indicator')) // Exclude typing indicator
            .map(msg => {
                const isUser = msg.classList.contains('user-message');
                const bubble = msg.querySelector('.message-bubble');
                const subject = msg.querySelector('.message-subject');
                
                return {
                    type: isUser ? 'user' : 'ai',
                    text: bubble ? bubble.textContent : '',
                    subject: subject ? subject.textContent : null,
                    timestamp: new Date().toISOString()
                };
            });
        
        // Encrypt and save with user-specific key
        const encrypted = encryptData(messages);
        if (encrypted) {
            const storageKey = getUserStorageKey('naviAI_chatHistory');
            localStorage.setItem(storageKey, encrypted);
            chatHistory = messages;
        }
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

/**
 * Clear chat history
 */
function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        try {
            const storageKey = getUserStorageKey('naviAI_chatHistory');
            localStorage.removeItem(storageKey);
            chatHistory = [];
            
            // Clear chat area except welcome message
            const welcomeMsg = chatArea.querySelector('.message.ai-message');
            chatArea.innerHTML = '';
            if (welcomeMsg) {
                chatArea.appendChild(welcomeMsg.cloneNode(true));
            }
            
            alert('Chat history cleared successfully!');
        } catch (error) {
            console.error('Error clearing chat history:', error);
            alert('Failed to clear chat history.');
        }
    }
}

// ====================
// EXPORT FUNCTIONALITY
// ====================

/**
 * Export chat history as text file
 */
function exportAsText() {
    try {
        const messages = Array.from(chatArea.querySelectorAll('.message'))
            .filter(msg => !msg.querySelector('.typing-indicator'))
            .map(msg => {
                const isUser = msg.classList.contains('user-message');
                const bubble = msg.querySelector('.message-bubble');
                const subject = msg.querySelector('.message-subject');
                const text = bubble ? bubble.textContent : '';
                const subjectText = subject ? ` [${subject.textContent}]` : '';
                
                return isUser ? `YOU: ${text}` : `NAVI AI${subjectText}: ${text}`;
            });
        
        if (messages.length === 0) {
            alert('No chat history to export!');
            return;
        }
        
        // Create text content
        const user = getCurrentUser();
        const userInfo = user ? `User: ${user.username} (${user.email})\n` : '';
        const header = `NAVI AI - Chat History\nCreated by: Ashish Gupta\n${userInfo}Exported: ${new Date().toLocaleString()}\n${'='.repeat(60)}\n\n`;
        const content = header + messages.join('\n\n') + `\n\n${'='.repeat(60)}\nEnd of Chat History`;
        
        // Download file
        downloadFile(content, `NaviAI_Chat_${new Date().toISOString().slice(0,10)}.txt`, 'text/plain');
    } catch (error) {
        console.error('Error exporting text:', error);
        alert('Failed to export chat history as text.');
    }
}

/**
 * Export chat history as PDF
 */
function exportAsPDF() {
    try {
        const messages = Array.from(chatArea.querySelectorAll('.message'))
            .filter(msg => !msg.querySelector('.typing-indicator'))
            .map(msg => {
                const isUser = msg.classList.contains('user-message');
                const bubble = msg.querySelector('.message-bubble');
                const subject = msg.querySelector('.message-subject');
                const text = bubble ? bubble.textContent : '';
                const subjectText = subject ? ` [${subject.textContent}]` : '';
                
                return {
                    sender: isUser ? 'YOU' : `NAVI AI${subjectText}`,
                    text: text,
                    isUser: isUser
                };
            });
        
        if (messages.length === 0) {
            alert('No chat history to export!');
            return;
        }
        
        // Create HTML content for PDF
        const user = getCurrentUser();
        const userInfo = user ? `<p class="subtitle">User: ${user.username}</p>` : '';
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Navi AI Chat History</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #333;
                    }
                    h1 {
                        margin: 0;
                        color: #1a1a1a;
                    }
                    .subtitle {
                        color: #666;
                        margin-top: 5px;
                    }
                    .message {
                        margin: 15px 0;
                        padding: 12px;
                        border-radius: 8px;
                    }
                    .user {
                        background-color: #f0f0f0;
                        margin-left: 100px;
                    }
                    .ai {
                        background-color: #e8f4f8;
                        margin-right: 100px;
                    }
                    .sender {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #333;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🤖 NAVI AI - Chat History</h1>
                    <p class="subtitle">Created by Ashish Gupta</p>
                    ${userInfo}
                    <p class="subtitle">Exported: ${new Date().toLocaleString()}</p>
                </div>
        `;
        
        messages.forEach(msg => {
            htmlContent += `
                <div class="message ${msg.isUser ? 'user' : 'ai'}">
                    <div class="sender">${msg.sender}</div>
                    <div>${msg.text}</div>
                </div>
            `;
        });
        
        htmlContent += `
                <div class="footer">
                    <p>Generated by Navi AI - Your Intelligent Knowledge Assistant</p>
                    <p>© ${new Date().getFullYear()} Ashish Gupta</p>
                </div>
            </body>
            </html>
        `;
        
        // Create a blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in new window for printing to PDF
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.print();
                    // Note: User needs to manually "Save as PDF" from print dialog
                }, 250);
            };
        } else {
            alert('Please allow pop-ups to export as PDF');
        }
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export chat history as PDF.');
    }
}

/**
 * Download file helper
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
