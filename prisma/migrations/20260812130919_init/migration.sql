-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "workingHours" TEXT,
    "imageUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "capacity" INTEGER,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "dataSourceType" TEXT NOT NULL DEFAULT 'DEMO',
    "officialSourceUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "verifiedAt" DATETIME,
    "verifiedBy" TEXT,
    "lastVerifiedAt" DATETIME,
    "contactUnit" TEXT,
    "services" TEXT NOT NULL DEFAULT '["sahiplendirme"]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "municipalityId" TEXT,
    CONSTRAINT "Shelter_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Municipality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "officialSourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "gender" TEXT NOT NULL,
    "birthDate" TEXT,
    "age" TEXT,
    "ageGroup" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "description" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "energyLevel" TEXT NOT NULL,
    "healthDescription" TEXT,
    "specialNeeds" TEXT,
    "adoptionStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "sourceType" TEXT NOT NULL DEFAULT 'SHELTER',
    "dataSourceType" TEXT NOT NULL DEFAULT 'DEMO',
    "sourceUrl" TEXT,
    "ownerName" TEXT,
    "microchipNumber" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "goodWithChildren" INTEGER,
    "goodWithDogs" INTEGER,
    "goodWithCats" INTEGER,
    "homeSuitable" INTEGER,
    "gardenRequired" INTEGER,
    "vaccinated" INTEGER,
    "neutered" INTEGER,
    "microchipped" INTEGER,
    "healthChecked" INTEGER,
    "traits" TEXT NOT NULL DEFAULT '[]',
    "imageUrls" TEXT NOT NULL DEFAULT '[]',
    "lastVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "shelterId" TEXT,
    CONSTRAINT "Animal_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnimalPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnimalPhoto_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnimalHealthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "vetName" TEXT,
    "nextDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnimalHealthRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdoptionApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shelterId" TEXT,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "houseType" TEXT,
    "homeOwnership" TEXT,
    "houseHold" TEXT,
    "hasGarden" BOOLEAN NOT NULL DEFAULT false,
    "previousExperience" BOOLEAN NOT NULL DEFAULT false,
    "hasOtherPets" BOOLEAN NOT NULL DEFAULT false,
    "hasChildren" BOOLEAN,
    "dailyCareTime" TEXT,
    "reason" TEXT NOT NULL,
    "needsCoverage" TEXT,
    "vetCoverage" TEXT,
    "shelterAccess" TEXT,
    "availableTime" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdoptionApplication_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdoptionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdoptionApplication_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShelterAdmin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "shelterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShelterAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShelterAdmin_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MunicipalityAdmin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MunicipalityAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MunicipalityAdmin_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "before" TEXT,
    "after" TEXT,
    "shelterId" TEXT,
    "municipalityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetAmount" REAL,
    "currentAmount" REAL NOT NULL DEFAULT 0,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "resultReport" TEXT,
    "animalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Shelter_slug_key" ON "Shelter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_slug_key" ON "Municipality"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_slug_key" ON "Animal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_animalId_key" ON "Favorite"("userId", "animalId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_animalId_idx" ON "AdoptionApplication"("animalId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_userId_idx" ON "AdoptionApplication"("userId");

-- CreateIndex
CREATE INDEX "AdoptionApplication_shelterId_idx" ON "AdoptionApplication"("shelterId");

-- CreateIndex
CREATE UNIQUE INDEX "ShelterAdmin_userId_shelterId_key" ON "ShelterAdmin"("userId", "shelterId");

-- CreateIndex
CREATE UNIQUE INDEX "MunicipalityAdmin_userId_municipalityId_key" ON "MunicipalityAdmin"("userId", "municipalityId");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Campaign_ownerId_ownerType_idx" ON "Campaign"("ownerId", "ownerType");
