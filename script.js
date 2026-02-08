const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const body = document.body;

let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function factorial(n) {
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return 1n;
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) res *= i;
    return res;
}

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => handleInput(button.innerText));
});

function handleInput(value) {
    if (value === 'C') {
        display.innerText = '0';
        liveResult.innerText = '';
    } else if (value === '←') {
        display.innerText = display.innerText.length > 1 ? display.innerText.slice(0, -1) : '0';
        updateLiveResult();
    } else if (value === '!') {
        let num = parseInt(display.innerText);
        if (!isNaN(num)) {
            let res = factorial(num).toString();
            saveHistory(display.innerText + "!", res);
            display.innerText = res;
            liveResult.innerText = '';
        }
    } else if (value === '=') {
        if (liveResult.innerText && liveResult.innerText !== 'Error') {
            saveHistory(display.innerText, liveResult.innerText);
            display.innerText = liveResult.innerText;
            liveResult.innerText = '';
        }
    } else {
        if (display.innerText === '0') display.innerText = value;
        else display.innerText += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let text = display.innerText.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        if (text.includes('√')) {
            text = text.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt()');
        }
        let res = eval(text);
        if (res !== undefined) {
            liveResult.innerText = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch {
        liveResult.innerText = '';
    }
}

function saveHistory(expr, res) {
    history.unshift({ expr, res });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
}

// Settings and History panels (basic toggle)
document.getElementById('settingsBtn').onclick = () => document.getElementById('settings-panel').classList.remove('hidden');
document.getElementById('historyBtn').onclick = () => {
    const list = document.getElementById('history-list');
    list.innerHTML = history.map(h => `<div style="padding:10px;border-bottom:1px solid #333;">${h.expr} = ${h.res}</div>`).join('');
    document.getElementById('history-panel').classList.remove('hidden');
};
document.querySelectorAll('.close-btn').forEach(btn => btn.onclick = () => {
    document.getElementById('settings-panel').classList.add('hidden');
    document.getElementById('history-panel').classList.add('hidden');
});
