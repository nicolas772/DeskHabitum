const carousel = document.getElementById("carouselDiv")
const thumbnails = document.getElementById("thumbnails")

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

function actualizarThumb(){
    let fotos = window.api.getFotosNames()
    for(let i=0; i< fotos.length; i++){
        if (i==0){
            let buttonThumb = document.createElement('button');
            buttonThumb.type = "button"
            buttonThumb.setAttribute("data-mdb-target", "#carouselExampleIndicators");
            buttonThumb.setAttribute("data-mdb-slide-to", i.toString());
            buttonThumb.setAttribute("class", "active") //esta no va despues
            buttonThumb.setAttribute("aria-current", "true")
            let aria_label = "Slide "+(i+1).toString()
            buttonThumb.setAttribute("aria-label", aria_label)
            buttonThumb.setAttribute("style", "width: 100px;")
            let img2 = document.createElement('img');
            img2.className = "d-block w-100";
            img2.setAttribute("class", "img-fluid")
            img2.src = "../images/unhasUser/"+fotos[i]
            buttonThumb.appendChild(img2)
            thumbnails.appendChild(buttonThumb)

        }else {
            let buttonThumb = document.createElement('button');
            buttonThumb.type = "button"
            buttonThumb.setAttribute("data-mdb-target", "#carouselExampleIndicators");
            buttonThumb.setAttribute("data-mdb-slide-to", i.toString());              
            let aria_label = "Slide "+(i+1).toString()
            buttonThumb.setAttribute("aria-label", aria_label)
            buttonThumb.setAttribute("style", "width: 100px;")
            let img2 = document.createElement('img');
            img2.className = "d-block w-100";
            img2.setAttribute("class", "img-fluid")
            img2.src = "../images/unhasUser/"+fotos[i]
            buttonThumb.appendChild(img2)
            thumbnails.appendChild(buttonThumb)
        }
        
    }

}

function init4(){
    actualizarCarousel();
    actualizarThumb()
    actualizarNavbar();
}

window.onload = init4;