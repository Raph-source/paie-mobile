-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "postNom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salaire" INTEGER NOT NULL,
    "solde" INTEGER NOT NULL,
    "notificateur" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Agent" ("email", "id", "matricule", "mdp", "nom", "notificateur", "postNom", "prenom", "salaire", "solde", "tel") SELECT "email", "id", "matricule", "mdp", "nom", "notificateur", "postNom", "prenom", "salaire", "solde", "tel" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
