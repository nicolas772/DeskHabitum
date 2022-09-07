/*codigo para que navbar lateral se despliegue automaticamente
al acercar mouse*/

const shrink_btn = document.querySelector(".shrink-btn");
shrink_btn.addEventListener("click",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});


const aside = document.querySelector(".aside1");
aside.addEventListener("mouseenter",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});

aside.addEventListener("mouseleave",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});
