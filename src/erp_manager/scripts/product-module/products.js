document.addEventListener('DOMContentLoaded', function() {
    getProductsData();
});

var allProducts = []; // Variable globale pour stocker les données des produits

function updateProductInfo(product) {
    var productName = document.getElementById('product-name');
    var productPrice = document.getElementById('product-price');
    var productQuantity = document.getElementById('product-quantity');
    var productDescription = document.getElementById('product-description');
    var productImage = document.getElementById('product-image');

    productName.textContent = 'Nom : ' + product.productName;
    productPrice.textContent = 'Prix : ' + product.sellPrice + '€';
    productQuantity.textContent = 'Stock : ' + product.quantity;
    productDescription.textContent = product.description;
    productImage.src = product.img;
    
}

function getProductsData() {
    $.ajax({
        url: "https://api.fuelsync.hertinox.fr/products/getallproducts.php",
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            allProducts = response; // Stocker les données des produits dans la variable globale
            response.forEach(function(product) {
                updateProductInfo(product);
            });
            addProductsToDataList(response); // Ajouter les produits au datalist
        }
    });
}


// Gérer l'événement de recherche
var searchInput = document.getElementById('search-input-produit');
var suggestionList = document.getElementById('suggestion-list');

searchInput.addEventListener('input', function() {
    var searchKeyword = searchInput.value.trim().toLowerCase();
    var filteredProducts = [];

    // Filtrer les produits correspondant au texte de recherche
    allProducts.forEach(function(product) { // Utiliser la variable globale allProducts
        if (product.productName.toLowerCase().includes(searchKeyword)) {
            filteredProducts.push(product);
        }
    });

    // Afficher les suggestions dans la liste déroulante
    displaySuggestions(filteredProducts);
});

var foundProduct;

// Gérer l'événement "Entrée" pour mettre à jour les informations du produit
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        var productName = searchInput.value.trim().toLowerCase();
        foundProduct = allProducts.find(function(product) { // Utiliser la variable globale allProducts
            return product.productName.toLowerCase() === productName;
        });
        if (foundProduct) {
            updateProductInfo(foundProduct);
        }
    }
});

function displaySuggestions(products) {
    // Effacer les suggestions précédentes
    suggestionList.innerHTML = '';

    // Afficher les suggestions
    products.forEach(function(product) {
        var suggestionItem = document.createElement('li');
        suggestionItem.textContent = product.productName;
        suggestionList.appendChild(suggestionItem);

        // Gérer le clic sur une suggestion
        suggestionItem.addEventListener('click', function() {
            searchInput.value = product.productName;
            // Mettre à jour les informations du produit sélectionné
            updateProductInfo(product);
            // Effacer la liste déroulante des suggestions
            suggestionList.innerHTML = '';
        });
    });
}

function addProductsToDataList(products) {
    var dataList = document.getElementById('product-options');

    // Effacer le datalist précédent
    dataList.innerHTML = '';

    // Ajouter chaque produit comme une option au datalist
    products.forEach(function(product) {
        var option = document.createElement('option');
        option.value = product.productName;
        dataList.appendChild(option);
    });
}


// MODIFICATION DU PRIX :

// MODIFICATION DU PRIX :
// Ajouter un événement de clic sur le bouton de modification du prix
var modifyButton = document.querySelector('#modifPrix button');
modifyButton.addEventListener('click', function() {
    // Récupérer le nouveau prix depuis l'élément d'entrée
    var newPrice = document.getElementById('inputPrix').value.trim();
    
    // Vérifier si le prix est valide
    if (newPrice !== '' && !isNaN(newPrice) && foundProduct) {
        // Envoyer une requête AJAX pour mettre à jour le prix dans la base de données
        $.ajax({
            url: "https://api.fuelsync.hertinox.fr/products/setproductprice.php",
            type: "POST",
            contentType: "application/json", // Définir le type de contenu comme JSON
            data: JSON.stringify({ price: parseFloat(newPrice), productID: foundProduct.idProduct }), // Envoyer le nouveau prix comme données JSON
            success: function(_, _, xhr) {
                // Gérer la réponse de la requête AJAX
                if (xhr.status == 200) {
                    // Afficher un message de confirmation
                    //alert('Le prix a été modifié avec succès !');
                    // Mettre à jour le prix affiché
                    foundProduct.sellPrice = newPrice;
                    updateProductInfo(foundProduct);
                } else {
                    // Afficher un message d'erreur si la modification a échoué
                    Swal.fire({
                        text: "Erreur lors de la modification du prix. Veuillez réessayer.",
                    });
                }
            },
            error: function(xhr, status, error) {
                // Gérer les erreurs de la requête AJAX
                console.error(xhr.responseText);
                Swal.fire({
                    text: "Une erreur s\'est produite. Veuillez réessayer.",
                });
            }
        });
    } else {
        // Afficher un message d'erreur si le prix n'est pas valide ou si aucun produit n'est sélectionné
        Swal.fire({
            text: "Veuillez sélectionner un produit et entrer un prix valide.",
        });
    }
});
