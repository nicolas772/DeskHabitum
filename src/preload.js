const model = require('./model/model.js')
const {contextBridge, ipcRenderer} = require("electron");
var fs = require('fs');

const iniciar_camara = (d) => { //esta funcion es para manejar boton iniciar detección general
    fs.writeFileSync('./src/data/cameraHandle.txt', "1", function(err) {
        if (err) {
          return console.log(err);
        }
      
        console.log("El archivo fue creado correctamente");
    });
}

const cerrar_camara = (data) => {//esta funcion es para manejar boton detener detección general
    fs.writeFileSync('./src/data/cameraHandle.txt', "0", function(err) {
        if (err) {
          return console.log(err);
        }
      
        console.log("El archivo fue creado correctamente");
    });
}

const cerrar_sesion = (data) => {
    let respuesta = ipcRenderer.sendSync('cerrar-sesion', data)
    return respuesta
}

const get_user_id = (data) => {
    let respuesta = ipcRenderer.sendSync('get-user-id', data)
    return respuesta
}

const getUsuarios = () => {
    return model.getUsuarios();
}

const createUser = (nombre, apellido, mail, pass) => {
    return model.createUser(nombre, apellido, mail, pass);
}
const getUserData = (id) => {
    return model.getUserData(id);
}


const confirmMail = (email) => {
    return model.confirmMail(email);
}
const createSesion = (id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder) => {
    return model.createSesion(id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder)
}

const getSesion = (id) => {
    return model.getSesion(id);
}

const lastSesion = (userId) => {
    return model.lastSesion(userId)
}

/*
const createUnhas = (id_ses, inicio, final) => {
    return model.createUnhas(id_ses, inicio, final);
}
const getUnhas = (id) => {
    return model.getUnhas(id);
}*/

const countUnhasSesion = (sesionId) => {
    return model.countUnhasSesion(sesionId)
}

const allSesionUnhas = (userId) => {
    return model.allSesionsUnhas(userId)
}

const durationSesion = (sesionId) => {
    return model.durationSesion(sesionId)
}

const totalTimeSesions  = (userId) => {
    return model.totalTimeSesions(userId)
}

const percentageTenSesion = (userId) => {
    return model.percentageTenSesion(userId)
}

const totalSesionTimeUnhas = (sesionId) => {
    return model.totalSesionTimeUnhas(sesionId)
}
const totalTimeUnhas = (userId) => {
    return model.totalTimeUnhas(userId)
}
const createUnhas = (id_usuario, id_sesion, inicio, final, total_time) => {
    return model.createUnhas(id_usuario, id_sesion, inicio, final, total_time);
}
/*
const timeUnhasAll = (userId) => {
    return model.timeUnhasAll(userId)
}

const unhasPercentage = (sesionId) => {
    return model.unhasPercentage(sesionId)
}*/

const validateUser = (email, pass) => {
    return model.validateUser(email, pass)
}

const postConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    return model.postConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion)
}

const updateConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    return model.updateConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion)
}
    

const getConfig = (id_usuario) => {
    return model.getConfig(id_usuario)
}

const contactar_profesional = (obj) => {
     ipcRenderer.invoke("env_formulario", obj)
}


const contacto = () => {
    let respuesta = ipcRenderer.sendSync('contacto')
    return respuesta
}

const insertManias = (id_usuario) => {
    let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
    let lista_unhas = JSON.parse(rawdata);
    let rawdata1 = fs.readFileSync('./src/data/peloSesion.json');
    let lista_pelo = JSON.parse(rawdata1);
    let rawdata2 = fs.readFileSync('./src/data/objetoSesion.json');
    let lista_objeto = JSON.parse(rawdata2);
    
    lista_unhas.map(u => {
        model.lastSesion(id_usuario).then(res => model.createUnhas(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/unhasSesion.json', '[]')//vaciar archivo

    lista_pelo.map(u => {
        model.lastSesion(id_usuario).then(res => model.createPelo(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/peloSesion.json', '[]')//vaciar archivo

    lista_objeto.map(u => {
        model.lastSesion(id_usuario).then(res => model.createMorder(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/objetoSesion.json', '[]')//vaciar archivo
}
 //calculo de totales por mania, para insertar en la tabla sesion al momento de detener la deteccion
const obtenerTotal = () => {
    let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
    let lista_unhas = JSON.parse(rawdata);
    let rawdata1 = fs.readFileSync('./src/data/peloSesion.json');
    let lista_pelo = JSON.parse(rawdata1);
    let rawdata2 = fs.readFileSync('./src/data/objetoSesion.json');
    let lista_objeto = JSON.parse(rawdata2);
    let tot_unha = 0, tot_objeto = 0, tot_pelo = 0
    lista_unhas.map(u => {
        tot_unha = tot_unha + parseInt(u.total)
    })

    lista_pelo.map(u => {
        tot_pelo = tot_pelo + parseInt(u.total)
    })

    lista_objeto.map(u => {
        tot_objeto = tot_objeto + parseInt(u.total)
    })
    return [tot_unha, tot_pelo, tot_objeto]
}

contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser,
    getUserData: getUserData,
    createSesion: createSesion,
    getSesion: getSesion,
    lastSesion: lastSesion,
    countUnhasSesion: countUnhasSesion,
    percentageTenSesion: percentageTenSesion,
    allSesionUnhas: allSesionUnhas,
    totalTimeSesions: totalTimeSesions,
    totalTimeUnhas: totalTimeUnhas,
    totalSesionTimeUnhas: totalSesionTimeUnhas,
    createUnhas: createUnhas,
    durationSesion: durationSesion,   
    validateUser: validateUser,
    postConfig: postConfig,
    getConfig: getConfig,
    updateConfig: updateConfig,
    iniciar_camara: iniciar_camara,
    cerrar_sesion: cerrar_sesion,
    cerrar_camara: cerrar_camara,
    confirmMail: confirmMail,
    contacto: contacto,
    contactar_profesional: contactar_profesional,
    get_user_id: get_user_id,
    insertManias: insertManias,
    obtenerTotal: obtenerTotal
})

//SE UTILIZA con la linea window.api.funcion("parametros").then((result) => {....})
//desde cualquier .js