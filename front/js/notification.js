function testNotification() {
    const modal = document.getElementById('plugin-modal');
    modal.style.display = 'flex';
}

function initPlugin() {
    // Code pour initialiser les notifications
    const modal = document.getElementById('plugin-modal');
    modal.style.display = 'none';
}

// Pour fermer le modal avec le X
document.querySelector('.close').addEventListener('click', function() {
    const modal = document.getElementById('plugin-modal');
    modal.style.display = 'none';
});