let contacto = document.getElementById("btn_contacto")
let nombre = document.getElementById("name_contacto")

 
contacto.onclick = function(){
    console.log("prueba boton contacto")
    window.api.contacto(nombre)
}
