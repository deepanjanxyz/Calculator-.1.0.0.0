const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function saveHistory(expr, res) {
    history.unshift({ expr, res });
    if (history.length > 50) history.pop(); // সর্বোচ্চ ৫০টি হিস্ট্রি রাখবে
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div>${item.expr}</div><div style="color:#00d2d3">= ${item.res}</div>`;
        div.onclick = () => {
            display.textContent = item.res;
            historyPanel.classList.add('hidden');
        };
        historyList.appendChild(div);
    });
}

document.getElementById('historyBtn').onclick = () => {
    renderHistory();
    historyPanel.classList.remove('hidden');
};

document.getElementById('closeHistory').onclick = () => historyPanel.classList.add('hidden');

document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
};

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => handleInput(e.target.textContent));
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
        liveResult.textContent = '';
    } else if (value === '=') {
        if (liveResult.textContent !== '' && liveResult.textContent !== 'Error') {
            saveHistory(display.textContent, liveResult.textContent);
            display.textContent = liveResult.textContent;
            liveResult.textContent = '';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
        updateLiveResult();
    } else {
        if (display.textContent === '0') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let expr = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
        if (/[0-9!]$/.test(expr)) {
            let res = eval(expr);
            liveResult.textContent = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch { liveResult.textContent = ''; }
}

renderHistory();
