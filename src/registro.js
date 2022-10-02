const { ipcRenderer } = require('electron')

let nombre; 
let apellido; 
let email; 
let password; 
let regbtn;
let volver;
let lider;

window.onload = function() { 
  email = document.getElementById("reg_email")
  password = document.getElementById("reg_pass")
  nombre = document.getElementById("reg_user")
  apellido = document.getElementById("reg_apellido")
  lider = document.getElementById("reg_lider")
  regbtn = document.getElementById("reg_btn")
  volver = document.getElementById("volver_login")

  regbtn.onclick = function(){
    if(nombre.value != null && nombre.value != "", apellido.value != null && apellido.value != "", email.value != null && email.value != "", password.value != null && password.value != ""){
      const obj = {nombre: nombre.value, apellido:apellido.value, email:email.value, password:password.value, lider:lider.value}
      ipcRenderer.invoke("registrar", obj) 
    }
       
  }


  volver.onclick = function(){
    ipcRenderer.invoke("moveToLogin")
  }
}