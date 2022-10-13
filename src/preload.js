const model = require('./model/model.js')
const {contextBridge, ipcRenderer} = require("electron");
var fs = require('fs');


const leer_pomodoro = () => {
    let rawdata = fs.readFileSync('./src/data/pomodoro.json');
    return JSON.parse(rawdata);
}

const iniciar_pomodoro = () => {
    fs.writeFileSync('./src/data/pomodoroHandle.txt', "1", function(err) {
        if (err) {
          return console.log(err);
        }
    })
}

const pausar_pomodoro = () => {
    fs.writeFileSync('./src/data/pomodoroHandle.txt', "0", function(err) {
        if (err) {
          return console.log(err);
        }
    })
}

const parar_pomodoro = () => {
    fs.writeFileSync('./src/data/pomodoroHandle.txt', "2", function(err) {
        if (err) {
          return console.log(err);
        }
    })
}

const fecha_inicio_sesion = () => {
    let inicio = fs.readFileSync('./src/data/inicio_fecha.txt')
    return new Date(inicio)
}

const iniciar_camara = (d) => { //esta funcion es para manejar boton iniciar detección general
    //esto lo agrego al iniciar reconocimiento, ya que hay algunos casos en donde luego de detener la deteccion, igual sigue escribiendo datos en el json.
    fs.writeFileSync('./src/data/unhasSesion.json', '[]')//vaciar archivo
    fs.writeFileSync('./src/data/peloSesion.json', '[]')//vaciar archivo
    fs.writeFileSync('./src/data/objetoSesion.json', '[]')//vaciar archivo
    fs.writeFileSync('./src/data/vistaSesion.json', '[]')//vaciar archivo
    fs.writeFileSync('./src/data/pestaneoSesion.json', '[]')//vaciar archivo

    //Se guarda la fecha de inicio de sesion
    let inicio = new Date
    fs.writeFileSync('./src/data/inicio_fecha.txt', inicio.toUTCString())

    fs.writeFileSync('./src/data/cameraHandle.txt', "1", function(err) {
        if (err) {
          return console.log(err);
        }
      
        console.log("El archivo fue creado correctamente");
    });

}

const cerrar_camara = (data) => {//esta funcion es para manejar boton detener detección general
    fs.writeFileSync('./src/data/cameraHandle.txt', "0", function(err) {
        if (err) {
          return console.log(err);
        }
      
        console.log("El archivo fue creado correctamente");
    });
}

const cerrar_sesion = (data) => {
    let respuesta = ipcRenderer.sendSync('cerrar-sesion', data)
    return respuesta
}

const get_user_id = (data) => {
    let respuesta = ipcRenderer.sendSync('get-user-id', data)
    return respuesta
}

const getUsuarios = () => {
    return model.getUsuarios();
}

const createUser = (nombre, apellido, mail, pass) => {
    return model.createUser(nombre, apellido, mail, pass);
}
const getUserData = (id) => {
    return model.getUserData(id);
}

const updateUserData = (id_usuario, nombre, apellido, mail) => {
    return model.updateUserData(id_usuario, nombre, apellido, mail);
}

const confirmMail = (email) => {
    return model.confirmMail(email);
}
const createSesion = (id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion) => {
    return model.createSesion(id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion)
}

const getSesion = (id) => {
    return model.getSesion(id);
}

const lastSesion = (userId) => {
    return model.lastSesion(userId)
}

/*
const createUnhas = (id_ses, inicio, final) => {
    return model.createUnhas(id_ses, inicio, final);
}
const getUnhas = (id) => {
    return model.getUnhas(id);
}*/

const countPestaneoSesion = (sesionId) => {
    return model.countPestaneoSesion(sesionId)
}

const countVistaSesion = (sesionId) => {
    return model.countVistaSesion(sesionId)
}

const countUnhasSesion = (sesionId) => {
    return model.countUnhasSesion(sesionId)
}

const allSesionsUnhas = (userId) => {
    return model.allSesionsUnhas(userId)
}

const durationSesion = (sesionId) => {
    return model.durationSesion(sesionId)
}

