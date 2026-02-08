const display = document.getElementById('display');
const title = document.getElementById('title');
const langSelect = document.getElementById('langSelect');

const translations = {
    en: { title: "Calculator", error: "Error" },
    bn: { title: "ক্যালকুলেটর", error: "ভুল" },
    hi: { title: "कैलकुलेटर", error: "त्रुटि" },
    ta: { title: "கணினி", error: "பிழை" },
    te: { title: "క్యాలిక్యులేటర్", error: "లోపం" },
    mr: { title: "कॅल्क्युलेटर", error: "त्रुटी" },
    gu: { title: "કેલ્ક્યુલેટર", error: "ભૂલ" },
    kn: { title: "ಕ್ಯಾಲ್ಕುಲೇಟರ್", error: "ದೋಷ" },
    ml: { title: "കാൽക്കുലേറ്റർ", error: "പിശക്" },
    pa: { title: "ਕੈਲਕੁਲੇਟਰ", error: "ਗਲਤੀ" },
    ur: { title: "کیلکولیٹر", error: "غلطی" }
};

let currentLang = 'bn';

langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    title.textContent = translations[currentLang].title;
});

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.textContent);
    });
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
    } else if (value === '=') {
        try {
            let expression = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(expression);
            display.textContent = Number.isInteger(result) ? result : result.toFixed(5);
        } catch {
            display.textContent = translations[currentLang].error;
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
    } else {
        if (display.textContent === '0' || Object.values(translations).some(t => t.error === display.textContent)) {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}
