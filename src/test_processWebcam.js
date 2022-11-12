//Librerias de IA
const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
const poseDetection = require('@tensorflow-models/pose-detection');
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');
//Base de datos
const crud = require('./model/model.js')
const fs = require('fs');
//Notificaciones
const {NotificarUña, NotificarPelo, NotificarObjeto, NotificarPestañeo, NotificarVisual, NotificarNariz, NotificarPostura, CamaraCargada, NotificarPellizco} = require('./notificaciones.js');

const {ipcRenderer} = require("electron");
var ID_USER = get_user_id()

const URL = 'https://teachablemachine.withgoogle.com/models/83c4Qg0Gu/';

//Variables para la ejecución de los modelos
let model, modeloHand, modeloBlaze, detectorHand, detectorBlaze;

//Variables que determinan si la detección del mal habito está encendida.
let config_user
let onicofagia = false; //comer uñas
let tricotilomania = false; //arrancar pelos
let morder_objetos = false; //detectar mordidas
let postura = false; // detectar postura
let fatiga_visual = false;
let mucofagia = false; // CORREGIR
let dermatilomania = false;

//Variable para controlar la ejecución de la webcam
let webcam, run;
let corriendo = false;
let camara_cargada = false;

//Intervalo de tiempo antes de mandar notificación por cada mal habito y consolidar la detección
let intervalo_uña = 2000;
let intervalo_pelo = 500;
let intervalo_objeto = 2000;
let intervalo_vista = 1500;
let intervalo_postura = 5000;
let intervalo_nariz = 2000;
let intervalo_pellizco = 850;


//Booleanos que se activan cuando se cumplen los intervalos de tiempo
let detectado_uña = false;
let detectado_pelo = false;
let detectado_objeto = false;
let detectado_vista = false;
let detectado_postura = false;
let detectado_nariz = false;
let detectado_pellizco = false;

//Booleano para el pestañeo intermitente
let pestañeo_individual = false;
let booleano_pestañeo = false;
let hay_cara = false;


//Variables para la configuración de las notificaciones
let opcion;

//Variables para notificación de estrés
let intervalo_estres = 12000;
let tiempo_estres = false;
let detectado_estres = false;
let cantidad_estres = 3;

let cantidad_detecciones = 0;
let detecciones_estres = 0;
let configuracion_deteccion_estres = true ////////////////////////CORREGIR ESTO
let cantidad_notificacion;

let cantidad_mordidas = 0;
let cantidad_pregunta = 3;
let comiendo = false;
let tiempo_comiendo = 600000;

let cantidad_pestañeos = 0;
let tiempo_periodo = 1000000; //en milisegundos
let frec_normal_pestañeo = 2; // Sin concentrar vista: 20 pestañeos por min / Leyendo: 14 pestañeos por min -> 2 pestañeos por 10 seg
let corriendo_periodo = false; 


let tiempo_entre_notificaciones;
let se_puede_notificar = true;

//Variables para monitorear el tiempo de los malos habitos
let corriendo_uña = false;
let corriendo_pelo = false;
let corriendo_objeto = false;
let corriendo_vista = false;
let corriendo_postura = false;
let corriendo_nariz = false;
let corriendo_pellizco = false;

//Variables de timestamp
let inicio_uña, inicio_pelo, inicio_objeto, inicio_vista, inicio_postura, inicio_nariz, inicio_pellizco;
let fin_uña, fin_pelo, fin_objeto, fin_vista, fin_postura, fin_nariz, fin_pellizco;

//Booleanos que indican si se está realizando dicho mal habito
let comiendo_uña, tirando_pelo, mordiendo_objeto, fatigando_vista, mala_postura, urgando_nariz, pellizcando_cara;

//Variables para determinar si el usuario monitorea el progreso de sus uñas

let capturando_foto = false;

function Periodo_Pestañeo() {
    corriendo_periodo = true
    setTimeout (function(){

        /*if(!hay_cara){
            clearTimeout(timeout)
        }*/
        
        if(cantidad_pestañeos < frec_normal_pestañeo && hay_cara){
            
            if(opcion == "tiempo" && se_puede_notificar){
                NotificarPestañeo(config_user);
                CountDownEntreNotificaciones();
            }

            else if (opcion == "reconocimientos"){
                cantidad_detecciones++;
                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarPestañeo(config_user);
                    cantidad_detecciones = 0;
                }
            }
            let inicio_pestaneo = new Date()
            actualizarJson('pestaneo', inicio_pestaneo, inicio_pestaneo)
        }
        corriendo_periodo = false
        cantidad_pestañeos = 0
    }, tiempo_periodo);

}


function CountDownComiendo() {
    comiendo = true;
    setTimeout (function(){comiendo = false; cantidad_mordidas = 0}, tiempo_comiendo);
}

let cargarSonido2 = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};

function Preguntar_Comiendo(){ //esta notificación siempre se muestra, ya que se perderia una funcionalidad si no la mostramos
    Notification.requestPermission().then(function (result){
        new Notification("¿ESTÁS COMIENDO?", { 
            body: "CLICKEA ESTA NOTIFICACIÓN SI ESTÁS COMIENDO, PARA DETENER LA DETECCIÓN DE MORDIDA DE OBJETOS", icon: 'https://media.istockphoto.com/photos/woman-holding-slice-of-bread-with-question-mark-sign-picture-id1166079452?k=20&m=1166079452&s=612x612&w=0&h=JJJIj2EEn-8VV2aihn3tg0-Y281p2hH-0O3GC71UO2k='
        })
        .onclick = () => CountDownComiendo()
    })
    if (config_user.alertasonora == 'on'){
        let path = '../sounds/'+config_user.mordersound+'.mp3'
        let sonido = cargarSonido2(path);
        sonido.play();
    }
    
}

function Preguntar_Estres(){ 
    Notification.requestPermission().then(function (result){
        new Notification("¿ESTÁS ESTRESADO?", { 
            body: "CLICKEA ESTA NOTIFICACIÓN SI TE ENCUENTRAS ESTRESADO", icon: 'https://media.istockphoto.com/photos/woman-holding-slice-of-bread-with-question-mark-sign-picture-id1166079452?k=20&m=1166079452&s=612x612&w=0&h=JJJIj2EEn-8VV2aihn3tg0-Y281p2hH-0O3GC71UO2k='
        })
        .onclick = () => ipcRenderer.sendSync('Estresado', "")
    })
    if (config_user.alertasonora == 'on'){
        let path = '../sounds/'+config_user.sonidonotificaciongeneral+'.mp3'
        let sonido = cargarSonido2(path);
        sonido.play();
    }
    
}

function CountDownEstres() {
    tiempo_estres = true;
    setTimeout (function(){
        tiempo_estres = false;
        detectado_estres = false;
        detecciones_estres = 0;
    }, intervalo_estres);
}

