const conexion = require("./database.js")
conexion.connect()

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

const createSesion = async (id_usuario, inicio, final) => {
    let query = `INSERT INTO sesiones (id_usuario, inicio, final) VALUES (${id_usuario}, '${inicio}', '${final}')`;
    console.log(query)
    const res = await conexion.query(query)
}

module.exports = { getUsuarios , createUser, createSesion}
