-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "api_key_id" TEXT,
    "model_name" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL,
    "output_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "ttft_ms" INTEGER,
    "status_code" INTEGER NOT NULL,
    "is_success" BOOLEAN NOT NULL,
    "error_message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'gateway',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_logs_user_id_created_at_idx" ON "usage_logs"("user_id", "created_at");
CREATE INDEX "usage_logs_model_name_created_at_idx" ON "usage_logs"("model_name", "created_at");
CREATE INDEX "usage_logs_provider_name_created_at_idx" ON "usage_logs"("provider_name", "created_at");
CREATE INDEX "usage_logs_created_at_idx" ON "usage_logs"("created_at");
