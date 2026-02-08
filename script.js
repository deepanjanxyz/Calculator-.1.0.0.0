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

function handleInput(val) {
    // ভাইব্রেশন কোড সরিয়ে ফেলা হলো
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
    display.innerText = currentInput;
    display.style.fontSize = currentInput.length > 10 ? "2.5rem" : "clamp(3rem, 12vw, 5.5rem)";
}

function saveToHistory(expr, res) {
    history.unshift({ expr, res });
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}
// হিস্ট্রি প্যানেল লজিক আগের মতোই থাকবে...
