const conexion = require("./database.js")
const bcrypt = require('bcrypt')
conexion.connect()


//select id_ses, count(*) from (select * from (select id_ses, inicio from unnas where EXTRACT(month from inicio) = '1' and id_user = 2 ) as subq where EXTRACT(year from inicio) = '2030') as subsubq group by id_ses 


//QUERYS USER
const validateUser = async (email, pass) => {

    let query = `SELECT id, pass FROM users where email = '${email}' `;
    const res = await conexion.query(query)
    const result = res.rows

    //pass result[0]['pass']
    if (result.length > 0) {
        if(await bcrypt.compare(pass, result[0]['pass'])){
            return result[0]['id']
        }
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

const createUser = async (nombre, apellido, mail, pass, lider) => {
    
    const hashedPassword = await bcrypt.hash(pass, 10)
    let query = `INSERT INTO users (nombre, apellido, email, pass, liderequipo) VALUES ('${nombre}', '${apellido}', '${mail}', '${hashedPassword}', '${lider}')`;
    const res = await conexion.query(query)
}

const getUserData = async (id) => {
    let query = `SELECT * FROM users WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const confirmMail = async (email) => {
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result
}

//QUERYS SESIONES
const createSesion = async (id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, mes_sesion, anno_sesion) => {
    let query = `INSERT INTO sesions (id_user, inicio, fin, total_time, time_unnas, time_pelo, time_morder, cant_total_unnas, cant_total_pelo, cant_total_morder, mes, anno) VALUES (${id_usuario}, '${inicio}', '${final}', '${total}', '${total_unhas}', '${total_pelo}', '${total_morder}', '${cant_tot_unha}','${cant_tot_pelo}','${cant_tot_objeto}', '${mes_sesion}', '${anno_sesion}')`;
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





const percentageTenSesionUnhas = async (userId) => { 
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



//query sesiones del mes
//total manias mes
//select sum(total_time) from (select * from sesions where EXTRACT(month from inicio) = '1' and id_user = '2') as subq where EXTRACT(year from inicio) = '2030'

const sesionesMesUnha = async (userId, mes, año) => {
    let query = `select cant_total_unnas from (select * from sesions where EXTRACT(month from inicio) = ${mes} and id_user = ${userId}) as subq where EXTRACT(year from inicio) = ${año}`;
    const res = await conexion.query(query)
    const result = res.rows
    var totales_sesiones = [] 
    result.forEach(element => {
        totales_sesiones.push(parseInt(element['cant_total_unnas']))
    });
    return totales_sesiones
}

const sesionesMesMorder = async (userId, mes, año) => {
    let query = `select cant_total_morder from (select * from sesions where EXTRACT(month from inicio) = ${mes} and id_user = ${userId}) as subq where EXTRACT(year from inicio) = ${año}`;
    const res = await conexion.query(query)
    const result = res.rows
    var totales_sesiones = [] 
    result.forEach(element => {
        totales_sesiones.push(parseInt(element['cant_total_morder']))
    });
    return totales_sesiones
}


const sesionesMesPelo = async (userId, mes, año) => {
    let query = `select cant_total_pelo from (select * from sesions where EXTRACT(month from inicio) = ${mes} and id_user = ${userId}) as subq where EXTRACT(year from inicio) = ${año}`;
    const res = await conexion.query(query)
    const result = res.rows
    var totales_sesiones = [] 
    result.forEach(element => {
        totales_sesiones.push(parseInt(element['cant_total_pelo']))
    });
    return totales_sesiones
}


const mejorMesUnhas=  async (userId) => {
    let query = `select min(cant_total_unnas) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']
}


const peorMesUnhas = async (userId) => {
    let query = `select max(cant_total_unnas) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']
}

const mejorMesPelo = async (userId) => {
    let query = `select min(cant_total_pelo) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']
}


const peorMesPelo = async (userId) => {
    let query = `select max(cant_total_pelo) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']
}

const mejorMesMorder = async (userId) => {
    let query = `select min(cant_total_morder) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']
}


const peorMesMorder = async (userId) => {
    let query = `select max(cant_total_morder) from total_mensual where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']
}





//QUERYS UNNAS
const createUnhas = async (id_usuario, id_sesion, inicio, final, total_time) => {
    let query = `INSERT INTO unnas (id_user, id_ses, inicio, fin, total_time) VALUES (${id_usuario}, '${id_sesion}','${inicio}', '${final}', '${total_time}')`;
    const res = await conexion.query(query)
}

const totalSesionTimeUnhas = async (sesionId) => {
    let query = `select sum(total_time) from unnas where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

const totalTimeUnhas = async (userId) => {
    let query = `select sum(total_time) from unnas where id_user = ${userId}`;
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

//QUERYS MORDER
const createMorder = async (id_usuario, id_sesion, inicio, final, total_time) => {
    let query = `INSERT INTO morder (id_user, id_ses, inicio, fin, total_time) VALUES (${id_usuario}, '${id_sesion}','${inicio}', '${final}', '${total_time}')`;
    const res = await conexion.query(query)
}

const totalSesionTimeMorder = async (sesionId) => {
    let query = `select sum(total_time) from morder where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

const totalTimeMorder = async (userId) => {
    let query = `select sum(total_time) from morder where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

const countMorderSesion = async (sesionId) => {
    let query = `select * from morder where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const allSesionsMorder = async (userId) => {
    let query = `select * from morder where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const peorSesionMorder = async (userId) => {
    let query = `select max(valor) from (select id_ses, count(*) as valor from morder where id_user = ${userId} group by id_ses) as subquery`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']    
}

const mejorSesionMorder = async (userId) => {
    let query = `select min(valor) from (select id_ses, count(*) as valor from morder where id_user = ${userId} group by id_ses) as subquery`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']    
}


const percentageTenSesionMorder = async (userId) => { 
    var percentages = []  
    let query = `select total_time, time_morder from sesions where id_user = ${userId} order by id desc limit 10`;
    const data = await conexion.query(query)
    const result = data.rows
    for (let i = 0; i < result.length; i++) {
        if (result[i]['total_time'] == 0) { 
            let p = 0  
            percentages.push(p)       
        }else{ 
            let p = result[i]['time_morder']/result[i]['total_time']
            p = p*100
            percentages.push(p)
        }
    }
    return percentages.reverse()
}


//QUERYS PELO
const createPelo = async (id_usuario, id_sesion, inicio, final, total_time) => {
    let query = `INSERT INTO pelo (id_user, id_ses, inicio, fin, total_time) VALUES (${id_usuario}, '${id_sesion}','${inicio}', '${final}', '${total_time}')`;
    const res = await conexion.query(query)
}

const totalSesionTimePelo = async (sesionId) => {
    let query = `select sum(total_time) from pelo where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

const totalTimePelo = async (userId) => {
    let query = `select sum(total_time) from pelo where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['sum']    
}

const countPeloSesion = async (sesionId) => {
    let query = `select * from pelo where id_ses = ${sesionId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const allSesionsPelo = async (userId) => {
    let query = `select * from pelo where id_user = ${userId}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}


const peorSesionPelo = async (userId) => {
    let query = `select max(valor) from (select id_ses, count(*) as valor from pelo where id_user = ${userId} group by id_ses) as subquery`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']    
}

const mejorSesionPelo = async (userId) => {
    let query = `select min(valor) from (select id_ses, count(*) as valor from pelo where id_user = ${userId} group by id_ses) as subquery`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']    
}

const percentageTenSesionPelo = async (userId) => { 
    var percentages = []  
    let query = `select total_time, time_pelo from sesions where id_user = ${userId} order by id desc limit 10`;
    const data = await conexion.query(query)
    const result = data.rows
    for (let i = 0; i < result.length; i++) {
        if (result[i]['total_time'] == 0) { 
            let p = 0  
            percentages.push(p)       
        }else{ 
            let p = result[i]['time_pelo']/result[i]['total_time']
            p = p*100
            percentages.push(p)
        }
    }
    return percentages.reverse()
}


//QUERYS CONFIG

const postConfig = async (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    let query = `INSERT INTO config (id_user, morderunha, morderobjetos, jalarpelo, fatigavisual, malapostura, alertavisual, alertasonora, intervalonotificacion, tiemponotificacion, tiponotificacion) VALUES 
    (${id_usuario}, '${morderUnha}', '${morderObjetos}', '${jalarPelo}', '${fatigaVisual}', '${malaPostura}', '${alertaVisual}', '${alertaSonora}', '${intervaloNotificacion}', '${tiempoNotificacion}', '${tipoNotificacion}')`;
    const res = await conexion.query(query)
}

const updateConfig = async (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    let query = `UPDATE config SET 
    morderunha='${morderUnha}', 
    morderobjetos='${morderObjetos}', 
    jalarpelo='${jalarPelo}', 
    fatigavisual='${fatigaVisual}', 
    malapostura='${malaPostura}', 
    alertavisual='${alertaVisual}', 
    alertasonora='${alertaSonora}', 
    intervalonotificacion='${intervaloNotificacion}',
    tiemponotificacion='${tiempoNotificacion}',
    tiponotificacion='${tipoNotificacion}'
    WHERE id_user = ${id_usuario}` ;
    const res = await conexion.query(query)
}

const getConfig = async (id_usuario) => {
    let query = `SELECT * FROM config WHERE id_user = ${id_usuario}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}


//QUERYS GRUPOS

const createGrupo = async (id_lider, nombre) => {
    let query = `insert into grupos (code, lider, participantes, nombre) values(random_string(10), ${id_lider}, array[${id_lider}], '${nombre}') returning id,code`;
    const res = await conexion.query(query)
    const result = res.rows
    id_grupo = result[0]['id']
    let query2 = `UPDATE users SET grupo = ${id_grupo} where id = ${id_lider}`;
    const res2 = await conexion.query(query2)
    return result[0]['code']
}

const getCodeGrupo = async (id_lider) => {
    let query = `select code from grupos where lider = ${id_lider}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['code']
}

// mayor que 0 si es que tiene
const tieneGrupo = async (id_lider) => {
    let query = `select * from grupos where lider = ${id_lider}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result
}



const addParticipante = async (id_usuario, code) => {
    let query = `UPDATE grupos SET participantes = array_append(participantes, ${id_usuario}) where code = '${code}' returning id`;
    const res = await conexion.query(query)
    const result = res.rows
    id_grupo = result[0]['id']
    let query2 = `UPDATE users SET grupo = ${id_grupo} where id = ${id_usuario}`;
    const res2 = await conexion.query(query2)
    //Quitarlo de los pendientes
    let query3 = `delete from pendientes where id_user = ${id_usuario} and code = '${code}'`
    const res3 = await conexion.query(query3)

}

const quitarDelGrupo = async (id_usuario, id_grupo) => {
    let query = `update grupos set participantes = array_remove(participantes, ${id_usuario}) where id = ${id_grupo}`;
    const res = await conexion.query(query)
    let query2 = `update users set grupo = null where id = ${id_usuario}`;
    const res2 = await conexion.query(query2)
}

const getParticipantesGrupo = async (id_grupo) => {
    let query = `select participantes from grupos where id = ${id_grupo}`;
    const res = await conexion.query(query)
    const result = res.rows
    p = result[0]['participantes']
    console.log(p)
    c = '('
    p.forEach( m => {
        c = c + m.toString() + ','
    });
    c = c.slice(0, -1) 
    c = c + ')'
     
    let query2 = `select nombre from users where id in ${c}`;
    console.log(query2)
    const res2 = await conexion.query(query2)
    const result2 = res2.rows
    return result2
}

const solicitudUnirseGrupo = async (id_user, code) => {
    let query = `insert into pendientes (id_user, code) values(${id_user}, '${code}')`;
    const res = await conexion.query(query)
}

const getSolicitudesGrupo = async (code) => {
    let query = `SELECT users.id, users.nombre FROM users INNER JOIN pendientes ON pendientes.id_user=users.id where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}



module.exports = { getUsuarios , createUser, getUserData, createSesion, getSesion, lastSesion,
                 totalTimeSesions, countUnhasSesion, allSesionsUnhas, percentageTenSesionUnhas, totalSesionTimeUnhas, durationSesion, totalTimeUnhas, createUnhas,
                  validateUser, postConfig, getConfig, updateConfig, confirmMail,
                createMorder, totalSesionTimeMorder, totalTimeMorder, countMorderSesion, allSesionsMorder,
              createPelo, totalSesionTimePelo, totalTimePelo, countPeloSesion, allSesionsPelo, 
              /*nuevas querys*/  peorSesionMorder, mejorSesionMorder, peorSesionPelo, mejorSesionPelo, percentageTenSesionMorder, percentageTenSesionPelo, 
              sesionesMesUnha, sesionesMesMorder, sesionesMesPelo, mejorMesUnhas,
              peorMesUnhas, mejorMesPelo, peorMesPelo, mejorMesMorder, peorMesMorder,
              createGrupo, getCodeGrupo,  addParticipante, quitarDelGrupo, getParticipantesGrupo, solicitudUnirseGrupo, getSolicitudesGrupo, tieneGrupo}
