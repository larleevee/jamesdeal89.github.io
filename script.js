
const hirebut = document.getElementById("hirebut");

const tabs = document.querySelectorAll('.tab');

document.addEventListener("mousemove", function(event) {
    hirebut.style.left = event.pageX - hirebut.offsetWidth/2 + "px";
    hirebut.style.top = event.pageY - hirebut.offsetHeight/2 + "px";
});


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
