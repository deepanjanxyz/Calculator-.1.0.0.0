const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const body = document.body;

// সেটিংস এলিমেন্ট
const settingsPanel = document.getElementById('settings-panel');
const brightnessOverlay = document.getElementById('brightness-overlay');

// ডেটা লোড
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// সেটিংস ওপেন/ক্লোজ
document.getElementById('settingsBtn').onclick = () => settingsPanel.classList.remove('hidden');
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = () => {
        settingsPanel.classList.add('hidden');
        document.getElementById('history-panel').classList.add('hidden');
    }
});

// থিম পরিবর্তন
document.getElementById('themeSelect').onchange = (e) => {
    body.className = e.target.value + '-mode';
};

// ব্রাইটনেস পরিবর্তন
document.getElementById('brightnessRange').oninput = (e) => {
    brightnessOverlay.style.opacity = e.target.value;
};

// বাটন কালার পরিবর্তন
document.getElementById('colorPicker').oninput = (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
};

// বাকি ক্যালকুলেটর লজিক (আগের মতোই)
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
        if (display.textContent === '0') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let text = display.textContent.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**').replace(/√/g, 'Math.sqrt');
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
    list.innerHTML = history.map(h => `<div class="history-item">${h.expr} = ${h.res}</div>`).join('');
    document.getElementById('history-panel').classList.remove('hidden');
};
