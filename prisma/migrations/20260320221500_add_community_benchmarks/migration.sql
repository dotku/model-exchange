-- DropIndex
DROP INDEX IF EXISTS "speed_benchmarks_model_name_provider_name_test_date_key";

-- AlterTable
ALTER TABLE "speed_benchmarks" ADD COLUMN IF NOT EXISTS "tested_by" TEXT;
ALTER TABLE "speed_benchmarks" ADD COLUMN IF NOT EXISTS "tested_by_name" TEXT;
ALTER TABLE "speed_benchmarks" ADD COLUMN IF NOT EXISTS "is_published" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "speed_benchmarks" ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'system';

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "speed_benchmarks_model_name_provider_name_test_date_tested__key" ON "speed_benchmarks"("model_name", "provider_name", "test_date", "tested_by");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "speed_benchmarks_is_published_test_date_idx" ON "speed_benchmarks"("is_published", "test_date");
