ALTER TABLE "Reaction" DROP CONSTRAINT IF EXISTS "Reaction_commentId_fkey";
ALTER TABLE "Reaction" DROP COLUMN IF EXISTS "commentId";
ALTER TABLE "Reaction" DROP CONSTRAINT IF EXISTS "Reaction_userId_commentId_type_key";
