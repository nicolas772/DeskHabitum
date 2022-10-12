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

const createUser = async (nombre, apellido, mail, pass) => {
    
    const hashedPassword = await bcrypt.hash(pass, 10)
    let query = `INSERT INTO users (nombre, apellido, email, pass) VALUES ('${nombre}', '${apellido}', '${mail}', '${hashedPassword}')`;
    const res = await conexion.query(query)
}

const getUserData = async (id) => {
    let query = `SELECT * FROM users WHERE id = ${id}`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const updateUserData = async (id_usuario, nombre, apellido, mail) => {
    let query = `UPDATE users SET 
    nombre='${nombre}', 
    apellido='${apellido}', 
    email='${mail}'
    WHERE id = ${id_usuario}` ;
    const res = await conexion.query(query)
}

const confirmMail = async (email) => {
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result
}

//QUERYS SESIONES
const createSesion = async (id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion, pom = 'no') => {
    let query = `INSERT INTO sesions (id_user, inicio, fin, total_time, time_unnas, time_pelo, time_morder, time_vista, cant_total_unnas, cant_total_pelo, cant_total_morder, cant_total_vista, cant_total_pestaneo, mes, anno, pomodoro) VALUES (${id_usuario}, '${inicio}', '${final}', '${total}', '${total_unhas}', '${total_pelo}', '${total_morder}', '${total_vista}', '${cant_tot_unha}','${cant_tot_pelo}','${cant_tot_objeto}', '${cant_tot_vista}', '${cant_tot_pestaneo}', '${mes_sesion}', '${anno_sesion}', '${pom}' )`;
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

//QUERYS VISTA

const createVista = async (id_usuario, id_sesion, inicio, final, total_time) => {
    let query = `INSERT INTO vista (id_user, id_ses, inicio, fin, total_time) VALUES (${id_usuario}, '${id_sesion}','${inicio}', '${final}', '${total_time}')`;
    const res = await conexion.query(query)
}

//QUERYS PESTANEO

const createPestaneo = async (id_usuario, id_sesion, inicio, final, total_time) => {
    let query = `INSERT INTO pestaneo (id_user, id_ses, inicio, fin, total_time) VALUES (${id_usuario}, '${id_sesion}','${inicio}', '${final}', '${total_time}')`;
    const res = await conexion.query(query)
}

//QUERYS CONFIG

const postConfig = async (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    let query = `INSERT INTO config (id_user, morderunha, morderobjetos, jalarpelo, fatigavisual, malapostura, alertavisual, alertasonora, intervalonotificacion, tiemponotificacion, tiponotificacion) VALUES 
    (${id_usuario}, '${morderUnha}', '${morderObjetos}', '${jalarPelo}', '${fatigaVisual}', '${malaPostura}', '${alertaVisual}', '${alertaSonora}', '${intervaloNotificacion}', '${tiempoNotificacion}', '${tipoNotificacion}')`;
    const res = await conexion.query(query)
}

const updateConfig = async (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion, duracionPomo, duracionShortBreak, duracionLongBreak, intervaloLongBreak, cantidadPomodoros) => {
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
    tiponotificacion='${tipoNotificacion}',
    duracionpomo='${duracionPomo}',
    duracionshortbreak='${duracionShortBreak}',
    duracionlongbreak='${duracionLongBreak}',
    intervalolongbreak='${intervaloLongBreak}',
    cantidadpomodoros='${cantidadPomodoros}'
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

const getCodeGrupoUser = async (id_user) => {
    let query = `select code from users inner join grupos on users.grupo=grupos.id where users.id=${id_user}`;
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

const quitarDelGrupo = async (id_usuario, code) => {
    let query = `update grupos set participantes = array_remove(participantes, ${id_usuario}) where code = '${code}'`;
    const res = await conexion.query(query)
    let query2 = `update users set grupo = null where id = ${id_usuario}`;
    const res2 = await conexion.query(query2)
}

const getParticipantesGrupo = async (code) => {
    let query = `select participantes from grupos where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    p = result[0]['participantes']
    c = '('
    p.forEach( m => {
        c = c + m.toString() + ','
    });
    c = c.slice(0, -1) 
    c = c + ')'
     
    let query2 = `select id, nombre,apellido from users where id in ${c}`;
    const res2 = await conexion.query(query2)
    const result2 = res2.rows
    return result2
}

const solicitudUnirseGrupo = async (id_user, code) => {
    let query = `insert into pendientes (id_user, code) values(${id_user}, '${code}')`;
    const res = await conexion.query(query)
}

const getSolicitudesGrupo = async (code) => {
    let query = `SELECT users.id, users.nombre, users.apellido FROM users INNER JOIN pendientes ON pendientes.id_user=users.id where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    return result
}

const quitarSolicitud = async (id_usuario, code) => {
    let query = `delete from pendientes where id_user = ${id_usuario} and code = '${code}'`;
    const res = await conexion.query(query)
}

//GRAFICOS LIDER


const tiempoGrupo = async (code, mes) => {
    let query = `select participantes from grupos where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    p = result[0]['participantes']
    c = '('
    p.forEach( m => {
        c = c + m.toString() + ','
    });
    c = c.slice(0, -1) 
    c = c + ')'

    let query2 = `select sum(total_time) as total_time, sum(time_unnas) as time_unnas, sum(time_pelo) as time_pelo, sum(time_morder) as time_morder, sum(time_vista) as time_vista  from (select * from sesions where id_user in ${c} and mes = ${mes} order by id desc limit 15) as t1`
    const res2 = await conexion.query(query2)
    const result2 = res2.rows
    return result2
}


const totalesGrupo = async (code, mes) => {
    let query = `select participantes from grupos where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    p = result[0]['participantes']
    c = '('
    p.forEach( m => {
        c = c + m.toString() + ','
    });
    c = c.slice(0, -1) 
    c = c + ')'

    let query2 = `select sum(cant_total_unnas) as total_unnas, sum(cant_total_pelo) as total_pelo, sum(cant_total_morder) as total_morder, sum(cant_total_vista) as total_vista, sum(cant_total_pestaneo) as total_pestaneo  from (select * from sesions where id_user in ${c} and mes = ${mes} order by id desc) as t1`
    const res2 = await conexion.query(query2)
    const result2 = res2.rows
    return result2
}

const top10Grupo = async (code, mes) => {
    let query = `select participantes from grupos where code = '${code}'`;
    const res = await conexion.query(query)
    const result = res.rows
    p = result[0]['participantes']
    c = '('
    p.forEach( m => {
        c = c + m.toString() + ','
    });
    c = c.slice(0, -1) 
    c = c + ')'

    let query2 = `select * from (select sesions.*, rank() over (partition by id_user order by id desc) from sesions where mes = ${mes}) as t1 where id_user in ${c} and rank < 11`
    const res2 = await conexion.query(query2)
    const result2 = res2.rows
    return result2
}

//QUERYS POMODORO

const peorSesionPomodoro = async (userId) => {
    let query = `select  max(total) from (select (cant_total_unnas + cant_total_pelo + cant_total_vista + cant_total_pestaneo) as total from sesions where id_user = ${userId} and pomodoro ='si') as t1`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['max']    
}

const mejorSesionPomodoro = async (userId) => {
    let query = `select  min(total) from (select (cant_total_unnas + cant_total_pelo + cant_total_vista + cant_total_pestaneo) as total from sesions where id_user = ${userId} and pomodoro ='si') as t1`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['min']    
}

const ultimaSesionPomodoro = async (userId) => {
    let query = `select (cant_total_unnas + cant_total_pelo + cant_total_vista + cant_total_pestaneo) as total from sesions where id_user = ${userId} and pomodoro ='si' order by id desc limit 1 `;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]['total']    
}

const contarSesionPomodoro = async (userId) => {
    let query = `select * from sesions where id_user= ${userId} and pomodoro ='si' `;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const contarMesPomodoro = async (userId, mes) => {
    let query = `select * from sesions where id_user= ${userId} and pomodoro ='si' and mes = ${mes}`;
    const res = await conexion.query(query)
    const result = res.rowCount
    return result    
}

const datosTotalesPomodoro = async (userId) => {
    let query = `select sum(cant_total_unnas) as unna, sum(cant_total_pelo) as pelo, sum(cant_total_morder) as morder, sum(cant_total_vista+cant_total_pestaneo) as vision from (select * from sesions where id_user= ${userId} and pomodoro = 'si') as t1`;
    const res = await conexion.query(query)
    const result = res.rows
    return result[0]    
}





module.exports = { getUsuarios , createUser, getUserData, createSesion, getSesion, lastSesion,
                 totalTimeSesions, countUnhasSesion, allSesionsUnhas, percentageTenSesionUnhas, totalSesionTimeUnhas, durationSesion, totalTimeUnhas, createUnhas,
                  validateUser, postConfig, getConfig, updateConfig, confirmMail,
                createMorder, totalSesionTimeMorder, totalTimeMorder, countMorderSesion, allSesionsMorder,
              createPelo, totalSesionTimePelo, totalTimePelo, countPeloSesion, allSesionsPelo, 
              peorSesionMorder, mejorSesionMorder, peorSesionPelo, mejorSesionPelo, percentageTenSesionMorder, percentageTenSesionPelo, 
              sesionesMesUnha, sesionesMesMorder, sesionesMesPelo, mejorMesUnhas,
              peorMesUnhas, mejorMesPelo, peorMesPelo, mejorMesMorder, peorMesMorder, createVista, createPestaneo,
              createGrupo, getCodeGrupo,  addParticipante, quitarDelGrupo, getParticipantesGrupo, solicitudUnirseGrupo, getSolicitudesGrupo, tieneGrupo, quitarSolicitud,
            tiempoGrupo, totalesGrupo, top10Grupo, /*nuevas*/ getCodeGrupoUser, peorSesionPomodoro, mejorSesionPomodoro, ultimaSesionPomodoro, contarSesionPomodoro, contarMesPomodoro, datosTotalesPomodoro, updateUserData}
