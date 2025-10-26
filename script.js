// A very new coder's first JS script!

// Step 1: Find the important spots on the HTML page.
// We use document.getElementById to grab things by their unique ID.
let theForm = document.getElementById('commandForm');
let theOutputArea = document.getElementById('output');
let theInputField = document.getElementById('commandInput');

// Step 2: Set up the welcome message for when the page loads.
// We store it in a variable so we can use it again later (for 'clear').
let startingMessage = '<p>Assistant: Ready! Type TIME, YEAR, DATE, or CLEAR.</p>';
theOutputArea.innerHTML = startingMessage;

// Step 3: Tell the form what function to run when the user clicks 'Send'.
theForm.addEventListener('submit', runMyAssistant);

// Step 4: This is the main function that does everything!
function runMyAssistant(event) {
    
    // Stop the website from refreshing! This is important for forms.
    event.preventDefault();

    // Get what the user typed.
    let userInputText = theInputField.value;

    // Convert the input to lowercase and remove spaces at the ends.
    // This makes sure 'Time', 'TIME', and 'time ' all work.
    let cleanCommand = userInputText.trim().toLowerCase();
    
    // Make the input box empty again for the next command.
    theInputField.value = '';

    // We need variables to hold the final messages.
    let messageForUser = `<strong>User:</strong> ${userInputText}`; // Use the original text here!
    let messageForAssistant = '';
    
    // -------------------------------------------------------------------
    // CHECKING ALL THE POSSIBLE COMMANDS
    
    // First, check for the special command: 'clear'
    if (cleanCommand === 'clear') {
        // If it's 'clear', just reset the output area to the starting message.
        theOutputArea.innerHTML = startingMessage;
        
        // Use 'return' to stop the function right here, so we don't run the rest of the code.
        return; 
    }

    // Next, check for 'time'
    else if (cleanCommand === 'time') {
        // We have to make a new Date object every time to get the current moment.
        let now = new Date();
        
        // This method gets the time nicely formatted.
        let theCurrentTime = now.toLocaleTimeString(); 
        
        messageForAssistant = 'The exact time right now is ' + theCurrentTime + '.';
    }

    // Next, check for 'date'
    else if (cleanCommand === 'date') {
        let now = new Date();
        
        // This method gets the day, month, and day number.
        let theCurrentDate = now.toLocaleDateString(); 
        
        messageForAssistant = 'Today\'s date (month/day/year) is ' + theCurrentDate + '.';
    }

    // Next, check for 'year'
    else if (cleanCommand === 'year') {
        let now = new Date();
        
        // This method gets just the four-digit year.
        let theCurrentYear = now.getFullYear();
        
        messageForAssistant = 'We are currently in the year ' + theCurrentYear + '.';
    }
    
    // If none of the above commands were typed, run this last 'else'.
    else {
        messageForAssistant = 'I don\'t know that command. Please try TIME, DATE, YEAR, or CLEAR.';
    }

    // -------------------------------------------------------------------
    
    // Step 5: Put the final result onto the screen.
    // We overwrite the whole area with the new user input and the assistant's response.
    theOutputArea.innerHTML = `
        <p>${messageForUser}</p>
        <p><strong>Assistant:</strong> ${messageForAssistant}</p>
    `;
}