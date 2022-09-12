//Librerias de IA
const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
const poseDetection = require('@tensorflow-models/pose-detection');
//Base de datos
const crud = require('./model/model.js')
const fs = require('fs');
const {contextBridge, ipcRenderer} = require("electron");
let ID_USER = get_user_id()

const URL = 'https://teachablemachine.withgoogle.com/models/83c4Qg0Gu/';

//Variables para la ejecución de los modelos
let model, modeloHand, modeloBlaze, detectorHand, detectorBlaze;

//Variables que determinan si la detección del mal habito está encendida.
let config_user
let onicofagia = false; //comer uñas
let tricotilomania = false; //arrancar pelos
let morder_objetos = false; //detectar mordidas
let postura = false;
let fatiga_visual = false;

//Variable para controlar la ejecución de la webcam
let webcam, run;
let corriendo = false;

//Variable para emplear un cooldown entre notificaciones
let cooldown = false;
let habito_cooldown = false;
let tiempo_inicio;
let tiempo_final;
let se_notifico = false;

//Tiempo del cooldown
const RECHARGE_TIME = 5000; //ms

//Variable para monitorear el tiempo de comida de uña 
let tiempo_corriendo = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function get_user_id(){
    let respuesta = ipcRenderer.sendSync('get-user-id', "")
    return respuesta   
}

async function getConfig(id_usuario){
    
    await crud.getConfig(id_usuario).then(result => {

        config_user = result[0];

        if (config_user.morderunha == "on"){
            onicofagia = true;
        }else{
            onicofagia = false;
        }

        if (config_user.morderobjetos == "on"){
            morder_objetos = true;
        }else{
            morder_objetos = false;
        }
        
        if (config_user.jalarpelo == "on"){
            tricotilomania = true;
        }else{
            tricotilomania = false;
        }

        if (config_user.malapostura == "on"){
            postura = true;
        }else{
            postura = false;
        }

        if (config_user.fatiga_visual == "on"){
            fatiga_visual = true;
        }else{
            fatiga_visual = false;
        }
    });  
}
  //aqui debiera ser ID_USER, pero no hay datos aun en la BD


function startCooldown() {
    cooldown = true;
    setTimeout (function(){ cooldown = false}, RECHARGE_TIME);
}

function habitoCooldown() {
    habito_cooldown = false;
    setTimeout (function(){ habito_cooldown = true}, 5000);
}

async function camaraHandle(){ //funcion que va leyendo el archivo cameraHandle infinitamente.
    //console.log("usuario logeado:", ID_USER)
    //console.log("config: ", config_user)
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
            run = data
        });

        if (run == '1' && flag){
            await getConfig(2)
            corriendo = true
            flag = false
            await init_model()

        }else if (run =='0' && !flag){
            corriendo = false
            flag = true
        }
    }
}


//Funciones para calcular la distancia entre dos puntos
function distancia_puntos(x1, y1, x2, y2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function distancia_puntos3D(x1, y1, z1, x2, y2, z2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) ** 0.5
}

//Determinar si la mano está en modo pinza. Para ello las distancia entre el dedo pulgar, indice y medio debe ser menos a 0.55 y la distancia entre
function mano_pinza(pulgar, indice, medio, muñeca){

    avg_distancia_entre_dedos = 0.055
    distancia_muñeca = 0.1

    pulgar_indice = distancia_puntos3D(pulgar.x, pulgar.y, pulgar.z, indice.x, indice.y, indice.z)
    pulgar_medio = distancia_puntos3D(pulgar.x, pulgar.y, pulgar.z, medio.x, medio.y, medio.z)
    indice_medio = distancia_puntos3D(indice.x, indice.y, indice.z, medio.x, medio.y, medio.z)

    indice_muñeca = distancia_puntos3D(indice.x, indice.y, indice.z, muñeca.x, muñeca.y, muñeca.z)

    avg_pinza = (pulgar_indice + pulgar_medio + indice_medio) / 3

    if (indice_muñeca > distancia_muñeca && avg_pinza < avg_distancia_entre_dedos){
        return true
    }

    return false
}

