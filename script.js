const display = document.getElementById('display');

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.textContent;
        handleInput(value);
    });
});

function handleInput(value) {
    if (value === 'C') {
        display.textContent = '0';
    } else if (value === '=') {
        try {
            // গুণ (×) এবং ভাগ (÷) চিহ্নগুলো জাভাস্ক্রিপ্টের উপযোগী চিহ্নে রূপান্তর
            let expression = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
            
            // হিসাব কষা
            const result = eval(expression);
            
            // রেজাল্ট যদি অনেক বড় ডেসিমাল হয় তবে ৫ ঘর পর্যন্ত দেখানো
            display.textContent = Number.isInteger(result) ? result : result.toFixed(5);
        } catch {
            display.textContent = 'ভুল';
        }
    } else if (value === '←') {
        display.textContent = display.textContent.length > 1 ? display.textContent.slice(0, -1) : '0';
    } else {
        if (display.textContent === '0' || display.textContent === 'ভুল') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}
