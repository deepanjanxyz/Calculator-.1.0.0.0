const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');

let currentInput = "0";

// একদম ইনস্ট্যান্ট টাচ হ্যান্ডলার
function handleInput(val) {
    if (val === 'C') {
        currentInput = "0";
        liveResult.innerText = "";
    } 
    else if (val === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        calculateLive();
    } 
    else if (val === '=') {
        if (liveResult.innerText) {
            currentInput = liveResult.innerText;
            liveResult.innerText = "";
        }
    }
    else {
        if (currentInput === "0" && !isNaN(val)) currentInput = val;
        else currentInput += val;
        calculateLive();
    }
    display.innerText = currentInput;
}

function calculateLive() {
    try {
        let expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        let res = eval(expr);
        if (res !== undefined) liveResult.innerText = res;
    } catch { liveResult.innerText = ""; }
}

// বাটনগুলোতে ফাস্ট টাচ ইভেন্ট অ্যাড করা
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointerdown', (e) => {
        e.preventDefault(); // ডাবল ট্যাপ জুম বন্ধ করবে
        let val = button.getAttribute('data-val') || button.innerText;
        handleInput(val);
    });
});
