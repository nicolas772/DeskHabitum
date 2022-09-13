const { ipcRenderer } = require('electron')

let btn_formulario;

window.onload = function() { 
  btn_formulario = document.getElementById("btn_formulario")

  btn_formulario.onclick = function(){
    ipcRenderer.invoke("env_formulario")
  }
}