function print_mordida(b_x1, b_x2, b_y1, b_y2,    x_i, x_d, x_m,    y_u, y_m, y_l){

    //En caso de que la mordida se detecte en la punta superior del objeto
    if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_u && y_u > b_y1){
        console.log("MORDIENDO ARRIBA ")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_u && y_u > b_y1){
        console.log("MORDIENDO ARRIBA ")

    }else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_u && y_u > b_y1){
        console.log("MORDIENDO ARRIBA ")

    }
    //En caso de que la mordida se detecte en la punta inferior del objeto
    else if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_l && y_l > b_y1){
        console.log("MORDIENDO ABAJO ")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_l && y_l > b_y1){
        console.log("MORDIENDO ABAJO ")
    }
    else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_l && y_l > b_y1){
        console.log("MORDIENDO ABAJO ")
    }
    //En caso de que la mordida se detecte en el medio del objeto
    else if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_m && y_m > b_y1){
        console.log("MORDIENDO MEDIO")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_m && y_m > b_y1){
        console.log("MORDIENDO MEDIO")
    }
    else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_m && y_m > b_y1){
        console.log("MORDIENDO MEDIO")
    }

}

async function init_model() {

    modeloBlaze = poseDetection.SupportedModels.BlazePose;
    detectorBlaze = await poseDetection.createDetector(modeloBlaze, {runtime : 'tfjs', modelType : 'full'});

    if (onicofagia || tricotilomania){
        modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;
        detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});

    }

    if (morder_objetos){
        model = await tf.loadGraphModel('../modelo_objetos/model.json');
    }

    const flip = false;
    const width = 224;
    const height = 224;
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
        document.getElementById("HOLA").innerHTML = "";
        return
    }
    window.setTimeout(loop, 0.1)
}

