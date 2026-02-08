let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ১. থিম ও ব্রাইটনেস ইনিশিয়ালাইজেশন
window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    changeTheme(savedTheme);
    document.getElementById('theme-select').value = savedTheme;
    
    const savedBrightness = localStorage.getItem('brightness') || 100;
    updateBrightness(savedBrightness);
    document.getElementById('brightness-slider').value = savedBrightness;
};

// ২. ব্রাইটনেস লজিক ফিক্স (0.1 - 1.0 range)
function updateBrightness(val) {
    const opacity = val / 100;
    const clampedOpacity = Math.max(0.1, Math.min(1, 1 - opacity)); 
    document.getElementById('app-overlay').style.background = `rgba(0,0,0,${clampedOpacity})`;
    localStorage.setItem('brightness', val);
}

// ৩. থিম সেভ করা
function changeTheme(theme) {
    document.body.className = theme + "-mode";
    localStorage.setItem('theme', theme);
}

// ৪. ক্যালকুলেশন লজিক ও এজ কেস
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
        finalizeResult();
    } else {
        // Continuous operator check (like ++ or *+)
        const lastChar = currentInput.slice(-1);
        const ops = ['+', '-', '*', '/', '.'];
        if (ops.includes(val) && ops.includes(lastChar)) {
            currentInput = currentInput.slice(0, -1) + val;
        } else {
            if (currentInput === "0" && !isNaN(val)) currentInput = val;
            else currentInput += val;
        }
        calculateLive();
    }
    display.innerText = currentInput;
}

function calculateLive() {
    try {
        let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        // Zero division check
        if (expr.includes('/0')) {
            document.getElementById('live-result').innerText = "Can't divide by 0";
            return;
        }
        let res = eval(expr);
        document.getElementById('live-result').innerText = res !== undefined ? res : "";
    } catch {
        document.getElementById('live-result').innerText = "";
    }
}

function finalizeResult() {
    const live = document.getElementById('live-result').innerText;
    if (live && !live.includes("Can't")) {
        history.unshift(currentInput + " = " + live);
        currentInput = live;
        document.getElementById('live-result').innerText = "";
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }
}

// স্ক্রিন সুইচ লজিক
function toggleScreen(id) {
    document.getElementById(id).classList.toggle('hidden');
    if(id === 'history-screen') renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = history.map(h => `<div class="history-item">${h}</div>`).join('');
}

function clearHistory() {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}
