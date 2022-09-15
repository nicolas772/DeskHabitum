let inicio_sesion
let fin_sesion
let total
let nombre, email, telefono, region, ciudad, atencion, profesional, motivo, obj;

function init_cam(){
    window.api.iniciar_camara("")
    inicio_sesion = new Date()
}

async function stop_cam(){
    let camHandle
    camHandle = window.api.leerCameraHandle()
        
    console.log("camera handle:", camHandle)
    if (camHandle == '1'){
        let ID = window.api.get_user_id("")
        let ID_USER = ID.toString()
        window.api.cerrar_camara("")

        //calculo de totales por mania
        let [total_unhas, total_pelo, total_objeto, cant_tot_unha, cant_tot_pelo, cant_tot_objeto]  = window.api.obtenerTotal()

        //creo sesion en BD
        fin_sesion = new Date()
        total =  Math.trunc((fin_sesion - inicio_sesion)/1000) //lo pasa de milisegundos a segundos
        let ini_sesion = inicio_sesion.toISOString()
        let fini_sesion = fin_sesion.toISOString()
        let mes_sesion = fin_sesion.getMonth() + 1
        let anno_sesion = fin_sesion.getFullYear()
        await window.api.createSesion(ID_USER, ini_sesion, fini_sesion, total, total_unhas, total_pelo, total_objeto, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, mes_sesion, anno_sesion); 
        //console.log("paso insert sesion")
        //inserto manias en BD

        await window.api.insertManias(ID_USER)
        //console.log("paso insert manias")
        //esta funcion es de ultimaSesion.js, no es necesario importar ya que se
        //importan los script en el html, y puedo usar las funciones de otros archivos
        //siempre y cuando esten en el orden correcto. ver https://es.stackoverflow.com/questions/353796/como-exportar-una-funcion-de-un-archivo-js-a-otro-archivo-js
        await update_dash_ultima_sesion();     
    }   
}



function contactar_profesional(){
    nombre = document.getElementById("nombre_contacto")
    email = document.getElementById("email_contacto")
    telefono = document.getElementById("telefono_contacto")
    region = document.getElementById("region_contacto")
    ciudad = document.getElementById("ciudad_contacto")
    atencion = document.getElementById("atencion_contacto")
    motivo = document.getElementById("motivo_contacto")
    if(nombre.value != null && nombre.value != "", email.value != null && email.value != "", motivo.value != null && motivo.value != "")
    {
        obj = {nombre:nombre.value, email:email.value, telefono:telefono.value, region:region.value, ciudad:ciudad.value, atencion:atencion.value, motivo:motivo.value }
        window.api.contactar_profesional(obj)
    }
}

