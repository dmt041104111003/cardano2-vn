-- CreateEnum
-- No enums to create

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "slug" TEXT DEFAULT 'temp-slug';

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- Update existing posts to have slug based on title
UPDATE "Post" 
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
) || '-' || SUBSTRING(id, 1, 8);

-- Remove default and make slug NOT NULL after updating existing data
ALTER TABLE "Post" ALTER COLUMN "slug" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL; 