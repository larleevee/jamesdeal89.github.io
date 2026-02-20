// Handles draggable desktop icons and icon interactions
let currentlyDraggingIcon = null;
const icons = document.querySelectorAll('.icon-item');

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

            //drag-to-trash popup for CV icon
            const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
                .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');

            const trashIcon = Array.from(document.querySelectorAll('.icon-item'))
                .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'trash');

            if (icon === cvIcon && dragMoved && trashIcon && window.isColliding(cvIcon, trashIcon)) {
                window.showPopup("please don't put my CV in the trash :(");
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
    });
    icon.ondragstart = function() { return false; };
});
