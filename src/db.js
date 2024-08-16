const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/electron")
.then(db => console.log("Base de datos MongoDB conectado!"))
.catch(error => console.error("Error al conectar con la DB "+error))