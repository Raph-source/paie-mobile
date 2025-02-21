//inclusion des module
const express = require("express")
const multer = require('multer')
const path = require("path")
const { log } = require("console")

//inclusion du contrôlleur
const Banque = require('../app/controllers/banque')

//pour le stockage des upload
const stockage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, './uploads/')
    },
    filename : (req, file, cb) =>{
        cb(null, Date.now() + "_" + file.originalname)
    }
})
//les extensions permis du fichier excel
const extension = (req, file, cb) => {
    const extensionPermis = /xlsx/; // l'extensions autorisée
    const mimetype = extensionPermis.test(file.mimetype); // Vérifie le type MIME du fichier
    const extname = extensionPermis.test(path.extname(file.originalname).toLowerCase()); // Vérifie l'extension du fichier

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error("L'extension ou le type MIME du fichier n'est pas valide"), false); // Indique que l'upload doit être rejeté
    }
}
const upload = multer({
    storage : stockage,
    fileFilter : extension
})

const banque = express.Router()

//LES ENDPOINTS

//POST
banque.post('/login', upload.none(), (req, res) =>{ Banque.login(req, res)})
banque.post('/inserer-montant', upload.none(), (req, res) =>{ Banque.setMontant(req, res)})

//GET
banque.get('/repartition', (req, res) =>{ Banque.repartition(res)})
banque.get('/notification', (req, res) =>{ Banque.notifierAgent(res)})
banque.get('/paiement', (req, res) =>{ Banque.lancerPaiement(res)})


module.exports = banque;