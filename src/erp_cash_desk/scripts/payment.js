let cb = document.getElementById("credit-card")
let esp = document.getElementById("money")
let ce = document.getElementById("fuel-card")
let cm = document.getElementById("member-card")

let ticketItems = document.getElementById("ticket-items")

// PAIEMENT CB
cb.addEventListener("click", () => {
    if(ticketItems.childElementCount == 0) {
        Swal.fire({
            icon: "error",
            text: "Le ticket est vide",
        });
        return;
    }
    if(display_pad.value != "") {
        valueNotEmpty()
    } else {
        Swal.fire({
            text: "Paiement en cours",
        });
        document.getElementById("total-price").innerText = 0
        pumpMaJ()
        ticketItems.innerHTML = ""
    }
    displayPad.value = ""

})

// PAIEMENT ESP
esp.addEventListener("click", () => {
    // Quitter si le ticket et vide
    if(ticketItems.childElementCount == 0) {
        Swal.fire({
            icon: "error",
            text: "Le ticket est vide",
        });
        return;
    }
    // Si on a entré un 
    if(display_pad.value != "") {
        valueNotEmpty()
    } else { // Sinon on fait payer le reste
        Swal.fire({
            text: "Paiement en cours",
        });
        document.getElementById("total-price").innerText = 0
        pumpMaJ()
        ticketItems.innerHTML = ""
    }
    displayPad.value = ""
})

// PAIEMENT CE
ce.addEventListener("click", () => {
    pumpMaJ()
})

function valueNotEmpty() {
    Swal.fire({
        text: "Paiement en cours de " + display_pad.value + "€",
    });
    if(document.getElementById("total-price").innerText >= displayPad.value) {
        document.getElementById("total-price").innerText -= displayPad.value
    }
    if(document.getElementById("total-price").innerText <= 0) {
        pumpMaJ()
        ticketItems.innerHTML = ""
        document.getElementById("total-price").innerText = 0
    }
    
}

function pumpMaJ() {
    let ticketItemsP = document.querySelectorAll(".product-info")
    if(ticketItems.childElementCount % 2 == 0) {
        Swal.fire({
            icon: "error",
            text: "Pas de carburant dans le ticket",
        });
        return
    }
    let id = ""
    let hasOil = false;
    let oilPrice;
    console.log(ticketItemsP.length)
    for(let product of ticketItemsP) {
        if(
            product.innerText.split(" - ")[0] === "SP95" ||
            product.innerText.split(" - ")[0] === "SP98" ||
            product.innerText.split(" - ")[0] === "Gazole") {
                hasOil = true;
                oilPrice = product.innerText.split(" - ")[1]
                oilPrice = oilPrice.split("€")[0]
                id=product.getAttribute("id")
                break
            }
    }
    if(!hasOil) {
        Swal.fire({
            icon: "error",
            text: "Pas de carburant dans le ticket",
        });
        return;
    }
    if(document.getElementById("total-price").innerText >= oilPrice) {
        document.getElementById("total-price").innerText -= oilPrice
        if(document.getElementById("total-price").innerText < 0) document.getElementById("total-price").innerText = 0;
    } else {
        document.getElementById("total-price").innerText = 0
    }
    Swal.fire({
        text: "Paiement en cours de " + oilPrice + "€"
    });
    if(document.getElementById("total-price").innerText == 0) {
        ticketItems.innerHTML = ""
    }
    pumpChoosen = null;

    let body = {
        "pumpID": id,
        "state": 1
    } 

    let xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                console.log("C'est bon...")
            }
            onClickFormation();
        } else {
            console.log("Ce n'est pas bon...");
        }
    } 
    
    xhr.open("POST", "https://api.fuelsync.hertinox.fr/pumps/setpumpstate.php", true);
    xhr.responseType = "json";
    xhr.send(JSON.stringify(body));
}

cm.addEventListener("click", () => {
    // TODO
})