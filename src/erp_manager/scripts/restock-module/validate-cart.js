document.addEventListener('DOMContentLoaded', () => {
    let date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()+3)
    const validateButton = document.querySelector('#validate-cart');
    const shoppingCartContent = document.querySelector("#cart-container");

    validateButton.addEventListener('click', () => {
        if (!shoppingCartContent.querySelector('div')) {
            Swal.fire({
                icon: "warning",
                title: "Panier vide",
                text: "Votre panier est vide. Veuillez ajouter des produits avant de passer une commande.",
            });
            return;
        }

        Swal.fire({
            title: 'Voulez-vous donner un nom à votre commande ?',
            input: 'text',
            inputPlaceholder: 'Nom de la commande',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            denyButtonText: 'Annuler',
            preConfirm: (name) => {
                if (!name) {
                    Swal.showValidationMessage('Le nom de la commande ne peut pas être vide !');
                }
                return name;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const commandName = result.value;
                Swal.fire({
                    icon: "success",
                    title: "Nom de commande validée",
                    text: `Vous avez saisi "${commandName}" comme nom de commande.`,
                });

                createCommand(commandName, date);
                clearShoppingCart();
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "error",
                    title: "Commande annulée",
                    text: "Votre commande n'a pas été envoyée au fournisseur !",
                });
                clearShoppingCart();
            } else {
                const firstProductName = shoppingCartContent.firstElementChild.querySelector('.left-element').textContent;
                const defaultCommandName = firstProductName.split(' - ')[0]; // Récupère le nom du premier produit
                Swal.fire({
                    icon: "info",
                    title: "Nom de commande par défaut",
                    text: `Vous n'avez pas donné de nom à votre commande, le nom de la commande sera "${defaultCommandName}."`,
                });

                createCommand(defaultCommandName, date);
                clearShoppingCart();
            }
        });
    });

function createCommand(commandName, date, products) {
    products = {
        "idProduct":1635245362235,
        "quantity":10,
        "price":10
    }
    // Récupérer l'élément qui contient le prix total
    const totalPriceElement = document.getElementById("shopping-cart-final-p");
    // Extraire le prix total
    const totalPriceText = totalPriceElement.textContent.trim();
    // Séparer le texte pour obtenir uniquement le prix
    const totalPrice = totalPriceText.split(':')[1].trim();

    let xhr = new XMLHttpRequest()

    let body = {
        products: products,
        totalPrice: totalPrice,
        deliveryDate: date,
        formName: commandName
    }

    xhr.onreadystatechange = function () { // TO DO
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                console.log("Commande passée et réussie")
            } else if (xhr.status == 400) {
                console.log("Commande passée et échouée (400)")
            } else if (xhr.status == 500) {
                console.log("Commande passée et échouée (500)")
            } else {
                console.log("Commande passée et échouée")
            }
        }
    }

    xhr.open("POST", "https://api.fuelsync.hertinox.fr/restock/createrestock.php", true)
    xhr.send(JSON.stringify(body))
}
/*
    function startCountdown() {
        const durationElements = document.querySelectorAll('#in-progress-commands-container .right-element p');
        
        const firstIcon = document.createElement('i');
        firstIcon.classList.add('green', 'cliquable', 'fa-solid', 'fa-circle-check');

        const secondIcon = document.createElement('i');
        secondIcon.classList.add('red', 'cliquable', 'fa-solid', 'fa-circle-xmark');

        durationElements.forEach((durationElement) => {
            // Extraire le nombre de la chaîne de caractères
            const durationText = durationElement.textContent.trim(); // Supprimer les espaces inutiles
            let duration = parseInt(durationText); // Convertir en nombre
    
            // Démarrer le décompte
            let countdown = setInterval(() => {
                if (duration <= 0) {
                    clearInterval(countdown);
                    // Déplacer l'élément vers une autre div
                    const toConfirmElementContainer = document.querySelector('#to-confirm-element-container');
                    let divRight = durationElement.parentElement;
                    divRight.style.display = 'flex';
                    divRight.style.gap = '10%';
                    divRight.style.marginRight = '5%';
                    divRight.removeChild(durationElement);
                    divRight.appendChild(firstIcon);
                    divRight.appendChild(secondIcon);
                    toConfirmElementContainer.appendChild(divRight.parentElement); // Déplacer l'élément
                } else {
                    duration -= 1; // Réduire le décompte de 1 seconde
                    // Mettre à jour le texte avec la nouvelle valeur
                    durationElement.textContent = `${duration}j`;
                }
            }, 3000); // Mettre à jour toutes les secondes (1000 ms)
        });
    }
    */

    function clearShoppingCart() {
        while (shoppingCartContent.firstChild) {
            shoppingCartContent.removeChild(shoppingCartContent.firstChild);
        }
    }
});