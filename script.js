const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function calculateFactorial(n) {
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return "1";
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res.toString();
}

function saveHistory(expr, res) {
    if (!expr || !res || res === "Error") return;
    history.unshift({ expr, res });
    if (history.length > 50) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<div style="color:gray;padding:10px;">No History</div>';
        return;
    }
    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div>${item.expr}</div><div style="color:#00d2d3">= ${item.res}</div>`;
        div.onclick = () => {
            display.textContent = item.res;
            historyPanel.classList.add('hidden');
            updateLiveResult();
        };
        historyList.appendChild(div);
    });
}

document.getElementById('historyBtn').onclick = () => {
    renderHistory();
    historyPanel.classList.toggle('hidden');
};

document.getElementById('closeHistory').onclick = () => historyPanel.classList.add('hidden');
document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
};

document.getElementById('factMode').onclick = () => {
    let num = prompt("Factorial of:");
    if (num && !isNaN(num)) {
        let res = calculateFactorial(parseInt(num));
        display.textContent = res;
        saveHistory(num + "!", res);
    }
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
        if (display.textContent === '0' || display.textContent === 'Error') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let text = display.textContent
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**') // Power
            .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt()') // Square root
            .replace(/(\d+)%/g, '(/100)'); // Percentage

        // Special case for √ before a number
        if (text.includes('√')) {
            text = text.replace(/√/g, 'Math.sqrt');
        }

        let res = eval(text);
        if (res !== undefined) {
            liveResult.textContent = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch {
        liveResult.textContent = '';
    }
}

renderHistory();
