const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const crud = require('./model/model.js')

const { getUsuarios , createUser, getUserData, delUser,
    createSesion, getSesion,
    createUnhas, getUnhas} = require('./model/model.js')

const URL = 'https://teachablemachine.withgoogle.com/models/QCfFnAVYW/';
//Variables para la ejecución de la webcam y modelo
let model, webcam;
//Variable para emplear un cooldown entre notificaciones
let cooldown = false;
let habito_cooldown = false;
let tiempo_inicio = new Date;
//Variable para controlar la ejecución de la webcam
let corriendo = false;
//Tiempo del cooldown
const RECHARGE_TIME = 5000; //ms
//Variable para monitorear el tiempo de comida de uña 
let tiempo_corriendo = false;

//variables para crear sesion
let inicio_sesion;
let fin_sesion;

function startCooldown() {
    cooldown = true;
    setTimeout (function(){ cooldown = false}, RECHARGE_TIME);
}

function habitoCooldown() {
    habito_cooldown = false;
    setTimeout (function(){ habito_cooldown = true}, 1000);
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

async function init_model() {
    inicio_sesion = new Date()
    if (!corriendo){
        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';
        corriendo = true;

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        model = await tmImage.load(modelURL, metadataURL);

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        const width = 200;
        const height = 200;
        webcam = new tmImage.Webcam(width, height, flip);
        await webcam.setup(); // request access to the webcam

        webcam.play();
        window.requestAnimationFrame(loop);
    }
}
function stop_monitoring(){
    fin_sesion = new Date();
    let ini = inicio_sesion.toISOString()
    let fini = fin_sesion.toISOString()
    crud.createSesion(1, ini, fini);
    corriendo = false;
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    if (!corriendo){
        webcam.stop()
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
    if (prediction[0].probability.toFixed(2) >= 0.85  && !cooldown && !tiempo_corriendo){
        tiempo_corriendo = true;
        tiempo_inicio = new Date;
        startCooldown();
        habitoCooldown();
    }

    if (prediction[0].probability.toFixed(2) > 0.50 && habito_cooldown){
        doNotify();
        habito_cooldown = false;
    }


    if (prediction[0].probability.toFixed(2) < 0.50 && tiempo_corriendo && !habito_cooldown){
        let tiempo_final = new Date();
        //console.log([tiempo_final - tiempo_inicio, tiempo_inicio, tiempo_final]);
        tiempo_corriendo = false;
    }
}



module.exports = {init_model, stop_monitoring}