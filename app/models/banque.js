const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

class Banque{
    static async login(mdp){
        const trouver = await prisma.banque.findMany({
            where: {
                mdp: mdp,
            }
        })

        if(trouver.length > 0)
            return true
        return false
    }

    static async getMontant(){
        const trouver = await prisma.banque.findFirst()        

        return trouver.montant
    }
    
    //update montant
    static async updateMontant(nouveauMontant){
        await prisma.banque.update({
            where: {
                id: 1
            },
            data: {
                montant: nouveauMontant
            }
        })
    }
}

module.exports = Banque