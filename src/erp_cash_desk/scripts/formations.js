let liste_formation = document.getElementById("liste_formation")

let nameInput = document.getElementById("nom")
nameInput.setAttribute("placeholder", "Nom")
let firstNameInput = document.getElementById("prenom")
firstNameInput.setAttribute("placeholder", "Prénom")
let phoneInput = document.getElementById("tel")
phoneInput.setAttribute("placeholder", "Téléphone")

let subscribeFormation = document.getElementById("subscribeFormation")

let xhr3 = new XMLHttpRequest()
let response_formation
let dateLocale
let formation

// -------------------------------------------------

// ICI Je devrai récupérer les valeurs des formations (nom, date) avec AJAX pour les utiliser (JSON)
xhr3.onreadystatechange = function() {
    if(this.readyState == 4) {
        if(this.status == 200) {
            console.log("Récupération formations réussie...")
            response_formation = this.response;

            console.log(response_formation)

            for(formation of response_formation) {
                dateLocale = formation.dateFormation.toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'long'
                })
                liste_formation.innerHTML += "<div id='"+formation.idFormation+"' class='formation staff-formation-box classic-box hvr-shrink cliquable'><p><span class='name'>"+ formation.name +"</span> - <span class='date'>" + dateLocale + "</span></p></div>"

            }
            onClickFormation();
        } else {
            console.log("Récupération formations échouée...");
        }
    } 
}

xhr3.open("GET", "https://api.fuelsync.hertinox.fr/formations/getallformations.php", true);
xhr3.responseType = "json";
xhr3.send();

// ---------------------------------------------------------

function onClickFormation() {
    console.log("Formation click event set")
    for(let node of liste_formation.childNodes) {
        node.addEventListener("click", () => {
            console.log("Nouvelle selection de formation...")
            if(node.classList.contains("formation-selected")) {
                node.classList.remove("formation-selected")
            } else {
                node.classList.add("formation-selected")
            }
        })
    }
}

// ---------------------------------------------------------

function inscription(){

    console.log("Envoi des données d'inscription...")
    let xhr = new XMLHttpRequest()

    for(let formation of document.getElementsByClassName("formation-selected")) {

        // recuperer l'id de la formation
        let idFormation = formation.getAttribute("id")

        // concatener firstName, lastName
        let formationName = firstNameInput.value+ " " + nameInput.value

        // envoyer
        let body = {
            "formationID": idFormation,
            "name": formationName
        }

        xhr.open("POST","https://api.fuelsync.hertinox.fr/formations/signupformation.php",true);
        xhr.send(JSON.stringify(body));
        
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    console.log("formation envoyée")
                    Swal.fire({
                        text: "Inscription réussie"
                    });
                } else {
                    console.log("Déjà inscrit");
                    Swal.fire({
                        text: "Inscription échouée ou employé déjà inscrit"
                    });
                }
            } 
        }
    }
}

nameInput.addEventListener("keydown", function(event) {
    // Vérification si la touche appuyée est la touche "Entrée" (code 13)
    if (event.keyCode === 13) {
        // Empêcher le comportement par défaut de la touche "Entrée"
        event.preventDefault();

        // Vérifier si tous les champs sont remplis
        if (checkInputs()) {
            // Afficher le message de succès
            Swal.fire({
                text: "Inscription réussie"
            });
            inscription()
        } else {
            // Afficher une notification indiquant que tous les champs doivent être remplis
            Swal.fire({
                text: "Inscription échouée"
            });
        }
    }
});

// Ajout d'un gestionnaire d'événement pour l'événement "keydown" sur le champ "inscription-first-name"
firstNameInput.addEventListener("keydown", function(event) {
    // Vérification si la touche appuyée est la touche "Entrée" (code 13)
    if (event.keyCode === 13) {
        // Empêcher le comportement par défaut de la touche "Entrée"
        event.preventDefault();

        // Vérifier si tous les champs sont remplis
        if (checkInputs()) {
            // Afficher le message de succès
            Swal.fire({
                text: "Inscription réussie"
            });
            inscription()
        } else {
            // Afficher une notification indiquant que tous les champs doivent être remplis
            Swal.fire({
                text: "Inscription échouée"
            });
        }
    }
});

// Ajout d'un gestionnaire d'événement pour l'événement "keydown" sur le champ "inscription-phone"
phoneInput.addEventListener("keydown", function(event) {
    // Vérification si la touche appuyée est la touche "Entrée" (code 13)
    if (event.keyCode === 13) {
        // Empêcher le comportement par défaut de la touche "Entrée"
        event.preventDefault();

        // Vérifier si tous les champs sont remplis
        if (checkInputs()) {
            // Afficher le message de succès
            
            inscription()
        }
    }
});

function checkInputs() {
    return nameInput.value.trim() !== '' && firstNameInput.value.trim() !== '' && phoneInput.value.trim() !== '';
}

