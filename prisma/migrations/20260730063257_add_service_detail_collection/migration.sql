-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL DEFAULT '',
    "titleEn" TEXT NOT NULL DEFAULT '',
    "descJa" TEXT NOT NULL DEFAULT '',
    "descEn" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "imagesJson" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "eyebrow" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "titleJp" TEXT NOT NULL DEFAULT '',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "heroImage" TEXT NOT NULL DEFAULT '',
    "introDropcap" TEXT NOT NULL DEFAULT '',
    "introPullquote" TEXT NOT NULL DEFAULT '',
    "sections" TEXT NOT NULL DEFAULT '[]',
    "comparisonBefore" TEXT NOT NULL DEFAULT '',
    "comparisonAfter" TEXT NOT NULL DEFAULT '',
    "insightHeading" TEXT NOT NULL DEFAULT '',
    "insightBody" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "authorRole" TEXT NOT NULL DEFAULT '',
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'ja',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompositeExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleJp" TEXT,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameJa" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionJa" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "priceHint" TEXT NOT NULL DEFAULT '',
    "priceHintJa" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "heroTaglineJa" TEXT NOT NULL DEFAULT '',
    "heroTaglineEn" TEXT NOT NULL DEFAULT '',
    "heroDescJa" TEXT NOT NULL DEFAULT '',
    "heroDescEn" TEXT NOT NULL DEFAULT '',
    "feature1TitleJa" TEXT NOT NULL DEFAULT '',
    "feature1TitleEn" TEXT NOT NULL DEFAULT '',
    "feature1DescJa" TEXT NOT NULL DEFAULT '',
    "feature1DescEn" TEXT NOT NULL DEFAULT '',
    "feature1Image" TEXT NOT NULL DEFAULT '',
    "feature2TitleJa" TEXT NOT NULL DEFAULT '',
    "feature2TitleEn" TEXT NOT NULL DEFAULT '',
    "feature2DescJa" TEXT NOT NULL DEFAULT '',
    "feature2DescEn" TEXT NOT NULL DEFAULT '',
    "feature2Image" TEXT NOT NULL DEFAULT '',
    "processJson" TEXT NOT NULL DEFAULT '[]',
    "plansJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Service" ("createdAt", "description", "descriptionJa", "icon", "id", "image", "name", "nameJa", "order", "priceHint", "priceHintJa", "slug") SELECT "createdAt", "description", "descriptionJa", "icon", "id", "image", "name", "nameJa", "order", "priceHint", "priceHintJa", "slug" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL DEFAULT '',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '3DCG',
    "type" TEXT NOT NULL DEFAULT 'still',
    "buildingCategory" TEXT NOT NULL DEFAULT 'residential',
    "image" TEXT NOT NULL DEFAULT '',
    "beforeImage" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "vrUrl" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Work" ("category", "createdAt", "featured", "id", "image", "order", "subtitle", "title", "titleJa", "videoUrl") SELECT "category", "createdAt", "featured", "id", "image", "order", "subtitle", "title", "titleJa", "videoUrl" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
