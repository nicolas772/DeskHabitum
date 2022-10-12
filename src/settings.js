let ID_USER = window.api.get_user_id("")
const morderUnha = document.getElementById("morderUnha")
const morderObjetos = document.getElementById("morderObjetos")
const jalarPelo = document.getElementById("jalarPelo")
const fatigaVisual = document.getElementById("fatigaVisual")
const malaPostura = document.getElementById("malaPostura")
const alertaVisual = document.getElementById("alertaVisual")
const alertaSonora = document.getElementById("alertaSonora")
const intervaloNotificacion = document.getElementById("intervaloNotificacion")
const tiempoNotificacion = document.getElementById("tiempoNotificacion")
const tipoNotificacion = document.getElementById("tipoNotificacion")
//configuraciones pomodoro
const duracionPomo = document.getElementById("duracionPomo")
const duracionShortBreak = document.getElementById("duracionShortBreak")
const duracionLongBreak = document.getElementById("duracionLongBreak")
const intervaloLongBreak = document.getElementById("intervaloLongBreak")
const cantidadPomodoros = document.getElementById("cantidadPomodoros")
const NOTIFICATION_TITLE = 'Configuración guardada'
const NOTIFICATION_BODY = 'Si tienes el monitoreo activado, tendrás que reiniciarlo para tu nueva configuración.'
const CLICK_MESSAGE = 'Notification clicked!'

async function saveSettings(){
    
    let configList = [
        ID_USER, 
        morderUnha.checked, 
        morderObjetos.checked,
        jalarPelo.checked,
        fatigaVisual.checked,
        malaPostura.checked,
        alertaVisual.checked,
        alertaSonora.checked,
        intervaloNotificacion.value,
        tiempoNotificacion.value,
        tipoNotificacion.value,
        duracionPomo.value,
        duracionShortBreak.value,
        duracionLongBreak.value,
        intervaloLongBreak.value,
        cantidadPomodoros.value
    ]
    let CONF = configList.map(function(e){
        switch(e) {
            case true:
                return 'on';
                break;
            case false:
                return 'off';
                break;
            default:
                return e;
                break;
        }
    })
    await window.api.updateConfig(
        CONF[0],
        CONF[1],
        CONF[2],
        CONF[3],
        CONF[4],
        CONF[5],
        CONF[6],
        CONF[7],
        CONF[8],
        CONF[9],
        CONF[10],
        CONF[11],
        CONF[12],
        CONF[13],
        CONF[14],
        CONF[15]
    ).then(result => {
        let resultado=result
    })
    doNotify3();
}

async function actualizarSettings(){
    
    await window.api.getConfig(ID_USER).then(result => {
        config = result[0];
    });
    $('#morderUnha').bootstrapToggle(config.morderunha)
    $('#morderObjetos').bootstrapToggle(config.morderobjetos) 
    $('#jalarPelo').bootstrapToggle(config.jalarpelo) 
    $('#fatigaVisual').bootstrapToggle(config.fatigavisual) 
    $('#malaPostura').bootstrapToggle(config.malapostura) 
    $('#alertaVisual').bootstrapToggle(config.alertavisual) 
    $('#alertaSonora').bootstrapToggle(config.alertasonora)
    $('#tipoNotificacion').val(config.tiponotificacion)
    $('#duracionPomo').val(config.duracionpomo)
    $('#duracionShortBreak').val(config.duracionshortbreak)
    $('#duracionLongBreak ').val(config.duracionlongbreak)
    $('#intervaloLongBreak').val(config.intervalolongbreak)
    $('#cantidadPomodoros').val(config.cantidadpomodoros)
    if(config.tiponotificacion == 'tiempo'){
        $('#tiempoNotificacion').val(config.tiemponotificacion)
        $('#tipo-intervalo').hide()
    }else if(config.tiponotificacion == 'reconocimientos'){
        $('#intervaloNotificacion').val(config.intervalonotificacion)
        $('#tipo-tiempo').hide()
    }
    
}

async function actualizarEquipoDiv(){ //esta funcion actualiza el div del equipo. Si está en un equipo, muestra el id del equipo. Si no esta, le da la opción de ingresar un codigo
    
}

function init2(){
    actualizarSettings();
    actualizarNavbar();
}

window.onload = init2;

function doNotify3(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY, icon: 'https://cdn-icons-png.flaticon.com/512/244/244060.png'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}

//funcion que permite cambiar las opciones de intervalo de notificacion
tipoNotificacion.addEventListener('change', (event) => {
    if (event.target.value == 'tiempo'){
        $('#tipo-intervalo').hide()
        $('#tipo-tiempo').show()
    }else if(event.target.value == 'reconocimientos'){
        $('#tipo-tiempo').hide()
        $('#tipo-intervalo').show()
    }
});