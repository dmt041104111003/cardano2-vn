/*
  Warnings:

  - The values [VIDEO] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('IMAGE', 'YOUTUBE');
ALTER TABLE "Media" ALTER COLUMN "type" TYPE "MediaType_new" USING ("type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'ARCHIVED';

-- DropIndex
DROP INDEX "Tag_slug_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "publishedAt",
DROP COLUMN "viewCount",
ADD COLUMN     "comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shares" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "slug";
