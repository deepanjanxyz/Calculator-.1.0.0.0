const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function handleInput(val) {
    if (val === 'C') {
        currentInput = "0";
        liveResult.innerText = "";
    } 
    else if (val === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        calculateLive();
    } 
    else if (val === '=') {
        if (liveResult.innerText && liveResult.innerText !== "") {
            saveToHistory(currentInput, liveResult.innerText);
            currentInput = liveResult.innerText;
            liveResult.innerText = "";
        }
    }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    display.innerText = currentInput;
}

function calculateLive() {
    try {
        let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let res = eval(expr);
        if (res !== undefined && !isNaN(res)) liveResult.innerText = res;
        else liveResult.innerText = "";
    } catch { liveResult.innerText = ""; }
}

function saveToHistory(expr, res) {
    history.unshift({ expr, res });
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div style="font-size: 0.9rem; color: #888;">${item.expr}</div>
            <div style="font-size: 1.2rem; color: white;">= ${item.res}</div>
        </div>
    `).join('');
}

// ইভেন্ট লিসেনারস (ফাস্ট রেসপন্স)
document.querySelectorAll('.btn, .tool-btn').forEach(button => {
    button.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        let val = button.getAttribute('data-val') || button.innerText.replace('🕒 History', '');
        if(val) handleInput(val);
    });
});

document.getElementById('history-btn').addEventListener('click', () => {
    renderHistory();
    historyPanel.classList.remove('hidden');
});

document.getElementById('close-history').addEventListener('click', () => {
    historyPanel.classList.add('hidden');
});

document.getElementById('clear-history').addEventListener('click', () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
});
