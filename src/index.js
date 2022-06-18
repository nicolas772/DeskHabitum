const { app, BrowserWindow } = require('electron')
const path = require('path')
/*const { getUsuarios } = require('./model.js')

getUsuarios().then(usuarios => {
  console.log(usuarios)
}).catch(err => {
  console.log(err);
  return res.status(500).send("Error obteniendo usuarios");
})*/

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
      }
    })
    //win.webContents.openDevTools();
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
