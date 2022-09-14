const { ipcRenderer } = require('electron')

let btnlogin;
let email; 
let password;
let reg_btn;


window.onload = function() { 
  email = document.getElementById("email")
  password = document.getElementById("password")
  btnlogin = document.getElementById("login")
  reg_btn = document.getElementById("registro")

  btnlogin.onclick = function(){
    const obj = {email:email.value, password:password.value }
    ipcRenderer.invoke("login", obj)
  }

  reg_btn.onclick = function(){
    ipcRenderer.invoke("moveToReg")
  }
}