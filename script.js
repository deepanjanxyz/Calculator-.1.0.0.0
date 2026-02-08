let currentInput = "0";

function handleInput(val) {
    const disp = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'C') {
        currentInput = "0";
        live.innerText = "";
    } else if (val === '=') {
        if (live.innerText !== "") {
            currentInput = live.innerText.replace("= ", "");
            live.innerText = "";
        }
    } else {
        if (currentInput === "0" && val !== '.') currentInput = val;
        else currentInput += val;
        
        // রিয়েল টাইম ক্যালকুলেশন
        try {
            let res = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/'));
            live.innerText = (res !== undefined && isFinite(res)) ? "= " + res : "";
        } catch {
            live.innerText = "";
        }
    }
    disp.innerText = currentInput;
}
