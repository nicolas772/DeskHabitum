let workTitle = document.getElementById('work');
let breakTitle = document.getElementById('break');
let longBreakTitle = document.getElementById('long_break');


//FUNCIONES DE LOS BOTONES DE POMODORO
function start_pomodoro(){

    window.api.iniciar_pomodoro()

    document.getElementById('start').style.display = "none";

    //idea: Parar deteccion y timer con el reset
    document.getElementById('reset').style.display = "block";

    //idea: detiene solo el timer
    document.getElementById('pause').style.display = "block";
}



function pause_pomodoro(){

    window.api.pausar_pomodoro()

    // change button
    document.getElementById('start').style.display = "block";

    //idea: Parar deteccion y timer con el reset
    document.getElementById('reset').style.display = "block";

    //idea: detiene solo el timer
    document.getElementById('pause').style.display = "none";

    clearInterval(id);

    en_pausa = true;
}

function stop_pomodoro(){

    window.api.parar_pomodoro()
    // change button
    document.getElementById('start').style.display = "block";

    //idea: Parar deteccion y timer con el reset
    document.getElementById('reset').style.display = "block";

    //idea: detiene solo el timer
    document.getElementById('pause').style.display = "block";

    clearInterval(id);

    pomodoro_iniciado = false;

    if (!is_break){
        stop_cam();
    }
    
}


//FUNCIONES PARA CONTROLAR LA DETECCION

let inicio_sesion, fin_sesion

function init_cam(){
    window.api.iniciar_camara("")
    inicio_sesion = new Date()
}

async function stop_cam(){
    let camHandle
    camHandle = window.api.leerCameraHandle()
        
    console.log("camera handle:", camHandle)
    if (camHandle == '1'){
        let ID = window.api.get_user_id("")
        let ID_USER = ID.toString()
        window.api.cerrar_camara("")

        //calculo de totales por mania
        let [total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo]  = window.api.obtenerTotal()

        //creo sesion en BD
        fin_sesion = new Date()
        total =  Math.trunc((fin_sesion - inicio_sesion)/1000) //lo pasa de milisegundos a segundos
        let ini_sesion = inicio_sesion.toISOString()
        let fini_sesion = fin_sesion.toISOString()
        let mes_sesion = fin_sesion.getMonth() + 1
        let anno_sesion = fin_sesion.getFullYear()
        await window.api.createSesion(ID_USER, ini_sesion, fini_sesion, total, total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion); 
        //console.log("paso insert sesion")
        //inserto manias en BD

        await window.api.insertManias(ID_USER)
        //console.log("paso insert manias")
        //esta funcion es de ultimaSesion.js, no es necesario importar ya que se
        //importan los script en el html, y puedo usar las funciones de otros archivos
        //siempre y cuando esten en el orden correcto. ver https://es.stackoverflow.com/questions/353796/como-exportar-una-funcion-de-un-archivo-js-a-otro-archivo-js
        await update_dash_ultima_sesion();     
    }   
}


async function timerHandle(){

    let loopHandler = () =>{

        let data_pomodoro = window.api.leer_pomodoro()

        document.getElementById('minutes').innerHTML = data_pomodoro.minutes;
        document.getElementById('seconds').innerHTML = data_pomodoro.seconds;

        if (data_pomodoro.tipo == "work"){
            breakTitle.classList.remove('active');
            longBreakTitle.classList.remove('active')
            workTitle.classList.add('active');

        } else if (data_pomodoro.tipo == "break"){
            workTitle.classList.remove('active');
            longBreakTitle.classList.remove('active')
            breakTitle.classList.add('active');

        }else if (data_pomodoro.tipo == "long break"){
            workTitle.classList.remove('active');
            breakTitle.classList.remove('active');
            longBreakTitle.classList.add('active');
        }
    }

    handler = setInterval(loopHandler, 100);
}
window.onload = timerHandle()