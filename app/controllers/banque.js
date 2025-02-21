const Banque_M = require('../models/banque')
const Agent_M = require('../models/agent')

const validator = require("validator")
const nodemailer = require('nodemailer')
const { text } = require('body-parser')
const { resolve } = require('path')
const { log } = require('console')
const e = require('express')

class Banque{
    static async login(req, res){        
        let {mdp} = req.body

        try{
            if(typeof mdp !== 'undefined'){
                //vérifier si le mdp se trouve dans bdd
                if(await Banque_M.login(mdp)){
                    res.status(200).json({
                        reponse: {
                            message:"success",
                        }

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

    // insèrer le montant 
    static async setMontant(req, res){        
        let {montant} = req.body
        
        try{
            if(typeof montant !== 'undefined'){

                const sommeSalaire = await Agent_M.getSommeSalaire()
                
                
                if(montant >= sommeSalaire){
                    await Banque_M.updateMontant(Number(montant))
                    
                    res.status(200).json({
                        reponse: "succes",
                    })
                }
                else{
                    res.status(400).json({
                        reponse: "montant insufisant"
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
            console.log(erreur);
                     
            res.status(500).json({
                reponse: "erreur serveur"
            })
        }
    }

    // Fonction pour déposer de l'argent sur votre compte CinetPay
    static async depositMoneyToCinetPay(amount) {
        var axios = require('axios');
        var data = JSON.stringify({
          "apikey": "7841257636780ea2c09d655.52135367",
          "site_id": "105885317",
          "transaction_id":  Math.floor(Math.random() * 100000000).toString(), //
          "amount": amount,
          "currency": "CDF",
          "description": " TEST INTEGRATION ",
          "notify_url": "http://localhost:3000/banque/notification",
          "return_url": "http://localhost:3000/banque/notification",
          "channels": "MOBILE_MONEY",
          "lang": "FR",
          "mode": 'PRODUCTION'
        });
        
        let url = ""
        var config = {
          method: 'post',
          url: 'https://api-checkout.cinetpay.com/v2/payment',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
    
        const response = await axios(config)
        
        return response.data.data.payment_url

    }

    //répartition du montant
    static async repartition(res){        
        try{
                
            let montantTotal = await Banque_M.getMontant()            
            
            if(montantTotal > 0){
                const allNumero = await Agent_M.getAllNumero()
                
                for(let numero of allNumero){                    
                    let salaire = await Agent_M.getSalaire(numero.tel)
                    let id = await Agent_M.getId(numero.tel)

                    await Agent_M.updateSolde(id, salaire)

                    montantTotal -= salaire
                }

                //mis à jour du montant
                await Banque_M.updateMontant(montantTotal)

                res.status(200).json({
                    reponse: "success"
                })
            }
            else{
                res.status(400).json({
                    reponse: "veuillez premièrement le montant total"
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

    static async notifierAgent(res){       
        try{
            //configuration du l'adresse email expeditrice
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth:{
                    user:'raphilunga00@gmail.com',
                    pass: 'qqlqnhsocgqrkptg'
                },
                connectionTimeout: 5000
            })

            //tout les emails 
            let resulat = await Agent_M.getAllEmail()
            
            let nombreEmail = 10
            for(let i = 0; i < resulat.length; i += nombreEmail){
                //les dix emails
                let dixAdressMail = resulat.slice(i, i + nombreEmail)

                //préparer les emails à envoyer
                let dixEmail = dixAdressMail.map(mail => ({             
                    from: 'Fontion publique',
                    to: mail.email,
                    subject: 'notification paiement',
                    text: "",
                    html: "cher agent, <br> nous ténons à vous informer que votre salaire à été bien versé "
                }))
                
                //Envoyer les emails
                await Promise.all(dixEmail.map(email => transporter.sendMail(email)))

                //Attendre 1 seconde pour éviter les spams
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            res.status(200).json({
                reponse: "success"
            })
        }
        catch (error) {
            console.log(error);
            
            res.status(500).json({
                reponse: "erreur serveur"
            })
        } 
        
    }

    static async lancerPaiement(res){
        try {
            const axios = require("axios");
            require("dotenv").config();

            const baseURL = 'https://client.cinetpay.com/v1/transfer/money/send/contact';

            // En-têtes pour la requête
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUzNzg0NCwiaXNzIjoiaHR0cHM6Ly9jbGllbnQuY2luZXRwYXkuY29tL3YxL2F1dGgvbG9naW4iLCJpYXQiOjE3MzcxNDAzMTMsImV4cCI6MTczNzE0NzU3MywibmJmIjoxNzM3MTQwMzEzLCJqdGkiOiJ5UkNRNzlEQzF3TXRweXhWIn0.d8da-kG9BhUt08jlt0MGCQQt4rNa8G-G0FhO-ak3hAE',
                'lang' : 'fr'
            };

            /// Étape 1 : Préparer les données POST pour chaque utilisateur
            const data = [
                {
                    "prefix": '243',
                    "phone": '0990905353',
                    "amount": '100',
                    "notify_url ": "user.telephone",
                }
            ]
            
            // Étape 2 : Envoyer une requête POST pour chaque utilisateur
            axios.post(baseURL, data, { headers });

            // Étape 3 : Attendre les réponses pour tous les utilisateurs
            const responses = await Promise.all(promises);

            // Afficher les réponses
            responses.forEach((response, index) => {
                console.log(`Réponse pour ${users[index].nom} ${users[index].prenom} :`, response.data);
            });

            return responses.map(response => response.data); // Retourner toutes les réponses
    

            // const allNumero = await Agent_M.getAllNumero()

            // for(numero of allNumero){
            //     let salaire = await Agent_M.getSalaire(numero)

            //     /// Étape 1 : Préparer les données POST pour chaque utilisateur
            //     const data = [
            //         {
            //             "prefix": '243',
            //             "phone": numero,
            //             "amount": salaire,
            //             "notify_url ": "user.telephone",
            //         }
            //     ]
                
            //     // Étape 2 : Envoyer une requête POST pour chaque utilisateur
            //     axios.post(baseURL, data, { headers });

            //     // Étape 3 : Attendre les réponses pour tous les utilisateurs
            //     const responses = await Promise.all(promises);
            // }


        } catch (error) {
            console.log(error)
            
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

    static async statusPaiement(){
        console.log("paiement");
        
    }
}

module.exports = Banque