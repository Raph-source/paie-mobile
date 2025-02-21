const express = require("express")
const bodyParser = require('body-parser');
const cors = require('cors');

const app =  express()
app.use(cors());

// Middleware pour parser les données JSON
app.use(express.json());

//le type des données des formulaires
app.use(bodyParser.urlencoded({ extended: true }));

//les routes
const agent = require("./routeur/agent")
const banque = require("./routeur/banque")

//entrée des endpoints
app.use('/', agent);
app.use('/banque/', banque);


app.listen(3000, ()=>{
    console.log("Serveur lancé")
})
