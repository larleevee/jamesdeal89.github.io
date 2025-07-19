const tabs = document.querySelectorAll('.tab');
const icons = document.querySelectorAll('.icon-item');

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

let currentlyDraggingIcon = null;

icons.forEach(icon => {
    icon.style.position = 'absolute';

    let isDragging = false;

    icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left mouse button
        if (currentlyDraggingIcon) return; // Prevent picking up another icon

        currentlyDraggingIcon = icon;

        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            icon.style.left = pageX - shiftX + 'px';
            icon.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
            isDragging = true;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            currentlyDraggingIcon = null;
            // Prevent accidental link activation after drag
            setTimeout(() => { isDragging = false; }, 50);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    icon.ondragstart = function() {
        return false;
    };

    // Prevent link activation if dragging
    icon.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });
});

document.querySelectorAll('.tab .nav button:first-child').forEach(btn => {
    btn.addEventListener('click', function() {
        // Find the parent .tab and hide it
        const tab = btn.closest('.tab');
        if (tab) tab.style.display = 'none';
    });
});

document.querySelectorAll('.tab .nav button:nth-child(2)').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = btn.closest('.tab');
        if (tab) {
            // Get footer height
            const footer = document.querySelector('footer');
            const footerHeight = footer ? footer.offsetHeight : 0;

            tab.style.left = '0';
            tab.style.top = '0';
            tab.style.width = '100vw';
            tab.style.height = `calc(100vh - ${footerHeight + 15}px)`;
            tab.style.zIndex = '10'; // Bring to front if needed
        }
    });
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

function isColliding(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}


updateTime();
setInterval(updateTime, 1000);

const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
    .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');
const trashIcon = Array.from(document.querySelectorAll('.icon-item'))
    .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'trash');

if (cvIcon && trashIcon) {
    let prevLeft, prevTop;
    cvIcon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;

        if (cvIcon) {
            prevLeft = cvIcon.style.left;
            prevTop = cvIcon.style.top;
        }2

        let shiftX = e.clientX - cvIcon.getBoundingClientRect().left;
        let shiftY = e.clientY - cvIcon.getBoundingClientRect().top;
        let isDraggingCV = false;

        function moveAt(pageX, pageY) {
            cvIcon.style.left = pageX - shiftX + 'px';
            cvIcon.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
            isDraggingCV = true;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // check collision after drag ends
            if (isDraggingCV && isColliding(cvIcon, trashIcon)) {
                showPopup("please don't put my CV in the trash :(");
                // reset position if colliding
                cvIcon.style.left = prevLeft;
                cvIcon.style.top = prevTop;
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    cvIcon.ondragstart = function() {
        return false;
    };
}

// Helper to show a popup window
function showPopup(message) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#3a015c';
    popup.style.color = 'yellow';
    popup.style.padding = '30px 40px';
    popup.style.border = '3px groove orange';
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '9999';
    popup.style.fontFamily = '"Share Tech", sans-serif';
    popup.style.textAlign = 'center';

    popup.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '20px';
    closeBtn.onclick = () => {
        popup.remove();
    };

    popup.appendChild(document.createElement('br'));
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
}