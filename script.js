const display = document.getElementById('display');
const title = document.getElementById('title');
const langSelect = document.getElementById('langSelect');

const translations = {
    en: { title: "Calculator", error: "Error", limit: "Limit: 100k" },
    bn: { title: "ক্যালকুলেটর", error: "ভুল", limit: "সীমা: ১ লাখ" },
    hi: { title: "कैलकुलेटर", error: "त्रुटि", limit: "सीमा: 1 लाख" }
    // বাকিগুলো একইভাবে কাজ করবে...
};

let currentLang = 'bn';

langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    title.textContent = translations[currentLang]?.title || "Calculator";
});

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.textContent);
    });
});

function factorial(n) {
    if (n < 0) return "Error";
    if (n > 100000) return translations[currentLang].limit;
    if (n === 0 || n === 1) return 1;
    
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) {
        res *= BigInt(i);
    }
    return res.toString();
}

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
    } else if (value === '!') {
        let num = parseInt(display.textContent);
        display.textContent = factorial(num);
    } else if (value === '=') {
        try {
            let expression = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(expression);
            display.textContent = Number.isInteger(result) ? result : result.toFixed(5);
        } catch {
            display.textContent = translations[currentLang]?.error || "Error";
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'ভুল' || display.textContent === 'Error') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}
