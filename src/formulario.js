const { ipcRenderer } = require('electron')

let btn_formulario;
let nombre, email, telefono, region, ciudad, atencion, profesional, motivo;

window.onload = function() { 
  btn_formulario = document.getElementById("btn_formulario")
  nombre = document.getElementById("nombre_contacto")
  email = document.getElementById("email_contacto")
  telefono = document.getElementById("telefono_contacto")
  region = document.getElementById("region_contacto")
  ciudad = document.getElementById("ciudad_contacto")
  atencion = document.getElementById("atencion_contacto")
  profesional = document.getElementById("profesional_contacto")
  motivo = document.getElementById("motivo_contacto")


  btn_formulario.onclick = function(){
    const obj = {nombre:nombre.value, email:email.value, telefono:telefono.value, region:region.value, ciudad:ciudad.value, atencion:atencion.value, profesional:profesional.value, motivo:motivo.value }
    ipcRenderer.invoke("env_formulario", obj)
  }
}