const display = document.getElementById('display');
const factModeBtn = document.getElementById('factMode');

// আনলিমিটেড ফ্যাক্টোরিয়াল লজিক
function calculateFactorial(n) {
    if (n < 0) {
        display.textContent = "Error";
        return;
    }
    display.textContent = "Calculating...";
    
    setTimeout(() => {
        try {
            let res = BigInt(1);
            for (let i = 2; i <= n; i++) {
                res *= BigInt(i);
            }
            display.textContent = res.toString();
        } catch (e) {
            display.textContent = "Too Big!";
        }
    }, 50);
}

factModeBtn.addEventListener('click', () => {
    let num = prompt("Enter number for factorial:");
    if (num && !isNaN(num)) {
        calculateFactorial(parseInt(num));
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
    } else if (value === '!') {
        let n = parseInt(display.textContent);
        if(!isNaN(n)) calculateFactorial(n);
    } else if (value === '=') {
        try {
            let expr = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
            let result = eval(expr);
            display.textContent = Number.isInteger(result) ? result : result.toFixed(5);
        } catch {
            display.textContent = 'Error';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'Error') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}
