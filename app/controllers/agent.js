const validator = require('validator')
const Agent_M = require('../models/agent')
const { response } = require('express')
const Notification = require('../models/notification')

class Agent{

    static async login(req, res){        
        let {matricule, mdp} = req.body

        try{
            if(typeof matricule !== 'undefined' && typeof mdp !== 'undefined'){
                //vérifier si le matricule et le mdp se trouve dans bdd
                const agent = await Agent_M.checkAgent(matricule, mdp)
                if(agent){
                    res.status(200).json({
                        reponse: agent,
                    })
                }
                else{
                    res.status(400).json({
                        reponse: "agent n'existe pas"
                    })
                }
            }
            else{
                res.status(403).json({
                    reponse: "interdit"
                })
            }
        }
        catch(erreur){
            res.status(500).json({
                reponse: "erreur serveur"
            })
        }
    }

    static async getSolde(req, res){        
        let {idAgent} = req.params

        try{
            if(typeof idAgent !== 'undefined'){
                idAgent = Number(idAgent)

                const solde = await Agent_M.getSolde(idAgent)

                res.status(200).json({
                    solde: solde.solde
                })
            }
            else{
                res.status(403).json({
                    reponse: "interdit"
                })
            }
        }
        catch(erreur){
            res.status(500).json({
                reponse: "erreur serveur"
            })
        }
    }

    static async getNotification(req, res){        
        let {idAgent} = req.params

        try{
            if(typeof idAgent !== 'undefined'){
                idAgent = Number(idAgent)

                const notification = await Notification.getNotification(idAgent)

                res.status(200).json({
                    reponse: notification
                })
            }
            else{
                res.status(403).json({
                    reponse: "interdit"
                })
            }
        }
        catch(erreur){            
            res.status(500).json({
                reponse: "erreur serveur"
            })
        }
    }

    static async setNotification(req, res){        
        let {contenu} = req.body

        try{
            if(typeof contenu !== 'undefined'){
                let dateActuelle = await Agent.getDateActuelle()
                
                await Notification.setNotification(dateActuelle, contenu)

                res.status(200).json({
                    reponse: "success"
                })
            }
            else{
                res.status(403).json({
                    reponse: "interdit"
                })
            }
        }
        catch(erreur){
            console.log(erreur);
            
            res.status(500).json({
                reponse: "erreur serveur"
            })
        }
    }

    static async getDateActuelle(){
        //la date actuelle
        const date = new Date()

        const annee = date.getFullYear();
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const jour = String(date.getDate()).padStart(2, '0');
        const heure = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const seconde = String(date.getSeconds()).padStart(2, '0');
  
        return annee + '-' + mois + '-' + jour + 'T' + heure + ':' + minute + ':' + seconde +'Z'
    }
}

module.exports = Agent