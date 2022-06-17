const conexion = require("./database")
conexion.connect()

async function obtenerUsuario(){
    const res = await conexion.query('SELECT * from usuarios')
    const result = res.rows
    return result
}

module.exports.obtenerUsuario = obtenerUsuario;