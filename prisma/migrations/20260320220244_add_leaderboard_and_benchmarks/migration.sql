-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "elo_rating" INTEGER,
    "scraped_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speed_benchmarks" (
    "id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "tokens_per_second" DOUBLE PRECISION NOT NULL,
    "ttft_ms" INTEGER NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speed_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leaderboard_entries_source_category_scraped_at_idx" ON "leaderboard_entries"("source", "category", "scraped_at");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_model_name_source_category_scraped_at_key" ON "leaderboard_entries"("model_name", "source", "category", "scraped_at");

-- CreateIndex
CREATE INDEX "speed_benchmarks_test_date_idx" ON "speed_benchmarks"("test_date");

-- CreateIndex
CREATE UNIQUE INDEX "speed_benchmarks_model_name_provider_name_test_date_key" ON "speed_benchmarks"("model_name", "provider_name", "test_date");
