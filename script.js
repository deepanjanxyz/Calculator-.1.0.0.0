const display = document.getElementById('display');
const voiceBtn = document.getElementById('voiceBtn');
const speakBtn = document.getElementById('speakBtn');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'bn-IN';
    
    recognition.onstart = () => {
        voiceBtn.textContent = '🔴';
        voiceBtn.classList.add('recording');
    };
    
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        display.textContent = command;
        processVoiceCommand(command);
    };
    
    recognition.onend = () => {
        voiceBtn.textContent = '🎤';
        voiceBtn.classList.remove('recording');
    };
    
    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });
}

function processVoiceCommand(text) {
    try {
        const result = eval(text.replace(/x/g, '*'));
        display.textContent = result;
    } catch {
        display.textContent = 'Error';
    }
}

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.textContent;
        if(value === 'C') display.textContent = '0';
        else if(value === '=') display.textContent = eval(display.textContent.replace(/x/g, '*'));
        else display.textContent === '0' ? display.textContent = value : display.textContent += value;
    });
});
