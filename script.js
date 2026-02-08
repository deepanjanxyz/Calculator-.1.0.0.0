const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ফ্যাক্টোরিয়াল লজিক
function getFactorial(n) {
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return 1n;
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) res *= i;
    return res.toString();
}

document.querySelectorAll('.button').forEach(btn => {
    btn.onclick = () => {
        let val = btn.innerText;
        if (val === 'C') {
            display.innerText = '0';
            liveResult.innerText = '';
        } else if (val === '←') {
            display.innerText = display.innerText.length > 1 ? display.innerText.slice(0, -1) : '0';
            updateLive();
        } else if (val === '=') {
            if (liveResult.innerText && liveResult.innerText !== 'Error') {
                saveHistory(display.innerText, liveResult.innerText);
                display.innerText = liveResult.innerText;
                liveResult.innerText = '';
            }
        } else {
            if (display.innerText === '0') display.innerText = val;
            else display.innerText += val;
            updateLive();
        }
    };
});

function updateLive() {
    try {
        let text = display.innerText.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        if (text.includes('√')) text = text.replace(/√(\d+)/g, 'Math.sqrt()');
        let res = eval(text);
        if (res !== undefined) {
            liveResult.innerText = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch { liveResult.innerText = ''; }
}

// FACT বাটন ইভেন্ট
document.getElementById('factMode').onclick = () => {
    let n = parseInt(display.innerText);
    if (!isNaN(n)) {
        let res = getFactorial(n);
        saveHistory(n + "!", res);
        display.innerText = res;
        liveResult.innerText = '';
    }
};

// প্যানেল কন্ট্রোল
document.getElementById('historyBtn').onclick = () => {
    document.getElementById('history-list').innerHTML = history.map(h => `<div class="history-item"><div>${h.expr}</div><div style="color:#3498db">= ${h.res}</div></div>`).join('');
    document.getElementById('history-panel').classList.remove('hidden');
};
document.querySelectorAll('.close-btn').forEach(btn => btn.onclick = () => {
    document.getElementById('history-panel').classList.add('hidden');
});

function saveHistory(expr, res) {
    history.unshift({ expr, res });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
}
