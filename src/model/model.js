const conexion = require("./database.js")
conexion.connect()

//TABLA USUARIOS

const getUsuarios = async () => {
    let query = 'SELECT * FROM usuarios'
    const res = await conexion.query(query)
    const result = res.rows
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
    const res = await conexion.query(query)
}
const getSesion = async (id) => {
    let query = `SELECT * FROM sesiones WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const lastSesion = async (userId) => {
    let query = `SELECT id FROM sesiones WHERE ID = (SELECT MAX(ID) FROM sesiones WHERE id_usuario = ${userId})`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['id']

}


//retorna un arreglo con todos los id de todas las sesiones de un (id) usuario
const getAllSesionesId = async (userId) => {   
    let query = `SELECT * FROM sesiones WHERE id_usuario = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    var ids = []
    for(var i = 0; i < result.length; i++ ){
        ids.push(result[i]['id'])
    }    
    return ids
}



//TABLA UNHAS

const createUnhas = async (id_ses, inicio, final) => {
    let query = `INSERT INTO unhas (id_sesion, inicio_mania, fin_mania) VALUES (${id_ses}, '${inicio}', '${final}')`;
    const res = await conexion.query(query)
}
const getUnhas = async (id) => {
    let query = `SELECT * FROM unhas WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}


//retorna el numero de manias tipo unha para dado (id) sesion
const countUnhasSesion = async (numSesion) => {
    let query = `select * from unhas where id_sesion = ${numSesion}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result
}


//retorna el numero total de manias tipo unha para dado (id) usuario
const countAllUnhas = async (userId) => {
    var ids = await getAllSesionesId(userId)
    var count = 0
    for (let i = 0; i < ids.length; i++) {
        count = count + await countUnhasSesion(ids[i])        
    }
    return count
}



module.exports = { getUsuarios , createUser, getUserData, delUser,
                    createSesion, getSesion,
                    createUnhas, getUnhas, getAllSesionesId, countUnhasSesion, countAllUnhas, lastSesion}
