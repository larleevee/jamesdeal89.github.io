// Handles window close/maximize buttons
document.querySelectorAll('.tab .nav button:first-child').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = btn.closest('.tab');
        if (tab) tab.style.display = 'none';
    });
});
document.querySelectorAll('.tab .nav button:nth-child(2)').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = btn.closest('.tab');
        if (tab) {
            const footer = document.querySelector('footer');
            const footerHeight = footer ? footer.offsetHeight : 0;
            tab.style.left = '0';
            tab.style.top = '0';
            tab.style.width = '100vw';
            tab.style.height = `calc(100vh - ${footerHeight + 15}px)`;
            tab.style.zIndex = '10';
        }
    });
});
