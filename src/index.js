const { app, BrowserWindow, ipcMain, Notification} = require('electron')
const path = require('path')
const model = require('./model/model.js')

model.validateUser("aaaaa","bbbb").then(r=>console.log(r))

let winlogin;

const createWindow = () => {
    const win = new BrowserWindow({
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

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj)
});




function validatelogin(obj) {
  const { email, password } = obj 
  model.validateUser(email, password).then(
    results => {
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


 app.whenReady().then(() => {
  loginWindow();
})