function CountDownEntreNotificaciones() {
    se_puede_notificar = false;
    setTimeout (function(){se_puede_notificar = true}, tiempo_entre_notificaciones);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function get_user_id(){
    let respuesta = ipcRenderer.sendSync('get-user-id', "")
    return respuesta   
}

function actualizarJson(tipo, inicio, fin){
    let ini = inicio.toISOString()
    let fini = fin.toISOString()
    let total = (fin - inicio)/1000
    let totali = total.toString()
    let objInsert = {
        "inicio": ini,
        "final": fini,
        "total": totali
    }
    if (tipo == 'unha'){
        let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
        let lista_unhas = JSON.parse(rawdata);
        lista_unhas.push(objInsert)
        let data_unha = JSON.stringify(lista_unhas);
        fs.writeFileSync("./src/data/unhasSesion.json", data_unha)
    }else if (tipo == 'pelo'){
        let rawdata1 = fs.readFileSync('./src/data/peloSesion.json');
        let lista_pelo = JSON.parse(rawdata1);
        lista_pelo.push(objInsert)
        let data_pelo = JSON.stringify(lista_pelo);
        fs.writeFileSync("./src/data/peloSesion.json", data_pelo)
    }else if (tipo== 'objeto'){
        let rawdata2 = fs.readFileSync('./src/data/objetoSesion.json');
        let lista_objeto = JSON.parse(rawdata2);
        lista_objeto.push(objInsert)
        let data_objeto = JSON.stringify(lista_objeto);
        fs.writeFileSync("./src/data/objetoSesion.json", data_objeto)
    }else if (tipo== 'vista'){
        let rawdata3 = fs.readFileSync('./src/data/vistaSesion.json');
        let lista_vista = JSON.parse(rawdata3);
        lista_vista.push(objInsert)
        let data_vista = JSON.stringify(lista_vista);
        fs.writeFileSync("./src/data/vistaSesion.json", data_vista)
    }else if (tipo== 'pestaneo'){
        let rawdata4 = fs.readFileSync('./src/data/pestaneoSesion.json');
        let lista_pestaneo = JSON.parse(rawdata4);
        lista_pestaneo.push(objInsert)
        let data_pestaneo = JSON.stringify(lista_pestaneo);
        fs.writeFileSync("./src/data/pestaneoSesion.json", data_pestaneo)
    }else if (tipo== 'nariz'){
        let rawdata5 = fs.readFileSync('./src/data/narizSesion.json');
        let lista_nariz = JSON.parse(rawdata5);
        lista_nariz.push(objInsert)
        let data_nariz = JSON.stringify(lista_nariz);
        fs.writeFileSync("./src/data/narizSesion.json", data_nariz)
    }else if (tipo== 'postura'){
        let rawdata6 = fs.readFileSync('./src/data/posturaSesion.json');
        let lista_postura = JSON.parse(rawdata6);
        lista_postura.push(objInsert)
        let data_postura = JSON.stringify(lista_postura);
        fs.writeFileSync("./src/data/posturaSesion.json", data_postura)
    }else if (tipo== 'pellizco'){
        let rawdata7 = fs.readFileSync('./src/data/pellizcoSesion.json');
        let lista_pellizco = JSON.parse(rawdata7);
        lista_pellizco.push(objInsert)
        let data_pellizco = JSON.stringify(lista_pellizco);
        fs.writeFileSync("./src/data/pellizcoSesion.json", data_pellizco)
    }
}
async function getConfig(ID_USER){
    ID_USER = get_user_id()
    await crud.getConfig(ID_USER).then(result => {
        camara_cargada = false;
        corriendo_uña = false;
        corriendo_pelo = false;
        corriendo_objeto = false;
        corriendo_vista = false;
        corriendo_postura = false;
        corriendo_nariz = false;
        corriendo_pellizco = false;
        detectado_uña = false;
        detectado_pelo = false;
        detectado_objeto = false;
        detectado_vista = false;
        detectado_postura = false;
        detectado_nariz = false;
        detectado_pellizco = false;
        detectado_estres = false;
        corriendo_periodo = false;
        cantidad_mordidas = 0;
        cantidad_detecciones = 0;
        detecciones_estres = 0;
        cantidad_pestañeos = 0;

        config_user = result[0];
        //console.log(config_user);

        opcion = config_user.tiponotificacion;

        tiempo_entre_notificaciones = parseInt(config_user.tiemponotificacion) * 60000;

        cantidad_notificacion = parseInt(config_user.intervalonotificacion);

        if (cantidad_notificacion == 0){
            cantidad_notificacion = 1;
        }

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

        if (config_user.fatigavisual == "on"){
            fatiga_visual = true;
        }else{
            fatiga_visual = false;
        }
        if (config_user.hurgarnariz == "on"){
            mucofagia = true;
        }else{
            mucofagia = false;
        }

        if (config_user.pellizcarpiel == "on"){
            dermatilomania = true;
        }else{
            dermatilomania = false;
        }


    });  
}
  //aqui debiera ser ID_USER, pero no hay datos aun en la BD

async function camaraHandle(){ //funcion que va leyendo el archivo cameraHandle infinitamente.
    console.log("usuario logeado:", ID_USER)
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
            await getConfig(2) //aqui deberia haber cambiado a ID USER, pero lo arregle en la funcion xd
            corriendo = true
            flag = false
            await init_model()

        }else if (run == '0' && !flag){

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

function pinza_pellizco(pulgar, indice, muñeca){
    coeficiente = 13.5
    distancia_muñeca = 54


    pulgar_indice = distancia_puntos(pulgar.x , pulgar.y , indice.x , indice.y )
    indice_muñeca = distancia_puntos(indice.x , indice.y , muñeca.x , muñeca.y )
    //positivo hacia cara el indice
    
    
    console.log("pulgar_indice: ", pulgar_indice)
    console.log("indice_muñeca: ", indice_muñeca)
    
    
    if(indice_muñeca > distancia_muñeca && pulgar_indice < coeficiente ){
        return true
    }
    return false
    
}
function magnitud(punto){
    return ((punto.x) ** 2 + (punto.y) ** 2 + (punto.z) ** 2) ** 0.5
}

function magnitud_2D(punto_x, punto_y){
    return ((punto_x) ** 2 + (punto_y) ** 2) ** 0.5
}

function mano_abierta(pulgar, indice, medio, anular, meñique, muñeca){


    coef_pulgar = 1.52
    coef_indice = 1.48
    coef_medio = 1.48
    coef_anular = 1.48
    coef_meñique = 1.38
    coef_horizontal = 1.1
    
    magnitud_pulgar = magnitud(pulgar) 
    magnitud_indice = magnitud(indice)
    magnitud_medio = magnitud(medio)
    magnitud_anular = magnitud(anular)
    magnitud_meñique = magnitud(meñique)
    magnitud_muñeca = magnitud(muñeca)

    pulgar_muñeca = distancia_puntos3D(pulgar.x / magnitud_pulgar, pulgar.y / magnitud_pulgar, pulgar.z / magnitud_pulgar, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    indice_muñeca = distancia_puntos3D(indice.x / magnitud_indice , indice.y / magnitud_indice, indice.z / magnitud_indice, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    medio_muñeca = distancia_puntos3D(medio.x / magnitud_medio, medio.y / magnitud_medio, medio.z / magnitud_medio, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    anular_muñeca = distancia_puntos3D(anular.x / magnitud_anular, anular.y / magnitud_anular, anular.z / magnitud_anular, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
   
    meñique_muñeca = distancia_puntos3D(meñique.x / magnitud_meñique, meñique.y / magnitud_meñique, meñique.z / magnitud_meñique, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)

    pulgar_meñique = distancia_puntos3D(pulgar.x / magnitud_pulgar, pulgar.y / magnitud_pulgar, pulgar.z / magnitud_pulgar, meñique.x / magnitud_meñique, meñique.y / magnitud_meñique, meñique.z / magnitud_meñique)

    
    console.log("pulgar_muñeca:",pulgar_muñeca)
    console.log("indice_muñeca:", indice_muñeca)
    console.log("medio_muñeca:", medio_muñeca)
    console.log("anular_muñeca:", anular_muñeca)
    console.log("meñique_muñeca:", meñique_muñeca)
    console.log("pulgar_meñique:", pulgar_meñique) 


    if (pulgar_muñeca >= coef_pulgar && indice_muñeca >= coef_indice && medio_muñeca >= coef_medio && anular_muñeca >= coef_anular && meñique_muñeca >= coef_meñique && pulgar_meñique >= coef_horizontal){

        console.log("MANO ABIERTA")
        return true
    }

    return false

}

function print_mordida(b_x1, b_x2, b_y1, b_y2,    x_i, x_d, x_m,    y_u, y_m, y_l){

    //En caso de que la mordida se detecte en la punta superior del objeto
    if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_u && y_u > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ARRIBA ")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_u && y_u > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ARRIBA ")

    }else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_u && y_u > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ARRIBA ")

    }
    //En caso de que la mordida se detecte en la punta inferior del objeto
    else if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_l && y_l > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ABAJO ")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_l && y_l > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ABAJO ")
    }
    else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_l && y_l > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO ABAJO ")
    }
    //En caso de que la mordida se detecte en el medio del objeto
    else if(b_x1 < x_i && x_i < b_x2 && b_y2 > y_m && y_m > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO MEDIO")
    }
    else if(b_x1 < x_d && x_d < b_x2 && b_y2 > y_m && y_m > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO MEDIO")
    }
    else if(b_x1 < x_m && x_m < b_x2 && b_y2 > y_m && y_m > b_y1){
        if (!corriendo_objeto){
            inicio_objeto = new Date;
        }
        mordiendo_objeto = true;
        corriendo_objeto = true;
        console.log("MORDIENDO MEDIO")
    }

}

