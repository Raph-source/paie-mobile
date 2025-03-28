const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

class Agent{
    static async checkAgent(matricule, mdp){
        const trouver = await prisma.agent.findMany({
            where: {
                matricule: matricule,
                mdp: mdp
            }
        })

        if(trouver.length > 0)
            return trouver
        return false
    }

    // retourne true si c'est un notificateur et false sinon
    static async checkNotificateur(matricule){
        const trouver = await prisma.agent.findMany({
            where: {
                matricule: matricule,
                notificateur: true
            }
        })
        
        if(trouver.length > 0)
            return true
        return false
    }
    
    //retourne l'id d'un agent
    static async getId(num){
        const trouver = await prisma.agent.findFirst({
            where: {
                tel: num
            },
            select: {
                id: true
            }
        })

        return trouver.id
    }

    //retourne l'id d'un agent
    static async getEmail(id){
        const trouver = await prisma.agent.findFirst({
            where: {
                id: id
            },
            select: {
                email: true
            }
        })

        return trouver.email
    }

    // retourne le solde d'un agent
    static async getSolde(id){
        const trouver = await prisma.agent.findUnique({
            where: {
                id: id
            },
            select: {
                solde: true
            }
        })

        return trouver
    }

    //retourne la somme de tout les salaires des agents
    static async getSommeSalaire(){
        const salaire = await prisma.agent.aggregate({
            _sum: {
                salaire: true,
            }
        })

        return salaire._sum.salaire
    }

    //retourne le salaire d'un agent
    static async getSalaire(num){
        const trouver = await prisma.agent.findFirst({
            where: {
                tel: num,
            },
            select: {
                salaire: true,
            }
        })

        return trouver.salaire
    }
    
    // mettre à jour le solde
    static async updateSolde(id, soldeAgent){
        await prisma.agent.update({
            where: {
                id: id
            },
            data: {
                solde: soldeAgent,
            }
        })
    }

    //retourne les emails des agents
    static async getAllEmail(){
        const trouver = await prisma.agent.findMany({
            select: {
                email: true
            }
        })

        return trouver
    }

    //retourne les numéros des agents
    static async getAllNumero(){
        const trouver = await prisma.agent.findMany({
            select: {
                tel: true
            }
        })

        return trouver
    }

    //changer l'accusé de recéption
    static async setAccuseRec(email, valeur){
        await prisma.agent.update({
            where: {
                email: email
            },
            data: {
                accuseRec: valeur,
            }
        })
    }

    //retourne tout les agents
    static async getAllAgent(){
        const agents = await prisma.agent.findMany()

        return agents
    }
}

module.exports = Agent