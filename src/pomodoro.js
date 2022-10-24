const fs = require('fs')
const utils_pom = require("./preload.js")
const {contextBridge, ipcRenderer} = require("electron");

let id, id_usuario, config;
let tipo = "work"

let run;
let corriendo = false;

let pomodoro_iniciado = false;
let objInsert, data_json;

//minutos de sesión
let workTime ;   //DURACION POMO
let breakTime ;  //DURACION SHORT BREAK
let longBreakTime ;  // DURACION LONG BREAK
let seconds = "00"
let pomodoroStopper;

let workMinutes, breakMinutes, longBreakMinutes;

let is_break = false
let en_pausa = false

//Contador para long break
let interval_counter = 0

//Numero de pomodoros antes de que ocurra el long break

let break_interval = 4; //INTERVALO LONG BREAK

let apretado = false;


function get_user_id(){
    let respuesta = ipcRenderer.sendSync('get-user-id', "")
    return respuesta   
}

function recargar_vista(){
    objInsert = {
        "minutes": workMinutes,
        "seconds": seconds,
        "tipo": tipo,
        "numero": 1,
        "estado": 2,
        "recarga": 1
    }
    data_json = JSON.stringify(objInsert);
    fs.writeFileSync("./src/data/pomodoro.json", data_json);
    setTimeout (function(){
        objInsert = {
            "minutes": workMinutes,
            "seconds": seconds,
            "tipo": tipo,
            "numero": 1,
            "estado": 2,
            "recarga": 0
        }
        data_json = JSON.stringify(objInsert);
        fs.writeFileSync("./src/data/pomodoro.json", data_json);
    }, 100);
}


async function pomodoroHandle(){
    fs.writeFileSync('./src/data/pomodoroHandle.txt', "0", function(err) {
        if (err) {
          return console.log(err);
        }
    });//esto es para que siempre inicie apagado

    id_usuario = await get_user_id()
    
    config = await utils_pom.getConfig(id_usuario)
    config = config[0]
    console.log(config)
    workTime = config.duracionpomo
    breakTime = config.duracionshortbreak
    longBreakTime = config.duracionlongbreak
    break_interval = config.intervalolongbreak
    pomodoroStopper = config.cantidadpomodoros

    objInsert = {
        "minutes": workTime,
        "seconds": seconds,
        "tipo": tipo,
        "numero": 1,
        "estado": 2,
        "recarga": 0
    }
    data_json = JSON.stringify(objInsert);
    fs.writeFileSync("./src/data/pomodoro.json", data_json)

    async function loopHandler(){

        fs.readFile('./src/data/pomodoroHandle.txt', 'utf8', function(err, data) {
            if (err) {
            return console.log(err);
            }
            run = data
        });
        if (run == '1' && !corriendo){


            id_usuario = await get_user_id()

            config = await utils_pom.getConfig(id_usuario)
            config = config[0]

            workTime = config.duracionpomo
            breakTime = config.duracionshortbreak
            longBreakTime = config.duracionlongbreak
            break_interval = config.intervalolongbreak
            pomodoroStopper = config.cantidadpomodoros

            corriendo = true
            start_pomodoro();

        }else if (run == '0' && corriendo){
            corriendo = false
            pause_pomodoro();

        }else if (run == '2' && corriendo){
            corriendo = false
            apretado = true
            stop_pomodoro();

        }
    }

    handler = setInterval(loopHandler, 100);

}


// display
window.onload = pomodoroHandle()

