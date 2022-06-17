const { app, BrowserWindow } = require('electron')
const { getUsuarios, getSesiones, getUnhas } = require('./database')
const crud = require('./crud')



const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
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

