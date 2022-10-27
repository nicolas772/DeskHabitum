const NOTIFICATION_TITLE = 'Desk Habitum'
const CLICK_MESSAGE = 'Notification clicked!'

const NOTIFICATION_BODY_UÑA = 'Morderte las uñas es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PELO = 'Jalarte el pelo es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_OBJETO = 'Morder objetos es malo para tu salud. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_PESTAÑEO = 'Estás pestañeando muy poco, esto puede afectar a tu vista! Toma un descanso :-)'
const NOTIFICATION_BODY_VISUAL = 'Restregarte los ojos es dañino para tu visión. Seria bueno que dejaras de hacerlo :-)'
const NOTIFICATION_BODY_CAMARA = 'Reconocimiento iniciado'

function NotificarUña(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_UÑA, icon: 'https://previews.123rf.com/images/tashatuvango/tashatuvango1504/tashatuvango150400671/39236581-stop-nail-biting-sign-painted-open-hand-raised-isolated-on-white-background-.jpg'
        })
    })
}

function NotificarPelo(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PELO, icon: 'https://i.pinimg.com/236x/1c/dc/c7/1cdcc71b23ec73fc874f448ec985f88a.jpg'
        })
    })
}

function NotificarObjeto(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_OBJETO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })
}

function NotificarPestañeo(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PESTAÑEO, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })
}


function NotificarVisual(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_VISUAL, icon: 'https://img.favpng.com/22/11/8/meditation-yoga-series-lotus-position-asana-png-favpng-pm1qsy0QY8Y4QPXgTaQqUCvUJ.jpg'
        })
    })
}

function CamaraCargada(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_CAMARA, icon: 'https://webcam-test.com/ico/webcam.svg'
        })
    })
}


module.exports = { NotificarUña, NotificarPelo, NotificarObjeto, NotificarPestañeo, NotificarVisual, CamaraCargada}