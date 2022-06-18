const conexion = require("./database.js")
conexion.connect()

//TABLA USUARIOS

const getUsuarios = async () => {
    let query = 'SELECT * FROM usuarios'
    const res = await conexion.query(query)
    const result = res.rows
    console.log(result)
    return result
}
const createUser = async (nombre, apellido, mail) => {
    let query = `INSERT INTO usuarios (nombre, apellido, mail) VALUES ('${nombre}', '${apellido}', '${mail}')`;
    console.log(query)
    const res = await conexion.query(query)
}
const getUserData = async (id) => {
    let query = `SELECT * FROM usuarios WHERE id = ${id}`;
    console.log(query)
    const res = await conexion.query(query)
    const result = res.rows
    return result
}
const delUser = async (id) => {
    let query = `DELETE FROM usuarios WHERE id = ${id}`;
    console.log(query)
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

//TABLA SESIONES

const createSesion = async (id_usuario, inicio, final) => {
    let query = `INSERT INTO sesiones (id_usuario, inicio, final) VALUES (${id_usuario}, '${inicio}', '${final}')`;
    console.log(query)
    const res = await conexion.query(query)
}
const getSesion = async (id) => {
    let query = `SELECT * FROM sesiones WHERE id = ${id}`;
    console.log(query)
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

//TABLA UNHAS

const createUnhas = async (id_ses, inicio, final) => {
    let query = `INSERT INTO unhas (id_sesion, inicio_mania, fin_mania) VALUES (${id_ses}, '${inicio}', '${final}')`;
    console.log(query)
    const res = await conexion.query(query)
}
const getUnhas = async (id) => {
    let query = `SELECT * FROM unhas WHERE id = ${id}`;
    console.log(query)
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

module.exports = { getUsuarios , createUser, getUserData, delUser,
                    createSesion, getSesion,
                    createUnhas, getUnhas}
