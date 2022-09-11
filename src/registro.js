const { ipcRenderer } = require('electron')

let nombre; 
let apellido; 
let email; 
let password; 
let regbtn;
let volver;

window.onload = function() { 
  email = document.getElementById("reg_email")
  password = document.getElementById("reg_pass")
  nombre = document.getElementById("reg_user")
  apellido = document.getElementById("reg_apellido")
  regbtn = document.getElementById("reg_btn")
  volver = document.getElementById("volver_login")

  regbtn.onclick = function(){
    const obj = {nombre: nombre.value, apellido:apellido.value, email:email.value, password:password.value}
    ipcRenderer.invoke("registrar", obj)    
  }


  volver.onclick = function(){
    ipcRenderer.invoke("moveToLogin")
  }
}