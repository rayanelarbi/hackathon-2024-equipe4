document.addEventListener('DOMContentLoaded', function() {
    const checkNowButton = document.getElementById('checkNow');
    const alertsList = document.getElementById('alertsList');

    checkNowButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "checkRisks"}, function(response) {
            updateAlertsList(response.alerts);
        });
    });

    function updateAlertsList(alerts) {
        alertsList.innerHTML = '';
        if (alerts && alerts.length > 0) {
            alerts.forEach(alert => {
                const alertElement = document.createElement('p');
                alertElement.textContent = `${alert.type}: ${alert.message}`;
                alertsList.appendChild(alertElement);
            });
        } else {
            alertsList.textContent = 'Aucune alerte en cours.';
        }
    }

    // Initial check for alerts
    chrome.runtime.sendMessage({action: "getAlerts"}, function(response) {
        updateAlertsList(response.alerts);
    });
});