const totalTimeSesions  = (userId) => {
    return model.totalTimeSesions(userId)
}

const percentageTenSesionUnhas = (userId) => {
    return model.percentageTenSesionUnhas(userId)
}

const totalSesionTimeUnhas = (sesionId) => {
    return model.totalSesionTimeUnhas(sesionId)
}
const totalTimeUnhas = (userId) => {
    return model.totalTimeUnhas(userId)
}
const createUnhas = (id_usuario, id_sesion, inicio, final, total_time) => {
    return model.createUnhas(id_usuario, id_sesion, inicio, final, total_time);
}
/*
const timeUnhasAll = (userId) => {
    return model.timeUnhasAll(userId)
}

const unhasPercentage = (sesionId) => {
    return model.unhasPercentage(sesionId)
}*/

const validateUser = (email, pass) => {
    return model.validateUser(email, pass)
}

const postConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion) => {
    return model.postConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion)
}

const updateConfig = (id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion, duracionPomo, duracionShortBreak, duracionLongBreak, intervaloLongBreak, cantidadPomodoros) => {
    return model.updateConfig(id_usuario, morderUnha, morderObjetos, jalarPelo, fatigaVisual, malaPostura, alertaVisual, alertaSonora, intervaloNotificacion, tiempoNotificacion, tipoNotificacion, duracionPomo, duracionShortBreak, duracionLongBreak, intervaloLongBreak, cantidadPomodoros)
}
    

const getConfig = (id_usuario) => {
    return model.getConfig(id_usuario)
}

const contactar_profesional = (obj) => {
     ipcRenderer.invoke("env_formulario", obj)
}


const contacto = () => {
    let respuesta = ipcRenderer.sendSync('contacto')
    return respuesta
}

