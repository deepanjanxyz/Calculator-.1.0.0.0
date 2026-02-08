const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const body = document.body;
const settingsPanel = document.getElementById('settings-panel');
const historyPanel = document.getElementById('history-panel');
const brightnessOverlay = document.getElementById('brightness-overlay');

let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ফ্যাক্টোরিয়াল ক্যালকুলেটর ফাংশন
function factorial(n) {
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return "1";
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res.toString();
}

// সেটিংস কন্ট্রোল
document.getElementById('settingsBtn').onclick = () => settingsPanel.classList.remove('hidden');
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = () => {
        settingsPanel.classList.add('hidden');
        historyPanel.classList.add('hidden');
    }
});

document.getElementById('themeSelect').onchange = (e) => body.className = e.target.value + '-mode';

// ব্রাইটনেস লজিক (০ = অন্ধকার, ১ = উজ্জ্বল)
document.getElementById('brightnessRange').oninput = (e) => {
    const val = parseFloat(e.target.value);
    // অপাসিটি ১ মানে পুরা কালা, ০ মানে পুরা আলো
    brightnessOverlay.style.opacity = 1 - val;
};

document.getElementById('colorPicker').oninput = (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
};

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => handleInput(e.target.textContent));
});

function handleInput(value) {
    if (value === 'C') { display.textContent = '0'; liveResult.textContent = ''; }
    else if (value === '!') {
        let n = parseInt(display.textContent);
        if(!isNaN(n)) {
            let res = factorial(n);
            saveHistory(n + "!", res);
            display.textContent = res;
            liveResult.textContent = '';
        }
    }
    else if (value === '=') {
        if (liveResult.textContent && liveResult.textContent !== 'Error') {
            saveHistory(display.textContent, liveResult.textContent);
            display.textContent = liveResult.textContent;
            liveResult.textContent = '';
        }
    }
    else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
        updateLiveResult();
    }
    else {
        if (display.textContent === '0') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let text = display.textContent.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        if (text.includes('√')) {
            text = text.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt()');
        }
        let res = eval(text);
        if (res !== undefined) liveResult.textContent = Number.isInteger(res) ? res : res.toFixed(4);
    } catch { liveResult.textContent = ''; }
}

function saveHistory(expr, res) {
    history.unshift({ expr, res });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
}

document.getElementById('historyBtn').onclick = () => {
    const list = document.getElementById('history-list');
    list.innerHTML = history.map(h => `<div class="history-item"><div>${h.expr}</div><div style="color:var(--primary-color)">= ${h.res}</div></div>`).join('');
    historyPanel.classList.remove('hidden');
};
