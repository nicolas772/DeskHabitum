const { ipcRenderer } = require('electron')

let nombre; 
let apellido; 
let email; 
let password; 
let regbtn;
let volver;

window.onload = function() { 
  email = document.getElementById("email")
  password = document.getElementById("password")
  regbtn = document.getElementById("reg_btn")
  volver = document.getElementById("volver_login")


  volver.onclick = function(){
    ipcRenderer.invoke("moveToLogin")
  }
}