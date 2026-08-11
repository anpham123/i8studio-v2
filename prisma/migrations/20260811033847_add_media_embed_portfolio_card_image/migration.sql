-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleJa" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionJa" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "galleryJson" TEXT NOT NULL DEFAULT '[]',
    "category" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceSlug" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "titleJa" TEXT NOT NULL DEFAULT '',
    "titleEn" TEXT NOT NULL DEFAULT '',
    "bulletsJson" TEXT NOT NULL DEFAULT '[]',
    "priceFrom" TEXT NOT NULL DEFAULT '',
    "priceLabelJa" TEXT NOT NULL DEFAULT '',
    "priceLabelEn" TEXT NOT NULL DEFAULT '',
    "cardImage" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PriceItem" ("bulletsJson", "createdAt", "icon", "id", "order", "priceFrom", "priceLabelEn", "priceLabelJa", "serviceSlug", "titleEn", "titleJa") SELECT "bulletsJson", "createdAt", "icon", "id", "order", "priceFrom", "priceLabelEn", "priceLabelJa", "serviceSlug", "titleEn", "titleJa" FROM "PriceItem";
DROP TABLE "PriceItem";
ALTER TABLE "new_PriceItem" RENAME TO "PriceItem";
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
INSERT INTO "new_Service" ("createdAt", "description", "descriptionJa", "feature1DescEn", "feature1DescJa", "feature1Image", "feature1TitleEn", "feature1TitleJa", "feature2DescEn", "feature2DescJa", "feature2Image", "feature2TitleEn", "feature2TitleJa", "featuresJson", "heroDescEn", "heroDescJa", "heroImage", "heroTaglineEn", "heroTaglineJa", "icon", "id", "image", "isPublished", "name", "nameJa", "order", "plansJson", "priceHint", "priceHintJa", "processJson", "slug") SELECT "createdAt", "description", "descriptionJa", "feature1DescEn", "feature1DescJa", "feature1Image", "feature1TitleEn", "feature1TitleJa", "feature2DescEn", "feature2DescJa", "feature2Image", "feature2TitleEn", "feature2TitleJa", "featuresJson", "heroDescEn", "heroDescJa", "heroImage", "heroTaglineEn", "heroTaglineJa", "icon", "id", "image", "isPublished", "name", "nameJa", "order", "plansJson", "priceHint", "priceHintJa", "processJson", "slug" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
