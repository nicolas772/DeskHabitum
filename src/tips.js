let ID_USER = window.api.get_user_id("")
var pelos_10_sesiones = [];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [];
let unha_state, morder_state, pelo_state, fatiga_state, postura_state;
let unha_color, morder_color, pelo_color, fatiga_color, postura_color;
let lista_consejos = window.api.readConsejos()
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
    //let lista_consejos = window.api.readConsejos()

    let unhaAvg = ArrayAvg(unhas_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que se comio las uñas en las ultimas 10 sesiones
    let morderAvg = ArrayAvg(objetos_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que mordio un objeto
    let peloAvg = ArrayAvg(pelos_10_sesiones).toFixed(2) //porcentaje promedio del tiempo total que se jalo el pelo en las ultimas sesiones
    let fatigaAvg = 1 //cantidad promedio que se notifico de fatiga visual por hora al usuario en las ultimas 10 sesiones
    //esto cambiarlo cuando se implemente el reconocimiento de postura
    let posturaAvg = 7 //cantidad promedio que se notifico de mala postura por hora al usuario en las ultimas 10 sesiones
    /*let unha_state, morder_state, pelo_state, fatiga_state, postura_state;
    let unha_color, morder_color, pelo_color, fatiga_color, postura_color;*/
    
    if (unhaAvg < 5){
      unha_state = 'Bajo'
      unha_color = 'green'
      let consejos1 = lista_consejos[0]["consejos"][0]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos1.length; i++) {
        let etiquetaName = '#unha-c'+(i+1).toString()
        let tituloName = 'unha-t'+(i+1).toString()
        let parrafoName = 'unha-p'+(i+1).toString()
        let imagenName = 'unha-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos1[i]['img']
        document.getElementById(tituloName).append(consejos1[i]['titulo'])
        document.getElementById(parrafoName).append(consejos1[i]['c'])
        $(etiquetaName).show()
      }
    }else if (unhaAvg < 40){
      unha_state = 'Medio'
      unha_color = '#FF9E23'
      let consejos2 = lista_consejos[0]["consejos"][1]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos2.length; i++) {
        let etiquetaName = '#unha-c'+(i+1).toString()
        let tituloName = 'unha-t'+(i+1).toString()
        let parrafoName = 'unha-p'+(i+1).toString()
        let imagenName = 'unha-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos2[i]['img']
        document.getElementById(tituloName).append(consejos2[i]['titulo'])
        document.getElementById(parrafoName).append(consejos2[i]['c'])
        $(etiquetaName).show()
      }
    }else{
      unha_state = 'Alto'
      unha_color = 'red'
      let consejos3 = lista_consejos[0]["consejos"][2]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos3.length; i++) {
        let etiquetaName = '#unha-c'+(i+1).toString()
        let tituloName = 'unha-t'+(i+1).toString()
        let parrafoName = 'unha-p'+(i+1).toString()
        let imagenName = 'unha-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos3[i]['img']
        document.getElementById(tituloName).append(consejos3[i]['titulo'])
        document.getElementById(parrafoName).append(consejos3[i]['c'])
        $(etiquetaName).show()
      }
    }

    if (morderAvg < 5){
      morder_state = 'Bajo'
      morder_color = 'green'
      let consejos1 = lista_consejos[1]["consejos"][0]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos1.length; i++) {
        let etiquetaName = '#morder-c'+(i+1).toString()
        let tituloName = 'morder-t'+(i+1).toString()
        let parrafoName = 'morder-p'+(i+1).toString()
        let imagenName = 'morder-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos1[i]['img']
        document.getElementById(tituloName).append(consejos1[i]['titulo'])
        document.getElementById(parrafoName).append(consejos1[i]['c'])
        $(etiquetaName).show()
      }
    }else if (morderAvg < 40){
      morder_state = 'Medio'
      morder_color = '#FF9E23'
      let consejos2 = lista_consejos[1]["consejos"][1]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos2.length; i++) {
        let etiquetaName = '#morder-c'+(i+1).toString()
        let tituloName = 'morder-t'+(i+1).toString()
        let parrafoName = 'morder-p'+(i+1).toString()
        let imagenName = 'morder-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos2[i]['img']
        document.getElementById(tituloName).append(consejos2[i]['titulo'])
        document.getElementById(parrafoName).append(consejos2[i]['c'])
        $(etiquetaName).show()
      }
    }else{
      morder_state = 'Alto'
      morder_color = 'red'
      let consejos3 = lista_consejos[1]["consejos"][2]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos3.length; i++) {
        let etiquetaName = '#morder-c'+(i+1).toString()
        let tituloName = 'morder-t'+(i+1).toString()
        let parrafoName = 'morder-p'+(i+1).toString()
        let imagenName = 'morder-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos3[i]['img']
        document.getElementById(tituloName).append(consejos3[i]['titulo'])
        document.getElementById(parrafoName).append(consejos3[i]['c'])
        $(etiquetaName).show()
      }
    }

    if (peloAvg < 5){
      pelo_state = 'Bajo'
      pelo_color = 'green'
      let consejos1 = lista_consejos[2]["consejos"][0]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos1.length; i++) {
        let etiquetaName = '#pelo-c'+(i+1).toString()
        let tituloName = 'pelo-t'+(i+1).toString()
        let parrafoName = 'pelo-p'+(i+1).toString()
        let imagenName = 'pelo-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos1[i]['img']
        document.getElementById(tituloName).append(consejos1[i]['titulo'])
        document.getElementById(parrafoName).append(consejos1[i]['c'])
        $(etiquetaName).show()
      }
    }else if (peloAvg < 40){
      pelo_state = 'Medio'
      pelo_color = '#FF9E23'
      let consejos2 = lista_consejos[2]["consejos"][1]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos2.length; i++) {
        let etiquetaName = '#pelo-c'+(i+1).toString()
        let tituloName = 'pelo-t'+(i+1).toString()
        let parrafoName = 'pelo-p'+(i+1).toString()
        let imagenName = 'pelo-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos2[i]['img']
        document.getElementById(tituloName).append(consejos2[i]['titulo'])
        document.getElementById(parrafoName).append(consejos2[i]['c'])
        $(etiquetaName).show()
      }
    }else{
      pelo_state = 'Alto'
      pelo_color = 'red'
      let consejos3 = lista_consejos[2]["consejos"][2]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos3.length; i++) {
        let etiquetaName = '#pelo-c'+(i+1).toString()
        let tituloName = 'pelo-t'+(i+1).toString()
        let parrafoName = 'pelo-p'+(i+1).toString()
        let imagenName = 'pelo-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos3[i]['img']
        document.getElementById(tituloName).append(consejos3[i]['titulo'])
        document.getElementById(parrafoName).append(consejos3[i]['c'])
        $(etiquetaName).show()
      }
    }
  
    if (fatigaAvg < 2){ //promedio por hora
      fatiga_state = 'Bajo'
      fatiga_color = 'green'
      let consejos1 = lista_consejos[3]["consejos"][0]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos1.length; i++) {
        let etiquetaName = '#fatiga-c'+(i+1).toString()
        let tituloName = 'fatiga-t'+(i+1).toString()
        let parrafoName = 'fatiga-p'+(i+1).toString()
        let imagenName = 'fatiga-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos1[i]['img']
        document.getElementById(tituloName).append(consejos1[i]['titulo'])
        document.getElementById(parrafoName).append(consejos1[i]['c'])
        $(etiquetaName).show()
      }
    }else if (fatigaAvg < 5){//promedio por hora
      fatiga_state = 'Medio'
      fatiga_color = '#FF9E23'
      let consejos2 = lista_consejos[3]["consejos"][1]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos2.length; i++) {
        let etiquetaName = '#fatiga-c'+(i+1).toString()
        let tituloName = 'fatiga-t'+(i+1).toString()
        let parrafoName = 'fatiga-p'+(i+1).toString()
        let imagenName = 'fatiga-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos2[i]['img']
        document.getElementById(tituloName).append(consejos2[i]['titulo'])
        document.getElementById(parrafoName).append(consejos2[i]['c'])
        $(etiquetaName).show()
      }
    }else{
      fatiga_state = 'Alto'
      fatiga_color = 'red'
      let consejos3 = lista_consejos[3]["consejos"][2]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos3.length; i++) {
        let etiquetaName = '#fatiga-c'+(i+1).toString()
        let tituloName = 'fatiga-t'+(i+1).toString()
        let parrafoName = 'fatiga-p'+(i+1).toString()
        let imagenName = 'fatiga-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos3[i]['img']
        document.getElementById(tituloName).append(consejos3[i]['titulo'])
        document.getElementById(parrafoName).append(consejos3[i]['c'])
        $(etiquetaName).show()
      }
    }

    if (posturaAvg < 2){ //promedio por hora
      postura_state = 'Bajo'
      postura_color = 'green'
      let consejos1 = lista_consejos[4]["consejos"][0]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos1.length; i++) {
        let etiquetaName = '#postura-c'+(i+1).toString()
        let tituloName = 'postura-t'+(i+1).toString()
        let parrafoName = 'postura-p'+(i+1).toString()
        let imagenName = 'postura-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos1[i]['img']
        document.getElementById(tituloName).append(consejos1[i]['titulo'])
        document.getElementById(parrafoName).append(consejos1[i]['c'])
        $(etiquetaName).show()
      }
    }else if (posturaAvg < 5){//promedio por hora
      postura_state = 'Medio'
      postura_color = '#FF9E23'
      let consejos2 = lista_consejos[4]["consejos"][1]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos2.length; i++) {
        let etiquetaName = '#postura-c'+(i+1).toString()
        let tituloName = 'postura-t'+(i+1).toString()
        let parrafoName = 'postura-p'+(i+1).toString()
        let imagenName = 'postura-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos2[i]['img']
        document.getElementById(tituloName).append(consejos2[i]['titulo'])
        document.getElementById(parrafoName).append(consejos2[i]['c'])
        $(etiquetaName).show()
      }
    }else{
      postura_state = 'Alto'
      postura_color = 'red'
      let consejos3 = lista_consejos[4]["consejos"][2]["data"] //el primer 0 es el mal habito, el segundo 0 es el nivel del consejo que se quiere mostrar
      for (let i = 0; i < consejos3.length; i++) {
        let etiquetaName = '#postura-c'+(i+1).toString()
        let tituloName = 'postura-t'+(i+1).toString()
        let parrafoName = 'postura-p'+(i+1).toString()
        let imagenName = 'postura-i'+(i+1).toString()
        document.getElementById(imagenName).src = consejos3[i]['img']
        document.getElementById(tituloName).append(consejos3[i]['titulo'])
        document.getElementById(parrafoName).append(consejos3[i]['c'])
        $(etiquetaName).show()
      }
    }
    
    
    
    document.getElementById("unha-state").append(unha_state)
    document.getElementById("unha-state").style.color = unha_color;
    //document.getElementById("unha-avg").append(unhaAvg+"%")
    document.getElementById("morder-state").append(morder_state)
    document.getElementById("morder-state").style.color = morder_color;
    //document.getElementById("morder-avg").append(morderAvg+"%")
    document.getElementById("pelo-state").append(pelo_state)
    document.getElementById("pelo-state").style.color = pelo_color;
    //document.getElementById("pelo-avg").append(peloAvg+"%")
    document.getElementById("fatiga-state").append(fatiga_state)
    document.getElementById("fatiga-state").style.color = fatiga_color;
    //document.getElementById("fatiga-avg").append(fatigaAvg+" notificaciones por hora")
    document.getElementById("postura-state").append(postura_state)
    document.getElementById("postura-state").style.color = postura_color;
    //document.getElementById("postura-avg").append(posturaAvg+" notificaciones por hora")
}

