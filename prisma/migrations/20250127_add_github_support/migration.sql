-- Migration to add GitHub support
-- This migration ensures all necessary fields exist for GitHub authentication

-- Check if email column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'email') THEN
        ALTER TABLE "User" ADD COLUMN "email" TEXT;
    END IF;
END $$;

-- Check if provider column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'provider') THEN
        ALTER TABLE "User" ADD COLUMN "provider" TEXT;
    END IF;
END $$;

-- Create index for provider if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'User_provider_idx') THEN
        CREATE INDEX "User_provider_idx" ON "User"("provider");
    END IF;
END $$;

-- Create unique index for email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'User_email_key') THEN
        CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
    END IF;
END $$;

-- Ensure wallet column is nullable for OAuth providers
ALTER TABLE "User" ALTER COLUMN "wallet" DROP NOT NULL;

-- Add comment to provider column to document supported providers
COMMENT ON COLUMN "User"."provider" IS 'Supported providers: "google", "github", "cardano" - All features support these 3 authentication methods'; 