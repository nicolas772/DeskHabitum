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
//const tipoNotificacion = document.getElementById("tipoNotificacion")
const tipoNotificacion = 'reconocimientos' //puede ser tiempo
const NOTIFICATION_TITLE = 'Desk Habitum'
const NOTIFICATION_BODY = 'Configuración Guardada. Si tienes el monitoreo activado, tendrás que apagar y encender monitoreo para tu nueva configuración.'
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
        tipoNotificacion //aqui poner .value quiza, cuando este implementado front
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
        CONF[10]
    ).then(result => {
        let resultado=result
    })
    doNotify();
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
    $('#intervaloNotificacion').val(config.intervalonotificacion)
    $('#tiempoNotificacion').val(config.tiemponotificacion)
    //$('#tipoNotificacion').val(config.tiponotificacion)//esto cambiara segun el tipo de elemento html que se ocupe
}

window.onload = actualizarSettings;

function doNotify(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY, icon: 'http://placekitten.com/g/300/300'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}

/*codigo para notificacion
$('.btn').click(function(){
            $('.alerta').removeClass("esconder");
            $('.alerta').addClass("mostrar");
        });

        $('.close-btn').click(function(){
            $('.alerta').addClass("esconder");
            $('.alerta').removeClass("mostrar");


        });
*/ 