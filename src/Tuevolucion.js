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

function actualizarThumbnails(){
    let fotos = window.api.getFotosNames()
    for(let i=0; i< fotos.length; i++){
        if (i==0){
            let boton = document.createElement('button');
            boton.type = "button";
            boton.data.mdb.target = "#carouselExampleControls";                
            boton.data.mdb.slide.to = toString(i);  
            boton.className = "active";
            boton.ariaCurrent = True;    
            boton.ariaLabel = "Slide " + toString(i+1);
            boton.style.width = '100px';                 
            let img = document.createElement('img');
            img.className = "img-fluid";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            boton.appendChild(img);
            thumbnails.appendChild(boton);
        }
        else{
            let boton = document.createElement('button');
            boton.type = "button";
            boton.data.mdb.target = "#carouselExampleControls";                              
            boton.data.mdb.slide.to = toString(i);              
            boton.ariaLabel = "Slide " + toString(i+1);        
            boton.style.width = '100px';          
            let img = document.createElement('img');
            img.className = "img-fluid";
            img.src = "../images/unhasUser/"+fotos[i]
            img.alt = "..."
            boton.appendChild(img);
            thumbnails.appendChild(boton);
        }

    }
}

function init4(){
    actualizarCarousel();
    actualizarThumbnails();
    actualizarNavbar();
}

window.onload = init4;