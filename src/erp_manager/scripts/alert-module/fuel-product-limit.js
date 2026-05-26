document.addEventListener("DOMContentLoaded", function () {
    // Sélection de l'input "fuel-amount-input"
    var fuelAmountInput = document.getElementById("fuel-amount-input");

    // Ajout d'un gestionnaire d'événement pour l'événement "keydown" sur l'input "fuel-amount-input"
    fuelAmountInput.addEventListener("keydown", function(event) {
        // Vérification si la touche appuyée est la touche "Entrée" (code 13)
        if (event.keyCode === 13) {
            // Empêcher le comportement par défaut de la touche "Entrée"
            event.preventDefault();

            const fuelID = document.getElementById('fuel-select').value;
            
            // Code à exécuter lorsque la touche "Entrée" est pressée
            if (fuelAmountInput.value.trim() === '') {
                iziToast.warning({
                    title: 'Attention',
                    message: 'Le champ "Seuil carburant" est vide. Veuillez entrer une valeur.',
                });
                return;
            }

            let fuelAmount = fuelAmountInput.value.split(" ")[0];
            
            let data = {
                limit: fuelAmount,
                fuelID: fuelID
            }

            fetch('https://api.fuelsync.hertinox.fr/fuels/setfuellimit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message) {
                    iziToast.success({
                        title: 'OK',
                        message: 'La valeur "' + fuelAmountInput.value + '" a été enregistrée avec succès!',
                    });
                } else {
                    iziToast.warning({
                        title: 'Attention',
                        message: 'Une erreur serveur s\'est produite.',
                    });
                }
            })
            .catch(error => console.error('Erreur updating fuel limit:', error));
        }
    });

    // Sélection de l'input "product-amount-bar"
    var productAmountInput = document.getElementById("product-amount-input");

    // Ajout d'un gestionnaire d'événement pour l'événement "keydown" sur l'input "product-amount-bar"
    productAmountInput.addEventListener("keydown", function(event) {
        // Vérification si la touche appuyée est la touche "Entrée" (code 13)
        if (event.keyCode === 13) {
            // Empêcher le comportement par défaut de la touche "Entrée"
            event.preventDefault();
            
            const productID = document.getElementById('product-select').value;
            
            // Code à exécuter lorsque la touche "Entrée" est pressée
            if (productAmountInput.value.trim() === '') {
                iziToast.warning({
                    title: 'Attention',
                    message: 'Le champ "Seuil produit" est vide. Veuillez entrer une valeur.',
                });
                return;
            }

            let productAmount = productAmountInput.value;
            
            let data = {
                limit: productAmount,
                productID: productID
            }

            fetch('https://api.fuelsync.hertinox.fr/products/setproductlimit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message) {
                    iziToast.success({
                        title: 'OK',
                        message: 'La valeur "' + productAmount + '" a été enregistrée avec succès!',
                    });
                } else {
                    iziToast.warning({
                        title: 'Attention',
                        message: 'Une erreur serveur s\'est produite.',
                    });
                }
            })
            .catch(error => console.error('Erreur updating product limit:', error));
        }
    });
});
