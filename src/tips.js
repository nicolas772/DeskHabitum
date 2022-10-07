let ID_USER = window.api.get_user_id("")
var pelos_10_sesiones = [];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [];

function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}

async function actualizarTips(){
    
    await window.api.percentageTenSesionUnhas(ID_USER).then(result => {
        unhas_10_sesiones = result;
      });

    await window.api.percentageTenSesionPelo(ID_USER).then(result => {
      pelos_10_sesiones = result;
    });

    await window.api.percentageTenSesionMorder(ID_USER).then(result => {
      objetos_10_sesiones = result;
    });

    let unhaAvg = ArrayAvg(unhas_10_sesiones).toFixed(2)
    let peloAvg = ArrayAvg(pelos_10_sesiones).toFixed(2)
    let morderAvg = ArrayAvg(objetos_10_sesiones).toFixed(2)
    let fatigaAvg = 10
    let posturaAvg = 20
    //tipos de estado: Saludable (nada), Normal (cometes, pero es dentro del rango aceptable), Grave (necesitas ayuda medica)
    //se puede mostrar el promedio de las ultimas 10 sesiones

    let fatiga_state = 'Grave'
    let unha_state = 'Grave'
    let pelo_state = 'Grave'
    let morder_state = 'Grave'
    let postura_state = 'Grave'
    document.getElementById("fatiga-state").append(fatiga_state)
    document.getElementById("unha-state").append(unha_state)
    document.getElementById("pelo-state").append(pelo_state)
    document.getElementById("morder-state").append(morder_state)
    document.getElementById("postura-state").append(postura_state)
    document.getElementById("fatiga-avg").append(fatigaAvg+"%")
    document.getElementById("unha-avg").append(unhaAvg+"%")
    document.getElementById("pelo-avg").append(peloAvg+"%")
    document.getElementById("morder-avg").append(morderAvg+"%")
    document.getElementById("postura-avg").append(posturaAvg+"%")
}

function init3(){
    actualizarTips();
    actualizarNavbar();
}

window.onload = init3;