async function init_model() {

    modeloBlaze = poseDetection.SupportedModels.BlazePose;
    detectorBlaze = await poseDetection.createDetector(modeloBlaze, {runtime : 'tfjs', modelType : 'full'});

    if (onicofagia || tricotilomania || fatiga_visual || mucofagia || dermatilomania ){
        modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;
        detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});

    }

    if (morder_objetos){
        model = await tf.loadGraphModel('../modelo_objetos/model.json');
    }

    if(fatiga_visual){
        //INSERTAR MODELO DE PESTAÑEO
        modeloPestañeo = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        detectorPestañeo = await faceLandmarksDetection.createDetector(modeloPestañeo, {runtime: 'tfjs', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'});
    }

    const flip = false;
    const width = 224;
    const height = 224;
    webcam = new tmImage.Webcam(width, height, flip);

    await webcam.setup(); // request access to the webcam
    webcam.play();
    document.getElementById("HOLA").appendChild(webcam.canvas);

    setTimeout (function(){window.requestAnimationFrame(loop)}, 5000);

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

    
    

    if (onicofagia || tricotilomania || fatiga_visual || mucofagia || postura || dermatilomania){

        posesBlaze = await detectorBlaze.estimatePoses(webcam.canvas);
        //https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
        



        
    }

    if (onicofagia || tricotilomania || fatiga_visual || mucofagia || dermatilomania){

        posesHand = await detectorHand.estimateHands(webcam.canvas);
        //https://github.com/tensorflow/tfjs-models/tree/master/pose-detection

        
    }

    if (fatiga_visual){
        cara = await detectorPestañeo.estimateFaces(webcam.canvas);
    }
    

    if (!camara_cargada){
        CamaraCargada(config_user);
        camara_cargada = true;
    }

    
    comiendo_uña = false 
    tirando_pelo = false
    mordiendo_objeto = false
    fatigando_vista = false
    urgando_nariz = false
    mala_postura = false
    pellizcando_cara = false
    
    if ( (onicofagia || tricotilomania || fatiga_visual || mucofagia || dermatilomania) && posesBlaze.length != 0 && posesHand.length != 0 /* && (posesBlaze[0].keypoints3D[19].score >= 0.8 || posesBlaze[0].keypoints3D[20].score >= 0.8)*/){

        //BLAZE POSE

        //Se consideran los puntos, del estimador BlazePose, que serán de utilidad. En este caso los dos puntos de la boca, en coordenadas (x,y) y (x,y,z), los puntos de los indices de la manos, los puntos de los ojos, de los hombros y nariz.
        bocaLeft = posesBlaze[0].keypoints[9]
        bocaRight = posesBlaze[0].keypoints[10]

        bocaLeft3D = posesBlaze[0].keypoints3D[9]
        bocaRight3D = posesBlaze[0].keypoints3D[10]

        ojoLeft_Outer = posesBlaze[0].keypoints[3]
        ojoLeft = posesBlaze[0].keypoints[2]
        ojoLeft_Inner = posesBlaze[0].keypoints[1]

        ojoRight_Outer = posesBlaze[0].keypoints[6]
        ojoRight = posesBlaze[0].keypoints[5]
        ojoRight_Inner = posesBlaze[0].keypoints[4]

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

        pipIndice = posesHand[0].keypoints[6]

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

        muñeca = posesHand[0].keypoints[0]
        muñeca3D = posesHand[0].keypoints3D[0]


        if (posesHand.length == 2){

            dipPulgar2 = posesHand[1].keypoints[3]
            dipIndice2 = posesHand[1].keypoints[7]
            dipMedio2 = posesHand[1].keypoints[11]
            dipAnular2 = posesHand[1].keypoints[15]
            dipMenique2 = posesHand[1].keypoints[19]

            pipIndice2 = posesHand[1].keypoints[6]

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

            muñeca2_3D = posesHand[1].keypoints3D[0]

            console.log(tipIndice3D.z >= 0 , tipIndice2_3D.z >= 0)

        }

/*-----------------------------------------------SECCIÓN DE FATIGA VISUAL CON MANO----------------------------------------------*/
        if(fatiga_visual){

            radio_ojoLeft = distancia_puntos(ojoLeft_Outer.x, ojoLeft_Outer.y, ojoLeft.x, ojoLeft.y)
            radio_ojoRight = distancia_puntos(ojoRight_Outer.x, ojoRight_Outer.y, ojoRight.x, ojoRight.y)

            //IZQUIERDA
            //caso restregar con "pip"
            dist_ojoLeft_pipIndice = distancia_puntos(pipIndice.x, pipIndice.y, ojoLeft.x, ojoLeft.y)

            //caso restregar con puntas de los dedos
            dist_ojoLeft_tipPulgar = distancia_puntos(tipPulgar.x, tipPulgar.y, ojoLeft.x, ojoLeft.y)
            dist_ojoLeft_tipIndice = distancia_puntos(tipIndice.x, tipIndice.y, ojoLeft.x, ojoLeft.y)
            dist_ojoLeft_tipMedio = distancia_puntos(tipMedio.x, tipMedio.y, ojoLeft.x, ojoLeft.y)
            dist_ojoLeft_tipAnular = distancia_puntos(tipAnular.x, tipAnular.y, ojoLeft.x, ojoLeft.y)
            dist_ojoLeft_tipMenique = distancia_puntos(tipMenique.x, tipMenique.y, ojoLeft.x, ojoLeft.y)

            //DERECHA
            //caso restregar con "pip"
            dist_ojoRight_pipIndice = distancia_puntos(pipIndice.x, pipIndice.y, ojoRight.x, ojoRight.y)

            //caso restregar con puntas de los dedos
            dist_ojoRight_tipPulgar = distancia_puntos(tipPulgar.x, tipPulgar.y, ojoRight.x, ojoRight.y)
            dist_ojoRight_tipIndice = distancia_puntos(tipIndice.x, tipIndice.y, ojoRight.x, ojoRight.y)
            dist_ojoRight_tipMedio = distancia_puntos(tipMedio.x, tipMedio.y, ojoRight.x, ojoRight.y)
            dist_ojoRight_tipAnular = distancia_puntos(tipAnular.x, tipAnular.y, ojoRight.x, ojoRight.y)
            dist_ojoRight_tipMenique = distancia_puntos(tipMenique.x, tipMenique.y, ojoRight.x, ojoRight.y)

            if (radio_ojoLeft >= dist_ojoLeft_pipIndice || radio_ojoRight >= dist_ojoRight_pipIndice){
                
                if (!corriendo_vista){
                    inicio_vista = new Date;
                }
                console.log("restregando ojo")
                fatigando_vista = true
                corriendo_vista = true
            }

            else if(radio_ojoLeft >= dist_ojoLeft_tipPulgar || radio_ojoLeft >= dist_ojoLeft_tipIndice || radio_ojoLeft >= dist_ojoLeft_tipMedio || radio_ojoLeft >= dist_ojoLeft_tipAnular || radio_ojoLeft >= dist_ojoLeft_tipMenique){
                
                if (!corriendo_vista){
                    inicio_vista = new Date;
                }
                console.log("restregando ojo")

                fatigando_vista = true
                corriendo_vista = true
            }

            else if(radio_ojoRight >= dist_ojoRight_tipPulgar || radio_ojoRight >= dist_ojoRight_tipIndice || radio_ojoRight >= dist_ojoRight_tipMedio || radio_ojoRight >= dist_ojoRight_tipAnular || radio_ojoRight >= dist_ojoRight_tipMenique){
                
                if (!corriendo_vista){
                    inicio_vista = new Date;
                }
                console.log("restregando ojo")

                fatigando_vista = true
                corriendo_vista = true

            }

            if (posesHand.length == 2 && !corriendo_vista){

                //IZQUIERDA
                //caso restregar con "pip"
                dist_ojoLeft_pipIndice2 = distancia_puntos(pipIndice2.x, pipIndice2.y, ojoLeft.x, ojoLeft.y)

                //caso restregar con puntas de los dedos
                dist_ojoLeft_tipPulgar2 = distancia_puntos(tipPulgar2.x, tipPulgar2.y, ojoLeft.x, ojoLeft.y)
                dist_ojoLeft_tipIndice2 = distancia_puntos(tipIndice2.x, tipIndice2.y, ojoLeft.x, ojoLeft.y)
                dist_ojoLeft_tipMedio2 = distancia_puntos(tipMedio2.x, tipMedio2.y, ojoLeft.x, ojoLeft.y)
                dist_ojoLeft_tipAnular2 = distancia_puntos(tipAnular2.x, tipAnular2.y, ojoLeft.x, ojoLeft.y)
                dist_ojoLeft_tipMenique2 = distancia_puntos(tipMenique2.x, tipMenique2.y, ojoLeft.x, ojoLeft.y)

                //DERECHA
                //caso restregar con "pip"
                dist_ojoRight_pipIndice2 = distancia_puntos(pipIndice2.x, pipIndice2.y, ojoRight.x, ojoRight.y)

                //caso restregar con puntas de los dedos
                dist_ojoRight_tipPulgar2 = distancia_puntos(tipPulgar2.x, tipPulgar2.y, ojoRight.x, ojoRight.y)
                dist_ojoRight_tipIndice2 = distancia_puntos(tipIndice2.x, tipIndice2.y, ojoRight.x, ojoRight.y)
                dist_ojoRight_tipMedio2 = distancia_puntos(tipMedio2.x, tipMedio2.y, ojoRight.x, ojoRight.y)
                dist_ojoRight_tipAnular2 = distancia_puntos(tipAnular2.x, tipAnular2.y, ojoRight.x, ojoRight.y)
                dist_ojoRight_tipMenique2 = distancia_puntos(tipMenique2.x, tipMenique2.y, ojoRight.x, ojoRight.y)

                if (radio_ojoLeft >= dist_ojoLeft_pipIndice2 || radio_ojoRight >= dist_ojoRight_pipIndice2){
                    
                    if (!corriendo_vista){
                        inicio_vista = new Date;
                    }
                    console.log("restregando ojo")

                    fatigando_vista = true
                    corriendo_vista = true
                }

                else if(radio_ojoLeft >= dist_ojoLeft_tipPulgar2 || radio_ojoLeft >= dist_ojoLeft_tipIndice2 || radio_ojoLeft >= dist_ojoLeft_tipMedio2 || radio_ojoLeft >= dist_ojoLeft_tipAnular2 || radio_ojoLeft >= dist_ojoLeft_tipMenique2){
                    
                    if (!corriendo_vista){
                        inicio_vista = new Date;
                    }
                    console.log("restregando ojo")

                    fatigando_vista = true
                    corriendo_vista = true
                }

                else if(radio_ojoRight >= dist_ojoRight_tipPulgar2 || radio_ojoRight >= dist_ojoRight_tipIndice2 || radio_ojoRight >= dist_ojoRight_tipMedio2 || radio_ojoRight >= dist_ojoRight_tipAnular2 || radio_ojoRight >= dist_ojoRight_tipMenique2){
                    
                    if (!corriendo_vista){
                        inicio_vista = new Date;
                    }
                    console.log("restregando ojo")

                    fatigando_vista = true
                    corriendo_vista = true

                }
            }
        }
/*-----------------------------------------------SECCIÓN DE ONICOFAGÍA-----------------------------------------------*/
        if (onicofagia && !fatigando_vista){
            if (tipPulgar.y >= dipPulgar.y - 8 && tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow && tipPulgar3D.z > 0){
                if (!corriendo_uña){
                    inicio_uña = new Date;
                }
                console.log("Comiendo uña pulgar");
                comiendo_uña = true;
                corriendo_uña = true;
            }

            else if (tipIndice.y > dipIndice.y && tipIndice.x <= radioXUp && tipIndice.x >= radioXLow && tipIndice.y >= radioYUp && tipIndice.y <= radioYLow && tipIndice3D.z > 0){
                if (!corriendo_uña){
                    inicio_uña = new Date;
                }
                console.log("Comiendo uña indice");
                comiendo_uña = true;
                corriendo_uña = true;
            }

            else if (tipMedio.y > dipMedio.y && tipMedio.x <= radioXUp && tipMedio.x >= radioXLow && tipMedio.y >= radioYUp && tipMedio.y <= radioYLow && tipMedio3D.z > 0){
                if (!corriendo_uña){
                    inicio_uña = new Date;
                }
                console.log("Comiendo uña medio");
                comiendo_uña = true;
                corriendo_uña = true;
            }

            else if (tipAnular.y > dipAnular.y && tipAnular.x <= radioXUp && tipAnular.x >= radioXLow && tipAnular.y >= radioYUp && tipAnular.y <= radioYLow && tipAnular3D.z > 0){
                if (!corriendo_uña){
                    inicio_uña = new Date;
                }
                console.log("Comiendo uña anular");
                comiendo_uña = true;
                corriendo_uña = true;
            }

            else if (tipMenique.y > dipMenique.y && tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow && tipMenique3D.z > 0){
                if (!corriendo_uña){
                    inicio_uña = new Date;
                }
                console.log("Comiendo uña meñique");
                comiendo_uña = true;
                corriendo_uña = true;
            }

            if (posesHand.length == 2){

                if (tipPulgar2.y >= dipPulgar2.y - 8 && tipPulgar2.x <= radioXUp && tipPulgar2.x >= radioXLow && tipPulgar2.y >= radioYUp && tipPulgar2.y <= radioYLow && tipPulgar2_3D.z > 0){
                    if (!corriendo_uña){
                        inicio_uña = new Date;
                    }
                    console.log("Comiendo uña pulgar");
                    comiendo_uña = true;
                    corriendo_uña = true;
                }

                else if (tipIndice2.y > dipIndice2.y && tipIndice2.x <= radioXUp && tipIndice2.x >= radioXLow && tipIndice2.y >= radioYUp && tipIndice2.y <= radioYLow && tipIndice2_3D.z > 0){
                    if (!corriendo_uña){
                        inicio_uña = new Date;
                    }
                    console.log("Comiendo uña indice");
                    comiendo_uña = true;
                    corriendo_uña = true;
                }

                else if (tipMedio2.y > dipMedio2.y && tipMedio2.x <= radioXUp && tipMedio2.x >= radioXLow && tipMedio2.y >= radioYUp && tipMedio2.y <= radioYLow && tipMedio2_3D.z > 0){
                    if (!corriendo_uña){
                        inicio_uña = new Date;
                    }
                    console.log("Comiendo uña medio");
                    comiendo_uña = true;
                    corriendo_uña = true;
                }

                else if (tipAnular2.y > dipAnular2.y && tipAnular2.x <= radioXUp && tipAnular2.x >= radioXLow && tipAnular2.y >= radioYUp && tipAnular2.y <= radioYLow && tipAnular2_3D.z > 0){
                    if (!corriendo_uña){
                        inicio_uña = new Date;
                    }
                    console.log("Comiendo uña anular");
                    comiendo_uña = true;
                    corriendo_uña = true;
                }

                else if (tipMenique2.y > dipMenique2.y && tipMenique2.x <= radioXUp && tipMenique2.x >= radioXLow && tipMenique2.y >= radioYUp && tipMenique2.y <= radioYLow && tipMenique2_3D.z > 0 ){
                    if (!corriendo_uña){
                        inicio_uña = new Date;
                    }
                    comiendo_uña = true;
                    corriendo_uña = true;
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
            score_estricto = 0.98
            if(mano_pinza(tipPulgar3D, tipIndice3D, tipMedio3D, muñeca3D) || (posesHand.length == 2 && mano_pinza(tipPulgar2_3D, tipIndice2_3D, tipMedio2_3D, muñeca2_3D))){

                if (dist_nariz_bocaCentro < dist_nariz_bocaLeft && dist_nariz_bocaCentro < dist_nariz_bocaRight){

                    segmento = (orejaLeft.x - orejaRight.x) / 4

                    areaDown_x = orejaRight.x - segmento
                    areaUp_x = orejaLeft.x + segmento
    
                    areaUp_y = (orejaRight.y + orejaLeft.y) / 2
                    areaDown_y = areaUp_y - (areaUp_x - areaDown_x)

                    frente = areaDown_y + 2*segmento

                    // ZONA DE LA FRENTE HACIA ARRIBA
                    if (tipPulgar.y <= frente && tipPulgar.y >= areaDown_y && posesHand[0].score > score_estricto){

                        if (tipPulgar.x >= areaDown_x && tipPulgar.x <= areaUp_x && tipPulgar.y >= areaDown_y && tipPulgar.y <= areaUp_y){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando de frente","Tirando el pelo por arriba");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= frente && tipPulgar2.y >= areaDown_y && posesHand[1].score > score_estricto){

                        if (tipPulgar2.x >= areaDown_x && tipPulgar2.x <= areaUp_x && tipPulgar2.y >= areaDown_y && tipPulgar2.y <= areaUp_y){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando de frente","Tirando el pelo por arriba");
                        }
                    }

                    // ZONA A LOS COSTADOS DE LA CABEZA
                    else if (tipPulgar.y > frente && tipPulgar.y <= areaUp_y && posesHand[0].score > score_estricto){

                        if (tipPulgar.x >= areaDown_x && tipPulgar.x <= orejaRight.x){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando de frente","Tirando el pelo por el costado derecho");
                        }

                        else if (tipPulgar.x >= orejaLeft.x && tipPulgar.x <= areaUp_x){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando de frente","Tirando el pelo por el costado izquierdo");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y > frente && tipPulgar2.y <= areaUp_y && posesHand[1].score > score_estricto){

                        if (tipPulgar2.x >= areaDown_x && tipPulgar2.x <= orejaRight.x){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando de frente","Tirando el pelo por el costado derecho");
                        }

                        else if (tipPulgar2.x >= orejaLeft.x && tipPulgar2.x <= areaUp_x){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
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
    
                    if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y && posesHand[0].score > score_estricto){
    
                        areaDown_x = orejaRight.x - (orejaRight.y - tipPulgar.y) / altura
    
                        if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando hacia la izquierda","Tirando el pelo!");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= areaUp_y && tipPulgar2.y >= areaDown_y && posesHand[1].score > score_estricto){
    
                        areaDown_x = orejaRight.x - (orejaRight.y - tipPulgar2.y) / altura
    
                        if (tipPulgar2.x <= areaUp_x && tipPulgar2.x >= areaDown_x ){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
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
    
                    if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y && posesHand[0].score > score_estricto){
    
                        areaUp_x = orejaLeft.x + (orejaLeft.y - tipPulgar.y) / altura
    
                        if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando hacia la derecha","Tirando el pelo!");
                        }
                    }

                    else if (posesHand.length == 2 && tipPulgar2.y <= areaUp_y && tipPulgar2.y >= areaDown_y && posesHand[1].score > score_estricto){
    
                        areaUp_x = orejaLeft.x + (orejaLeft.y - tipPulgar2.y) / altura
    
                        if (tipPulgar2.x <= areaUp_x && tipPulgar2.x >= areaDown_x ){
                            if (!corriendo_pelo){
                                inicio_pelo = new Date;
                            }
                            tirando_pelo = true;
                            corriendo_pelo = true;
                            console.log("Mirando hacia la derecha","Tirando el pelo!");
                        }
                    }
                }
                    
            }
        }


/*-----------------------------------------------SECCIÓN DE MUCOFAGIA-----------------------------------------------*/
        if(mucofagia){
            let radio_nariz;

            radio_ojoLeft = distancia_puntos(ojoLeft_Outer.x, ojoLeft_Outer.y, ojoLeft_Inner.x, ojoLeft_Inner.y)
            radio_ojoRight = distancia_puntos(ojoRight_Outer.x, ojoRight_Outer.y, ojoRight_Inner.x, ojoRight_Inner.y)

            dist_nariz_tip = distancia_puntos(tipIndice.x, tipIndice.y, nariz.x, nariz.y)

            if (radio_ojoLeft > radio_ojoRight){
                radio_nariz = radio_ojoLeft
            } else {
                radio_nariz = radio_ojoRight
            }
            
            if (tipIndice.y < bocaCenter_y && dist_nariz_tip >= 0 && radio_nariz >= dist_nariz_tip){
                if (!corriendo_nariz){
                    inicio_nariz = new Date;
                }
                console.log("MUCOFAGIA")
                urgando_nariz = true;
                corriendo_nariz = true;

            }

            if (posesHand.length == 2 && !corriendo_nariz){

                dist_nariz_tip = distancia_puntos(tipIndice2.x, tipIndice2.y, nariz.x, nariz.y)

                if (tipIndice2.y < bocaCenter_y && dist_nariz_tip >= 0 && radio_nariz >= dist_nariz_tip){
                    if (!corriendo_nariz){
                        inicio_nariz = new Date;
                    }
                    
                    console.log("MUCOFAGIA")
                    urgando_nariz = true;
                    corriendo_nariz = true;
    
                }

            }
        }
/*-----------------------------------------------SECCIÓN DE DERMATILOMANIA-----------------------------------------------*/
        if(dermatilomania && !tirando_pelo){

            // REFERENCIA: https://imgur.com/a/Z4ykQd2
            if(pinza_pellizco(tipPulgar, tipIndice, muñeca)){

                centro_elipse_x = (ojoLeft_Inner.x + ojoRight_Inner.x + nariz.x)/3
                centro_elipse_y = (ojoLeft_Inner.y + ojoRight_Inner.y + nariz.y)/3

                beta = distancia_puntos(bocaLeft.x, bocaLeft.y, bocaRight.x, bocaRight.y)
                alfa = distancia_puntos(orejaLeft.x, orejaLeft.y, orejaRight.x, orejaRight.y)

                b = (bocaLeft.y + bocaRight.y) / 2 - (ojoLeft_Inner.y + ojoRight_Inner.y) / 2 + 3 * beta

                x = tipIndice.x - centro_elipse_x
                y = tipIndice.y - centro_elipse_y

                if ( x**2 / alfa ** 2 + y ** 2 / b ** 2 <= 1 ){

                    if (!corriendo_pellizco){
                        inicio_pellizco = new Date;
                    }

                    pellizcando_cara = true;
                    corriendo_pellizco = true;
                    
                    console.log("DERMATILOMANIA")
                }     
            }   
        }
    }

    /*-----------------------------------------------SECCIÓN DE POSTURA-----------------------------------------------*/

    if(postura && posesBlaze.length != 0){
        hombro_izquierdo = posesBlaze[0].keypoints[11]
        hombro_derecho =  posesBlaze[0].keypoints[12]

        hombro_promedio_X = (hombro_izquierdo.x + hombro_derecho.x) / 2.0
        hombro_promedio_Y = (hombro_izquierdo.y + hombro_derecho.y) / 2.0


        mejilla_izquierda = posesBlaze[0].keypoints[7]
        mejilla_derecha = posesBlaze[0].keypoints[8]

        mejilla_promedio_X = (mejilla_izquierda.x + mejilla_derecha.x) / 2.0
        mejilla_promedio_Y = (mejilla_izquierda.y + mejilla_izquierda.y) / 2.0

        vertical = distancia_puntos(hombro_promedio_X,  hombro_promedio_Y , mejilla_promedio_X , mejilla_promedio_Y )
        horizontal = distancia_puntos(hombro_izquierdo.x , hombro_izquierdo.y , hombro_derecho.x , hombro_derecho.y )
        proporcion_nueva = vertical / horizontal

        /*
        console.log("Horizontal: ", horizontal)
        console.log("Vertical: ", vertical)
        console.log("Proporcion: ", proporcion_nueva)
        */
        if(proporcion_nueva < 0.48){
            if(!corriendo_postura){
                inicio_postura = new Date;
            }
            
            console.log("MALA POSTURA")
            mala_postura = true;
            corriendo_postura = true;

        }else if(horizontal < 100 && vertical < 78){
            if(!corriendo_postura){
                inicio_postura = new Date;
            }
            
            console.log("MALA POSTURA")
            mala_postura = true;
            corriendo_postura = true;

        }

 
    }
    

/*---------------------------------------------SECCIÓN DE FATIGA VISUAL CON PESTAÑEO----------------------------------------------*/
    if(fatiga_visual){

        //cara = await detectorPestañeo.estimateFaces(webcam.canvas);

        if(booleano_pestañeo){
            if (cara.length != 0){
                hay_cara = true
                if (!corriendo_periodo){
                    Periodo_Pestañeo()
                }
                //Nariz
                nariz1 = cara[0].keypoints[4]
                nariz2 = cara[0].keypoints[1]
                narizUP = cara[0].keypoints[6]
                narizLOW = cara[0].keypoints[5]
    
                //frente
                f1 = cara[0].keypoints[107]
                f2 = cara[0].keypoints[336]
    
                //Parpados
                parpado_superior_160 = cara[0].keypoints[160]
                parpado_superior_158 = cara[0].keypoints[158]
                parpado_superior_385 = cara[0].keypoints[385]
                parpado_superior_387 = cara[0].keypoints[387]
    
    
                parpado_inferior_144 = cara[0].keypoints[144]
                parpado_inferior_153 = cara[0].keypoints[153]
                parpado_inferior_380 = cara[0].keypoints[380]
                parpado_inferior_373 = cara[0].keypoints[373]
    
                parpado_extremo_33 = cara[0].keypoints[33]
                parpado_extremo_133 = cara[0].keypoints[133]
                parpado_extremo_362 = cara[0].keypoints[362]
                parpado_extremo_263 = cara[0].keypoints[263]
    
    
                //Proporción para determinar parpadeo en ojo derecho
                derecho = (distancia_puntos(parpado_superior_160.x, parpado_superior_160.y,parpado_inferior_144.x, parpado_inferior_144.y)
                + distancia_puntos(parpado_superior_158.x, parpado_superior_158.y,parpado_inferior_153.x, parpado_inferior_153.y)
                ) / (2 * distancia_puntos(parpado_extremo_33.x, parpado_extremo_33.y, parpado_extremo_133.x, parpado_extremo_133.y))
    
                //Proporción para determinar parpadeo en ojo izquierdo
                izquierdo = (distancia_puntos(parpado_superior_385.x, parpado_superior_385.y,parpado_inferior_380.x, parpado_inferior_380.y)
                + distancia_puntos(parpado_superior_387.x, parpado_superior_387.y,parpado_inferior_373.x, parpado_inferior_373.y)
                ) / (2 * distancia_puntos(parpado_extremo_362.x, parpado_extremo_362.y, parpado_extremo_263.x, parpado_extremo_263.y))
    
            
                //Unidad para definir cercanía a la pantalla en base a dos coordenadas de la frente
                dist_frente = distancia_puntos(f1.x, f1.y, f2.x, f2.y)
    
                //Condición para que bajar cabeza no se detecte como pestañeo
                condicion_abajo_arriba = distancia_puntos(nariz1.x, nariz1.y, nariz2.x, nariz2.y) / distancia_puntos(f1.x, f1.y, f2.x, f2.y)
    
                //Proporción para que levantar cabeza no se detecte como pestañeo
                proporcion = distancia_puntos(f1.x, f1.y, f2.x, f2.y) / distancia_puntos(narizUP.x, narizUP.y, narizLOW.x, narizLOW.y)
    
                //proporcion < 1.35
                if(!pestañeo_individual){
                    if(derecho <= 0.255 && izquierdo <= 0.255 && condicion_abajo_arriba > 0.18  && dist_frente < 28){
                        pestañeo_individual = true
                        console.log("Parpadeando frente")
                        cantidad_pestañeos += 1
        
                    }else if(derecho <= 0.23 && izquierdo <= 0.23 && condicion_abajo_arriba > 0.18  && dist_frente >= 28){
                        pestañeo_individual = true
                        console.log("Parpadeando cerca frente")
                        cantidad_pestañeos += 1
        
                    }else if(derecho <= 0.32 && izquierdo <= 0.32 && condicion_abajo_arriba > 0.15 && condicion_abajo_arriba < 0.17 && dist_frente < 28){
                        pestañeo_individual = true
                        console.log("Parpadeando abajo")
                        cantidad_pestañeos += 1
        
                    }else if(derecho <= 0.32 && izquierdo <= 0.32 && condicion_abajo_arriba > 0.15 && condicion_abajo_arriba < 0.17 && dist_frente >= 28){
                        pestañeo_individual = true
                        console.log("Parpadeando abajo cerca")
                        cantidad_pestañeos += 1
        
                    }else if(derecho <= 0.35 && izquierdo <= 0.35 && condicion_abajo_arriba > 0.1 && condicion_abajo_arriba < 0.15 && dist_frente < 28){
                        pestañeo_individual = true
                        console.log("Parpadeando muy abajo")
                        cantidad_pestañeos += 1
                    }
    
                }if (derecho > 0.255 && izquierdo > 0.255 && condicion_abajo_arriba > 0.18  && dist_frente < 28){
                    pestañeo_individual = false
    
                }else if(derecho > 0.23 && izquierdo > 0.23 && condicion_abajo_arriba > 0.18  && dist_frente >= 28){
                    pestañeo_individual = false
    
    
                }else if(derecho > 0.32 && izquierdo > 0.32 && condicion_abajo_arriba > 0.15 && condicion_abajo_arriba < 0.17 && dist_frente < 28){
                    pestañeo_individual = false
    
    
                }else if(derecho > 0.32 && izquierdo > 0.32 && condicion_abajo_arriba > 0.15 && condicion_abajo_arriba < 0.17 && dist_frente >= 28){
                    pestañeo_individual = false
    
    
                }else if(derecho > 0.35 && izquierdo > 0.35 && condicion_abajo_arriba > 0.1 && condicion_abajo_arriba < 0.15 && dist_frente < 28){
                    pestañeo_individual = false
    
                }
                
    
            }else{
                hay_cara = false
            }


            
        }
        booleano_pestañeo = true

    }

    if(morder_objetos && !comiendo && !comiendo_uña){
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

            score_clase1 = scores_data[0];
            score_clase2 = scores_data[1];
            score_clase3 = scores_data[2];
            score_clase4 = scores_data[3];
            score_clase5 = scores_data[4];

            coef = 0.61
            
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
                        
                        if (score_clase2 > coef){
                            x_izq = clase2_x1
                            x_der = clase2_x2
                            x_med = (clase2_x1 + clase2_x2) / 2.0
                            y_up = clase2_y1
                            y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                            y_low = clase2_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

                        

                    }if(clase3 == 1 || clase3 == 2){

                        if (score_clase3 > coef){
                            x_izq = clase3_x1
                            x_der = clase3_x2
                            x_med = (clase3_x1 + clase3_x2) / 2.0
                            y_up = clase3_y1
                            y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                            y_low = clase3_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }


                    }if(clase4 == 1 || clase4 == 2){

                        if (score_clase4 > coef){
                            x_izq = clase4_x1
                            x_der = clase4_x2
                            x_med = (clase4_x1 + clase4_x2) / 2.0
                            y_up = clase4_y1
                            y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                            y_low = clase4_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase5 == 1 || clase5 == 2){

                        if (score_clase5 > coef){
                            x_izq = clase5_x1
                            x_der = clase5_x2
                            x_med = (clase5_x1 + clase5_x2) / 2.0
                            y_up = clase5_y1
                            y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                            y_low = clase5_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

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

                        if (score_clase1 > coef){
                            x_izq = clase1_x1
                            x_der = clase1_x2
                            x_med = (clase1_x1 + clase1_x2) / 2.0
                            y_up = clase1_y1
                            y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                            y_low = clase1_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

        
                    }if(clase3 == 1 || clase3 == 2){

                        if (score_clase3 > coef){
                            x_izq = clase3_x1
                            x_der = clase3_x2
                            x_med = (clase3_x1 + clase3_x2) / 2.0
                            y_up = clase3_y1
                            y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                            y_low = clase3_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

                    }if(clase4 == 1 || clase4 == 2){

                        if (score_clase4 > coef){
                            x_izq = clase4_x1
                            x_der = clase4_x2
                            x_med = (clase4_x1 + clase4_x2) / 2.0
                            y_up = clase4_y1
                            y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                            y_low = clase4_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase5 == 1 || clase5 == 2){

                        if (score_clase5 > coef){
                            x_izq = clase5_x1
                            x_der = clase5_x2
                            x_med = (clase5_x1 + clase5_x2) / 2.0
                            y_up = clase5_y1
                            y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                            y_low = clase5_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

                    
    
                    }
                }
                // Si la boca está en la tercera posición del arreglo
                else if(clase3 == 0){
    
                    boca_x1 = clase3_x1
                    boca_x2 = clase3_x2
                    boca_y1 = clase3_y1
                    boca_y2 = clase3_y2
    
                    //Si detecta un objeto fino o grande
                    if(clase1 == 1 || clase1 == 2 ){

                        if (score_clase1 > coef){
                            x_izq = clase1_x1
                            x_der = clase1_x2
                            x_med = (clase1_x1 + clase1_x2) / 2.0
                            y_up = clase1_y1
                            y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                            y_low = clase1_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

        
                    }if(clase2 == 1 || clase2 == 2){

                        if (score_clase2 > coef){
                            x_izq = clase2_x1
                            x_der = clase2_x2
                            x_med = (clase2_x1 + clase2_x2) / 2.0
                            y_up = clase2_y1
                            y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                            y_low = clase2_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase4 == 1 || clase4 == 2){

                        if (score_clase4 > coef){
                            x_izq = clase4_x1
                            x_der = clase4_x2
                            x_med = (clase4_x1 + clase4_x2) / 2.0
                            y_up = clase4_y1
                            y_med = Math.abs(clase4_y2 - clase4_y1) / 2.0
                            y_low = clase4_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase5 == 1 || clase5 == 2){

                        if (score_clase5 > coef){
                            x_izq = clase5_x1
                            x_der = clase5_x2
                            x_med = (clase5_x1 + clase5_x2) / 2.0
                            y_up = clase5_y1
                            y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                            y_low = clase5_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
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
                        if (score_clase1 > coef){

                            x_izq = clase1_x1
                            x_der = clase1_x2
                            x_med = (clase1_x1 + clase1_x2) / 2.0
                            y_up = clase1_y1
                            y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                            y_low = clase1_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }
    
                    }if(clase2 == 1 || clase2 == 2){

                        if (score_clase2 > coef){

                            x_izq = clase2_x1
                            x_der = clase2_x2
                            x_med = (clase2_x1 + clase2_x2) / 2.0
                            y_up = clase2_y1
                            y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                            y_low = clase2_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase3 == 1 || clase3 == 2){

                        if (score_clase3 > coef){

                            x_izq = clase3_x1
                            x_der = clase3_x2
                            x_med = (clase3_x1 + clase3_x2) / 2.0
                            y_up = clase3_y1
                            y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                            y_low = clase3_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase5 == 1 || clase5 == 2){

                        if (score_clase5 > coef){

                            x_izq = clase5_x1
                            x_der = clase5_x2
                            x_med = (clase5_x1 + clase5_x2) / 2.0
                            y_up = clase5_y1
                            y_med = Math.abs(clase5_y2 - clase5_y1) / 2.0
                            y_low = clase5_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

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

                        if (score_clase1 > coef){

                            x_izq = clase1_x1
                            x_der = clase1_x2
                            x_med = (clase1_x1 + clase1_x2) / 2.0
                            y_up = clase1_y1
                            y_med = Math.abs(clase1_y2 - clase1_y1) / 2.0
                            y_low = clase1_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase2 == 1 || clase2 == 2){

                        if (score_clase2 > coef){

                            x_izq = clase2_x1
                            x_der = clase2_x2
                            x_med = (clase2_x1 + clase2_x2) / 2.0
                            y_up = clase2_y1
                            y_med = Math.abs(clase2_y2 - clase2_y1) / 2.0
                            y_low = clase2_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase3 == 1 || clase3 == 2){

                        if (score_clase3 > coef){

                            x_izq = clase3_x1
                            x_der = clase3_x2
                            x_med = (clase3_x1 + clase3_x2) / 2.0
                            y_up = clase3_y1
                            y_med = Math.abs(clase3_y2 - clase3_y1) / 2.0
                            y_low = clase3_y2
                            print_mordida(boca_x1, boca_x2, boca_y1, boca_y2, x_izq, x_der, x_med, y_up, y_med, y_low);
                        }

    
                    }if(clase4 == 1 || clase4 == 2){

                        if (score_clase4 > coef){

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
            }
          });
          tf.engine().endScope() // Liberar tensores que no se ocupan
    }

    //Termina la detección
    if (!(comiendo_uña || tirando_pelo || mordiendo_objeto || fatigando_vista || urgando_nariz || mala_postura || pellizcando_cara) && (corriendo_uña || corriendo_pelo || corriendo_objeto || corriendo_vista || corriendo_nariz || corriendo_postura || corriendo_pellizco)){

        if (corriendo_uña && detectado_uña){
            corriendo_uña = false;
            detectado_uña = false;
            fin_uña = new Date;
            detecciones_estres++;
            
            //AQUI GUARDAR EN BASE DE DATOS
            console.log(inicio_uña, fin_uña);
            actualizarJson('unha', inicio_uña, fin_uña)
        }else{
            corriendo_uña = false;

        }

        if (corriendo_pelo && detectado_pelo){
            corriendo_pelo = false;
            detectado_pelo = false;
            fin_pelo = new Date;
            detecciones_estres++;
            
            //AQUI GUARDAR EN BASE DE DATOS
            console.log(inicio_pelo, fin_pelo);
            actualizarJson('pelo', inicio_pelo, fin_pelo)
        }else{
            corriendo_pelo = false;

        }

        if (corriendo_objeto && detectado_objeto && !comiendo){
            corriendo_objeto = false;
            detectado_objeto = false;
            fin_objeto = new Date;
            detecciones_estres++;
            
            //AQUI GUARDAR EN BASE DE DATOS
            console.log(inicio_objeto, fin_objeto);
            actualizarJson('objeto', inicio_objeto, fin_objeto)
        }else{
            corriendo_objeto= false;

        }

        if (corriendo_vista && detectado_vista){
            corriendo_vista = false;
            detectado_vista = false;
            fin_vista = new Date;
            //detecciones_estres++;
            
            //AQUI GUARDAR EN BASE DE DATOS
            console.log(inicio_vista, fin_vista);
            actualizarJson('vista', inicio_vista, fin_vista)
        }else{
            corriendo_vista = false;

        }

        if (corriendo_nariz && detectado_nariz){
            corriendo_nariz = false;
            detectado_nariz = false;
            fin_nariz = new Date;
            detecciones_estres++;

            //@@@@@@@@@@@@@@@@@@BASE DE DATOOOOOOOOOOOOOOOOOSSSSSS
            console.log(inicio_nariz, fin_nariz);
            actualizarJson('nariz', inicio_nariz, fin_nariz)
        }else{
            corriendo_nariz = false;

        }

        if (corriendo_postura && detectado_postura){
            corriendo_postura = false;
            detectado_postura = false;
            fin_postura = new Date;
            //detecciones_estres++;

            //AQUI GUARDAR EN BASE DE DATOS
            actualizarJson('postura', inicio_postura, fin_postura)
            console.log(inicio_postura, fin_postura);
        }else{
            corriendo_postura = false;

        }

        if (corriendo_pellizco && detectado_pellizco){
            corriendo_pellizco = false;
            detectado_pellizco = false;
            fin_pellizco = new Date;
            detecciones_estres++;

            //AQUI GUARDAR EN BASE DE DATOS
            console.log(inicio_pellizco, fin_pellizco);
            actualizarJson('pellizco', inicio_pellizco, fin_pellizco)
        }else{
            corriendo_pellizco = false;

        }
    }

    fecha_ahora = new Date;

    if(configuracion_deteccion_estres && !tiempo_estres && !detectado_estres && detecciones_estres > 0){
        CountDownEstres();
        
    }else if(configuracion_deteccion_estres && tiempo_estres && detecciones_estres >= cantidad_estres && !detectado_estres){
        Preguntar_Estres();
        detecciones_estres = 0;
        detectado_estres = true;
    }

    //---------------------------NOTIFICACIONES ENTRE INTERVALOS DE TIEMPO---------------------------
    if (opcion == "tiempo"){
        if (corriendo_uña && !detectado_uña){
    
            if (fecha_ahora - inicio_uña >= intervalo_uña){

                detectado_uña = true;

                if (se_puede_notificar){
                    NotificarUña(config_user);
                    CountDownEntreNotificaciones();
                }
            }
        }

        if (corriendo_pelo && !detectado_pelo){

            if (fecha_ahora - inicio_pelo >= intervalo_pelo){

                detectado_pelo= true;

                if (se_puede_notificar){
                    NotificarPelo(config_user);
                    CountDownEntreNotificaciones();
                }
            }
        }

        if (corriendo_objeto && !detectado_objeto && !comiendo){

            if (fecha_ahora - inicio_objeto >= intervalo_objeto){

                if(cantidad_pregunta == cantidad_mordidas){
                    Preguntar_Comiendo()
                    await sleep(4000);
                }

                if(!comiendo){
                    detectado_objeto = true;
                    
                    if (se_puede_notificar && cantidad_pregunta != cantidad_mordidas){
                        NotificarObjeto(config_user);
                        CountDownEntreNotificaciones();
                    }

                    cantidad_mordidas++;
                }
            }
        }

        if (corriendo_vista && !detectado_vista){
            if (fecha_ahora - inicio_vista >= intervalo_vista){

                detectado_vista = true;

                if (se_puede_notificar){
                    NotificarVisual(config_user);
                    CountDownEntreNotificaciones();
                }
            }

        }

        if (corriendo_nariz && !detectado_nariz){
            if (fecha_ahora - inicio_nariz >= intervalo_nariz){

                detectado_nariz = true;

                if (se_puede_notificar){
                    NotificarNariz(config_user);
                    CountDownEntreNotificaciones();
                }
            }

        }

        if (corriendo_postura && !detectado_postura){
            if (fecha_ahora - inicio_postura >= intervalo_postura){

                detectado_postura = true;

                if (se_puede_notificar){
                    NotificarPostura(config_user);
                    CountDownEntreNotificaciones();
                }
            }

        }
        if (corriendo_pellizco && !detectado_pellizco){
            if (fecha_ahora - inicio_pellizco >= intervalo_pellizco){

                detectado_pellizco = true;

                if (se_puede_notificar){
                    NotificarPellizco(config_user);
                    CountDownEntreNotificaciones();
                }
            }

        }


    //---------------------------NOTIFICACIONES ENTRE CANTIDADES DE RECONOCIMIENTOS---------------------------
    } else if (opcion == "reconocimientos"){

        if (corriendo_uña && !detectado_uña){
    
            if (fecha_ahora - inicio_uña >= intervalo_uña){

                detectado_uña = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarUña(config_user);
                    cantidad_detecciones = 0;
                    
                }
            }
        }

        if (corriendo_pelo && !detectado_pelo){

            if (fecha_ahora - inicio_pelo >= intervalo_pelo){

                detectado_pelo = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarPelo(config_user);
                    cantidad_detecciones = 0;
                }
            }
        }

        if (corriendo_objeto && !detectado_objeto && !comiendo){

            if (fecha_ahora - inicio_objeto >= intervalo_objeto){
                cantidad_detecciones++;
                cantidad_mordidas++;

                if(cantidad_pregunta == cantidad_mordidas){
                    Preguntar_Comiendo()
                    await sleep(4000);
                }

                console.log(comiendo)
                if(!comiendo){
                    detectado_objeto = true;



                    console.log(cantidad_detecciones, cantidad_notificacion, cantidad_pregunta, cantidad_mordidas)
                    if (cantidad_detecciones == cantidad_notificacion){
                        NotificarObjeto(config_user);
                        cantidad_detecciones = 0;
                    }
                }
            }
        }
        
        if (corriendo_vista && !detectado_vista){
    
            if (fecha_ahora - inicio_vista >= intervalo_vista){

                detectado_vista = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarVisual(config_user);
                    cantidad_detecciones = 0;
                    
                }
            }
        }

        if (corriendo_nariz && !detectado_nariz){
    
            if (fecha_ahora - inicio_nariz >= intervalo_nariz){

                detectado_nariz = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarNariz(config_user);
                    cantidad_detecciones = 0;
                    
                }
            }
        }
        if (corriendo_postura && !detectado_postura){
    
            if (fecha_ahora - inicio_postura >= intervalo_postura){

                detectado_postura = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarPostura(config_user);
                    cantidad_detecciones = 0;
                    
                }
            }
        }
        if (corriendo_pellizco && !detectado_pellizco){
    
            if (fecha_ahora - inicio_pellizco >= intervalo_pellizco){

                detectado_pellizco = true;

                cantidad_detecciones++;

                if (cantidad_detecciones == cantidad_notificacion){
                    NotificarPellizco(config_user);
                    cantidad_detecciones = 0;
                    
                }
            }
        }
    }
}


window.onload = camaraHandle;
