ID_USER = window.api.get_user_id("")
//let userData
/*codigo para que navbar lateral se despliegue automaticamente
al acercar mouse*/
let shrink_btn = document.querySelector(".shrink-btn");
shrink_btn.addEventListener("click",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});


let aside = document.querySelector(".aside1");
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

//codigo para cerrar sesion

let logoutBtn = document.getElementById("cerrar-sesion")
logoutBtn.onclick = function(){
    window.api.cerrar_sesion("")
}

//let lider_equipo =  document.getElementById("lider_equipo")
let data_user, lider
async function actualizarNavbar(){
    await window.api.getUserData(ID_USER).then(result => {
        data_user = result[0];
        lider = data_user.liderequipo
    });
    if (lider == 'si'){
        $('#lider_equipo').show()
    }
}
  
window.onload = actualizarNavbar;
