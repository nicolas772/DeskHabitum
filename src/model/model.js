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

//retorna la duracion de una sesion en segundos
const durationSesion = async (sesionId) => {   
    let query = `SELECT EXTRACT(EPOCH FROM ("final" - inicio)) AS difference FROM sesiones where id = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['difference']

}

//retorna el tiempo total entre todas las sesiones
const timeSesionAll = async (userId) => {   
    var ids = await getAllSesionesId(userId)
    time = 0
    for (let i = 0; i < ids.length; i++) {
        let duracion = await durationSesion(ids[i])
        time = time + duracion        
    }
    return time

}

//retorna un array con los porcentages de tiempo perdido debido a manias en las ultimas 10 sesiones
const percentageTenSesion = async (userId) => { 
    var percentages = []  
    let query = `select id from sesiones where id_usuario= ${userId} order by id desc limit 10`;
    const tenId = await conexion.query(query)
    const idResult = tenId.rows
    for (let i = 0; i < idResult.length; i++) {        
        let mania = await totalDurationUnhas(idResult[i]['id'])
        let sesion = await durationSesion(idResult[i]['id'])
        let p = mania/sesion
        p = p*100
        percentages.push(p)        
    }
    percentages.reverse()
    return percentages
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


//retorna el tiempo total gastado por unhas en una sesion en segundos
const totalDurationUnhas = async (numSesion) => {
    let query = `SELECT EXTRACT(EPOCH FROM (fin_mania - inicio_mania)) AS difference FROM unhas where id_sesion = ${numSesion}`;
    const res = await conexion.query(query)
    const result = res.rows
    var time = 0
    for (let i = 0; i< result.length; i++) {
      time  = time + result[i]['difference'];
       
    }
    return time
}

//retorna el tiempor total gastado en todas las sesiones por unhas en segundos
const timeUnhasAll = async (userId) => {
    var sesiones = await getAllSesionesId(userId)
    var time = 0
    for (let i = 0; i < sesiones.length; i++) {
        let duration = await totalDurationUnhas(sesiones[i])
        time = time + duration        
    }
    return time

}

//retorna el % de tiempo usado de la sesion por la mania unhas en dada sesion
const unhasPercentage = async (sesionId) => {
    var unhas = await totalDurationUnhas(sesionId)
    var sesiones = await durationSesion(sesionId)
    var p = unhas/sesiones
    p = p*100
    return p
}



module.exports = { getUsuarios , createUser, getUserData, delUser,
                    createSesion, getSesion,
                    createUnhas, getUnhas, getAllSesionesId, countUnhasSesion, durationSesion, countAllUnhas, lastSesion,
                    totalDurationUnhas, percentageTenSesion, timeSesionAll, timeUnhasAll, unhasPercentage}
