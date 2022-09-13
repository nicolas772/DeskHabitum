const { app, BrowserWindow, ipcMain, Notification, MessageChannelMain} = require('electron')
const path = require('path')
const model = require('./model/model.js')
var nodemailer = require("nodemailer");

let winlogin;
let win, camera_win;


const createWindow = () => {
      win = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js'),
        enableRemoteModule: true
        
      }
    })
    //win.webContents.openDevTools();
    win.loadFile('src/views/index.html');
    
    camera_win = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      webPreferences: {
          // nodeIntegration: true,
          // contextIsolation:true,
          //devTools:true,
          preload:path.join(__dirname, 'test_processWebcam.js')
          
      }
    })
    camera_win.loadFile('src/views/camera.html');
    //camera_win.webContents.openDevTools();
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
    nodeIntegration: true,
    contextIsolation:true,
    // devTools:false,
     preload:path.join(__dirname, 'login.js')
     
   }
 })

 winlogin.loadFile('src/views/login.html')
}


/*function loginWindow () {
  createWindow()
}*/

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

//Funcionalidades registrarse
function regWindow () {
  winreg = new BrowserWindow({
   width: 900,
   height: 700,
   webPreferences: {
    // nodeIntegration: true,
    // contextIsolation:true,
    // devTools:false,
     preload:path.join(__dirname, 'registro.js')
     
   }
 })

 winreg.loadFile('src/views/registro.html')
}


ipcMain.handle('registrar', (event, obj) => {
  regUser(obj)
});

function regUser(obj) {
  const {nombre, apellido, email, password } = obj
  model.confirmMail(email).then( existe =>
    {
      if (existe>0) {
        new Notification({
          title:"registro",
          body: 'Email ya registrado'
        }).show()
      } else {
        model.createUser(nombre, apellido, email, password)
        new Notification({
          title:"registro",
          body: 'Usuario registrado correctamente'
        }).show()
      }
    }



  )

}

//Movimiento entre vistas login/registro
ipcMain.handle('moveToReg', (event, obj) => {
  toReg();
});

function toReg(){
  regWindow();
  winlogin.close();
}

ipcMain.handle('moveToLogin', (event, obj) => {
  toLogin();
});

function toLogin(){
  loginWindow();
  winreg.close();
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

//Contacto mail
function SendIt(name) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contacto.dolphindev@gmail.com",
      pass: "vxarbpfkxguwfqxp",
    },
  });

  const mailOptions = {
    from: "contacto.dolphindev@gmail.com", 
    to: "j.cabrerab96@gmail.com",
    subject: "Subject of your email",
    html: `<p>estimado ${name} le informa que...</p>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}



ipcMain.on('contacto', (event, obj) => {
  const {nombre} = obj
  console.log("correo enviado a: ", nombre)
  SendIt(nombre)
})





 app.whenReady().then(() => {
  loginWindow();
})