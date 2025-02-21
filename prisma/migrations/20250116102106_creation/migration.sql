-- CreateTable
CREATE TABLE "Agent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "postNom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "matricule" TEXT NOT NULL DEFAULT 'aucun',
    "email" TEXT NOT NULL,
    "salaire" INTEGER NOT NULL,
    "solde" INTEGER NOT NULL,
    "notificateur" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "contenu" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Notifvu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idAgent" INTEGER NOT NULL,
    "idNotification" INTEGER NOT NULL,
    CONSTRAINT "Notifvu_idNotification_fkey" FOREIGN KEY ("idNotification") REFERENCES "Notification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notifvu_idAgent_fkey" FOREIGN KEY ("idAgent") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Banque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mdp" TEXT NOT NULL,
    "montant" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
