const URL = 'https://teachablemachine.withgoogle.com/models/QCfFnAVYW/';
let model, webcam, labelContainer, maxPredictions;
let cooldown = false;
let corriendo = true;
const RECHARGE_TIME = 5000; //ms

let tiempo_corriendo = false;
let tiempo_inicio = new Date;
let fin_sesion 
let inicio_sesion

// Load the image model and setup the webcam
function startCooldown() {
    cooldown = true;
    setTimeout (function(){ cooldown = false}, RECHARGE_TIME);
}

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

async function init() {
    inicio_sesion = new Date();
    console.log("INICIO" + inicio_sesion.toISOString())
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    corriendo = true;

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    const width = 200;
    const height = 200;
    webcam = new tmImage.Webcam(width, height, flip);
    await webcam.setup(); // request access to the webcam

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // append elements to the DOM
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
    webcam.play();
    window.requestAnimationFrame(loop);
}


function stop_cam(){
    fin_sesion = new Date();
    let fini = fin_sesion.toISOString()
    let ini = inicio_sesion.toISOString()
    console.log("FIN: " + fin_sesion.toISOString())
    console.log("INICIO " + inicio_sesion.toISOString())
    corriendo = false;
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    if (!corriendo){
        webcam.stop()
        document.getElementById("webcam-container").innerHTML = '';
        return
    }
    // PROBAR AQUÍ LO DEL SEGUNDO PLANO
    //https://stackoverflow.com/questions/60550376/tensorflowjs-perform-inference-in-an-inactive-tab

    //window.requestAnimationFrame(loop);
    window.setTimeout(loop, 1)
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    let prediction;
    prediction = await model.predict(webcam.canvas)
    if (prediction[0].probability.toFixed(2) >= 0.85 && !cooldown && !tiempo_corriendo){
        tiempo_corriendo = true;
        tiempo_inicio = new Date;
        doNotify();
        startCooldown();

    }
    if (prediction[0].probability.toFixed(2) < 0.50 && tiempo_corriendo){
        let tiempo_final = new Date();
        //console.log([tiempo_final - tiempo_inicio, tiempo_inicio, tiempo_final]);
        tiempo_corriendo = false;
    }
}
