var pg = require('pg');

var conString = "Ipostgres://bfrgouab:1G3nqhUwUmzEqg-_zHM8Pk36iX6lRrml@kesavan.db.elephantsql.com/bfrgouab" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect()
const getUsuarios = async () => {
    const res = await client.query('SELECT * from usuarios')

    const result = res.rows
    //await client.end()
    return result
}

const getSesiones = async () => {
    const res = await client.query('SELECT * from sesiones')

    const result = res.rows
    //await client.end()
    return result
}

const getUnhas = async () => {
    const res = await client.query('SELECT * from unhas')

    const result = res.rows
    //await client.end()
    return result
}

module.exports = { getUsuarios, getSesiones, getUnhas }

