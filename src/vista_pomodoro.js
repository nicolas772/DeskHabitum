let workTitle = document.getElementById('work');
let breakTitle = document.getElementById('break');
let longBreakTitle = document.getElementById('long_break');



//FUNCIONES DE LOS BOTONES DE POMODORO
function start_pomodoro(){
    window.api.iniciar_pomodoro()
}



function pause_pomodoro(){
    window.api.pausar_pomodoro()
}

function stop_pomodoro(){
    breakTitle.classList.remove('active');
    longBreakTitle.classList.remove('active')
    workTitle.classList.add('active');

    window.api.parar_pomodoro()
}


async function timerHandle(){

    let loopHandler = () =>{

        let data_pomodoro = window.api.leer_pomodoro()

        document.getElementById('minutes').innerHTML = data_pomodoro.minutes;
        document.getElementById('seconds').innerHTML = data_pomodoro.seconds;
        document.getElementById('num_pomodoro').innerHTML = data_pomodoro.numero;

        // CORRIENDO
        if (data_pomodoro.estado == 1){

            document.getElementById('start').style.display = "none";
            document.getElementById('reset').style.display = "block";
            document.getElementById('pause').style.display = "block";

        // EN PAUSA
        }else if (data_pomodoro.estado == 0){

            document.getElementById('start').style.display = "block";
            document.getElementById('reset').style.display = "block";
            document.getElementById('pause').style.display = "none";

        // PARADO
        }else if (data_pomodoro.estado == 2){

            document.getElementById('start').style.display = "block";
            document.getElementById('reset').style.display = "none";
            document.getElementById('pause').style.display = "none";

        }

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