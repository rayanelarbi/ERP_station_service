document.getElementById('createButton').addEventListener('click', function(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du lien

    // Récupérer les valeurs des champs
    var dateTime = document.getElementById('dateTime').value.trim();
    var incidentType = document.getElementById('incidentType').value.trim();
    var technicalDetail = document.getElementById('technicalDetail').value.trim();
    var remark = document.getElementById('remark').value.trim();

    // Vérifier que tous les champs sont remplis
    if (dateTime === '' || incidentType === '' || technicalDetail === '' || remark === '') {
        Swal.fire({
            icon: 'error',
            title: 'Champs incomplets',
            text: 'Veuillez remplir tous les champs avant de créer l\'incident.'
        });
        return; // Arrêter l'exécution de la fonction
    }

    // Afficher la popup pour demander le nom de l'incident
    Swal.fire({
        title: 'Choisir un nom pour l\'incident',
        input: 'text',
        inputPlaceholder: 'Nom de l\'incident',
        showCancelButton: true,
        confirmButtonText: 'Créer',
        cancelButtonText: 'Annuler',
        allowOutsideClick: false, // Empêcher la fermeture de la popup en cliquant en dehors
        inputValidator: (value) => {
            if (!value) {
                return 'Vous devez saisir un nom pour l\'incident.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Récupérer le nom de l'incident saisi par l'utilisateur
            var nameIncident = result.value.trim();

            // Convertir la date au format YYYY-MM-DD HH:MM
            var dateObj = new Date(dateTime);
            var year = dateObj.getFullYear();
            var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
            var day = ('0' + dateObj.getDate()).slice(-2);
            var hours = ('0' + dateObj.getHours()).slice(-2);
            var minutes = ('0' + dateObj.getMinutes()).slice(-2);
            var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;

            // Effectuer la requête POST avec le nom de l'incident
            fetch("https://api.fuelsync.hertinox.fr/incidents/createincident.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nameIncident: nameIncident, // Utilisation du nom de l'incident
                    dateIncident: formattedDateTime, // Utilisation de la date formatée
                    typeIncident: incidentType,
                    details: technicalDetail,
                    notes: remark
                })
            })
            .then(response => response.json())
            .then(data => {
                // Vérifier si la requête s'est bien passée
                if (data.success) {
                    // Afficher la popup de succès
                    Swal.fire({
                        icon: "success",
                        title: "Incident créé avec succès",
                        text: "L'incident a été enregistré avec succès."
                    });
                    window.location.reload();
                } else {
                    // Afficher une popup d'erreur si la requête a échoué
                    Swal.fire({
                        icon: "success",
                        title: "Incident créé avec succès",
                        text: "L'incident a été enregistré avec succès."
                    });
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error("Erreur lors de la création de l'incident:", error);
                // Afficher une popup d'erreur si une erreur inattendue se produit
                Swal.fire({
                    icon: "error",
                    title: "Erreur inattendue",
                    text: "Une erreur inattendue s'est produite. Veuillez réessayer."
                });
            });
        }
    });
});


// --------------------------------------------------------------------------------------------------


// fetchIncidents.js

// Faire une requête GET à l'URL spécifiée
fetch("https://api.fuelsync.hertinox.fr/incidents/getallincidents.php")
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
        // Parcourir les données JSON pour créer dynamiquement les incidents
        data.forEach(incident => {
            // Créer un élément div pour chaque incident
            var incidentDiv = document.createElement("div");
            incidentDiv.className = "incident-list-box classic-box hvr-shrink cliquable";
            incidentDiv.id = incident.idIncident; // Utiliser l'attribut idIncident comme id d'élément

            // Créer un élément p pour le nom de l'incident et lui attribuer le texte approprié
            var nameParagraph = document.createElement("p");
            nameParagraph.textContent = incident.nameIncident; // Utiliser l'attribut nameIncident comme texte

            // Ajouter le paragraphe au div de l'incident
            incidentDiv.appendChild(nameParagraph);

            // Ajouter le div de l'incident à la div principale
            document.getElementById("checkIncident").appendChild(incidentDiv);
        });
    })
    .catch(error => console.error("Erreur lors de la récupération des incidents:", error));


// --------------------------------------------------------------------------------------------------

    // Récupérer la div parente avec l'ID 'checkIncident'
var checkIncidentDiv = document.getElementById('checkIncident');

// Ajouter un gestionnaire d'événements au parent
checkIncidentDiv.addEventListener('click', function(event) {
    // Vérifier si l'élément cliqué est une div enfant avec la classe 'incident-list-box'
    if (event.target.classList.contains('incident-list-box')) {
        // Récupérer l'ID de la div cliquée
        var incidentId = event.target.id;

        // Effectuer la requête GET avec l'ID de la div
        fetch("https://api.fuelsync.hertinox.fr/incidents/getincident.php?idIncident=" + incidentId)
        .then(response => response.json())
        .then(data => {
            // Afficher les informations récupérées dans une popup
            Swal.fire({
                title: 'Informations sur l\'incident',
                html: `
                    <p><strong>ID de l'incident:</strong> ${data.idIncident}</p>
                    <p><strong>Nom de l'incident:</strong> ${data.nameIncident}</p>
                    <p><strong>Date de l'incident:</strong> ${data.dateIncident}</p>
                    <p><strong>Type de l'incident:</strong> ${data.typeIncident}</p>
                    <p><strong>Détails de l'incident:</strong> ${data.detailIncident}</p>
                    <p><strong>Notes sur l'incident:</strong> ${data.noteIncident}</p>
                `,
                showCancelButton: false,
                confirmButtonText: 'Fermer'
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des informations sur l'incident:", error);
            // Afficher une popup d'erreur si une erreur se produit
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur s'est produite lors de la récupération des informations sur l'incident. Veuillez réessayer."
            });
        });
    }
});
