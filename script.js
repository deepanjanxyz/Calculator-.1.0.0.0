let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

const disp = document.getElementById('display');
const live = document.getElementById('live-result');

function handleInput(val) {
    if (val === 'C') { currentInput = "0"; live.innerText = ""; }
    else if (val === '=') { finalize(); }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val.replace('×', '*').replace('÷', '/');
        calculateLive();
    }
    disp.innerText = currentInput.replace(/\*/g, '×').replace(/\//g, '÷');
}

function calculateLive() {
    try {
        let res = eval(currentInput);
        live.innerText = (res !== undefined && isFinite(res)) ? "= " + res : "";
    } catch { live.innerText = ""; }
}

function finalize() {
    const res = live.innerText.replace("= ", "");
    if(res) {
        history.unshift(currentInput.replace(/\*/g, '×').replace(/\//g, '÷') + " = " + res);
        currentInput = res;
        live.innerText = "";
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }
}

function updateBrightness(v) {
    document.getElementById('app-overlay').style.backgroundColor = `rgba(0,0,0,${1 - v/100})`;
}

function toggleScreen(id) {
    const s = document.getElementById(id);
    s.classList.toggle('hidden');
    if(id === 'history-screen') {
        document.getElementById('history-list').innerHTML = history.slice(0, 20).map(h => `<div class="h-item">${h}</div>`).join('');
    }
}
