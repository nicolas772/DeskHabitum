let ID_USER = window.api.get_user_id("")
const NOTIFICATION_TITLE = 'Desk Habitum'
const CLICK_MESSAGE = 'Notification clicked!'

const NOTIFICATION_BODY_UÑA = 'Morderte las uñas es malo para tu salud. Seria bueno que dejaras de hacerlo :)'
const NOTIFICATION_BODY_PELO = 'Jalarte el pelo es malo para tu salud. Seria bueno que dejaras de hacerlo :)'
const NOTIFICATION_BODY_OBJETO = 'Morder objetos es malo para tu salud. Seria bueno que dejaras de hacerlo :)'


function NotificarUña(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_UÑA, icon: 'http://placekitten.com/g/300/300'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}

function NotificarPelo(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_PELO, icon: 'http://placekitten.com/g/300/300'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}

function NotificarObjeto(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY_OBJETO, icon: 'http://placekitten.com/g/300/300'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}


module.exports = { NotificarUña, NotificarPelo, NotificarObjeto }