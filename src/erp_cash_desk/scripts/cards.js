// cards.js

document.addEventListener('DOMContentLoaded', function () {
    getCardData();
    searchInputCards.addEventListener('keypress', function (event) {    if (event.key === 'Enter') {getCard();}})
});

function updateCardInfo(card) {
    var idCardInput = document.getElementById('divIdCard').querySelector('input');
    var nameInput = document.getElementById('divName').querySelector('input');
    var birthDateParagraph = document.getElementById('divDate').querySelector('p:last-of-type');
    var balanceParagraph = document.getElementById('divSolde').querySelector('p:last-of-type');
    var creationDateParagraph = document.getElementById('divCreation').querySelector('p:last-of-type');
    var photoImage = document.getElementById('divPhoto').querySelector('img');

    idCardInput.value = card.idCard;
    nameInput.value = card.lastName + ' ' + card.firstName;
    birthDateParagraph.textContent = card.birthDate;
    balanceParagraph.textContent = card.balance;
    creationDateParagraph.textContent = card.creationDate;
    photoImage.src = card.profileImageURL;
}

function getCardData() {
    fetch("https://api.fuelsync.hertinox.fr/cards/getallcards.php")
        .then(response => response.json())
        .then(data => {
            var allCards = data.energy.concat(data.member);
            updateCardOptions(allCards);
            if (allCards.length > 0) {
                updateCardInfo(allCards[0]);
            }
        })
        .catch(error => console.error('Error fetching card data:', error));
}

function updateCardOptions(cards) {
    var dataList = document.getElementById('card-options');
    //dataList.innerHTML = ''; // Nettoyer les options précédentes
    cards.forEach(function (card) {
        var option = document.createElement('option');
        option.value = card.idCard;
        dataList.appendChild(option);
    });
    getCard();
}

var searchInputCards = document.getElementById('search-input');
searchInputCards.addEventListener('input', function () {
    var searchKeyword = searchInput.value.trim().toLowerCase();
    var cards = document.querySelectorAll('option');
    cards.forEach(function (card) {
        if (!card.value.toLowerCase().includes(searchKeyword)) {
            card.hidden = true;
        } else {
            card.hidden = false;
        }
    });
});

function getCard() {
    var selectedCardId = searchInputCards.value.trim();
    fetch(`https://api.fuelsync.hertinox.fr/cards/getcard.php?idCard=${selectedCardId}`)
        .then(response => response.json())
        .then(data => {
            updateCardInfo(data);
        })
        .catch(error => console.error('Error fetching card data:', error));
}


// MODIFIER INFORMATIONS CARTES

// Gestionnaire d'événements pour modifier le nom
document.querySelector('#divName button').addEventListener('click', function () {
    var nameInput = document.getElementById('divName').querySelector('input').value.trim();
    var firstName = nameInput.split(' ')[1];
    var lastName = nameInput.split(' ')[0];
    var cardID = document.getElementById('divIdCard').querySelector('input').value.trim();

    var data = {
        cardID: cardID,
        dataToChange: "name",
        data: {
            firstName: firstName,
            lastName: lastName
        }
    };

    fetch('https://api.fuelsync.hertinox.fr/customers/editcustomer.php', {
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
            Swal.fire({
                text: "Nom de la carte mis à jour avec succès !",
            });
        } else {
            Swal.fire({
                text: "Erreur lors de la mise à jour du nom de la carte. Veuillez réessayer.",
            });
        }
    })
    .catch(error => console.error('Error updating card name:', error));
});

// CREDITER LA CARTE

// Gestionnaire d'événements pour le bouton "Créditer"
document.getElementById('divCrediter').addEventListener('click', function () {
    // Récupérer le montant saisi dans la calculatrice
    var amount = parseFloat(document.getElementById('display-pad').value);

    // Récupérer l'identifiant de la carte
    var cardID = document.getElementById('divIdCard').querySelector('input').value.trim();

    // Vérifier si le montant est valide
    if (isNaN(amount) || amount <= 0) {
        Swal.fire({
            text: "Veuillez saisir un montant valide à créditer.",
        });
        return;
    }

    // Envoyer la demande de crédit au serveur
    var data = {
        idCard: cardID,
        points: amount
    };

    fetch('https://api.fuelsync.hertinox.fr/cards/addpoints.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then( function() {
        // Mettre à jour le solde affiché sur l'interface utilisateur
        var balanceParagraph = document.getElementById('divSolde').querySelector('p:last-of-type');
        var currentBalance = parseFloat(balanceParagraph.textContent);
        balanceParagraph.textContent = (currentBalance + amount).toFixed(2); // Mettre à jour le solde avec le nouveau montant crédité
        Swal.fire({
            text: "Solde crédité avec succès !",
        });
        getCard();
    })
    .catch(error => console.error('Error crediting balance:', error));
});

document.getElementById('btnScanner').addEventListener('click', function () {
    getCard();
});