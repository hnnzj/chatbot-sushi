const express = require('express')


const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
app.listen(port,( ) => {
    console.log(`Servidor corriendo en puerto ${port}`)
})