const NOTIFICATION_TITLE = 'Desk Habitum'
const CLICK_MESSAGE = 'Notification clicked!'

const NOTIFICATION_BODY_UÑA = 'Morderte las uñas es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PELO = 'Jalarte el pelo es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_OBJETO = 'Morder objetos es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PESTAÑEO = 'Estás pestañeando muy poco, esto puede afectar a tu vista! Toma un descanso :-)'
const NOTIFICATION_BODY_VISUAL = 'Restregarte los ojos es dañino para tu visión. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_NARIZ = 'Urgarte la nariz es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_POSTURA = 'Sentarte de manera incorrecta es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PELLIZCO = 'Pellizcarte la piel es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
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

async function doNotify(tipo_notif, config, cuerpo, icono, mania){ //tipo_notif es para diferenciar las de manias con las generales, y config lo recibe desde process webcam
    let path, myNotification, sonido
    if(tipo_notif == 'mania'){
        if (config.alertasonora == 'on'){
            if (mania == 'unha'){
                path = '../sounds/'+config.unhasound+'.mp3'
            }else if (mania == 'morder'){
                path = '../sounds/'+config.mordersound+'.mp3'
            }else if (mania == 'pelo'){
                path = '../sounds/'+config.pelosound+'.mp3'
            }else if (mania == 'fatiga'){
                path = '../sounds/'+config.fatigasound+'.mp3'
            }else if (mania == 'postura'){
                path = '../sounds/'+config.posturasound+'.mp3'
            }else if (mania == 'piel'){
                path = '../sounds/'+config.pielsound+'.mp3'
            }else if (mania == 'nariz'){
                path = '../sounds/'+config.narizsound+'.mp3'
            }       
            sonido = cargarSonido(path);
            sonido.play();
        }
        if (config.alertavisual == 'on'){
            myNotification = new Notification(NOTIFICATION_TITLE, {
                body: cuerpo,
                icon: icono,
                silent: true
            });
        }
    }else{
        myNotification = new Notification(NOTIFICATION_TITLE, {
            body: cuerpo,
            icon: icono,
            silent: true
        });
        if (config.alertasonorageneral == 'on'){
            path = '../sounds/'+config.sonidonotificaciongeneral+'.mp3'
            sonido = cargarSonido(path);
            sonido.play();
        }
    }
    
}

async function NotificarUña(config){ //tiene que recibir el config user desde test_processWebcam
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_UÑA, icon: 'https://previews.123rf.com/images/tashatuvango/tashatuvango1504/tashatuvango150400671/39236581-stop-nail-biting-sign-painted-open-hand-raised-isolated-on-white-background-.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_UÑA, 'https://previews.123rf.com/images/tashatuvango/tashatuvango1504/tashatuvango150400671/39236581-stop-nail-biting-sign-painted-open-hand-raised-isolated-on-white-background-.jpg', 'unha')
}

async function NotificarPelo(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PELO, icon: 'https://i.pinimg.com/236x/1c/dc/c7/1cdcc71b23ec73fc874f448ec985f88a.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_PELO, 'https://i.pinimg.com/236x/1c/dc/c7/1cdcc71b23ec73fc874f448ec985f88a.jpg', 'pelo')
}

async function NotificarObjeto(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_OBJETO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_OBJETO, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'morder')
}

async function NotificarPestañeo(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PESTAÑEO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_PESTAÑEO, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'fatiga')
}


async function NotificarVisual(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_VISUAL, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_VISUAL, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'fatiga')
}

async function NotificarPostura(){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_POSTURA, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_POSTURA, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'postura')
}

async function NotificarPellizco(){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PELLIZCO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_PELLIZCO, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'piel')
}

async function NotificarNariz(){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_NARIZ, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })*/
    await doNotify('mania', config, NOTIFICATION_BODY_NARIZ, 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg', 'nariz')
}

async function CamaraCargada(config){
    /*Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_CAMARA, icon: 'https://webcam-test.com/ico/webcam.svg'
        })
    })*/
    await doNotify('general', config, NOTIFICATION_BODY_CAMARA, 'https://webcam-test.com/ico/webcam.svg', '')
}


module.exports = { NotificarUña, NotificarPelo, NotificarObjeto, NotificarPestañeo, NotificarVisual, NotificarNariz, NotificarPostura, NotificarPellizco ,CamaraCargada}
