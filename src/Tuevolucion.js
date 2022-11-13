const carousel = document.getElementById("carouselDiv")

function actualizarCarousel(){
    /*let carouselItem = document.createElement('div');
    carouselItem.className = "carousel-item active";
    let img = document.createElement('img');
    img.className = "d-block w-100";
    img.src = "../images/fabian.png"
    img.alt = "..."
    carouselItem.appendChild(img)
    let carouselItem2 = document.createElement('div');
    carouselItem2.className = "carousel-item active";
    let img2 = document.createElement('img');
    img2.className = "d-block w-100";
    img2.src = "../images/fabian.png"
    img2.alt = "..."
    carouselItem2.appendChild(img2)
    carousel.appendChild(carouselItem)
    carousel.appendChild(carouselItem2)*/

    let fotos = window.api.getFotosNames()
    
    for(let i=0; i< fotos.length; i++){
        if (i==0){
            let carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item active";
            let img = document.createElement('img');
            img.className = "d-block w-100";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            carouselItem.appendChild(img)
            carousel.appendChild(carouselItem)
        }else {
            let carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item";
            let img = document.createElement('img');
            img.className = "d-block w-100";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            carouselItem.appendChild(img)
            carousel.appendChild(carouselItem)
        }
        
    }

}

function init4(){
    actualizarCarousel();
    actualizarNavbar();
}

window.onload = init4;