const { app, BrowserWindow } = require('electron')
//const { getUsuarios, getSesiones, getUnhas } = require('./database.js')
//const { createSesion } = require('./crud.js')

/*getUsuarios().then((result) => {
  console.log(result);
})*/

/*createSesion(1, '2022-06-15 20:52:40', '2022-06-15 20:59:40').then(() => {
  console.log('BUENARDO');
})*/

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
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

