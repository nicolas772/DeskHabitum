const NOTIFICATION_TITLE = 'Desk Habitum'
const CLICK_MESSAGE = 'Notification clicked!'

const NOTIFICATION_BODY_UÑA = 'Morderte las uñas es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PELO = 'Jalarte el pelo es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_OBJETO = 'Morder objetos es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PESTAÑEO = 'Estás pestañeando muy poco, esto puede afectar a tu vista! Toma un descanso :-)'
const NOTIFICATION_BODY_VISUAL = 'Restregarte los ojos es dañino para tu visión. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_CAMARA = 'Reconocimiento iniciado'

const cargarSonido = function (fuente) { //esta funcion sirve para reproducir sonido en notificación
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

async function doNotify(tipo_notif, config, cuerpo, icono){ //tipo_notif es para diferenciar las de manias con las generales, y config lo recibe desde process webcam
    console.log("entra a donotify")
    let path
    let myNotification = new Notification(NOTIFICATION_TITLE, {
        body: cuerpo,
        icon: icono,
        silent: true
    });
    if(tipo_notif == 'mania'){
        console.log("entra a if donotify")
        path = '../sounds/'+config.sonidonotificacionmania+'.mp3'
    }else{
        path = '../sounds/'+config.sonidonotificaciongeneral+'.mp3'
    }
    let sonido = cargarSonido(path);
    sonido.play();
}

async function NotificarUña(config){ //tiene que recibir el config user desde test_processWebcam
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_UÑA, icon: 'https://previews.123rf.com/images/tashatuvango/tashatuvango1504/tashatuvango150400671/39236581-stop-nail-biting-sign-painted-open-hand-raised-isolated-on-white-background-.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_UÑA, 'https://previews.123rf.com/images/tashatuvango/tashatuvango1504/tashatuvango150400671/39236581-stop-nail-biting-sign-painted-open-hand-raised-isolated-on-white-background-.jpg')
}

async function NotificarPelo(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PELO, icon: 'https://i.pinimg.com/236x/1c/dc/c7/1cdcc71b23ec73fc874f448ec985f88a.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_PELO, 'https://i.pinimg.com/236x/1c/dc/c7/1cdcc71b23ec73fc874f448ec985f88a.jpg')
}

async function NotificarObjeto(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_OBJETO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_OBJETO, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg')
}

async function NotificarPestañeo(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PESTAÑEO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_PESTAÑEO, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg')
}


async function NotificarVisual(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_VISUAL, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_VISUAL, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg')
}

async function CamaraCargada(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_CAMARA, icon: 'https://webcam-test.com/ico/webcam.svg'
        })
    })*/
    await doNotify('general', config, NOTIFICATION_BODY_CAMARA, 'https://webcam-test.com/ico/webcam.svg')
}


module.exports = { NotificarUña, NotificarPelo, NotificarObjeto, NotificarPestañeo, NotificarVisual, CamaraCargada}