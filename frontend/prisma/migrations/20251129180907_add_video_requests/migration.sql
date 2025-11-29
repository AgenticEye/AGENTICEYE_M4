-- CreateTable
CREATE TABLE "VideoRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ideaTitle" TEXT NOT NULL,
    "ideaText" TEXT,
    "notes" TEXT,
    "preferences" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "downloadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "VideoRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kindeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "tier" TEXT NOT NULL DEFAULT 'Free',
    "videoGenerations" INTEGER NOT NULL DEFAULT 0,
    "videoCredits" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "credits", "email", "id", "kindeId", "lastResetDate", "tier", "videoGenerations") SELECT "createdAt", "credits", "email", "id", "kindeId", "lastResetDate", "tier", "videoGenerations" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_kindeId_key" ON "User"("kindeId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
