var recognition;
var isListening = false;
var isSpeaking = false;
        
var micButton = document.getElementById('mic-button');
var display = document.getElementById('conversation-display');
var historySidebar = document.getElementById('history-sidebar');

micButton.addEventListener('click', startAssistant);
document.addEventListener('DOMContentLoaded', loadHistoryFromLocalStorage);

const STORAGE_KEY = 'vanguard_chats';
const MAX_HISTORY_ITEMS = 15;



function getHistory() {
    try {
        const history = localStorage.getItem(STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error("Error reading localStorage:", e);
        return [];
    }
}

function saveConversationToLocalStorage(userText, assistantText) {
    const newChat = {
        userQuery: userText,
        assistantReply: assistantText,
        timestamp: new Date().toISOString()
    };

    let history = getHistory();
    history.unshift(newChat);
    
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        loadHistoryFromLocalStorage();
    } catch (e) {
        console.error("Error writing to localStorage:", e);
    }
}

function loadHistoryFromLocalStorage() {
    const history = getHistory();
    historySidebar.innerHTML = '<h3 class="sidebar-title">Recent Chats</h3>';

    if (history.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'Start a conversation to see history!';
        emptyMsg.style.padding = '10px';
        emptyMsg.style.fontSize = '0.9em';
        emptyMsg.style.color = '#969090';
        historySidebar.appendChild(emptyMsg);
        return;
    }

    history.forEach(data => {
        const item = document.createElement('div');
        item.classList.add('history-item');

        const date = new Date(data.timestamp);
        const dateText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        item.innerHTML = `
            <div class="history-prompt">${data.userQuery.substring(0, 30)}...</div>
            <div class="history-date">${dateText}</div>
        `;
        
      
        
        historySidebar.appendChild(item);
    });
}


function addMessage(text, isAssistant = false) {
    var p = document.createElement('p');
    p.textContent = (isAssistant ? 'Vanguard: ' : 'You: ') + text;
    p.classList.add(isAssistant ? 'assistant-message' : 'user-message');
    
    display.append(p); 
    display.scrollTop = display.scrollHeight;
}

function speak(text) {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    
    utterance.onstart = function() {
        isSpeaking = true;
    };
    
    utterance.onend = function() {
        isSpeaking = false;
        micButton.style.backgroundColor = '#fdfdfd';
    };
    
    window.speechSynthesis.speak(utterance);
}

function getSmartResponse(input) {
    const cleanInput = input.toLowerCase().trim();
    let response = "I do not know that yet. Please ask me about the time, date, or my name.";
    
    if (cleanInput.includes('time')) {
        const now = new Date();
        response = "The current time is " + now.toLocaleTimeString() + ".";
    } else if (cleanInput.includes('date')) {
        const today = new Date();
        response = "Today's date is " + today.toLocaleDateString() + ".";
    } else if (cleanInput.includes('hello') || cleanInput.includes('hi')) {
        response = "Hello there! I am Vanguard, ready to assist.";
    } else if (cleanInput.includes('name')) {
        response = "I am called Vanguard Voice Assist. Nice to meet you.";
    } else if (cleanInput.includes('how are you')) {
        response = "I am a computer program, so I am functioning perfectly, thank you!";
    } else if (cleanInput.includes('gemini')) {
        response = "I use simulated intelligence here, but the real Gemini is a powerful large language model created by Google, capable of multimodal reasoning.";
    }
    
    if (response === "I do not know that yet. Please ask me about the time, date, or my name.") {
        response = "That's an interesting topic. To keep things fast, I'm currently limited to simple tasks, but I'll remember you asked about " + input + ".";
    }

    return response;
}

function startAssistant() {
    if (isListening || isSpeaking) {
        if (isSpeaking) window.speechSynthesis.cancel();
        if (isListening) recognition.stop();
        return;
    }

    if (!('webkitSpeechRecognition' in window)) {
        addMessage("Vanguard: Error: Your browser does not support the required Web Speech API for voice input.", true);
        return;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false; 

    isListening = true;
    micButton.style.backgroundColor = 'red';
    
    recognition.onresult = function(event) {
        const userQuery = event.results[0][0].transcript;
        addMessage(userQuery, false);

        const responseText = getSmartResponse(userQuery);

        addMessage(responseText, true);
        
        speak(responseText);

        saveConversationToLocalStorage(userQuery, responseText);
    };

    recognition.onend = function() {
        isListening = false;
        if (!isSpeaking) {
            micButton.style.backgroundColor = '#fdfdfd';
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        
        isListening = false;
        micButton.style.backgroundColor = '#fdfdfd';

        if (event.error === 'not-allowed') {
            const errorMsg = 'Error: Microphone permission was denied. Please check your browser settings and try again.';
            addMessage(errorMsg, true);
            speak(errorMsg);
        } else {
            const errorMsg = 'I had trouble hearing you. Try again!';
            addMessage(errorMsg, true);
            speak(errorMsg);
        }
    };

    recognition.start();
}
