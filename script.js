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
    let dragMoved = false;
    let dragStartX = 0, dragStartY = 0;
    icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (currentlyDraggingIcon) return;
        currentlyDraggingIcon = icon;
        isDragging = true;
        dragMoved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            icon.style.left = pageX - shiftX + 'px';
            icon.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
            dragMoved = true;
        }
        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            currentlyDraggingIcon = null;
            isDragging = false;
            // Drag-to-trash popup for CV icon
            const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
                .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');
            const trashIcon = Array.from(document.querySelectorAll('.icon-item'))
                .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'trash');
            if (icon === cvIcon && dragMoved && trashIcon && isColliding(cvIcon, trashIcon)) {
                showPopup("please don't put my CV in the trash :(");
                // reset position if colliding
                cvIcon.style.left = '';
                cvIcon.style.top = '';
            }
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    icon.ondragstart = function() { return false; };
    // Only open window on click if not dragging
    icon.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (dragMoved) {
                e.preventDefault();
                e.stopImmediatePropagation();
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

// --- CV Icon: Open PDF in styled window ---
const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
    .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');
if (cvIcon) {
    const cvLink = cvIcon.querySelector('a');
    if (cvLink) {
        cvLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Create styled window
            const win = document.createElement('div');
            win.className = 'tab';
            win.style.position = 'absolute';
            win.style.left = '30vw';
            win.style.top = '15vh';
            win.style.width = '40vw';
            win.style.height = '60vh';
            win.style.zIndex = '25';
            win.style.background = '#220135';
            win.style.border = 'groove 3px orange';
            win.style.borderRadius = '10px';
            win.style.color = 'white';
            win.style.display = 'flex';
            win.style.flexDirection = 'column';
            // Nav bar
            const nav = document.createElement('div');
            nav.className = 'nav';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'x';
            closeBtn.onclick = () => win.remove();
            const maxBtn = document.createElement('button');
            maxBtn.textContent = '+';
            maxBtn.onclick = () => {
                const footer = document.querySelector('footer');
                const footerHeight = footer ? footer.offsetHeight : 0;
                win.style.left = '0';
                win.style.top = '0';
                win.style.width = '100vw';
                win.style.height = `calc(100vh - ${footerHeight + 15}px)`;
                win.style.zIndex = '30';
            };
            nav.appendChild(closeBtn);
            nav.appendChild(maxBtn);
            // Tab content with iframe
            const tabcontent = document.createElement('div');
            tabcontent.className = 'tabcontent';
            tabcontent.style.height = 'calc(100% - 40px)';
            tabcontent.style.overflow = 'hidden';
            const iframe = document.createElement('iframe');
            iframe.src = cvLink.href;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = 'white';
            tabcontent.appendChild(iframe);
            win.appendChild(nav);
            win.appendChild(tabcontent);
            document.body.appendChild(win);
            // Draggable nav
            nav.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;
                let shiftX = e.clientX - win.getBoundingClientRect().left;
                let shiftY = e.clientY - win.getBoundingClientRect().top;
                function moveAt(pageX, pageY) {
                    win.style.left = pageX - shiftX + 'px';
                    win.style.top = pageY - shiftY + 'px';
                }
                function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            nav.ondragstart = function() { return false; };
        });
    }
}

// --- Mail Icon: Open pseudo mail client ---
const mailIcon = Array.from(document.querySelectorAll('.icon-item'))
    .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'mail');
