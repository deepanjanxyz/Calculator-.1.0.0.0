let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme + "-mode";
    updateBrightness(localStorage.getItem('brightness') || 100);
};

function updateBrightness(val) {
    const b = val / 100;
    document.getElementById('app-overlay').style.backgroundColor = `rgba(0,0,0,${1 - b})`;
    localStorage.setItem('brightness', val);
}

function handleInput(val) {
    const display = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'C') { currentInput = "0"; live.innerText = ""; }
    else if (val === '←') { currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0"; calculateLive(); }
    else if (val === '=') { finalize(); }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    display.innerText = currentInput;
}

function calculateLive() {
    try {
        let res = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/'));
        document.getElementById('live-result').innerText = (res !== undefined && res !== Infinity) ? res : "";
    } catch { document.getElementById('live-result').innerText = ""; }
}

function finalize() {
    const res = document.getElementById('live-result').innerText;
    if(res) {
        history.unshift(currentInput + " = " + res);
        currentInput = res;
        document.getElementById('live-result').innerText = "";
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }
}

function toggleScreen(id) { document.getElementById(id).classList.toggle('hidden'); if(id==='history-screen') renderHistory(); }
function renderHistory() { document.getElementById('history-list').innerHTML = history.map(h => `<div class="history-item">${h}</div>`).join(''); }
function clearHistory() { history = []; localStorage.removeItem('calcHistory'); renderHistory(); }
