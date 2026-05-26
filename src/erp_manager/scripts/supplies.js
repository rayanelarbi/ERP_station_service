supplies()

function supplies()  {
    let supplies

    let reappro = new XMLHttpRequest();

    reappro.onreadystatechange = function () {
        if(reappro.readyState == 4) {
            if(reappro.status == 200) {
                supplies = this.response
                console.log(supplies)

                for(let supply of supplies) {
                    let today = new Date()
                    let dateItem = supply.deliveryDate.split("-")
                    let supplyDate = new Date(dateItem[0], dateItem[1]-1, dateItem[2])

                    console.log(supplyDate)

                    const oneDay = 24 * 60 * 60 * 1000;
                    let day = Math.round((supplyDate - today) / oneDay);

                    if(day <= 0) {
                        if(supply.status == 2) {
                            continue
                        }
                        document.querySelector("#to-confirm-element-container").innerHTML += "<div class='element-box classic-box'><p class='left-element'>"+  supply.formName +" - "+ supply.totalPrice +"€</p><div class='right-element'><i class='green cliquable fa-solid fa-circle-check' id='"+ supply.idForm +"'></i><i class='red cliquable fa-solid fa-circle-xmark' id='"+ supply.idForm +"'></i></div></div>"
                    } else {
                        document.querySelector("#in-progress-commands-container").innerHTML += "<div class='element-box classic-box hvr-round-corners'><p class='left-element'>"+ supply.formName +" - "+ supply.totalPrice +"€</p><div class='right-element'><p>"+ day +"j</p></div></div>"
                    }

                    
                }
            } else {
                console.log("Error getting stocks")
            }
        }
    }

    reappro.open("GET", "https://api.fuelsync.hertinox.fr/restock/getallrestocks.php", true)
    reappro.responseType = "json"
    reappro.send()
}