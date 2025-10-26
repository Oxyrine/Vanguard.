let theForm = document.getElementById('commandForm');
let theOutputArea = document.getElementById('output');
let theInputField = document.getElementById('commandInput');

let startingMessage = '<p>Assistant: Ready! Type TIME, YEAR, DATE, or CLEAR.</p>';
theOutputArea.innerHTML = startingMessage;

theForm.addEventListener('submit', runMyAssistant);

function runMyAssistant(event) {
    event.preventDefault();

    let userInputText = theInputField.value;
    let cleanCommand = userInputText.trim().toLowerCase();
    theInputField.value = '';

    let messageForUser = `<strong>User:</strong> ${userInputText}`;
    let messageForAssistant = '';

    if (cleanCommand === 'clear') {
        theOutputArea.innerHTML = startingMessage;
        return; 
    }
    else if (cleanCommand === 'time') {
        let now = new Date();
        let theCurrentTime = now.toLocaleTimeString(); 
        messageForAssistant = 'The exact time right now is ' + theCurrentTime + '.';
    }
    else if (cleanCommand === 'date') {
        let now = new Date();
        let theCurrentDate = now.toLocaleDateString(); 
        messageForAssistant = 'Today\'s date (month/day/year) is ' + theCurrentDate + '.';
    }
    else if (cleanCommand === 'year') {
        let now = new Date();
        let theCurrentYear = now.getFullYear();
        messageForAssistant = 'We are currently in the year ' + theCurrentYear + '.';
    }
    else {
        messageForAssistant = 'I don\'t know that command. Please try TIME, DATE, YEAR, or CLEAR.';
    }

    theOutputArea.innerHTML = `
        <p>${messageForUser}</p>
        <p><strong>Assistant:</strong> ${messageForAssistant}</p>
    `;
}
