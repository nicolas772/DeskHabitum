const { app, BrowserWindow, ipcMain, Notification} = require('electron')
const path = require('path')
const model = require('./model/model.js')

let winlogin;
let win;
const createWindow = () => {
      win = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
      }
    })

    //Variable que almacena el timestamp del inicio de la sesión, si no hay sesión en curso almacena "No-Session"
    let sesion = 'No-Session';
    ipcMain.on('Check-Session', (event, data) => {
      if (data == "Init")
        sesion = new Date();
      else if (data == "Stop")
        sesion = 'No-Session';
      event.returnValue = sesion;
    })


    //win.webContents.openDevTools();
    win.loadFile('src/views/index.html');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


function loginWindow () {
  winlogin = new BrowserWindow({
   width: 900,
   height: 700,
   webPreferences: {
    // nodeIntegration: true,
    // contextIsolation:true,
    // devTools:false,
     preload:path.join(__dirname, 'login.js')
     
   }
 })

 winlogin.loadFile('src/views/login.html')
}

/*function loginWindow () {
  winlogin = new BrowserWindow({
   width: 900,
   height: 700,
   webPreferences: {
    // nodeIntegration: true,
    // contextIsolation:true,
    // devTools:false,
     preload:path.join(__dirname, 'preload.js')
     
   }
 })

 winlogin.loadFile('src/views/index.html')
}*/

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj)
});

function validatelogin(obj) {
  const { email, password } = obj 
  model.validateUser(email, password).then(
    results => { //results es el id del usuario loggeado
      if(results > 0){
        winlogin.close()
        createWindow();
      }else{
        new Notification({
          title:"login",
          body: 'email o password equivocado'
        }).show()
      }
    }    
  )
}


//Funcion para crear nueva camara desde boton "comenzar"
ipcMain.on('iniciar-camara', (event, data) => {
  camera_win = new BrowserWindow({
        width: 200,
        height: 200,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation:true,
            // devTools:false,
            preload:path.join(__dirname, 'test_processWebcam.js')
            
        }
    })

  camera_win.loadFile('src/views/camera.html')
  let respuesta = "llego proceso a main"
  event.returnValue = respuesta;
})

//Funcion para cerrar sesión y cambiar a vista de login
ipcMain.on('cerrar-sesion', (event, data) => {
  loginWindow()
  win.close()
})


 app.whenReady().then(() => {
  loginWindow();
})