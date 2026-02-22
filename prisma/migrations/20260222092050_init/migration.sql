-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('github', 'credentials');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerAccountId" TEXT,
    "password" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoResult" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "primaryKeywords" TEXT[],
    "secondaryKeywords" TEXT[],
    "ogTitle" TEXT NOT NULL,
    "ogDescription" TEXT NOT NULL,
    "twitterDescription" TEXT NOT NULL,
    "h1Suggestion" TEXT NOT NULL,
    "h2Suggestions" TEXT[],
    "schemaType" TEXT NOT NULL,
    "seoTips" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoResult" ADD CONSTRAINT "SeoResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
