/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Article_title_key";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
