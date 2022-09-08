const id_User = 2
const morderUnha = document.getElementById("morderUnha")
const morderObjetos = document.getElementById("morderObjetos")
const jalarPelo = document.getElementById("jalarPelo")
const fatigaVisual = document.getElementById("fatigaVisual")
const malaPostura = document.getElementById("malaPostura")
const alertaVisual = document.getElementById("alertaVisual")
const alertaSonora = document.getElementById("alertaSonora")
const intervaloNotificacion = document.getElementById("intervaloNotificacion")


function saveSettings(){
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
    window.api.postConfig(
        CONF[0],
        CONF[1],
        CONF[2],
        CONF[3],
        CONF[4],
        CONF[5],
        CONF[6],
        CONF[7],
        CONF[8]
    )
}

function actualizarSettings(){
    $('#morderObjetos').bootstrapToggle('off') 
    console.log(morderObjetos.checked)
    
}

//window.onload = actualizarSettings;