

let workTitle = document.getElementById('work');
let breakTitle = document.getElementById('break');
let longBreakTitle = document.getElementById('long_break');

let workTime = 1;
let breakTime = 1;
let longBreakTime = 2;
let interval_counter = 0
let seconds = "00"
let break_interval = 4;


// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;


}

// start timer
function start_pomodoro() {
    workTitle.classList.add('active');

    // change button
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";
    document.getElementById('pause').style.display = "block";

    // change the time
    seconds = 5;

    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;
    let longBreakMinutes = longBreakTime - 1;

    breakCount = 0;

    // countdown
    let timerFunction = () => {

            // start
            
            
            //change the display
            document.getElementById('minutes').innerHTML = workMinutes;
            document.getElementById('seconds').innerHTML = seconds  ;


            seconds = seconds - 1;
            if(seconds === 0) {
                workMinutes = workMinutes - 1;
                if(workMinutes === -1 ){

                    if(interval_counter != 0 && interval_counter % break_interval == 0){
                        workMinutes = longBreakMinutes - 1;
                        interval_counter ++

                        workTitle.classList.remove('active');
                        breakTitle.classList.remove('active');
                        longBreakTitle.classList.add('active');

                    }
                
                    else if(breakCount % 2 === 0) {
                        // start break
                        workMinutes = breakMinutes;
                        breakCount++
                        interval_counter ++
                        // change the painel
                        workTitle.classList.remove('active');
                        longBreakTitle.classList.remove('active')
                        breakTitle.classList.add('active');
                    }else {
                        // continue work
                        workMinutes = workTime - 1;
                        breakCount++
                        

                        // change the painel
                        breakTitle.classList.remove('active');
                        longBreakTitle.classList.remove('active')
                        workTitle.classList.add('active');
                    }
                }
                seconds = 5;
        }

    }

    // start countdown
    
    id = setInterval(timerFunction, 1000); // 1000 = 1s
    
}


