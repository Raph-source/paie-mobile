-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notifvu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idAgent" INTEGER,
    "idNotification" INTEGER,
    CONSTRAINT "Notifvu_idNotification_fkey" FOREIGN KEY ("idNotification") REFERENCES "Notification" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notifvu_idAgent_fkey" FOREIGN KEY ("idAgent") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Notifvu" ("id", "idAgent", "idNotification") SELECT "id", "idAgent", "idNotification" FROM "Notifvu";
DROP TABLE "Notifvu";
ALTER TABLE "new_Notifvu" RENAME TO "Notifvu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
