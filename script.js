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

// ভয়েস আউটপুট ফাংশন
function speakResult(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    speechSynthesis.speak(utterance);
}

// ভয়েস কমান্ড প্রসেস করার আসল জায়গা
function processVoiceCommand(text) {
    // অগোছালো শব্দ আর স্পেস পরিষ্কার করা
    let cleanText = text.replace(/ /g, ''); 
    
    let mathExpr = cleanText.toLowerCase()
        .replace(/যোগ|প্লাস/g, '+')
        .replace(/বিয়োগ|বিয়োগ|মাইনাস/g, '-')
        .replace(/গুণ|গুন|মাল্টিপ্লাই/g, '*')
        .replace(/ভাগ/g, '/')
        .replace(/x/g, '*');

    // বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর (যাতে হিসাব করতে সুবিধা হয়)
    const numbers = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    for (let bn in numbers) {
        mathExpr = mathExpr.replace(new RegExp(bn, 'g'), numbers[bn]);
    }

    // শুধুমাত্র সংখ্যা আর অপারেটর ছাড়া বাকি সব ফেলে দেওয়া (এরর ঠেকানোর জন্য)
    mathExpr = mathExpr.replace(/[^0-9+\-*/.]/g, '');
    
    try {
        if(mathExpr === "") throw "Empty";
        const result = eval(mathExpr);
        display.textContent = result;
        speakResult("উত্তর হলো " + result);
    } catch {
        display.textContent = 'আবার বলুন';
        speakResult('ঠিকমতো শুনতে পাইনি, আবার বলুন');
    }
}

// বাটন ক্লিক হ্যান্ডলার
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
            // গুণ আর ভাগের চিহ্নগুলো ঠিক করে নেওয়া
            let expression = display.textContent.replace(/×/g, '*').replace(/÷/g, '/').replace(/x/g, '*');
            const result = eval(expression);
            display.textContent = result;
            speakResult(result.toString());
        } catch {
            display.textContent = 'ভুল';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.slice(0, -1) || '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'ভুল') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}

speakBtn.addEventListener('click', () => {
    speakResult(display.textContent);
});
