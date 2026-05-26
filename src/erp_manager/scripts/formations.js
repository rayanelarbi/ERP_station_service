let liste_personnel = document.getElementById("liste_personnel")
let liste_formation = document.querySelector("#liste_formation")

let subscribeFormation = document.getElementById("subscribeFormation")

// -------------------------------------------------

let dateLocale
let formation

// -------------------------------------------------
let xhr2 = new XMLHttpRequest()

// ICI Je devrai récupérer les valeurs des formations (nom, date) avec AJAX pour les utiliser (JSON)
xhr2.onreadystatechange = function() {
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

xhr2.open("GET", "https://api.fuelsync.hertinox.fr/formations/getallformations.php", true);
xhr2.responseType = "json";
xhr2.send();

// ---------------------------------------------------------

function onClickFormation() {
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

// -------------------------------------------------

function inscription(){

    console.log("Envoi des données d'inscription...")
    let xhr = new XMLHttpRequest()

    for(let formation of document.getElementsByClassName("formation-selected")) {

        // recuperer l'id de la formation
        let idFormation = formation.getAttribute("id")

        // concatener firstName, lastName
        let formationName = document.getElementById("inscription-first-name").value+ " " + document.getElementById("inscription-name").value

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