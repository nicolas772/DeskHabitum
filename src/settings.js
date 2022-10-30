let ID_USER = window.api.get_user_id("")
const morderUnha = document.getElementById("morderUnha")
const morderObjetos = document.getElementById("morderObjetos")
const jalarPelo = document.getElementById("jalarPelo")
const fatigaVisual = document.getElementById("fatigaVisual")
const malaPostura = document.getElementById("malaPostura")
const alertaSonoraGeneral = document.getElementById("alertaSonoraGeneral")//nuevo
const sonidoNotificacionGeneral = document.getElementById("sonidoNotificacionGeneral")
const alertaVisual = document.getElementById("alertaVisual")
const alertaSonora = document.getElementById("alertaSonora")
const tipoNotificacion = document.getElementById("tipoNotificacion")
const intervaloNotificacion = document.getElementById("intervaloNotificacion")
const tiempoNotificacion = document.getElementById("tiempoNotificacion")
const temaNotificacionMania = document.getElementById("temaNotificacionMania")//cambiar sonidoNotificacionMania por temaNotificacionMania
const unhaSound = document.getElementById("unhaSound")//nuevo
const morderSound = document.getElementById("morderSound")//nuevo
const peloSound = document.getElementById("peloSound")//nuevo
const fatigaSound = document.getElementById("fatigaSound")//nuevo
const posturaSound = document.getElementById("posturaSound")//nuevo
//configuraciones pomodoro
const duracionPomo = document.getElementById("duracionPomo")
const duracionShortBreak = document.getElementById("duracionShortBreak")
const duracionLongBreak = document.getElementById("duracionLongBreak")
const intervaloLongBreak = document.getElementById("intervaloLongBreak")
const cantidadPomodoros = document.getElementById("cantidadPomodoros")
const duracionPomo1 = document.getElementById("duracionPomo1")
const duracionShortBreak1 = document.getElementById("duracionShortBreak1")
const duracionLongBreak1 = document.getElementById("duracionLongBreak1")
const intervaloLongBreak1 = document.getElementById("intervaloLongBreak1")
const cantidadPomodoros1 = document.getElementById("cantidadPomodoros1")
const NOTIFICATION_TITLE = 'Configuración guardada'
const NOTIFICATION_BODY = 'Si tienes el monitoreo activado, tendrás que reiniciarlo para tu nueva configuración.'
const CLICK_MESSAGE = 'Notification clicked!'
let configList

async function saveSettings(){
    let codeGrupo1

    await window.api.getCodeGrupoUser(ID_USER).then(result => {
        codeGrupo1 = result;
    });
    if(codeGrupo1.length != 0){
        configList = [
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
            duracionPomo1.value,
            duracionShortBreak1.value,
            duracionLongBreak1.value,
            intervaloLongBreak1.value,
            cantidadPomodoros1.value,
            sonidoNotificacionGeneral.value,
            temaNotificacionMania.value,//modificar este en bd
            alertaSonoraGeneral.checked,//agregar de aqui en adelante en bd
            unhaSound.value,
            morderSound.value,
            peloSound.value,
            fatigaSound.value,
            posturaSound.value
        ]   
    }else{
        configList = [
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
            cantidadPomodoros.value,
            sonidoNotificacionGeneral.value,
            temaNotificacionMania.value,
            alertaSonoraGeneral.checked,//agregar de aqui en adelante en bd
            unhaSound.value,
            morderSound.value,
            peloSound.value,
            fatigaSound.value,
            posturaSound.value
        ]
    }

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
        CONF[15],
        CONF[16],
        CONF[17],
        CONF[18],
        CONF[19],
        CONF[20],
        CONF[21],
        CONF[22],
        CONF[23]
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
    $('#temaNotificacionMania').val(config.temanotificacionmania)
    $('#sonidoNotificacionGeneral').val(config.sonidonotificaciongeneral)
    $('#duracionPomo').val(config.duracionpomo)
    $('#duracionShortBreak').val(config.duracionshortbreak)
    $('#duracionLongBreak ').val(config.duracionlongbreak)
    $('#intervaloLongBreak').val(config.intervalolongbreak)
    $('#cantidadPomodoros').val(config.cantidadpomodoros)
    $('#duracionPomo').val(config.duracionpomo)
    $('#duracionShortBreak').val(config.duracionshortbreak)
    $('#duracionLongBreak').val(config.duracionlongbreak)
    $('#intervaloLongBreak').val(config.intervalolongbreak)
    $('#cantidadPomodoros').val(config.cantidadpomodoros)
    $('#duracionPomo1').val(config.duracionpomo)
    $('#duracionShortBreak1').val(config.duracionshortbreak)
    $('#duracionLongBreak1 ').val(config.duracionlongbreak)
    $('#intervaloLongBreak1').val(config.intervalolongbreak)
    $('#cantidadPomodoros1').val(config.cantidadpomodoros)
    $('#alertaSonoraGeneral').bootstrapToggle(config.alertasonorageneral)
    $('#unhaSound').val(config.unhasound)
    $('#morderSound').val(config.mordersound)
    $('#peloSound').val(config.pelosound)
    $('#fatigaSound').val(config.fatigasound)
    $('#posturaSound').val(config.posturasound)
    
    
    if(config.tiponotificacion == 'tiempo'){
        $('#tiempoNotificacion').val(config.tiemponotificacion)
        $('#tipo-intervalo').hide()
    }else if(config.tiponotificacion == 'reconocimientos'){
        $('#intervaloNotificacion').val(config.intervalonotificacion)
        $('#tipo-tiempo').hide()
    }

    if(config.temanotificacionmania == 'personalizado'){
        $('#unhaSound').prop( "disabled", false);
        $('#morderSound').prop( "disabled", false);
        $('#peloSound').prop( "disabled", false);
        $('#fatigaSound').prop( "disabled", false);
        $('#posturaSound').prop( "disabled", false);
    }else{
        $('#unhaSound').prop( "disabled", true );
        $('#morderSound').prop( "disabled", true );
        $('#peloSound').prop( "disabled", true );
        $('#fatigaSound').prop( "disabled", true );
        $('#posturaSound').prop( "disabled", true );
    }

}

