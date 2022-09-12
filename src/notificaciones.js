const NOTIFICATION_TITLE = 'Desk Habitum'
const NOTIFICATION_BODY = 'Morderte las uñas es malo para tu salud. Seria bueno que dejaras de hacerlo :)'
const CLICK_MESSAGE = 'Notification clicked!'


function doNotify(){
    Notification.requestPermission().then(function (result){
        new Notification(NOTIFICATION_TITLE, { 
            body: NOTIFICATION_BODY, icon: 'http://placekitten.com/g/300/300'
        })
        .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE
    })
}


module.exports = { doNotify }