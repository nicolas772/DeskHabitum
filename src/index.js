const { app, BrowserWindow, ipcMain, Notification, MessageChannelMain} = require('electron')
const path = require('path')
const model = require('./model/model.js')

let winlogin;
let win, camera_win;
let corriendo;


const createWindow = () => {
      win = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
      }
    })
    //win.webContents.openDevTools();
    win.loadFile('src/views/index.html');
    
    camera_win = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
          // nodeIntegration: true,
          // contextIsolation:true,
          //devTools:true,
          preload:path.join(__dirname, 'test_processWebcam.js')
          
      }
    })
    camera_win.loadFile('src/views/camera.html');
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


/*function loginWindow () {
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
}*/


function loginWindow () {
  createWindow()
}

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj)
});

function validatelogin(obj) {
  const { email, password } = obj 
  model.validateUser(email, password).then(
    results => { //results es el id del usuario loggeado
      if(results > 0){
        createWindow();
        winlogin.close();
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
/*ipcMain.on('iniciar-camara', (event, data) => {
  corriendo = "true"
  let respuesta = "llego proceso a main"
  event.returnValue = respuesta;
})

ipcMain.on('cerrar-camara', (event, data) => {
  //camera_win.close()
  corriendo = "false"
})*/

//Funcion para cerrar sesión y cambiar a vista de login
ipcMain.on('cerrar-sesion', (event, data) => {
  loginWindow()
  win.close()
})



 app.whenReady().then(() => {
  loginWindow();
})