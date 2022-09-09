const model = require('./model/model.js')
const camera = require('./processWebcam.js')
const {contextBridge, ipcRenderer} = require("electron");

const check_session = (data) => {
    const sesion = ipcRenderer.sendSync('Check-Session', data)
    return sesion
}

const init_session = (sesion) => {
    return camera.init_model(sesion);
}

const stop_session= () => {
    return camera.stop_monitoring();
}

const iniciar_camara = (data) => {
    const respuesta = ipcRenderer.sendSync('iniciar-camara', data)
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

const createSesion = (id_usuario, inicio, final, total) => {
    return model.createSesion(id_usuario, inicio, final, total)
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

const postConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion) => {
    return model.postConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion)
}

const updateConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion) => {
    return model.updateConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion)
}
    

const getConfig = (id_usuario) => {
    return model.getConfig(id_usuario)
}

contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser,
    getUserData: getUserData,
    createSesion: createSesion,
    getSesion: getSesion,
    lastSesion: lastSesion,
    countUnhasSesion: countUnhasSesion,
    init_session: init_session,
    stop_session: stop_session,
    check_session: check_session,
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
    iniciar_camara: iniciar_camara
})

//SE UTILIZA con la linea window.api.funcion("parametros").then((result) => {....})
//desde cualquier .js