// start timer
function start_pomodoro() {

    if (!en_pausa){
        init_cam()
    }

    en_pausa = false;



    if (!pomodoro_iniciado){
        
        // change the seconds
        seconds = 59;

        // Minutos de pomodoro, break y long break
        workMinutes = workTime - 1;
        breakMinutes = breakTime - 1;
        longBreakMinutes = longBreakTime - 1;

        breakCount = 0;
        longBreakCount = 0;

        pomodoro_iniciado = true;
    }

    // countdown
    let timerFunction = () => {

        //Comunicación de la venta de pomodoro con la vista de pomodoro
        console.log(workMinutes, seconds, tipo)
        objInsert = {
            "minutes": workMinutes,
            "seconds": seconds,
            "tipo": tipo,
            "numero": interval_counter + 1,
            "estado": 1,
            "recarga": 0
        }

        data_json = JSON.stringify(objInsert);
        fs.writeFileSync("./src/data/pomodoro.json", data_json)

    


        seconds = seconds - 1;

        if(seconds === 0) {
            workMinutes = workMinutes - 1;
            if(workMinutes === -1 ){

                if(interval_counter + 1 >= pomodoroStopper){
                    utils_pom.parar_pomodoro();
                    stop_pomodoro();
                    
                }

                // COndición para el long break
                else if(interval_counter != 0 && interval_counter % break_interval == 0){
                    
                    tipo = "long break"

                    
                    
                    if(!is_break){
                        stop_cam();
                        recargar_vista();
                    }
                    is_break = true
                    
                    workMinutes = longBreakMinutes;
                    interval_counter ++
                    longBreakCount ++
                    breakCount++
                    

                }
                
                //COndición para el break
                else if(breakCount % 2 === 0 ) {
                    
                    tipo = "break"
                    if(!is_break){
                        stop_cam();
                        recargar_vista();
                    }
                    // start break
                    is_break = true
                    workMinutes = breakMinutes;
                    breakCount++
                    

                
                //Condición para el trabajo
                }else {

                    tipo = "work"
                    if(is_break){
                        init_cam()
                        is_break = false
                    }
                    // continue work
                    workMinutes = workTime - 1;
                    breakCount++
                    interval_counter ++

                }
            }
            // change the seconds
            seconds = 59;
        }

    }

    // start countdown
    
    id = setInterval(timerFunction, 1000); // 1000 = 1s
    
}

function pause_pomodoro(){

    clearInterval(id);

    objInsert = {
        "minutes": workMinutes,
        "seconds": seconds,
        "tipo": tipo,
        "numero": interval_counter + 1,
        "estado": 0,
        "recarga": 0
    }

    data_json = JSON.stringify(objInsert);
    fs.writeFileSync("./src/data/pomodoro.json", data_json)

    en_pausa = true;
}

async function stop_pomodoro(){

    tipo = "work"

    corriendo = false;

    pomodoro_iniciado = false;


    id_usuario = await get_user_id()

    config = await utils_pom.getConfig(id_usuario)
    config = config[0]

    workTime = config.duracionpomo
    breakTime = config.duracionshortbreak
    longBreakTime = config.duracionlongbreak
    break_interval = config.intervalolongbreak
    pomodoroStopper = config.cantidadpomodoros
    
    workMinutes = workTime
    seconds = "00"
    objInsert = {
        "minutes": workTime,
        "seconds": "00",
        "tipo": tipo,
        "numero": 1,
        "estado": 2,
        "recarga": 0
    }
    data_json = JSON.stringify(objInsert);
    fs.writeFileSync("./src/data/pomodoro.json", data_json)

    is_break = false
    en_pausa = false

    //Contador para long break
    interval_counter = 0

    clearInterval(id);
    pomodoro_iniciado = false;

    if (!is_break || apretado){
        stop_cam();
        recargar_vista();
        apretado = false
    }
    
}




function init_cam(){
    utils_pom.iniciar_camara("")
}

async function stop_cam(){
    let camHandle
    camHandle = utils_pom.leerCameraHandle()
        
    console.log("camera handle:", camHandle)
    if (camHandle == '1'){
        let ID = utils_pom.get_user_id("")
        let ID_USER = ID.toString()
        utils_pom.cerrar_camara("")

        //calculo de totales por mania
        let [total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo]  = utils_pom.obtenerTotal()

        //creo sesion en BD
        let inicio_sesion = utils_pom.fecha_inicio_sesion()
        let fin_sesion = new Date()
        total =  Math.trunc((fin_sesion - inicio_sesion)/1000) //lo pasa de milisegundos a segundos
        let ini_sesion = inicio_sesion.toISOString()
        let fini_sesion = fin_sesion.toISOString()
        let mes_sesion = fin_sesion.getMonth() + 1
        let anno_sesion = fin_sesion.getFullYear()
        
        await utils_pom.createSesion(ID_USER, ini_sesion, fini_sesion, total, total_unhas, total_pelo, total_objeto, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion, "si"); 
        //console.log("paso insert sesion")
        //inserto manias en BD

        await utils_pom.insertManias(ID_USER)
        //console.log("paso insert manias")
        //esta funcion es de ultimaSesion.js, no es necesario importar ya que se
        //importan los script en el html, y puedo usar las funciones de otros archivos
        //siempre y cuando esten en el orden correcto. ver https://es.stackoverflow.com/questions/353796/como-exportar-una-funcion-de-un-archivo-js-a-otro-archivo-js
    }   
}





