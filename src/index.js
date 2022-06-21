const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')




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


    win.webContents.openDevTools();
    win.loadFile('src/views/index.html');
}

app.whenReady().then(() => {
    createWindow()
})

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
