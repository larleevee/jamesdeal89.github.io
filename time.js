// Handles updating the clock in the footer
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}
updateTime();
setInterval(updateTime, 1000);
