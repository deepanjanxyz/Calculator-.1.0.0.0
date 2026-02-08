let currentInput = "0";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

// সায়েন্টিফিক ফাংশন
function handleSci(op) {
    try {
        let val = parseFloat(currentInput);
        if(op === 'sin') currentInput = Math.sin(val * Math.PI / 180).toFixed(4);
        if(op === 'cos') currentInput = Math.cos(val * Math.PI / 180).toFixed(4);
        if(op === 'tan') currentInput = Math.tan(val * Math.PI / 180).toFixed(4);
        if(op === 'sqrt') currentInput = Math.sqrt(val).toString();
        if(op === 'pow') currentInput += "**";
        
        document.getElementById('display').innerText = currentInput;
        calculateLive();
    } catch(e) { document.getElementById('display').innerText = "Error"; }
}

function handleInput(val) {
    const disp = document.getElementById('display');
    const live = document.getElementById('live-result');

    if(val === 'C') {
        currentInput = "0";
        live.innerText = "";
    } else if(val === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        calculateLive();
    } else if(val === '=') {
        finalize();
    } else {
        if(currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    disp.innerText = currentInput;
}

function calculateLive() {
    try {
        let cleanExpr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let res = eval(cleanExpr);
        document.getElementById('live-result').innerText = (res !== undefined && res !== Infinity) ? "= " + res : "";
    } catch { document.getElementById('live-result').innerText = ""; }
}

function finalize() {
    const res = document.getElementById('live-result').innerText.replace("= ", "");
    if(res && !res.includes("Error")) {
        history.unshift(currentInput + " = " + res);
        currentInput = res;
        document.getElementById('live-result').innerText = "";
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }
}

function updateBrightness(v) {
    document.getElementById('app-overlay').style.backgroundColor = `rgba(0,0,0,${1 - v/100})`;
}

function toggleScreen(id) {
    document.getElementById(id).classList.toggle('hidden');
}
