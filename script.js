let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function handleInput(val) {
    const disp = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'C') { currentInput = "0"; live.innerText = ""; }
    else if (val === '←') { currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0"; calculateLive(); }
    else if (val === '=') { finalize(); }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    disp.innerText = currentInput;
}

function calculateLive() {
    try {
        let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let res = eval(expr);
        document.getElementById('live-result').innerText = (res !== undefined) ? "= " + res : "";
    } catch { document.getElementById('live-result').innerText = ""; }
}

function finalize() {
    const res = document.getElementById('live-result').innerText.replace("= ", "");
    if(res) {
        history.unshift(currentInput + " = " + res);
        currentInput = res;
        document.getElementById('live-result').innerText = "";
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }
}

function updateBrightness(v) {
    document.getElementById('app-overlay').style.backgroundColor = `rgba(0,0,0,${1 - v/100})`;
}

function toggleScreen(id) {
    const s = document.getElementById(id);
    s.style.display = (s.style.display === 'flex') ? 'none' : 'flex';
    s.style.flexDirection = 'column';
    if(id === 'history-screen') renderHistory();
}

function renderHistory() {
    document.getElementById('history-list').innerHTML = history.map(h => `<div style="padding:15px; border-bottom:1px solid #333; text-align:right;">${h}</div>`).join('');
}
