var recognition;
var isListening = false;
        
var micButton = document.getElementById('mic-button');
var display = document.getElementById('conversation-display');

function addMessage(text, isAssistant = false) {
    var p = document.createElement('p');
    p.textContent = (isAssistant ? 'Vanguard: ' : 'You: ') + text;
    p.classList.add(isAssistant ? 'assistant-message' : 'user-message');
    
    display.append(p); 
    display.scrollTop = display.scrollHeight;
}

function startAssistant() {
    if (isListening) {
        recognition.stop();
        return;
    }

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false; 

        isListening = true;
        micButton.style.backgroundColor = 'red';
        
        recognition.onresult = function(event) {
            var speechResult = event.results[0][0].transcript;
            addMessage(speechResult, false);

            var response = "I do not know that yet. Please ask me about the time, date, or my name.";
            var cleanInput = speechResult.toLowerCase().trim();

            if (cleanInput.includes('hello') || cleanInput.includes('hi')) {
                response = "Hello there! I am Vanguard, ready to assist!";
            } else if (cleanInput.includes('time')) {
                var now = new Date();
                response = "The current time is " + now.toLocaleTimeString() + ".";
            } else if (cleanInput.includes('date')) {
                var today = new Date();
                response = "Today's date is " + today.toLocaleDateString() + ".";
            } else if (cleanInput.includes('name')) {
                response = "I am called Vanguard Voice Assist! Nice to meet you.";
            } else if (cleanInput.includes('how are you')) {
                response = "I am a computer program, so I am functioning perfectly, thank you!";
            }

            addMessage(response, true);
        };

        recognition.onend = function() {
            isListening = false;
            micButton.style.backgroundColor = '#00ffff';
            console.log('Listening stopped.');
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            
            isListening = false;
            micButton.style.backgroundColor = '#00ffff'; 

            if (event.error === 'not-allowed') {
                addMessage('Error: Microphone permission was denied. Please check your browser settings and try again.', true);
            } else {
                addMessage('I had trouble hearing you. Try again!', true);
            }
        };

        recognition.start();
        console.log('Attempting to start listening...');

    } else {
        addMessage("Vanguard: Error: Your browser does not support the required Web Speech API for voice input.", true);
    }
}
