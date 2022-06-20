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



const getUsuarios = () => {
    return model.getUsuarios();
}
const createUser = (nombre, apellido, mail) => {
    return model.createUser(nombre, apellido, mail);
}
const getUserData = (id) => {
    return model.getUserData(id);
}
const delUser = (id) => {
    return model.delUser(id);
}

const createSesion = (id_usuario, inicio, final) => {
    return model.createSesion(id_usuario, inicio, final)
}
const getSesion = (id) => {
    return model.getSesion(id);
}

const lastSesion = (userId) => {
    return model.lastSesion(userId)
}

const getAllSesionesId = (userId) => {
    return model.getAllSesionesId(userId)
}

const createUnhas = (id_ses, inicio, final) => {
    return model.createUnhas(id_ses, inicio, final);
}
const getUnhas = (id) => {
    return model.getUnhas(id);
}

const countUnhasSesion = (numSesion) => {
    return model.countUnhasSesion(numSesion)
}

const countAllUnhas = (userId) => {
    return model.countAllUnhas(userId)
}



contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser,
    getUserData: getUserData,
    delUser: delUser,
    createSesion: createSesion,
    getSesion: getSesion,
    lastSesion: lastSesion,
    getAllSesionesId: getAllSesionesId,
    createUnhas: createUnhas,
    getUnhas: getUnhas,
    countUnhasSesion: countUnhasSesion,
    countAllUnhas: countAllUnhas,
    init_session: init_session,
    stop_session: stop_session,
    check_session: check_session
    
})

//SE UTILIZA con la linea window.api.funcion("parametros") 
//desde cualquier .js