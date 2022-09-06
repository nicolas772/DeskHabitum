const conexion = require("./database.js")
conexion.connect()

//QUERYS USER
const validateUser = async (email, pass) => {
    let query = `SELECT id FROM users where email = '${email}' and pass = '${pass}'`;
    const res = await conexion.query(query)
    const result = res.rows
    if (result.length > 0) {
        return result[0]['id']
    } else {
        return -1
    }
}

const getUsuarios = async () => {
    let query = 'SELECT * FROM users'
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const createUser = async (nombre, apellido, mail, pass) => {
    let query = `INSERT INTO users (nombre, apellido, email, pass) VALUES ('${nombre}', '${apellido}', '${mail}', '${pass}')`;
    const res = await conexion.query(query)
}

const getUserData = async (id) => {
    let query = `SELECT * FROM users WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

//QUERYS SESIONES
const createSesion = async (id_usuario, inicio, final, total) => {
    let query = `INSERT INTO sesions (id_user, inicio, fin) VALUES (${id_usuario}, '${inicio}', '${final}', , '${total}')`;
    const res = await conexion.query(query)
}
const getSesion = async (id) => {
    let query = `SELECT * FROM sesions WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const lastSesion = async (userId) => {
    let query = `SELECT id FROM sesions WHERE ID = (SELECT MAX(ID) FROM sesions WHERE id_user = ${userId})`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['id']
}

const durationSesion = async (sesionId) => {
    let query = `SELECT total_time FROM sesions WHERE id = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['total_time']
}

const totalTimeSesions = async (userId) => {
    let query = `select sum(total_time) from sesions where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']
}

const countUnhasSesion = async (sesionId) => {
    let query = `select * from unnas where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const allSesionsUnhas = async (userId) => {
    let query = `select * from unnas where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const percentageTenSesion = async (userId) => { 
    var percentages = []  
    let query = `select total_time, time_unnas from sesions where id_user = ${userId} order by id desc limit 10`;
    const data = await conexion.query(query)
    const result = data.rows
    for (let i = 0; i < result.length; i++) {
        if (result[i]['total_time'] == 0) { 
            let p = 0  
            percentages.push(p)       
        }else{ 
            let p = result[i]['time_unnas']/result[i]['total_time']
            p = p*100
            percentages.push(p)
        }
    }
    return percentages.reverse()
}

//QUERYS UNNAS
const totalTimeUnhas = async (sesionId) => {
    let query = `select sum(total_time) from unnas where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

module.exports = { getUsuarios , createUser, getUserData, createSesion, getSesion, lastSesion, totalTimeSesions, countUnhasSesion, 
    allSesionsUnhas, percentageTenSesion, totalTimeUnhas, durationSesion, validateUser}