const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyList = document.getElementById('history-list');

let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ফ্যাক্টোরিয়াল ফাংশন (The Monster Fix)
function factorial(n) {
    if (n < 0) return "Err";
    if (n > 5000) return "Too Large"; // সেফটি লিমিট
    if (n === 0 || n === 1) return "1";
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) res *= i;
    return res.toString();
}

// ইনপুট হ্যান্ডলার
function handleInput(val) {
    // ভাইব্রেশন (Haptic Feedback)
    if (navigator.vibrate) navigator.vibrate(5);

    if (val === 'C') {
        currentInput = "0";
        liveResult.innerText = "";
    } 
    else if (val === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        calculateLive();
    } 
    else if (val === '=') {
        finalizeCalculation();
    }
    else if (val === '!') {
        // ফ্যাক্টোরিয়াল হ্যান্ডলিং
        try {
            // ডিসপ্লেতে এখন যে সংখ্যাটা আছে সেটার ফ্যাক্টোরিয়াল বের করবে
            let numMatch = currentInput.match(/(\d+)$/);
            if (numMatch) {
                let num = parseInt(numMatch[0]);
                let fact = factorial(num);
                // পুরো ইনপুট রিপ্লেস না করে শুধু শেষের সংখ্যাটা রিপ্লেস হবে না, রেজাল্ট দেখাবে
                currentInput = fact;
                saveToHistory(num + "!", fact);
            }
        } catch (e) {
            currentInput = "Error";
        }
    }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    
    updateDisplay();
}

function calculateLive() {
    try {
        let expr = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');
        
        // রুটের লজিক
        if (expr.includes('√')) {
             expr = expr.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt()');
        }

        // পারসেন্টেজ
        expr = expr.replace(/(\d+)%/g, '(/100)');

        let res = eval(expr);
        if (res !== undefined && !isNaN(res)) {
            liveResult.innerText = Number.isInteger(res) ? res : res.toFixed(4);
        } else {
            liveResult.innerText = "";
        }
    } catch (e) {
        liveResult.innerText = "";
    }
}

function finalizeCalculation() {
    if (liveResult.innerText && liveResult.innerText !== "") {
        saveToHistory(currentInput, liveResult.innerText);
        currentInput = liveResult.innerText;
        liveResult.innerText = "";
        updateDisplay();
    }
}

function updateDisplay() {
    display.innerText = currentInput;
}

// হিস্ট্রি লজিক
function saveToHistory(expr, res) {
    history.unshift({ expr, res });
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

document.getElementById('historyBtn').onclick = () => {
    document.getElementById('history-panel').classList.remove('hidden');
    renderHistory();
};

document.getElementById('closeHistory').onclick = () => {
    document.getElementById('history-panel').classList.add('hidden');
};

document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
};

function renderHistory() {
    historyList.innerHTML = history.length ? history.map(h => `
        <div class="history-item" onclick="loadFromHistory('${h.res}')">
            <div class="history-expr">${h.expr}</div>
            <div class="history-res">= ${h.res}</div>
        </div>
    `).join('') : '<div style="text-align:center; padding:20px; color:#555;">No History Yet</div>';
}

window.loadFromHistory = (val) => {
    currentInput = val;
    updateDisplay();
    document.getElementById('history-panel').classList.add('hidden');
}
