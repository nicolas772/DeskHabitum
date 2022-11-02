const { app, BrowserWindow, ipcMain, Notification, MessageChannelMain} = require('electron')
const path = require('path')
const model = require('./model/model.js')
var nodemailer = require("nodemailer");


//model.eliminarGrupo("hXhix7Ornk").then(r => console.log());

let winlogin;
let win, camera_win, winCameraUnha ;

let ID_USER;


const createWindow = () => {
      win = new BrowserWindow({
      width: 1000,
      height: 700,
      icon: __dirname + '/icons/icono.ico',
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js'),
        enableRemoteModule: true
        
      }
    })
    //win.webContents.openDevTools();
    //win.loadFile('src/views/index.html');
    
    win.loadFile('src/views/index.html');
    
    camera_win = new BrowserWindow({
      width: 600,
      height: 600,
      //show: false,
      webPreferences: {
          // nodeIntegration: true,
          // contextIsolation:true,
          //devTools:true,
          preload:path.join(__dirname, 'test_processWebcam.js')
          
      }
    })
    camera_win.loadFile('src/views/camera.html');
    camera_win.webContents.openDevTools();


    pomodoro_win = new BrowserWindow({
      width: 600,
      height: 600,
      show: false,
      webPreferences: {
          // nodeIntegration: true,
          // contextIsolation:true,
          //devTools:true,
          preload:path.join(__dirname, 'pomodoro.js')
          
      }
    })
    
    pomodoro_win.loadFile('src/views/camera.html');
    pomodoro_win.webContents.openDevTools();
    createWindowCameraUnhas()

    win.once('closed', () => {
      pomodoro_win.close()
      camera_win.close()
    })
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

 //winlogin.loadFile('src/views/login.html')
 winlogin.loadFile('src/views/login2.html')
}
/*

function loginWindow () {
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
        ID_USER = results
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

 //winreg.loadFile('src/views/registro.html')
 winreg.loadFile('src/views/register2.html')
}


ipcMain.handle('registrar', (event, obj) => {
  regUser(obj)
});

function regUser(obj) {
  const {nombre, apellido, email, password, lider } = obj
  model.confirmMail(email).then( existe =>
    {
      if (existe>0) {
        new Notification({
          title:"registro",
          body: 'Email ya registrado'
        }).show()
      } else {
        model.createUser(nombre, apellido, email, password, lider)
        //luego de instertar usuario, se dispara trigger en BD para config por default
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
ipcMain.on('get-user-id', (event, data) => {
  event.returnValue = ID_USER;
})

//Funcion para cerrar sesión y cambiar a vista de login
ipcMain.on('cerrar-sesion', (event, data) => {
  loginWindow()
  win.close()
  camera_win.close()
})

//Contacto mail
function SendIt(nombre, email, telefono, region, ciudad, atencion, motivo) {
  
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contacto.dolphindev@gmail.com",
      pass: "vxarbpfkxguwfqxp",
    },
  });

  const mailOptions = {
    from: "contacto.dolphindev@gmail.com", 
    to: "contacto.dolphindev@gmail.com",
    subject: "Contacto usuario DeskHabitum",
    html: `<p>Estimado/a, me comunico con usted, mediante la aplicación DeskHabitum para solicitar asesoria,  se adjunta mis datos a continuacion</p>
            <p>
            nombre: ${nombre} <br>
            email: ${email} <br>  
            telefono: ${telefono} <br>
            region: ${region} <br> 
            ciudad: ${ciudad} <br>
            tipo atencion solicitada: ${atencion} <br>  
            motivo: ${motivo} <br>            
            </p>
    
    `,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}


ipcMain.handle('env_formulario', (event, obj) => {
  const {nombre, email, telefono, region, ciudad, atencion, motivo} = obj

  console.log("correo enviado a: ", obj)
  SendIt(nombre, email, telefono, region, ciudad, atencion, motivo);
  new Notification({
    title:"Contacto",
    body: 'Correo enviado exitosamente'
  }).show()
});

 app.whenReady().then(() => {
  loginWindow();
})

//Manejo de la funcionalidad de sacar fotos de las manos
function createWindowCameraUnhas() {
 winCameraUnha = new BrowserWindow({
    useContentSize: true,
    width: 800,
    height: 600,
    resizable: false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:true,
      // devTools:false,
      preload:path.join(__dirname, './cameraFotosUnha.js')
       
    }
  });
 //winCameraUnha.webContents.openDevTools();
 winCameraUnha.loadFile('src/views/cameraFotosUnha.html')
}