function obtenerNivel(hab){
  if(hab == 0){
    if(unha_state == 'Bajo'){
      return 0
    }else if(unha_state == 'Medio'){
      return 1
    }else if(unha_state == 'Alto'){
      return 2
    }
  }else if(hab == 1){
    if(morder_state == 'Bajo'){
      return 0
    }else if(morder_state == 'Medio'){
      return 1
    }else if(morder_state == 'Alto'){
      return 2
    }
  }else if(hab == 2){
    if(pelo_state == 'Bajo'){
      return 0
    }else if(pelo_state == 'Medio'){
      return 1
    }else if(pelo_state == 'Alto'){
      return 2
    }
  }else if(hab == 3){
    if(fatiga_state == 'Bajo'){
      return 0
    }else if(fatiga_state == 'Medio'){
      return 1
    }else if(fatiga_state == 'Alto'){
      return 2
    }
  }else if(hab == 4){
    if(postura_state == 'Bajo'){
      return 0
    }else if(postura_state == 'Medio'){
      return 1
    }else if(postura_state == 'Alto'){
      return 2
    }
  }
}

function saberMas(habito,consejo){ //habito-> 0=unha, 1=morder, 2=pelo, 3=fatiga, 4=postura
  let nivel = obtenerNivel(habito)
  let objInsert = lista_consejos[habito]["consejos"][nivel]["data"][consejo]
  window.api.setConsejo(objInsert)
}

function init3(){
    actualizarTips();
    actualizarNavbar();
}

window.onload = init3;