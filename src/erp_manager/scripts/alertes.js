document.addEventListener('DOMContentLoaded', function () {
    getAllAlerts();
});

function getAllAlerts() {
    fetch("https://api.fuelsync.hertinox.fr/alerts/getallalerts.php")
        .then(response => response.json())
        .then(data => {
            displayAlerts(data);
        })
        .catch(error => console.error('Error fetching alerts:', error));
}

function displayAlerts(alertData) {
    var alertListContainer = document.getElementById('alert-list').querySelector(".content-wrapper");

    // Clear previous alerts
    alertListContainer.innerHTML = '';

    // Display fuel alerts
    alertData.forEach(function (alert) {
        var alertBox
        if (alert.alertFuel) {
            alertBox = createAlertBox(alert.alertName + " - " + alert.amount + " L");
        } else {
            alertBox = createAlertBox(alert.alertName + " - " + alert.quantity);
        }

        alertListContainer.appendChild(alertBox);
    });
}

function createAlertBox(alertText) {
    var alertBox = document.createElement('div');
    alertBox.classList.add('alert-list-box', 'classic-box', 'hvr-shrink', 'cliquable');
    alertBox.innerHTML = '<p class="left-element">' + alertText + '</p><div class="right-element"><i class="cliquable fa-solid fa-circle-check fa-lg"></i></div>';
    return alertBox;
}
