// Handles start menu and shutdown overlay
const menuBtn = document.querySelector('footer.bar button');
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
    <div class="menu-item" data-window="newtab" style="padding:8px 16px; cursor:pointer; border-bottom:1px solid orange;">My Blog</div>
    <div class="menu-item" id="shutdownBtn" style="padding:8px 16px; cursor:pointer;">Shutdown</div>
`;
const windows = {
    header: document.querySelector('header.tab'),
    maintab: document.getElementById('maintab'),
    newtab: document.getElementById('newtab')
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
            win.style.left = '10vw';
            win.style.top = '5vh';
            win.style.width = '70vw';
            win.style.height = `calc(100vh - ${footerHeight + 90}px)`;
            win.style.maxHeight = `calc(100vh - ${footerHeight + 90}px)`;
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
    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
        window.removeEventListener('keydown', removeOverlay);
    }
    window.addEventListener('keydown', removeOverlay);
});
