let ID_USER = window.api.get_user_id("")
let userData
let nombre = document.getElementById('nombre')
let apellido = document.getElementById('apellido')
let mail = document.getElementById('mail')

async function saveSettingsUser(){
    await window.api.getUserData(ID_USER).then(result => {
        userData = result[0];
    });
    let newData = {
        "nombre":nombre.value, 
        "apellido":apellido.value, 
        "email":mail.value
    }
    let claves = Object.keys(newData); // 
    for(let i=0; i< claves.length; i++){
        let clave = claves[i];
        if(newData[clave] == ""){
            newData[clave]=userData[clave]
        }
    }
    await window.api.updateUserData(ID_USER, newData['nombre'], newData['apellido'], newData['email']).then(result => {
        let resultado=result
    })
    actualizarProfile()
}


async function actualizarProfile(){
    nombre.value=""
    apellido.value=""
    mail.value=""
    await window.api.getUserData(ID_USER).then(result => {
        userData = result[0];
    });

    nombre.placeholder=userData.nombre;
    apellido.placeholder=userData.apellido;
    mail.placeholder=userData.email;
}

window.onload = actualizarProfile;