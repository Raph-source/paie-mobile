//inclusion des module
const express = require("express")
const multer = require('multer')
const { log } = require("console")

//inclusion du contrôlleur
const Agent = require("../app/controllers/agent")

//pour le stockage des upload
const stockage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, './uploads/')
    },
    filename : (req, file, cb) =>{
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const upload = multer({
    storage : stockage
})

const agent = express.Router()

//LES ENDPOINTS

//POST
agent.post('/login', upload.none(), (req, res) =>{ Agent.login(req, res)})
agent.post('/ajouter-notification', upload.none(), (req, res) =>{ Agent.setNotification(req, res)})

//GET
agent.get('/get-solde/:idAgent', upload.none(), (req, res) =>{ Agent.getSolde(req, res)})
agent.get('/get-notification/:idAgent', upload.none(), (req, res) =>{ Agent.getNotification(req, res)})

//PUT
agent.put('/accuse-reception/:idAgent', upload.none(), (req, res) =>{ Agent.setAccuseRec(req, res)})

module.exports = agent;