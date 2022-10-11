const model = require('./model/model.js')
const {contextBridge, ipcRenderer} = require("electron");
var fs = require('fs');


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

const createSesion = (id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion) => {
    return model.createSesion(id_usuario, inicio, final, total, total_unhas, total_pelo, total_morder, total_vista, cant_tot_unha, cant_tot_pelo, cant_tot_objeto, cant_tot_vista, cant_tot_pestaneo, mes_sesion, anno_sesion)
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

const fecha_inicio_sesion = () => {
    let inicio = fs.readFileSync('./src/data/inicio_fecha.txt')
    return new Date(inicio)
}

const leerCameraHandle = () => {
    let data = fs.readFileSync('./src/data/cameraHandle.txt', 'utf8')
    return data
}

const get_user_id = (data) => {
    let respuesta = ipcRenderer.sendSync('get-user-id', data)
    return respuesta
}

module.exports = {iniciar_camara, cerrar_camara, createSesion, insertManias, obtenerTotal, fecha_inicio_sesion, leerCameraHandle, get_user_id }