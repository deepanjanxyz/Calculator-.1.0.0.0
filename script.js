const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const body = document.body;
const settingsPanel = document.getElementById('settings-panel');
const historyPanel = document.getElementById('history-panel');
const brightnessOverlay = document.getElementById('brightness-overlay');

let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// সেটিংস হ্যান্ডলিং
document.getElementById('settingsBtn').onclick = () => settingsPanel.classList.remove('hidden');
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = () => {
        settingsPanel.classList.add('hidden');
        historyPanel.classList.add('hidden');
    }
});

// থিম ফিক্স
document.getElementById('themeSelect').onchange = (e) => {
    body.className = e.target.value + '-mode';
};

// ব্রাইটনেস লজিক ফিক্স (স্লাইডার বাড়ালে স্ক্রিন পরিষ্কার হবে)
document.getElementById('brightnessRange').oninput = (e) => {
    // স্লাইডার ভ্যালু ০ (অন্ধকার) থেকে ০.৮ (উজ্জ্বল)
    // আমরা অপাসিটি উল্টো করে দেব: ১ - ভ্যালু
    const val = parseFloat(e.target.value);
    brightnessOverlay.style.opacity = 0.8 - val;
};

// কালার পিকার
document.getElementById('colorPicker').oninput = (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
};

// ক্যালকুলেশন লজিক
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => handleInput(e.target.textContent));
});

function handleInput(value) {
    if (value === 'C') { display.textContent = '0'; liveResult.textContent = ''; }
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
        if (display.textContent === '0' || display.textContent === 'Error') display.textContent = value;
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

document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    document.getElementById('history-list').innerHTML = '';
};
