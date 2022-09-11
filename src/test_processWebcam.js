const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const crud = require('./model/model.js')
const fs = require('fs');
const {contextBridge, ipcRenderer} = require("electron");
let id_User = 2;
const URL = 'https://teachablemachine.withgoogle.com/models/83c4Qg0Gu/';
//Variables para la ejecución de la webcam y modelo
let model, webcam;
//Variable para emplear un cooldown entre notificaciones
let cooldown = false;
let habito_cooldown = false;
let tiempo_inicio;
let tiempo_final;
let se_notifico = false;
//Variable para controlar la ejecución de la webcam
let corriendo = false;
//Tiempo del cooldown
const RECHARGE_TIME = 5000; //ms
//Variable para monitorear el tiempo de comida de uña 
let tiempo_corriendo = false;

//variables para crear sesion
let inicio_sesion;
let fin_sesion;
let respuesta
let run
//lista que guarda el inicio y final del mal habito de comerse uñas en la sesion actual
//let lista_unhas = [];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startCooldown() {
    cooldown = true;
    setTimeout (function(){ cooldown = false}, RECHARGE_TIME);
}

function habitoCooldown() {
    habito_cooldown = false;
    setTimeout (function(){ habito_cooldown = true}, 5000);
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

async function camaraHandle(){ //funcion que va leyendo el archivo cameraHandle infinitamente.
    let flag = true
    fs.writeFileSync('./src/data/cameraHandle.txt', "0", function(err) {
        if (err) {
          return console.log(err);
        }
    });//esto es para que siempre inicie apagado
    while(true){
        await sleep(100);
        fs.readFile('./src/data/cameraHandle.txt', 'utf8', function(err, data) {
            if (err) {
              return console.log(err);
            }
            run=data
        });
        if (run=='1' && flag){
            corriendo=true
            flag=false
            init_model()
        }else if (run =='0' && !flag){
            corriendo = false
            flag=true
        }
    }
}

async function init_model() {
        doNotify();
        //inicio_sesion = sesion;
        corriendo = true;

        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';
        model = await tmImage.load(modelURL, metadataURL);
        const flip = true;
        const width = 200;
        const height = 200;
        webcam = new tmImage.Webcam(width, height, flip);

        await webcam.setup(); // request access to the webcam
        webcam.play();
        document.getElementById("HOLA").appendChild(webcam.canvas);
        window.requestAnimationFrame(loop);
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
    window.setTimeout(loop, 0.1)
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
        se_notifico = true;
    }


    if (prediction[0].probability.toFixed(2) < 0.50 && tiempo_corriendo && !habito_cooldown && se_notifico){
        tiempo_final = new Date();
        
        let ini = tiempo_inicio.toISOString()
        let fini = tiempo_final.toISOString()
        let total = tiempo_final - tiempo_inicio
        let totali = total.toString()

        /*
        let unha = {
            "inicio": ini,
            "final": fini,
            "total": totali
        }
        //lista_unhas.push(unha)
        //console.log(lista_unhas)
        let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
        let lista_unhas = JSON.parse(rawdata);
        lista_unhas.push(unha)
        let data_unha = JSON.stringify(lista_unhas);
        fs.writeFileSync("./src/data/unhasSesion.json", data_unha)
        tiempo_corriendo = false;
        se_notifico = false;*/
    }
}


window.onload = camaraHandle;
