const container = document.getElementById('calcContainer');
const floatBtn = document.getElementById('floatBtn');
const display = document.getElementById('display');
const liveResult = document.getElementById('live-result');

let isFloating = false;

// ফ্লোটিং মোড টগল
floatBtn.onclick = () => {
    isFloating = !isFloating;
    if (isFloating) {
        container.classList.add('floating');
        floatBtn.innerText = "📺 Back";
        makeDraggable(container);
    } else {
        container.classList.remove('floating');
        container.style.top = "auto";
        container.style.right = "auto";
        floatBtn.innerText = "📺 Float";
    }
};

// ড্র্যাগিং লজিক (ভাসমান অবস্থায় নড়াচড়া করার জন্য)
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;
    el.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
        if (!isFloating) return;
        e = e || window.event;
        pos3 = e.clientX || e.touches[0].clientX;
        pos4 = e.clientY || e.touches[0].clientY;
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        let clientX = e.clientX || e.touches[0].clientX;
        let clientY = e.clientY || e.touches[0].clientY;
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = "auto";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchmove = null;
    }
}

// ক্যালকুলেটর কোর লজিক (ফ্যাক্টোরিয়ালসহ)
document.querySelectorAll('.button').forEach(btn => {
    btn.onclick = () => {
        let val = btn.innerText;
        if (val === 'C') { display.innerText = '0'; liveResult.innerText = ''; }
        else if (val === '=') { display.innerText = liveResult.innerText || display.innerText; liveResult.innerText = ''; }
        else {
            if (display.innerText === '0') display.innerText = val;
            else display.innerText += val;
            updateLive();
        }
    };
});

function updateLive() {
    try {
        let text = display.innerText.replace(/×/g, '*').replace(/÷/g, '/');
        liveResult.innerText = eval(text);
    } catch { liveResult.innerText = ''; }
}
