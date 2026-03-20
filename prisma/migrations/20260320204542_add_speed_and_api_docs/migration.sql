-- AlterTable
ALTER TABLE "ai_models" ADD COLUMN     "api_docs_url" TEXT,
ADD COLUMN     "speed" TEXT NOT NULL DEFAULT 'standard';
