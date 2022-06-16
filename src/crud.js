var pg = require('pg');

var conString = "Ipostgres://bfrgouab:1G3nqhUwUmzEqg-_zHM8Pk36iX6lRrml@kesavan.db.elephantsql.com/bfrgouab" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect()

//TABLA USUARIOS
const createUser = async (nombre, apellido, mail) => {
    let query = `INSERT INTO usuarios (nombre, apellido, mail) VALUES ('${nombre}', '${apellido}', '${mail}')`;
    console.log(query)
    const res = await client.query(query)
}

const getUserData = async (id) => {
    let query = `SELECT * FROM usuarios WHERE id = ${id}`;
    console.log(query)
    const res = await client.query(query)

    const result = res.rows
    return result
}

const delUser = async (id) => {
    let query = `DELETE FROM usuarios WHERE id = ${id}`;
    console.log(query)
    const res = await client.query(query)

    const result = res.rows
    return result
}

//TABLA UNHAS
const createUnhas = async (id_ses, inicio, final) => {
    let query = `INSERT INTO unhas (id_sesion, inicio_mania, fin_mania) VALUES (${id_ses}, '${inicio}', '${final}')`;
    console.log(query)
    const res = await client.query(query)
}

//Como obtener el tiempo con formato que acepte la consulta:
/*
  var d = new Date,
    dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
*/

const getUnhas = async (id) => {
    let query = `SELECT * FROM unhas WHERE id = ${id}`;
    console.log(query)
    const res = await client.query(query)

    const result = res.rows
    return result
}


//TABLA SESIONES

const createSesion = async (id_usuario, inicio, final) => {
    let query = `INSERT INTO sesiones (id_usuario, inicio, final) VALUES (${id_usuario}, '${inicio}', '${final}')`;
    console.log(query)
    const res = await client.query(query)
}

const getSesion = async (id) => {
    let query = `SELECT * FROM sesiones WHERE id = ${id}`;
    console.log(query)
    const res = await client.query(query)

    const result = res.rows
    return result
}

module.exports = { getUserData, createUser, delUser, createUnhas, getUnhas, createSesion, getSesion }