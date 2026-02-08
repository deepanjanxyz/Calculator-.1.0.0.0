const display = document.getElementById('display');
const voiceBtn = document.getElementById('voiceBtn');
const speakBtn = document.getElementById('speakBtn');

// ভয়েস ইনপুট সেটআপ
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'bn-BD';
    
    recognition.onstart = () => {
        voiceBtn.textContent = '🔴';
        voiceBtn.classList.add('recording');
    };
    
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
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

// ভয়েস আউটপুট ফাংশন (স্পিকার ফাটিয়ে দেওয়ার জন্য!)
function speakResult(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}

// ভয়েস কমান্ড প্রসেস এবং হিসাব
function processVoiceCommand(text) {
    let mathExpr = text.toLowerCase()
        .replace(/যোগ|প্লাস/g, '+')
        .replace(/বিয়োগ|বিয়োগ|মাইনাস/g, '-')
        .replace(/গুণ|গুন|মাল্টিপ্লাই/g, '*')
        .replace(/ভাগ/g, '/')
        .replace(/x/g, '*');

    // বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর
    const numbers = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    for (let bn in numbers) {
        mathExpr = mathExpr.replace(new RegExp(bn, 'g'), numbers[bn]);
    }
    
    try {
        const result = eval(mathExpr);
        display.textContent = result;
        speakResult("উত্তর হলো " + result);
    } catch {
        display.textContent = 'ভুল হয়েছে';
        speakResult('আবার বলুন');
    }
}

// বাটন ক্লিক হ্যান্ডলার (সাধারণ হিসাবের জন্য)
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.textContent;
        handleInput(value);
    });
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
    } else if (value === '=') {
        try {
            const result = eval(display.textContent.replace(/×/g, '*').replace(/÷/g, '/').replace(/x/g, '*'));
            display.textContent = result;
            speakResult(result.toString());
        } catch {
            display.textContent = 'Error';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.slice(0, -1) || '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'Error') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}

// স্পিকার বাটন টিপলে ডিসপ্লের লেখা পড়বে
speakBtn.addEventListener('click', () => {
    speakResult(display.textContent);
});
