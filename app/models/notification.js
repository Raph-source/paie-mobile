const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

class Notification{
    // retourne les notifications
    static async getNotification(idAgent){
        //récuperer les notification non lues
        const trouver = await prisma.notification.findMany({
            where: {
                NOT: {
                  notifvu: {
                    some: {
                      agent: {
                        id: idAgent,
                      },
                    },
                  },
                },
              },
        })

        //inserer les notification dans la table notificationvu
        for(let notif of trouver){
            await prisma.notifvu.create({
                data: {
                    idAgent: idAgent,
                    idNotification: notif.id
                }
            })
        }

        return trouver

    }
    
    // insère une notification
    static async setNotification(dateActuelle, contenu){
        await prisma.notification.create({
            data: {
                date: dateActuelle,
                contenu: contenu
            }
        })
    }
}

module.exports = Notification