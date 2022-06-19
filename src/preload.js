const model = require('./model/model.js')
const camera = require('./mainWebcam.js')
const { contextBridge } = require("electron");

const init_model = () => {
    return camera.init_model();
}

const stop_monitoring = () => {
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

const createUnhas = (id_ses, inicio, final) => {
    return model.createUnhas(id_ses, inicio, final);
}
const getUnhas = (id) => {
    return model.getUnhas(id);
}

contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser,
    getUserData: getUserData,
    delUser: delUser,
    createSesion: createSesion,
    getSesion: getSesion,
    createUnhas: createUnhas,
    getUnhas: getUnhas,
    init_model: init_model,
    stop_monitoring: stop_monitoring
})

//SE UTILIZA con la linea window.api.funcion("parametros") 
//desde cualquier .js