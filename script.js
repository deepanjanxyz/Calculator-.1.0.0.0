const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyList = document.getElementById('history-list');

let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function factorial(n) {
    if (n < 0) return "Err";
    if (n > 5000) return "Too Large";
    if (n === 0 || n === 1) return "1";
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) res *= i;
    return res.toString();
}

// ইনপুট হ্যান্ডলার - টাচ এবং ক্লিক দুইটাই সাপোর্ট করবে
function handleInput(val) {
    if (navigator.vibrate) navigator.vibrate(5); // হ্যাপটিক ফিডব্যাক

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
        try {
            let numMatch = currentInput.match(/(\d+)$/);
            if (numMatch) {
                let num = parseInt(numMatch[0]);
                let fact = factorial(num);
                currentInput = currentInput.replace(/(\d+)$/, fact);
                saveToHistory(num + "!", fact);
            }
        } catch (e) { currentInput = "Error"; }
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
        let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        if (expr.includes('√')) expr = expr.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt()');
        expr = expr.replace(/(\d+)%/g, '(/100)');
        
        let res = eval(expr);
        if (res !== undefined && !isNaN(res)) liveResult.innerText = Number.isInteger(res) ? res : res.toFixed(4);
        else liveResult.innerText = "";
    } catch { liveResult.innerText = ""; }
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
    // ফন্ট সাইজ অটো ছোট করার লজিক
    display.innerText = currentInput;
    if (currentInput.length > 10) display.style.fontSize = "2rem";
    else display.style.fontSize = "clamp(2rem, 10vw, 4rem)";
}

function saveToHistory(expr, res) {
    history.unshift({ expr, res });
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

document.getElementById('historyBtn').onclick = () => {
    document.getElementById('history-panel').classList.remove('hidden');
    renderHistory();
};
document.getElementById('closeHistory').onclick = () => document.getElementById('history-panel').classList.add('hidden');
document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
};

function renderHistory() {
    historyList.innerHTML = history.length ? history.map(h => `
        <div class="history-item" onclick="loadFromHistory('${h.res}')">
            <div style="color:#888">${h.expr}</div>
            <div style="color:#ff9f0a;font-weight:bold">= ${h.res}</div>
        </div>
    `).join('') : '<div style="text-align:center;color:#555">No History</div>';
}

window.loadFromHistory = (val) => {
    currentInput = val;
    updateDisplay();
    document.getElementById('history-panel').classList.add('hidden');
}
