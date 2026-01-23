# Navi AI - Login System

Complete authentication system for Navi AI with user identification, data persistence, and intelligent session management.

## 📁 Files

- **index.html** - Login page interface
- **styles.css** - Glassmorphism design styling
- **auth.js** - Authentication logic and user management

## 🚀 Features

### 1. **User Authentication**
- Username and email identification
- Guest mode for quick access
- Encrypted user data storage
- Session management

### 2. **Auto-Login & Smart Logout**
- Auto-login for returning users (after browser close)
- Auto-logout after 2 minutes of inactivity
- Manual logout prevents auto-login (requires re-authentication)
- Activity tracking (mouse, keyboard, scroll, touch)

### 3. **Data Persistence**
- User-specific chat history
- Encrypted localStorage
- Automatic data loading on login
- Secure session tracking

## 🔐 Security

### Encryption
- **Algorithm**: XOR Cipher + Base64
- **Key**: `NaviAI_SecureAuth_2026`
- **Storage**: Browser localStorage only
- **Privacy**: 100% local, no server transmission

### User Data Structure
```javascript
{
    userId: "user_1737590400000_abc123",
    username: "John Doe",
    email: "john@example.com",
    isGuest: false,
    loginDate: {
        timestamp: "2026-01-23T10:00:00.000Z",
        formatted: "Thursday, January 23, 2026..."
    },
    createdAt: "...",
    lastLogin: "..."
}
```

## 📋 How It Works

### First Time Login:
1. User enters username and email
2. System generates unique user ID
3. User data encrypted and saved to localStorage
4. Redirect to main application
5. Chat history loads (if any)
6. 2-minute inactivity timer starts

### Returning User (Auto-Login):
1. System checks localStorage for existing user
2. Checks if user manually logged out (if yes, skip auto-login)
3. Auto-login if conditions met
4. Redirect to main app
5. Previous chat history loads automatically
6. 2-minute inactivity timer starts

### Guest Mode:
1. Click "Continue as Guest"
2. Temporary guest account created
3. Data still saved locally
4. Full functionality available
5. 2-minute inactivity timer applies

### Session Management:
**Auto-Logout (2 minutes of inactivity):**
- Timer starts on login
- Resets on any user activity
- Shows alert before logout
- Allows auto-login next time

**Manual Logout:**
- User clicks "Logout" link
- Confirmation dialog shown
- Clears session and sets logout flag
- Requires re-authentication (no auto-login)

## 🎯 Usage

### To Access Login:
```
http://localhost/modal/login/index.html
```
⏱️ Session Timeout Details

### Inactivity Timer (2 Minutes):
- **Starts**: On successful login
- **Resets**: On any user activity
- **Tracked Activities**: 
  - Mouse movements and clicks
  - Keyboard inputs
  - Scrolling
  - Touch events
- **On Timeout**: 
  - Alert notification shown
  - Session cleared
  - Redirected to login page
  - Auto-login enabled for next visit

### localStorage Keys:
```javascript
naviAI_user              // Encrypted user credentials
naviAI_session           // Current session data
naviAI_manualLogout      // Flag to prevent auto-login
naviAI_chatHistory_[userId]  // User-specific chat data
═══════════════════════════════════════════════════
                  SESSION INFO
═══════════════════════════════════════════════════

Login Time:     2026-01-23T10:00:00.000Z
Login Date:     Thursday, January 23, 2026 at 10:00:00 AM
Created:        Thursday, January 23, 2026...

═══════════════════════════════════════════════════
                   SECURITY
═══════════════════════════════════════════════════

Storage:        Encrypted localStorage
Encryption:     XOR Cipher + Base64
Privacy:        100% Local - No server transmission
Data Location:  Browser localStorage only
```

## 🛠️ Troubleshooting

### Login Issues:
- ClAuto-Login Not Working:
- Check if you manually logged out (requires re-login)
- Clear `naviAI_manualLogout` flag: `localStorage.removeItem('naviAI_manualLogout')`
- Verify localStorage is enabled
- Check browser console for errors (F12)

### Logged Out Unexpectedly:
- Check if 2 minutes passed without activity
- Timer resets on mouse/keyboard activity
- Verify no browser extensions blocking timers

### Auto-Login Not Working:
- Clear browser cache
- Check localStorage
- Re-login to refresh session

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ❌ Internet Explorer

## 📱 Responsive Design

Fully responsive glassmorphism design:
- Desktop: Full-width card (450px max)
- Tablet: Adaptive layout
- Mobile: Touch-optimized buttons

## 🎨 Styling

### Design Theme:
- Glassmorphism effect with backdrop blur
- Dark gradient background
- Smooth animations
- Accessible color contrast

### Key Features:
- Animated logo bounce
- Smooth transitions
- Loading states
- Error/success alerts

## 🔗 Navigation Flow

```
login/index.html 
    ↓ (Authentication)
../index.html (Main App)
    ↓ (Logout)
login/index.html
```

## 📊 Data Flow

```
User Input → Validation → Encryption → localStorage
                              ↓
                    user_id file download
                              ↓
                    Redirect to main app
                              ↓
              Load user-specific chat history
```

## 🎯 Future Enhancements

- [ ] Password protection
- [ ] Multi-factor authentication
- [ ] User profile pictures
- [ ] Social login integration
- [ ] Remember me option
- [ ] Password reset flow

---
🔄 Auto-Login Behavior

| Scenario | Auto-Login | Reason |
|----------|------------|--------|
| Browser closed and reopened | ✅ Yes | User convenience |
| 2-minute inactivity timeout | ✅ Yes | Session expired naturally |
| Manual logout clicked | ❌ No | User explicitly logged out |
| New browser/device | ❌ No | No stored credentials |

## 🎯 Future Enhancements

- [ ] Password protection
- [ ] Multi-factor authentication
- [ ] User profile pictures
- [ ] Social login integration
- [ ] Configurable timeout duration
- [ ] Password reset flow
- [ ] Session activity log

---

**Created by Ashish Gupta**  
**Version**: 2.1  
**Date**: January 2026  
**Last Updated**: January 23, 2026

---

**Important Notes:**
- User data is 100% local only
- No server-side storage or transmission
- Export chat history regularly for backup
- 2-minute inactivity timer for security
- Manual logout prevents auto-login