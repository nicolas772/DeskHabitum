const carousel = document.getElementById("carouselDiv")

function actualizarCarousel(){

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
            let d = document.createElement('div');
            d.className="carousel-caption d-none d-md-block";
            let h = document.createElement('h5');
            let texto = document.createTextNode("Foto del 10.10.2022")
            h.appendChild(texto);
            d.appendChild(h);
            carouselItem.appendChild(d);
            carousel.appendChild(carouselItem)
        }else {
            let carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item";                   
            let img = document.createElement('img');
            img.className = "d-block w-100";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."            
            carouselItem.appendChild(img)
            let d = document.createElement('div');
            d.className="carousel-caption d-none d-md-block";
            let h = document.createElement('h5');
            let texto = document.createTextNode("Foto del 10.10.2022")
            h.appendChild(texto);
            d.appendChild(h);
            carouselItem.appendChild(d);
            carousel.appendChild(carouselItem)
        }
        
    }

}

function init4(){
    actualizarCarousel();
    actualizarNavbar();
}

window.onload = init4;