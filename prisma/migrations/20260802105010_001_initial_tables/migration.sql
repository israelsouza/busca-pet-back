-- CreateEnum
CREATE TYPE "AUTH_TYPES" AS ENUM ('LOCAL', 'OAUTH');

-- CreateTable
CREATE TABLE "PEOPLE" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PEOPLE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USERS" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "is_ban" BOOLEAN NOT NULL DEFAULT false,
    "photo" TEXT,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AUTH_METHODS" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "AUTH_TYPES" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AUTH_METHODS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LOCAL_AUTHS" (
    "id" UUID NOT NULL,
    "auth_method_id" UUID NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "LOCAL_AUTHS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAUTH_AUTHS" (
    "id" UUID NOT NULL,
    "auth_method_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,

    CONSTRAINT "OAUTH_AUTHS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_person_id_key" ON "USERS"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LOCAL_AUTHS_auth_method_id_key" ON "LOCAL_AUTHS"("auth_method_id");

-- CreateIndex
CREATE UNIQUE INDEX "OAUTH_AUTHS_auth_method_id_key" ON "OAUTH_AUTHS"("auth_method_id");

-- CreateIndex
CREATE UNIQUE INDEX "OAUTH_AUTHS_provider_provider_user_id_key" ON "OAUTH_AUTHS"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "PEOPLE"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AUTH_METHODS" ADD CONSTRAINT "AUTH_METHODS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LOCAL_AUTHS" ADD CONSTRAINT "LOCAL_AUTHS_auth_method_id_fkey" FOREIGN KEY ("auth_method_id") REFERENCES "AUTH_METHODS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAUTH_AUTHS" ADD CONSTRAINT "OAUTH_AUTHS_auth_method_id_fkey" FOREIGN KEY ("auth_method_id") REFERENCES "AUTH_METHODS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "PEOPLE" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "USERS" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AUTH_METHODS" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LOCAL_AUTHS" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OAUTH_AUTHS" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for USERS & PEOPLE
CREATE POLICY "Users can view their own profile" ON "USERS" FOR SELECT USING (id = current_setting('app.current_user_id', true)::uuid);
CREATE POLICY "Users can update their own profile" ON "USERS" FOR UPDATE USING (id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY "People can view their own person data" ON "PEOPLE" FOR SELECT USING (id IN (SELECT person_id FROM "USERS" WHERE id = current_setting('app.current_user_id', true)::uuid));

-- Strict RLS Policies for Authentication Credentials (no direct public access)
CREATE POLICY "Restrict direct public access to local auths" ON "LOCAL_AUTHS" FOR ALL USING (false);
CREATE POLICY "Restrict direct public access to oauth auths" ON "OAUTH_AUTHS" FOR ALL USING (false);
CREATE POLICY "Restrict direct public access to auth methods" ON "AUTH_METHODS" FOR ALL USING (false);

