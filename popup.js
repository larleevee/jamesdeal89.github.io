// Handles popup messages
window.showPopup = function(message) {
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
};
window.isColliding = function(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
};
