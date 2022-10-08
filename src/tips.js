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

    let unhaAvg = ArrayAvg(unhas_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que se comio las uñas en las ultimas 10 sesiones
    let morderAvg = ArrayAvg(objetos_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que mordio un objeto
    let peloAvg = ArrayAvg(pelos_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que se jalo el pelo en las ultimas sesiones
    let fatigaAvg = 3 //cantidad promedio que se notifico de fatiga visual por hora al usuario en las ultimas 10 sesiones
    //esto cambiarlo cuando se implemente el reconocimiento de postura
    let posturaAvg = 7 //cantidad promedio que se notifico de mala postura por hora al usuario en las ultimas 10 sesiones
    let unha_state, morder_state, pelo_state, fatiga_state, postura_state;
    let unha_color, morder_color, pelo_color, fatiga_color, postura_color;
    
    if (unhaAvg < 5){
      unha_state = 'Saludable'
      unha_color = 'green'
    }else if (unhaAvg < 40){
      unha_state = 'Leve'
      unha_color = '#FF9E23'
    }else{
      unha_state = 'Delicado'
      unha_color = 'red'
    }

    if (morderAvg < 5){
      morder_state = 'Saludable'
      morder_color = 'green'
    }else if (morderAvg < 40){
      morder_state = 'Leve'
      morder_color = '#FF9E23'
    }else{
      morder_state = 'Delicado'
      morder_color = 'red'
    }

    if (peloAvg < 5){
      pelo_state = 'Saludable'
      pelo_color = 'green'
    }else if (peloAvg < 40){
      pelo_state = 'Leve'
      pelo_color = '#FF9E23'
    }else{
      pelo_state = 'Delicado'
      pelo_color = 'red'
    }
  
    if (fatigaAvg < 2){ //promedio por hora
      fatiga_state = 'Saludable'
      fatiga_color = 'green'
    }else if (fatigaAvg < 5){//promedio por hora
      fatiga_state = 'Leve'
      fatiga_color = '#FF9E23'
    }else{
      fatiga_state = 'Delicado'
      fatiga_color = 'red'
    }

    if (posturaAvg < 2){ //promedio por hora
      postura_state = 'Saludable'
      postura_color = 'green'
    }else if (posturaAvg < 5){//promedio por hora
      postura_state = 'Leve'
      postura_color = '#FF9E23'
    }else{
      postura_state = 'Delicado'
      postura_color = 'red'
    }

    document.getElementById("unha-state").append(unha_state)
    document.getElementById("unha-state").style.color = unha_color;
    document.getElementById("unha-avg").append(unhaAvg+"%")
    document.getElementById("morder-state").append(morder_state)
    document.getElementById("morder-state").style.color = morder_color;
    document.getElementById("morder-avg").append(morderAvg+"%")
    document.getElementById("pelo-state").append(pelo_state)
    document.getElementById("pelo-state").style.color = pelo_color;
    document.getElementById("pelo-avg").append(peloAvg+"%")
    document.getElementById("fatiga-state").append(fatiga_state)
    document.getElementById("fatiga-state").style.color = fatiga_color;
    document.getElementById("fatiga-avg").append(fatigaAvg+" notificaciones por hora")
    document.getElementById("postura-state").append(postura_state)
    document.getElementById("postura-state").style.color = postura_color;
    document.getElementById("postura-avg").append(posturaAvg+" notificaciones por hora")
}

function init3(){
    actualizarTips();
    actualizarNavbar();
}

window.onload = init3;