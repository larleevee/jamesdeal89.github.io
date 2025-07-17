

const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('mousedown', (e) => {
        let shiftX = e.clientX - tab.getBoundingClientRect().left;
        let shiftY = e.clientY - tab.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            tab.style.left = pageX - shiftX + 'px';
            tab.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        tab.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            tab.onmouseup = null;
        };
    });

    tab.ondragstart = function() {
        return false;
    };
});

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isMobileSize() {
    return window.innerWidth <= 600;
}

if (isMobile() || isMobileSize()) {
    alert("My website is designed to mimick a retro computer desktop. Viewing on a mobile device (or small window) is not recomended (but you can try anyways if you like).");
}
