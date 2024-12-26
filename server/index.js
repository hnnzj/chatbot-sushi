const express = require('express')
const app = express();
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://hnnzj:jo234151@cluster0.l6x6f.mongodb.net/Sushi-API?retryWrites=true&w=majority&appName=Cluster0').then((res) => {
    console.log("Base de datos conectada")
})
.catch((err) => {
    console.log(err)
})

const port = process.env.PORT || 5000;

app.use(express.json())

app.listen(port,( ) => {
    console.log(`Servidor corriendo en puerto ${port}`)
})