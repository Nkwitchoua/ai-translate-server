-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "daily_limit_text" INTEGER DEFAULT 200,
    "daily_limit_photos" INTEGER DEFAULT 1,
    "daily_limit_audio" INTEGER DEFAULT 1,
    "price" DECIMAL DEFAULT 0,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_limits" (
    "user_id" BIGINT NOT NULL,
    "used_symbols" DECIMAL NOT NULL DEFAULT 0,
    "used_audio" DECIMAL NOT NULL DEFAULT 0,
    "used_photos" DECIMAL NOT NULL DEFAULT 0,

    CONSTRAINT "user_limits_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "user_id" BIGINT NOT NULL,
    "subscription_id" INTEGER DEFAULT 0,
    "started_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "username" VARCHAR(255),
    "name" VARCHAR(255),
    "language_code" VARCHAR(10),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_code_key" ON "subscriptions"("code");

-- AddForeignKey
ALTER TABLE "user_limits" ADD CONSTRAINT "user_limits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
