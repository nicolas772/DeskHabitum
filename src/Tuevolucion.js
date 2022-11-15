const carousel = document.getElementById("carouselDiv")

function actualizarCarousel(){

    let fotos = window.api.getFotosNames()
    
    for(let i=0; i< fotos.length; i++){
        if (i==0){
            let carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item active";            
            carouselItem.style.height ="400px";
            carouselItem.style.overflow ="hidden";
            carouselItem.style.width ="100%";
            let img = document.createElement('img');
            img.className = "d-block w-100";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            img.style.width = "100%";
            img.style.overflow ="hidden";
            carouselItem.appendChild(img)
            carousel.appendChild(carouselItem)
        }else {
            let carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item";            
            carouselItem.style.height ="400px";
            carouselItem.style.overflow ="hidden";
            carouselItem.style.width ="100%";
            let img = document.createElement('img');
            img.className = "d-block w-100";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            img.style.width = "100%";
            img.style.overflow ="hidden";
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