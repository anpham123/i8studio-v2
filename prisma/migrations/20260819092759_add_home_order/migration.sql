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
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "heroImage" TEXT NOT NULL DEFAULT '',
    "heroVideo" TEXT NOT NULL DEFAULT '',
    "featuresJson" TEXT NOT NULL DEFAULT '[]',
    "mediaEmbedUrl" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_Service" ("createdAt", "description", "descriptionJa", "feature1DescEn", "feature1DescJa", "feature1Image", "feature1TitleEn", "feature1TitleJa", "feature2DescEn", "feature2DescJa", "feature2Image", "feature2TitleEn", "feature2TitleJa", "featuresJson", "heroDescEn", "heroDescJa", "heroImage", "heroTaglineEn", "heroTaglineJa", "icon", "id", "image", "isPublished", "mediaEmbedUrl", "name", "nameJa", "order", "plansJson", "priceHint", "priceHintJa", "processJson", "slug") SELECT "createdAt", "description", "descriptionJa", "feature1DescEn", "feature1DescJa", "feature1Image", "feature1TitleEn", "feature1TitleJa", "feature2DescEn", "feature2DescJa", "feature2Image", "feature2TitleEn", "feature2TitleJa", "featuresJson", "heroDescEn", "heroDescJa", "heroImage", "heroTaglineEn", "heroTaglineJa", "icon", "id", "image", "isPublished", "mediaEmbedUrl", "name", "nameJa", "order", "plansJson", "priceHint", "priceHintJa", "processJson", "slug" FROM "Service";
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
    "homeOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Work" ("beforeImage", "buildingCategory", "category", "createdAt", "featured", "id", "image", "order", "subtitle", "title", "titleJa", "type", "videoUrl", "vrUrl") SELECT "beforeImage", "buildingCategory", "category", "createdAt", "featured", "id", "image", "order", "subtitle", "title", "titleJa", "type", "videoUrl", "vrUrl" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
