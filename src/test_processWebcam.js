const electron = require('electron');

function initialize () {
    let btn = document.getElementById("prueba")

    btn.onclick = function(){
        console.log("prueba boton")
    }

}

window.onload = initialize;