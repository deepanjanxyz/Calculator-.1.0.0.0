const display = document.getElementById('display');
const factModeBtn = document.getElementById('factMode');

factModeBtn.addEventListener('click', () => {
    let num = prompt("কত সংখ্যার ফ্যাক্টোরিয়াল বের করতে চান? (সাবধান: বড় সংখ্যায় সময় লাগবে)");
    if (num) {
        display.textContent = "হিসাব হচ্ছে...";
        setTimeout(() => {
            calculateFactorial(parseInt(num));
        }, 100);
    }
});

function calculateFactorial(n) {
    if (n < 0) {
        display.textContent = "ভুল ইনপুট";
        return;
    }
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) {
        res *= BigInt(i);
    }
    display.textContent = res.toString();
}

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
        calculateFactorial(n);
    } else if (value === '=') {
        try {
            let expr = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
            display.textContent = eval(expr);
        } catch {
            display.textContent = 'Error';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.slice(0, -1) || '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'Error') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}
