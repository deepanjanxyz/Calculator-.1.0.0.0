let currentInput = "0";

function handleInput(val) {
    const disp = document.getElementById('display');
    const live = document.getElementById('live-result');

    if (val === 'AC') {
        currentInput = "0";
        live.innerText = "";
    } else if (val === '=') {
        if (live.innerText !== "") {
            currentInput = live.innerText.replace("= ", "");
            live.innerText = "";
        }
    } else {
        if (currentInput === "0" && val !== '.') currentInput = val;
        else if (currentInput.length < 15) currentInput += val; // লিমিট যাতে বাইরে না যায়
        
        try {
            let res = eval(currentInput.replace(/×/g, '*').replace(/÷/g, '/'));
            live.innerText = (res !== undefined && isFinite(res)) ? "= " + res : "";
        } catch { live.innerText = ""; }
    }
    
    disp.innerText = currentInput;
    adjustFontSize();
}

function adjustFontSize() {
    const disp = document.getElementById('display');
    const len = disp.innerText.length;
    if (len > 12) disp.style.fontSize = "2.5rem";
    else if (len > 8) disp.style.fontSize = "3.5rem";
    else disp.style.fontSize = "5rem";
}