async function actualizarEquipoDiv(){ //esta funcion actualiza el div html del equipo. Si está en un equipo, muestra el id del equipo. Si no esta, le da la opción de ingresar un codigo
    let codeGrupo
    $('#unirse_a_equipo').hide()
    $('#unido_a_equipo').hide()
    await window.api.getCodeGrupoUser(ID_USER).then(result => {
        codeGrupo = result;
    });
    console.log("code grupo:", codeGrupo)
    if(codeGrupo.length != 0){
        $('#unido_a_equipo').show()
        $('#codigo_equipo_actual').val(codeGrupo[0]['code'])    
    }else{
        $('#unirse_a_equipo').show()
    }
    
}

function init2(){
    actualizarSettings();
    actualizarEquipoDiv()
    actualizarNavbar();
}

window.onload = init2;

const cargarSonido = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

async function doNotify3(){
    await window.api.getConfig(ID_USER).then(result => {
        config = result[0];
    });
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY, 
            icon: 'https://cdn-icons-png.flaticon.com/512/244/244060.png',
            silent: true
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
    if (config.alertasonorageneral == 'on'){
        let path = '../sounds/'+config.sonidonotificaciongeneral+'.mp3'
        let sonido = cargarSonido(path);
        sonido.play();
    }
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

//funcion que permite bloquear las opciones cuando se elige un tema particular
temaNotificacionMania.addEventListener('change', (event) => {
    if (event.target.value == 'tema1'){
        $('#unhaSound').val('sound1t1')
        $('#morderSound').val('sound2t1')
        $('#peloSound').val('sound3t1')
        $('#fatigaSound').val('sound4t1')
        $('#posturaSound').val('sound5t1')
        $('#unhaSound').prop( "disabled", true );
        $('#morderSound').prop( "disabled", true );
        $('#peloSound').prop( "disabled", true );
        $('#fatigaSound').prop( "disabled", true );
        $('#posturaSound').prop( "disabled", true );
    }else if(event.target.value == 'tema2'){
        $('#unhaSound').val('sound1t2')
        $('#morderSound').val('sound2t2')
        $('#peloSound').val('sound3t2')
        $('#fatigaSound').val('sound4t2')
        $('#posturaSound').val('sound5t2')
        $('#unhaSound').prop( "disabled", true );
        $('#morderSound').prop( "disabled", true );
        $('#peloSound').prop( "disabled", true );
        $('#fatigaSound').prop( "disabled", true );
        $('#posturaSound').prop( "disabled", true );
    }else if(event.target.value == 'personalizado'){
        $('#unhaSound').prop( "disabled", false);
        $('#morderSound').prop( "disabled", false);
        $('#peloSound').prop( "disabled", false);
        $('#fatigaSound').prop( "disabled", false);
        $('#posturaSound').prop( "disabled", false);
    }
});

sonidoNotificacionGeneral.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});

unhaSound.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});

morderSound.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});

peloSound.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});

fatigaSound.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});

posturaSound.addEventListener('change', (event) => {
    let path = '../sounds/'+event.target.value+'.mp3'
    let sonido = cargarSonido(path);
    sonido.play();
});