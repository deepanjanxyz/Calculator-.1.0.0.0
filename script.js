let currentInput = "0";
let history = [];

function handleInput(val) {
    const display = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'C') {
        currentInput = "0";
        live.innerText = "";
    } else if (val === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        calculateLive();
    } else if (val === '=') {
        if (live.innerText) {
            history.unshift(currentInput + " = " + live.innerText);
            currentInput = live.innerText;
            live.innerText = "";
        }
    } else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    display.innerText = currentInput;
}

function calculateLive() {
    try {
        let res = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/'));
        document.getElementById('live-result').innerText = res !== undefined ? res : "";
    } catch { document.getElementById('live-result').innerText = ""; }
}

function showHistory() {
    const panel = document.getElementById('history-panel');
    const list = document.getElementById('history-list');
    list.innerHTML = history.map(h => `<div style="padding:10px; border-bottom:1px solid #222;">${h}</div>`).join('');
    panel.style.display = 'flex';
}

function hideHistory() {
    document.getElementById('history-panel').style.display = 'none';
}
