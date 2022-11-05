
let fin_sesion
let total
let nombre, email, telefono, region, ciudad, atencion, profesional, motivo, obj;
let config
function init_cam(){
    window.api.iniciar_camara("")
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
        let [total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo]  = window.api.obtenerTotal()

        //creo sesion en BD
        let inicio_sesion = window.api.fecha_inicio_sesion()
        let fin_sesion = new Date()
        total =  Math.trunc((fin_sesion - inicio_sesion)/1000) //lo pasa de milisegundos a segundos
        let ini_sesion = inicio_sesion.toISOString()
        let fini_sesion = fin_sesion.toISOString()
        let mes_sesion = fin_sesion.getMonth() + 1
        let anno_sesion = fin_sesion.getFullYear()
        await window.api.createSesion(ID_USER, ini_sesion, fini_sesion, total, total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion, "no"); 
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

        let obj = {nombre:nombre.value, email:email.value, telefono:telefono.value, region:region.value, ciudad:ciudad.value, atencion:atencion.value, motivo:motivo.value }
        window.api.contactar_profesional(obj)
    }
}

let cargarSonido1 = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

async function doNotify(id_usuario, cuerpo){
    await window.api.getConfig(id_usuario).then(result => {
        config = result[0];
    });
    Notification.requestPermission().then(function (result){
        new Notification("GRUPO", { 
            body: cuerpo, icon: 'https://cdn-icons-png.flaticon.com/512/244/244060.png', silent: true
        })
    })
    if (config.alertasonorageneral == 'on'){
        let path = '../sounds/'+config.sonidonotificaciongeneral+'.mp3'
        let sonido = cargarSonido1(path);
        sonido.play();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function unirse_grupo(){
    let ID = window.api.get_user_id("")
    code = document.getElementById("codigo_equipo")
    window.api.solicitudUnirseGrupo(ID, code.value)
    doNotify(ID, "Solicitud de unión Enviada")
    sleep(1000)
}

function crear_grupo(){
    let ID = window.api.get_user_id("")
    nombre = document.getElementById("nombre_equipo")
    window.api.createGrupo(ID, nombre.value)
    doNotify(ID, "Creación de grupo exitosa")
    sleep(1000)
}

async function eliminar_grupo(){
    let id_new = window.api.get_user_id("")
    let code_new = await window.api.getCodeGrupo(id_new)
    await window.api.eliminarGrupo(code_new).then(r => window.location.href= "liderEquipo2.html")
    //document.getElementById("boton_eliminar_grupo").setAttribute("href", "liderEquipo2.html")
    
}

function takePhoto () {
    window.api3.takePhoto()
}
