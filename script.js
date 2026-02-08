const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const factModeBtn = document.getElementById('factMode');

// হিস্ট্রি লোড করা
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ফ্যাক্টোরিয়াল ফাংশন (BigInt দিয়ে যাতে বড় সংখ্যা সাপোর্ট করে)
function calculateFactorial(n) {
    if (n < 0) return "Error";
    if (n === 0 || n === 1) return "1";
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) {
        res *= BigInt(i);
    }
    return res.toString();
}

// হিস্ট্রি সেভ করা
function saveHistory(expr, res) {
    if (!expr || !res || res === "Error") return;
    history.unshift({ expr, res });
    if (history.length > 50) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

// হিস্ট্রি দেখানো
function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-item">No history yet!</div>';
        return;
    }
    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div>${item.expr}</div><div style="color:#00d2d3">= ${item.res}</div>`;
        div.onclick = () => {
            display.textContent = item.res;
            historyPanel.classList.add('hidden');
            updateLiveResult();
        };
        historyList.appendChild(div);
    });
}

// বাটন ইভেন্টগুলো
document.getElementById('historyBtn').onclick = () => {
    renderHistory();
    historyPanel.classList.toggle('hidden');
};

document.getElementById('closeHistory').onclick = () => historyPanel.classList.add('hidden');

document.getElementById('clearHistory').onclick = () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
};

factModeBtn.onclick = () => {
    let num = prompt("Enter number for factorial:");
    if (num && !isNaN(num)) {
        const res = calculateFactorial(parseInt(num));
        display.textContent = res;
        saveHistory(num + "!", res);
        liveResult.textContent = "";
    }
};

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => handleInput(e.target.textContent));
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
        liveResult.textContent = '';
    } else if (value === '!') {
        let n = parseInt(display.textContent);
        if (!isNaN(n)) {
            const res = calculateFactorial(n);
            saveHistory(display.textContent + "!", res);
            display.textContent = res;
            liveResult.textContent = "";
        }
    } else if (value === '=') {
        if (liveResult.textContent !== '' && liveResult.textContent !== 'Error') {
            saveHistory(display.textContent, liveResult.textContent);
            display.textContent = liveResult.textContent;
            liveResult.textContent = '';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
        updateLiveResult();
    } else {
        if (display.textContent === '0' || display.textContent === 'Error') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

function updateLiveResult() {
    try {
        let text = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
        // যদি শুধু সংখ্যা থাকে তবে রেজাল্ট দেখানোর দরকার নেই
        if (!/[+*/-]/.test(text)) {
            liveResult.textContent = '';
            return;
        }
        // যদি শেষে অপারেটর না থাকে তবেই ক্যালকুলেট করবে
        if (/[0-9]$/.test(text)) {
            let res = eval(text);
            liveResult.textContent = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch {
        liveResult.textContent = '';
    }
}

// শুরুতে হিস্ট্রি রেন্ডার করে রাখা
renderHistory();
