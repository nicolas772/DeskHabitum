const id_User = 2
const morderUnha = document.getElementById("morderUnha")
const morderObjetos = document.getElementById("morderObjetos")
const jalarPelo = document.getElementById("jalarPelo")
const fatigaVisual = document.getElementById("fatigaVisual")
const malaPostura = document.getElementById("malaPostura")
const alertaVisual = document.getElementById("alertaVisual")
const alertaSonora = document.getElementById("alertaSonora")
const intervaloNotificacion = document.getElementById("intervaloNotificacion")
var user_config 
const NOTIFICATION_TITLE = 'Desk Habitum'
const NOTIFICATION_BODY = 'Configuración Guardada'
const CLICK_MESSAGE = 'Notification clicked!'

async function saveSettings(){
    let configList = [
        id_User, 
        morderUnha.checked, 
        morderObjetos.checked,
        jalarPelo.checked,
        fatigaVisual.checked,
        malaPostura.checked,
        alertaVisual.checked,
        alertaSonora.checked,
        intervaloNotificacion.value
    ]
    console.log(intervaloNotificacion.value)
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
    console.log(configList)
    console.log(CONF)
    await window.api.updateConfig(
        CONF[0],
        CONF[1],
        CONF[2],
        CONF[3],
        CONF[4],
        CONF[5],
        CONF[6],
        CONF[7],
        CONF[8]
    ).then(result => {
        let resultado=result
    })
    doNotify();
}

async function actualizarSettings(){
    
    await window.api.getConfig(id_User).then(result => {
        config = result[0];
    });
    console.log(config)
    $('#morderUnha').bootstrapToggle(config.morderunha)
    $('#morderObjetos').bootstrapToggle(config.morderobjetos) 
    $('#jalarPelo').bootstrapToggle(config.jalarpelo) 
    $('#fatigaVisual').bootstrapToggle(config.fatigavisual) 
    $('#malaPostura').bootstrapToggle(config.malapostura) 
    $('#alertaVisual').bootstrapToggle(config.alertavisual) 
    $('#alertaSonora').bootstrapToggle(config.alertasonora)
    $('#intervaloNotificacion').val(config.intervalonotificacion)
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