const insertManias = (id_usuario) => {
    let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
    let lista_unhas = JSON.parse(rawdata);
    let rawdata1 = fs.readFileSync('./src/data/peloSesion.json');
    let lista_pelo = JSON.parse(rawdata1);
    let rawdata2 = fs.readFileSync('./src/data/objetoSesion.json');
    let lista_objeto = JSON.parse(rawdata2);
    let rawdata3 = fs.readFileSync('./src/data/vistaSesion.json');
    let lista_vista = JSON.parse(rawdata3);
    let rawdata4 = fs.readFileSync('./src/data/pestaneoSesion.json');
    let lista_pestaneo = JSON.parse(rawdata4);
    
    lista_unhas.map(u => {
        model.lastSesion(id_usuario).then(res => model.createUnhas(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/unhasSesion.json', '[]')//vaciar archivo

    lista_pelo.map(u => {
        model.lastSesion(id_usuario).then(res => model.createPelo(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/peloSesion.json', '[]')//vaciar archivo

    lista_objeto.map(u => {
        model.lastSesion(id_usuario).then(res => model.createMorder(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/objetoSesion.json', '[]')//vaciar archivo

    lista_vista.map(u => {
        model.lastSesion(id_usuario).then(res => model.createVista(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/vistaSesion.json', '[]')//vaciar archivo

    lista_pestaneo.map(u => {
        model.lastSesion(id_usuario).then(res => model.createPestaneo(id_usuario, res, u.inicio, u.final, u.total))
    })
    fs.writeFileSync('./src/data/pestaneoSesion.json', '[]')//vaciar archivo
}
 //calculo de totales por mania, para insertar en la tabla sesion al momento de detener la deteccion
const obtenerTotal = () => {
    let rawdata = fs.readFileSync('./src/data/unhasSesion.json');
    let lista_unhas = JSON.parse(rawdata);
    let rawdata1 = fs.readFileSync('./src/data/peloSesion.json');
    let lista_pelo = JSON.parse(rawdata1);
    let rawdata2 = fs.readFileSync('./src/data/objetoSesion.json');
    let lista_objeto = JSON.parse(rawdata2);
    let rawdata3 = fs.readFileSync('./src/data/vistaSesion.json');
    let lista_vista = JSON.parse(rawdata3);
    let rawdata4 = fs.readFileSync('./src/data/pestaneoSesion.json');
    let lista_pestaneo = JSON.parse(rawdata4);
    let tot_unha = 0, tot_objeto = 0, tot_pelo = 0, tot_vista = 0; //tiempo total de la mania en la sesion (se omite a pestaneo, no llevaremos esa cuenta)
    let cant_tot_unha = 1, cant_tot_objeto = 1, cant_tot_pelo = 1, cant_tot_vista = 1, cant_tot_pestaneo = 1; //cantidad total de reconocimientos
    lista_unhas.map(u => {
        tot_unha = tot_unha + parseInt(u.total)
        cant_tot_unha += 1
    })

    lista_pelo.map(u => {
        tot_pelo = tot_pelo + parseInt(u.total)
        cant_tot_pelo += 1
    })

    lista_objeto.map(u => {
        tot_objeto = tot_objeto + parseInt(u.total)
        cant_tot_objeto += 1
    })

    lista_vista.map(u => {
        tot_vista = tot_vista + parseInt(u.total)
        cant_tot_vista += 1
    })

    lista_pestaneo.map(u => {
        cant_tot_pestaneo += 1
    })
     
    return [Math.trunc(tot_unha), Math.trunc(tot_pelo), Math.trunc(tot_objeto), Math.trunc(tot_vista), cant_tot_unha-1, cant_tot_pelo-1, cant_tot_objeto-1, cant_tot_vista-1, cant_tot_pestaneo-1]
}

const leerCameraHandle = () => {
    let data = fs.readFileSync('./src/data/cameraHandle.txt', 'utf8')
    return data
}

const createPelo = (id_usuario, id_sesion, inicio, final, total_time) => {
    return model.createPelo(id_usuario, id_sesion, inicio, final, total_time)
}

const totalSesionTimePelo = (sesionId) => {
    return model.totalSesionTimePelo(sesionId)
}
const totalTimePelo = (userId) => {
    return model.totalTimePelo(userId)
}
const countPeloSesion = (sesionId) => {
    return model.countPeloSesion(sesionId)
}

const allSesionsPelo = (userId) => {
    return model.allSesionsPelo(userId)
}

const peorSesionPelo = (userId) => {
    return model.peorSesionPelo(userId)
}

const mejorSesionPelo = (userId) => {
    return model.mejorSesionPelo(userId)
}

const percentageTenSesionPelo = (userId) => {
    return model.percentageTenSesionPelo(userId)
}

const createMorder = (id_usuario, id_sesion, inicio, final, total_time) => {
    return model.createMorder(id_usuario, id_sesion, inicio, final, total_time)
}

const totalSesionTimeMorder = (sesionId) => {
    return model.totalSesionTimeMorder(sesionId)
}

const totalTimeMorder = (userId) => {
    return model.totalTimeMorder(userId)
}

const countMorderSesion = (sesionId) => {
    return model.countMorderSesion(sesionId)
}

const allSesionsMorder = (userId) => {
    return model.allSesionsMorder(userId)
}

const peorSesionMorder = (userId) => {
    return model.peorSesionMorder(userId)
}

const mejorSesionMorder = (userId) => {
    return model.mejorSesionMorder(userId)
}

const percentageTenSesionMorder = (userId) => {
    return model.percentageTenSesionMorder(userId)
}

const sesionesMesUnha = (userId, mes, año) => {
    return model.sesionesMesUnha(userId, mes, año)
}

const sesionesMesMorder = (userId, mes, año) => {
    return model.sesionesMesMorder(userId, mes, año)
}

const sesionesMesPelo = (userId, mes, año) => {
    return model.sesionesMesPelo(userId, mes, año)
}

const peorMesMorder = (userId, mes, año) => {
    return model.peorMesMorder(userId, mes, año)
}

const mejorMesMorder = (userId, mes, año) => {
    return model.mejorMesMorder(userId, mes, año)
}

const peorMesPelo = (userId, mes, año) => {
    return model.peorMesPelo(userId, mes, año)
}

const mejorMesPelo = (userId, mes, año) => {
    return model.mejorMesPelo(userId, mes, año)
}

const readConsejos = () => {
    let rawdata = fs.readFileSync('./src/data/consejos.json');
    let lista_consejos = JSON.parse(rawdata);
    return lista_consejos
}
const tieneGrupo = (lider_id) => {
    return model.tieneGrupo(lider_id)
}

const solicitudUnirseGrupo = (user_id, code) => {
    return model.solicitudUnirseGrupo(user_id, code)
}

const createGrupo = (id_lider, nombre) => {
    return model.createGrupo(id_lider, nombre)
}

const getParticipantesGrupo = (id_grupo) => {
    return model.getParticipantesGrupo(id_grupo)
}

const getSolicitudesGrupo = (code) => {
    return model.getSolicitudesGrupo(code)
}

const getCodeGrupo = (id_lider) => {
    return model.getCodeGrupo(id_lider)
}

const setConsejo = (obj) => {
    fs.writeFileSync('./src/data/consejoHandle.json', '')//vaciar archivo
    let insert = JSON.stringify(obj)
    fs.writeFileSync('./src/data/consejoHandle.json', insert)//vaciar archivo
}
const quitarDelGrupo = (id_usuario, id_grupo) => {
    return model.quitarDelGrupo(id_usuario, id_grupo)
}

const addParticipante = (id_usuario, code) => {
    return model.addParticipante(id_usuario, code)
}

const quitarSolicitud = (id_usuario, code) => {
    return model.quitarSolicitud(id_usuario, code)
}

const tiempoGrupo = (code, mes) => {
    return model.tiempoGrupo(code, mes)
}

const totalesGrupo = (code, mes) => {
    return model.totalesGrupo(code, mes)
}

const top10Grupo = (code, mes) => {
    return model.top10Grupo(code, mes)
}

const getCodeGrupoUser = (id_user) => {
    return model.getCodeGrupoUser(id_user)
}

const peorSesionPomodoro = (id_user) => {
    return model.peorSesionPomodoro(id_user)
}

const mejorSesionPomodoro = (id_user) => {
    return model.mejorSesionPomodoro(id_user)
}

const ultimaSesionPomodoro = (id_user) => {
    return model.ultimaSesionPomodoro(id_user)
}

const contarSesionPomodoro = (id_user) => {
    return model.contarSesionPomodoro(id_user)
}


const contarMesPomodoro = (id_user, mes) => {
    return model.contarMesPomodoro(id_user, mes)
}

const datosTotalesPomodoro = (id_user) => {
    return model.datosTotalesPomodoro(id_user)
}

const datosUltimaSesionPomodoro = (id_user) => {
    return model.datosUltimaSesionPomodoro(id_user)
}

const ultimaVista = (id_user) => {
    return model.ultimaVista(id_user)
}

const totalVista = (id_user) => {
    return model.totalVista(id_user)
}

const top10Vista = (id_user) => {
    return model.top10Vista(id_user)
}

const eliminarGrupo = (code) => {
    return model.eliminarGrupo(code)
}

const readConsejoFile = () => {
    let rawdata = fs.readFileSync('./src/data/consejoHandle.json');
    let consejo = JSON.parse(rawdata);
    return consejo
}

const cantDeteccionesFatigaPorMinutoTenSesion = (id_user) => {
    return model.cantDeteccionesFatigaPorMinutoTenSesion(id_user)
}


contextBridge.exposeInMainWorld("api", {
    getUsuarios: getUsuarios,
    createUser: createUser,
    getUserData: getUserData,
    updateUserData: updateUserData,
    createSesion: createSesion,
    getSesion: getSesion,
    lastSesion: lastSesion,
    countUnhasSesion: countUnhasSesion,
    percentageTenSesionUnhas: percentageTenSesionUnhas,
    allSesionsUnhas: allSesionsUnhas,
    totalTimeSesions: totalTimeSesions,
    totalTimeUnhas: totalTimeUnhas,
    totalSesionTimeUnhas: totalSesionTimeUnhas,
    createUnhas: createUnhas,
    durationSesion: durationSesion,   
    validateUser: validateUser,
    postConfig: postConfig,
    getConfig: getConfig,
    updateConfig: updateConfig,
    iniciar_camara: iniciar_camara,
    cerrar_sesion: cerrar_sesion,
    cerrar_camara: cerrar_camara,
    confirmMail: confirmMail,
    contacto: contacto,
    contactar_profesional: contactar_profesional,
    get_user_id: get_user_id,
    insertManias: insertManias,
    obtenerTotal: obtenerTotal,
    leerCameraHandle: leerCameraHandle,
    createPelo: createPelo,
    totalSesionTimePelo: totalSesionTimePelo,
    totalTimePelo: totalTimePelo,
    countPeloSesion: countPeloSesion,
    allSesionsPelo: allSesionsPelo,
    createMorder: createMorder,
    totalSesionTimeMorder: totalSesionTimeMorder,
    totalTimeMorder: totalTimeMorder,
    countMorderSesion: countMorderSesion,
    allSesionsMorder: allSesionsMorder,
    peorSesionMorder: peorSesionMorder,
    mejorSesionMorder: mejorSesionMorder, 
    peorSesionPelo: peorSesionPelo, 
    mejorSesionPelo: mejorSesionPelo,
    percentageTenSesionPelo: percentageTenSesionPelo,
    percentageTenSesionMorder: percentageTenSesionMorder,
    sesionesMesUnha: sesionesMesUnha,
    sesionesMesMorder: sesionesMesMorder,
    sesionesMesPelo: sesionesMesPelo,
    mejorMesMorder: mejorMesMorder,
    peorMesMorder: peorMesMorder,
    peorMesPelo: peorMesPelo,
    mejorMesPelo: mejorMesPelo,
    readConsejos: readConsejos,
    tieneGrupo: tieneGrupo,
    solicitudUnirseGrupo: solicitudUnirseGrupo,
    createGrupo: createGrupo,
    getParticipantesGrupo: getParticipantesGrupo,
    getSolicitudesGrupo: getSolicitudesGrupo,
    getCodeGrupo: getCodeGrupo,
    quitarDelGrupo: quitarDelGrupo,
    addParticipante: addParticipante,
    quitarSolicitud: quitarSolicitud,
    tiempoGrupo: tiempoGrupo,
    totalesGrupo: totalesGrupo,
    top10Grupo: top10Grupo,
    getCodeGrupoUser: getCodeGrupoUser,
    peorSesionPomodoro: peorSesionPomodoro,
    mejorSesionPomodoro: mejorSesionPomodoro,
    ultimaSesionPomodoro: ultimaSesionPomodoro,
    contarSesionPomodoro: contarSesionPomodoro,
    contarMesPomodoro: contarMesPomodoro,
    datosTotalesPomodoro: datosTotalesPomodoro,
    setConsejo: setConsejo,
    readConsejoFile: readConsejoFile,
    iniciar_pomodoro: iniciar_pomodoro,
    pausar_pomodoro: pausar_pomodoro,
    parar_pomodoro: parar_pomodoro,
    leer_pomodoro: leer_pomodoro,
    fecha_inicio_sesion: fecha_inicio_sesion,
    quitarDelGrupo: quitarDelGrupo,
    countPestaneoSesion: countPestaneoSesion,
    countVistaSesion:countVistaSesion,
    datosUltimaSesionPomodoro: datosUltimaSesionPomodoro,
    cantDeteccionesFatigaPorMinutoTenSesion: cantDeteccionesFatigaPorMinutoTenSesion,
    datosUltimaSesionPomodoro: datosUltimaSesionPomodoro,
    ultimaVista: ultimaVista,
    totalVista: totalVista,
    top10Vista: top10Vista,
    eliminarGrupo: eliminarGrupo
})

module.exports = {iniciar_camara, cerrar_camara, createSesion, insertManias, obtenerTotal, fecha_inicio_sesion, leerCameraHandle, get_user_id, getConfig, parar_pomodoro}
//SE UTILIZA con la linea window.api.funcion("parametros").then((result) => {....})
//desde cualquier .js