async function predict() {

    let posesHand, posesBlaze, bocaCenter_x, bocaCenter_y;
    //https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
    posesHand = await detectorHand.estimateHands(webcam.canvas);
    //https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
    posesBlaze = await detectorBlaze.estimatePoses(webcam.canvas);

    
    if ( (onicofagia || tricotilomania) && posesBlaze.length != 0 && posesHand.length != 0 /* && (posesBlaze[0].keypoints3D[19].score >= 0.8 || posesBlaze[0].keypoints3D[20].score >= 0.8)*/){

        //BLAZE POSE

        //Se consideran los puntos, del estimador BlazePose, que serán de utilidad. En este caso los dos puntos de la boca, en coordenadas (x,y) y (x,y,z), los puntos de los indices de la manos, los puntos de los ojos, de los hombros y nariz.
        bocaLeft = posesBlaze[0].keypoints[9]
        bocaRight = posesBlaze[0].keypoints[10]

        bocaLeft3D = posesBlaze[0].keypoints3D[9]
        bocaRight3D = posesBlaze[0].keypoints3D[10]

        ojoLeft3D = posesBlaze[0].keypoints3D[2]
        ojoRight3D = posesBlaze[0].keypoints3D[5]
        //Distancia entre ojos mirando de frente
        distancia_ojos = 0.030

        hombroLeft3D = posesBlaze[0].keypoints3D[11]
        hombroRight3D = posesBlaze[0].keypoints3D[12]

        nariz = posesBlaze[0].keypoints[0]
        nariz3D = posesBlaze[0].keypoints3D[0]

        orejaLeft = posesBlaze[0].keypoints[7]
        orejaRight = posesBlaze[0].keypoints[8]

        orejaLeft3D = posesBlaze[0].keypoints3D[7]
        orejaRight3D = posesBlaze[0].keypoints3D[8]

        //Se define el centro de la boca en base a las coordenadas estimadas
        bocaCenter_x = (bocaLeft.x + bocaRight.x) / 2.0
        bocaCenter_y = (bocaLeft.y + bocaRight.y) / 2.0

        //Se define un radio de detección desde el centro de la boca hasta el coef definido 
        coef = 10;

        radioXUp = bocaCenter_x + coef
        radioXLow = bocaCenter_x - coef

        radioYUp = bocaCenter_y - coef
        radioYLow = bocaCenter_y + coef

        //HAND POSE

        //Se consideran las articulaciones interfalángicas distales de la mano detectada
        dipPulgar = posesHand[0].keypoints[3]
        dipIndice = posesHand[0].keypoints[7]
        dipMedio = posesHand[0].keypoints[11]
        dipAnular = posesHand[0].keypoints[15]
        dipMenique = posesHand[0].keypoints[19]

        //Tambien las puntas de los dedos
        tipPulgar = posesHand[0].keypoints[4]
        tipPulgar3D = posesHand[0].keypoints3D[4]

        tipIndice = posesHand[0].keypoints[8]
        tipIndice3D = posesHand[0].keypoints3D[8]

        tipMedio = posesHand[0].keypoints[12]
        tipMedio3D = posesHand[0].keypoints3D[12]

        tipAnular = posesHand[0].keypoints[16]
        tipAnular3D = posesHand[0].keypoints3D[16]

        tipMenique = posesHand[0].keypoints[20]
        tipMenique3D = posesHand[0].keypoints3D[20]

        muñeca3D = posesHand[0].keypoints3D[0]


        if (posesHand.length == 2){

            dipPulgar2 = posesHand[1].keypoints[3]
            dipIndice2 = posesHand[1].keypoints[7]
            dipMedio2 = posesHand[1].keypoints[11]
            dipAnular2 = posesHand[1].keypoints[15]
            dipMenique2 = posesHand[1].keypoints[19]

            //Tambien las puntas de los dedos
            tipPulgar2 = posesHand[1].keypoints[4]
            tipPulgar2_3D = posesHand[1].keypoints3D[4]

            tipIndice2 = posesHand[1].keypoints[8]
            tipIndice2_3D = posesHand[1].keypoints3D[8]

            tipMedio2 = posesHand[1].keypoints[12]
            tipMedio2_3D = posesHand[1].keypoints3D[12]

            tipAnular2 = posesHand[1].keypoints[16]
            tipAnular2_3D = posesHand[1].keypoints3D[16]

            tipMenique2 = posesHand[1].keypoints[20]
            tipMenique2_3D = posesHand[1].keypoints3D[20]
        }


/*-----------------------------------------------SECCIÓN DE ONICOFAGÍA-----------------------------------------------*/
        if (onicofagia){
            if (tipPulgar.y >= dipPulgar.y - 8 && tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow && tipPulgar3D.z > 0){
                console.log("Comiendo uña pulgar");
            }

            else if (tipIndice.y > dipIndice.y && tipIndice.x <= radioXUp && tipIndice.x >= radioXLow && tipIndice.y >= radioYUp && tipIndice.y <= radioYLow && tipIndice3D.z > 0){
                console.log("Comiendo uña indice");
            }

            else if (tipMedio.y > dipMedio.y && tipMedio.x <= radioXUp && tipMedio.x >= radioXLow && tipMedio.y >= radioYUp && tipMedio.y <= radioYLow && tipMedio3D.z > 0){
                console.log("Comiendo uña medio");
            }

            else if (tipAnular.y > dipAnular.y && tipAnular.x <= radioXUp && tipAnular.x >= radioXLow && tipAnular.y >= radioYUp && tipAnular.y <= radioYLow && tipAnular3D.z > 0){
                console.log("Comiendo uña anular");
            }

            else if (tipMenique.y > dipMenique.y && tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow && tipMenique3D.z > 0){
                console.log("Comiendo uña meñique");
            }

            if (posesHand.length == 2){

                if (tipPulgar2.y >= dipPulgar2.y - 8 && tipPulgar2.x <= radioXUp && tipPulgar2.x >= radioXLow && tipPulgar2.y >= radioYUp && tipPulgar2.y <= radioYLow && tipPulgar2_3D.z > 0){
                    console.log("Comiendo uña pulgar");
                }

                else if (tipIndice2.y > dipIndice2.y && tipIndice2.x <= radioXUp && tipIndice2.x >= radioXLow && tipIndice2.y >= radioYUp && tipIndice2.y <= radioYLow && tipIndice2_3D.z > 0){
                    console.log("Comiendo uña indice");
                }

                else if (tipMedio2.y > dipMedio2.y && tipMedio2.x <= radioXUp && tipMedio2.x >= radioXLow && tipMedio2.y >= radioYUp && tipMedio2.y <= radioYLow && tipMedio2_3D.z > 0){
                    console.log("Comiendo uña medio");
                }

                else if (tipAnular2.y > dipAnular2.y && tipAnular2.x <= radioXUp && tipAnular2.x >= radioXLow && tipAnular2.y >= radioYUp && tipAnular2.y <= radioYLow && tipAnular2_3D.z > 0){
                    console.log("Comiendo uña anular");
                }

                else if (tipMenique2.y > dipMenique2.y && tipMenique2.x <= radioXUp && tipMenique2.x >= radioXLow && tipMenique2.y >= radioYUp && tipMenique2.y <= radioYLow && tipMenique2_3D.z > 0 ){
                    console.log("Comiendo uña meñique");
                }
            }
        }
/*-----------------------------------------------SECCIÓN DE TRICOTILOMANÍA----------------------------------------------*/
        if (tricotilomania){

            dist_nariz_bocaLeft = distancia_puntos(nariz.x, nariz.y, bocaLeft.x, bocaLeft.y);
            dist_nariz_bocaRight = distancia_puntos(nariz.x, nariz.y, bocaRight.x, bocaRight.y);
            dist_nariz_bocaCentro = distancia_puntos(nariz.x, nariz.y, bocaCenter_x, bocaCenter_y);

            calibracion_perfil = 1
            
            altura = 23/14

            pinza = false;

            if(mano_pinza(tipPulgar3D, tipIndice3D, tipMedio3D, muñeca3D) || (posesHand.length == 2 && mano_pinza(tipPulgar2_3D, tipIndice2_3D, tipMedio2_3D, muñeca3D))){

                //Se plantean 3 casos:
                //Mirando de frente
                if (dist_nariz_bocaCentro < dist_nariz_bocaLeft && dist_nariz_bocaCentro < dist_nariz_bocaRight){

                    segmento = (orejaLeft.x - orejaRight.x) / 4

                    areaDown_x = orejaRight.x - segmento
                    areaUp_x = orejaLeft.x + segmento
    
                    areaUp_y = (orejaRight.y + orejaLeft.y) / 2
                    areaDown_y = areaUp_y - (areaUp_x - areaDown_x)

                    frente = areaDown_y + 2*segmento

                    // ZONA DE LA FRENTE HACIA ARRIBA
                    if (tipPulgar.y <= frente && tipPulgar.y >= areaDown_y){

                        if (tipPulgar.x >= areaDown_x && tipPulgar.x <= areaUp_x && tipPulgar.y >= areaDown_y && tipPulgar.y <= areaUp_y){
                            console.log("Mirando de frente","Tirando el pelo por arriba");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= frente && tipPulgar2.y >= areaDown_y){

                        if (tipPulgar2.x >= areaDown_x && tipPulgar2.x <= areaUp_x && tipPulgar2.y >= areaDown_y && tipPulgar2.y <= areaUp_y){
                            console.log("Mirando de frente","Tirando el pelo por arriba");
                        }
                    }

                    // ZONA A LOS COSTADOS DE LA CABEZA
                    else if (tipPulgar.y > frente && tipPulgar.y <= areaUp_y){

                        if (tipPulgar.x >= areaDown_x && tipPulgar.x <= orejaRight.x){
                            console.log("Mirando de frente","Tirando el pelo por el costado derecho");
                        }

                        else if (tipPulgar.x >= orejaLeft.x && tipPulgar.x <= areaUp_x){
                            console.log("Mirando de frente","Tirando el pelo por el costado izquierdo");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y > frente && tipPulgar2.y <= areaUp_y){

                        if (tipPulgar2.x >= areaDown_x && tipPulgar2.x <= orejaRight.x){
                            console.log("Mirando de frente","Tirando el pelo por el costado derecho");
                        }

                        else if (tipPulgar2.x >= orejaLeft.x && tipPulgar2.x <= areaUp_x){
                            console.log("Mirando de frente","Tirando el pelo por el costado izquierdo");
                        }
                    }
                }

                //Mirando hacia la izquierda
                else if (dist_nariz_bocaCentro - calibracion_perfil > dist_nariz_bocaLeft && dist_nariz_bocaCentro < dist_nariz_bocaRight){
    
                    unidad = distancia_puntos(nariz.x, nariz.y, orejaRight.x, orejaRight.y);
                    
                    areaDown_y = orejaRight.y - altura * unidad
                    areaUp_y = orejaRight.y
                    
                    areaUp_x = orejaRight.x + unidad
    
                    if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y){
    
                        areaDown_x = orejaRight.x - (orejaRight.y - tipPulgar.y) / altura
    
                        if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                            console.log("Mirando hacia la izquierda","Tirando el pelo!");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= areaUp_y && tipPulgar2.y >= areaDown_y){
    
                        areaDown_x = orejaRight.x - (orejaRight.y - tipPulgar2.y) / altura
    
                        if (tipPulgar2.x <= areaUp_x && tipPulgar2.x >= areaDown_x ){
                            console.log("Mirando hacia la izquierda","Tirando el pelo!");
                        }
                    }
                }
                //Mirando hacia la derecha
                else if (dist_nariz_bocaCentro < dist_nariz_bocaLeft && dist_nariz_bocaCentro - calibracion_perfil > dist_nariz_bocaRight){
    
                    unidad = distancia_puntos(nariz.x, nariz.y, orejaLeft.x, orejaLeft.y);
    
                    areaDown_y = orejaLeft.y - altura * unidad
                    areaUp_y = orejaLeft.y
    
                    areaDown_x = orejaLeft.x - unidad
    
                    if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y){
    
                        areaUp_x = orejaLeft.x + (orejaLeft.y - tipPulgar.y) / altura
    
                        if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                            console.log("Mirando hacia la derecha","Tirando el pelo!");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= areaUp_y && tipPulgar2.y >= areaDown_y){
    
                        areaUp_x = orejaLeft.x + (orejaLeft.y - tipPulgar2.y) / altura
    
                        if (tipPulgar2.x <= areaUp_x && tipPulgar2.x >= areaDown_x ){
                            console.log("Mirando hacia la derecha","Tirando el pelo!");
                        }
                    }
                }
            }
        }
    }

    if(morder_objetos){
        tf.engine().startScope()   // Liberar tensores que no se ocupan
        tensor = tf.image.resizeBilinear(tf.browser.fromPixels(webcam.canvas), [224, 224]).div(255.0).expandDims(0);
        modelo = await model.executeAsync(tensor).then(predictions=> { 
            const data = predictions;
            const [boxes, scores, classes, valid_detections] = predictions;
            const boxes_data = boxes.dataSync();
            const scores_data = scores.dataSync();
            const classes_data = classes.dataSync();
            const valid_detections_data = valid_detections.dataSync()[0];
    
    
            let [clase1_x1,clase1_y1,clase1_x2,clase1_y2] = boxes_data.slice(0,4);
            let [clase2_x1,clase2_y1,clase2_x2,clase2_y2] = boxes_data.slice(4,8);
            let [clase3_x1,clase3_y1,clase3_x2,clase3_y2] = boxes_data.slice(8,12);
            let [clase4_x1,clase4_y1,clase4_x2,clase4_y2] = boxes_data.slice(12,16);
            let [clase5_x1,clase5_y1,clase5_x2,clase5_y2] = boxes_data.slice(16,20);
            let [clase6_x1,clase6_y1,clase6_x2,clase6_y2] = boxes_data.slice(20,24);
            
            //if( manoIzquierda.x )

            clase1 = classes_data[0];
            clase2 = classes_data[1];
            clase3 = classes_data[2];
            clase4 = classes_data[3];
            clase5 = classes_data[4];
            clase6 = classes_data[5];
            
            //Si se detecta al menos una clase, entrar aquí
            if (clase1 != -1){
                
                //Si lo primero que se detecta es la boca
                // Si la boca está en la primera posición del arreglo
                if(clase1 == 0){
    
                    boca_x1 = clase1_x1
                    boca_x2 = clase1_x2
                    boca_y1 = clase1_y1
                    boca_y2 = clase1_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase2 == 1 || clase2 == 2){
        
                        x_izq = clase2_x1
                        x_der = clase2_x2
                        x_med = (clase2_x1 + clase2_x2) / 2.0
                        y_up = clase2_y1
                        y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                        y_low = clase2_y2
                        
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }if(clase3 == 1 || clase3 == 2){
                        x_izq = clase3_x1
                        x_der = clase3_x2
                        x_med = (clase3_x1 + clase3_x2) / 2.0
                        y_up = clase3_y1
                        y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                        y_low = clase3_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }if(clase4 == 1 || clase4 == 2){
                        x_izq = clase4_x1
                        x_der = clase4_x2
                        x_med = (clase4_x1 + clase4_x2) / 2.0
                        y_up = clase4_y1
                        y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                        y_low = clase4_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase5 == 1 || clase5 == 2){
                        x_izq = clase5_x1
                        x_der = clase5_x2
                        x_med = (clase5_x1 + clase5_x2) / 2.0
                        y_up = clase5_y1
                        y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                        y_low = clase5_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }
        
                }
                
                // Si la boca está en la segunda posición del arreglo
                else if(clase2 == 0){
    
                    boca_x1 = clase2_x1
                    boca_x2 = clase2_x2
                    boca_y1 = clase2_y1
                    boca_y2 = clase2_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase1 == 1 || clase1 == 2){
        
                        x_izq = clase1_x1
                        x_der = clase1_x2
                        x_med = (clase1_x1 + clase1_x2) / 2.0
                        y_up = clase1_y1
                        y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                        y_low = clase1_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
        
                    }if(clase3 == 1 || clase3 == 2){
                        x_izq = clase3_x1
                        x_der = clase3_x2
                        x_med = (clase3_x1 + clase3_x2) / 2.0
                        y_up = clase3_y1
                        y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                        y_low = clase3_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }if(clase4 == 1 || clase4 == 2){
                        x_izq = clase4_x1
                        x_der = clase4_x2
                        x_med = (clase4_x1 + clase4_x2) / 2.0
                        y_up = clase4_y1
                        y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                        y_low = clase4_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase5 == 1 || clase5 == 2){
                        x_izq = clase5_x1
                        x_der = clase5_x2
                        x_med = (clase5_x1 + clase5_x2) / 2.0
                        y_up = clase5_y1
                        y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                        y_low = clase5_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    
    
                    }
                }
                // Si la boca está en la tercera posición del arreglo
                else if(clase3 == 0){
    
                    boca_x1 = clase3_x1
                    boca_x2 = clase3_x2
                    boca_y1 = clase3_y1
                    boca_y2 = clase3_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase1 == 1 || clase1 == 2){
        
                        x_izq = clase1_x1
                        x_der = clase1_x2
                        x_med = (clase1_x1 + clase1_x2) / 2.0
                        y_up = clase1_y1
                        y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                        y_low = clase1_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
        
                    }if(clase2 == 1 || clase2 == 2){
                        x_izq = clase2_x1
                        x_der = clase2_x2
                        x_med = (clase2_x1 + clase2_x2) / 2.0
                        y_up = clase2_y1
                        y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                        y_low = clase2_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase4 == 1 || clase4 == 2){
                        x_izq = clase4_x1
                        x_der = clase4_x2
                        x_med = (clase4_x1 + clase4_x2) / 2.0
                        y_up = clase4_y1
                        y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                        y_low = clase4_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase5 == 1 || clase5 == 2){
                        x_izq = clase5_x1
                        x_der = clase5_x2
                        x_med = (clase5_x1 + clase5_x2) / 2.0
                        y_up = clase5_y1
                        y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                        y_low = clase5_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }
                    
                }
                
    
    
                // Si la boca está en la cuarta posición del arreglo
                else if(clase4 == 0){
    
                    boca_x1 = clase4_x1
                    boca_x2 = clase4_x2
                    boca_y1 = clase4_y1
                    boca_y2 = clase4_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase1 == 1 || clase1 == 2){
        
                        x_izq = clase1_x1
                        x_der = clase1_x2
                        x_med = (clase1_x1 + clase1_x2) / 2.0
                        y_up = clase1_y1
                        y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                        y_low = clase1_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase2 == 1 || clase2 == 2){
                        x_izq = clase2_x1
                        x_der = clase2_x2
                        x_med = (clase2_x1 + clase2_x2) / 2.0
                        y_up = clase2_y1
                        y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                        y_low = clase2_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase3 == 1 || clase3 == 2){
                        x_izq = clase3_x1
                        x_der = clase3_x2
                        x_med = (clase3_x1 + clase3_x2) / 2.0
                        y_up = clase3_y1
                        y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                        y_low = clase3_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase5 == 1 || clase5 == 2){
                        x_izq = clase5_x1
                        x_der = clase5_x2
                        x_med = (clase5_x1 + clase5_x2) / 2.0
                        y_up = clase5_y1
                        y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                        y_low = clase5_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }    
                }
                
                // Si la boca está en la quinta posición del arreglo
                else if(clase5 == 0){
    
                    boca_x1 = clase5_x1
                    boca_x2 = clase5_x2
                    boca_y1 = clase5_y1
                    boca_y2 = clase5_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase1 == 1 || clase1 == 2){
        
                        x_izq = clase1_x1
                        x_der = clase1_x2
                        x_med = (clase1_x1 + clase1_x2) / 2.0
                        y_up = clase1_y1
                        y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                        y_low = clase1_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase2 == 1 || clase2 == 2){
                        x_izq = clase2_x1
                        x_der = clase2_x2
                        x_med = (clase2_x1 + clase2_x2) / 2.0
                        y_up = clase2_y1
                        y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                        y_low = clase2_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase3 == 1 || clase3 == 2){
                        x_izq = clase3_x1
                        x_der = clase3_x2
                        x_med = (clase3_x1 + clase3_x2) / 2.0
                        y_up = clase3_y1
                        y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                        y_low = clase3_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
    
                    }if(clase4 == 1 || clase4 == 2){
                        x_izq = clase4_x1
                        x_der = clase4_x2
                        x_med = (clase4_x1 + clase4_x2) / 2.0
                        y_up = clase4_y1
                        y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                        y_low = clase4_y2
                        print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                    }
        
                }    
            }
          });
          tf.engine().endScope() // Liberar tensores que no se ocupan
    }
}


window.onload = camaraHandle;
