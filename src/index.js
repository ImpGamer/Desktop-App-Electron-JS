const { app } = require("electron");
const {createWindow} = require('./main')
require("./db")

//Funcion que valida que todos los archivos sean cargados para cargar la aplicacion
app.whenReady().then(createWindow)
app.disableHardwareAcceleration()