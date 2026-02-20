// Handles CV icon window logic
const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
    .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');
if (cvIcon) {
    const cvLink = cvIcon.querySelector('a');
    if (cvLink) {
        cvLink.addEventListener('click', function(e) {
            e.preventDefault();
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
            const nav = document.createElement('div');
            nav.className = 'nav';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'x';
            closeBtn.onclick = () => win.remove();
            const maxBtn = document.createElement('button');
            maxBtn.textContent = '+';
            nav.appendChild(closeBtn);
            nav.appendChild(maxBtn);
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
        });
    }
}
