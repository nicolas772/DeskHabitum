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
const NOTIFICATION_TITLE = 'Configuración guardada'
const NOTIFICATION_BODY = 'Si tienes el monitoreo activado, tendrás que reiniciar monitoreo para tu nueva configuración.'
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
        tipoNotificacion.value //aqui poner .value quiza, cuando este implementado front
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
    $('#tipoNotificacion').val(config.tiponotificacion)

    if(config.tiponotificacion == 'tiempo'){
        $('#tiempoNotificacion').val(config.tiemponotificacion)
        $('#tipo-intervalo').hide()
    }else if(config.tiponotificacion == 'reconocimientos'){
        $('#intervaloNotificacion').val(config.intervalonotificacion)
        $('#tipo-tiempo').hide()
    }
    
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