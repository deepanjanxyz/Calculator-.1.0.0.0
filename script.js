const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');
const factModeBtn = document.getElementById('factMode');

function calculateFactorial(n) {
    if (n < 0) return "Error";
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res.toString();
}

factModeBtn.addEventListener('click', () => {
    let num = prompt("Enter number for factorial:");
    if (num && !isNaN(num)) {
        display.textContent = calculateFactorial(parseInt(num));
        liveResult.textContent = "";
    }
});

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.textContent);
    });
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
        liveResult.textContent = '';
    } else if (value === '!') {
        let n = parseInt(display.textContent);
        display.textContent = calculateFactorial(n);
        liveResult.textContent = '';
    } else if (value === '=') {
        if (liveResult.textContent !== '' && liveResult.textContent !== 'Error') {
            display.textContent = liveResult.textContent;
            liveResult.textContent = '';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
        updateLiveResult();
    } else {
        if (display.textContent === '0') display.textContent = value;
        else display.textContent += value;
        updateLiveResult();
    }
}

// অটো হিসাব করার ফাংশন
function updateLiveResult() {
    try {
        let expr = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
        // যদি শেষে অপারেটর থাকে তবে হিসাব করবে না
        if (/[0-9]$/.test(expr)) {
            let res = eval(expr);
            liveResult.textContent = Number.isInteger(res) ? res : res.toFixed(4);
        }
    } catch {
        liveResult.textContent = '';
    }
}
