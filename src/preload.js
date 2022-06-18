const model = require('./model.js')
const { contextBridge } = require("electron")

const getUsuarios = () => {
    return model.getUsuarios();
}
const createUser = (nombre, apellido, mail) => {
    return model.createUser(nombre, apellido, mail);
}

contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser
})