if (mailIcon) {
    const mailLink = mailIcon.querySelector('a');
    if (mailLink) {
        mailLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Create styled window
            const win = document.createElement('div');
            win.className = 'tab';
            win.style.position = 'absolute';
            win.style.left = '35vw';
            win.style.top = '18vh';
            win.style.width = '28vw';
            win.style.height = '40vh';
            win.style.zIndex = '20';
            win.style.background = '#220135';
            win.style.border = 'groove 3px orange';
            win.style.borderRadius = '10px';
            win.style.color = 'white';
            win.style.display = 'flex';
            win.style.flexDirection = 'column';
            // Nav bar
            const nav = document.createElement('div');
            nav.className = 'nav';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'x';
            closeBtn.onclick = () => win.remove();
            const maxBtn = document.createElement('button');
            maxBtn.textContent = '+';
            maxBtn.onclick = () => {
                const footer = document.querySelector('footer');
                const footerHeight = footer ? footer.offsetHeight : 0;
                win.style.left = '0';
                win.style.top = '0';
                win.style.width = '100vw';
                win.style.height = `calc(100vh - ${footerHeight + 15}px)`;
                win.style.zIndex = '30';
            };
            nav.appendChild(closeBtn);
            nav.appendChild(maxBtn);
            // Tab content with fake email client
            const tabcontent = document.createElement('div');
            tabcontent.className = 'tabcontent';
            tabcontent.style.height = 'calc(100% - 40px)';
            tabcontent.style.overflow = 'auto';
            tabcontent.style.display = 'flex';
            tabcontent.style.flexDirection = 'column';
            tabcontent.style.alignItems = 'center';
            tabcontent.style.justifyContent = 'center';
            // Fake email form
            const form = document.createElement('form');
            form.style.width = '90%';
            form.style.margin = 'auto';
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
            form.style.gap = '10px';
            // To field
            const toLabel = document.createElement('label');
            toLabel.textContent = 'To:';
            toLabel.style.textAlign = 'left';
            toLabel.style.fontFamily = '"Share Tech", sans-serif';
            const toInput = document.createElement('input');
            toInput.type = 'email';
            toInput.value = 'j891319@protonmail.com';
            toInput.readOnly = true;
            toInput.style.background = '#3a015c';
            toInput.style.color = 'yellow';
            toInput.style.border = '1px solid orange';
            toInput.style.borderRadius = '3px';
            toInput.style.padding = '4px';
            // Subject field
            const subjectLabel = document.createElement('label');
            subjectLabel.textContent = 'Subject:';
            subjectLabel.style.textAlign = 'left';
            subjectLabel.style.fontFamily = '"Share Tech", sans-serif';
            const subjectInput = document.createElement('input');
            subjectInput.type = 'text';
            subjectInput.placeholder = 'Subject';
            subjectInput.style.background = '#3a015c';
            subjectInput.style.color = 'yellow';
            subjectInput.style.border = '1px solid orange';
            subjectInput.style.borderRadius = '3px';
            subjectInput.style.padding = '4px';
            // Body field
            const bodyLabel = document.createElement('label');
            bodyLabel.textContent = 'Message:';
            bodyLabel.style.textAlign = 'left';
            bodyLabel.style.fontFamily = '"Share Tech", sans-serif';
            const bodyInput = document.createElement('textarea');
            bodyInput.value = "I love your website, James! You're hired!";
            bodyInput.readOnly = true;
            bodyInput.style.background = '#3a015c';
            bodyInput.style.color = 'yellow';
            bodyInput.style.border = '1px solid orange';
            bodyInput.style.borderRadius = '3px';
            bodyInput.style.padding = '4px';
            bodyInput.style.height = '100px';
            // Send button
            const sendBtn = document.createElement('button');
            sendBtn.type = 'submit';
            sendBtn.textContent = 'Send';
            sendBtn.style.background = 'orange';
            sendBtn.style.color = '#32004f';
            sendBtn.style.border = 'none';
            sendBtn.style.borderRadius = '3px';
            sendBtn.style.fontWeight = 'bold';
            sendBtn.style.cursor = 'pointer';
            sendBtn.style.marginTop = '10px';
            form.appendChild(toLabel);
            form.appendChild(toInput);
            form.appendChild(subjectLabel);
            form.appendChild(subjectInput);
            form.appendChild(bodyLabel);
            form.appendChild(bodyInput);
            form.appendChild(sendBtn);
            // Handle send
            form.addEventListener('submit', function(ev) {
                ev.preventDefault();
                const subject = encodeURIComponent(subjectInput.value);
                const body = encodeURIComponent(bodyInput.value);
                const mailtoLink = `mailto:${toInput.value}?subject=${subject}&body=${body}`;
                window.location = mailtoLink;
                win.remove();
            });
            tabcontent.appendChild(form);
            win.appendChild(nav);
            win.appendChild(tabcontent);
            document.body.appendChild(win);
            // Draggable nav
            nav.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;
                let shiftX = e.clientX - win.getBoundingClientRect().left;
                let shiftY = e.clientY - win.getBoundingClientRect().top;
                function moveAt(pageX, pageY) {
                    win.style.left = pageX - shiftX + 'px';
                    win.style.top = pageY - shiftY + 'px';
                }
                function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            nav.ondragstart = function() { return false; };
        });
    }
}

// --- Start Menu: Reopen windows & shutdown ---
const menuBtn = document.querySelector('footer.bar button'); // Fix selector
let startMenu = document.getElementById('startMenu');
if (!startMenu) {
    startMenu = document.createElement('div');
    startMenu.id = 'startMenu';
    startMenu.style.display = 'none';
    startMenu.style.position = 'fixed';
    startMenu.style.bottom = '50px';
    startMenu.style.left = '10px';
    startMenu.style.background = '#32004f';
    startMenu.style.border = '3px groove orange';
    startMenu.style.borderRadius = '6px';
    startMenu.style.minWidth = '180px';
    startMenu.style.zIndex = '1000';
    startMenu.style.color = 'white';
    startMenu.style.fontFamily = '"Share Tech",sans-serif';
    document.body.appendChild(startMenu);
}
startMenu.innerHTML = `
    <div class="menu-item" data-window="header" style="padding:8px 16px; cursor:pointer; border-bottom:1px solid orange;">About / Projects</div>
    <div class="menu-item" data-window="maintab" style="padding:8px 16px; cursor:pointer; border-bottom:1px solid orange;">Who Am I / Hobbies</div>
    <div class="menu-item" id="shutdownBtn" style="padding:8px 16px; cursor:pointer;">Shutdown</div>
`;
const windows = {
    header: document.querySelector('header.tab'),
    maintab: document.getElementById('maintab')
};
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
    }
});
startMenu.querySelectorAll('.menu-item[data-window]').forEach(item => {
    item.addEventListener('click', () => {
        const winKey = item.getAttribute('data-window');
        const win = windows[winKey];
        if (win) {
            const footer = document.querySelector('footer');
            const footerHeight = footer ? footer.offsetHeight : 0;
            win.style.display = '';
            win.style.zIndex = '15';
            win.style.left = '5vw';
            win.style.top = '5vh';
            win.style.width = '90vw';
            win.style.height = `calc(100vh - ${footerHeight + 30}px)`;
            win.style.maxHeight = `calc(100vh - ${footerHeight + 30}px)`;
        }
        startMenu.style.display = 'none';
    });
});
startMenu.querySelector('#shutdownBtn').addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.id = 'shutdownOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'black';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '99999';
    overlay.style.transition = 'opacity 1s';
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    // Unfade on any key press
    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
        window.removeEventListener('keydown', removeOverlay);
    }
    window.addEventListener('keydown', removeOverlay);
});

// --- Popup function ---
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
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(document.createElement('br'));
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
}