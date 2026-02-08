let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function handleInput(val) {
    const disp = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'C') { currentInput = "0"; live.innerText = ""; }
    else if (val === '=') { finalize(); }
    else {
        if (currentInput === "0" && val !== '.') currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    disp.innerText = currentInput.replace(/\*/g, '×').replace(/\//g, '÷');
}

function calculateLive() {
    try {
        let res = eval(currentInput);
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

// সেটিংস ও হিস্ট্রি ফাংশন (এবার গ্যারান্টি কাজ করবে)
function openSettings() { document.getElementById('settings-screen').classList.remove('hidden'); }
function closeSettings() { document.getElementById('settings-screen').classList.add('hidden'); }
function openHistory() { 
    document.getElementById('history-screen').classList.remove('hidden'); 
    document.getElementById('history-list').innerHTML = history.map(h => `<div class="h-item">${h}</div>`).join('');
}
function closeHistory() { document.getElementById('history-screen').classList.add('hidden'); }

function updateBrightness(v) {
    document.getElementById('app-overlay').style.backgroundColor = `rgba(0,0,0,${1 - v/100})`;
}
