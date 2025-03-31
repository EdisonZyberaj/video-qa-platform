/*
  Warnings:

  - You are about to drop the column `adminNotes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ModerationLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'GUEST';

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userId_fkey";

-- DropIndex
DROP INDEX "User_githubId_key";

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminNotes",
DROP COLUMN "githubId",
DROP COLUMN "googleId",
DROP COLUMN "lastLogin";

-- DropTable
DROP TABLE "ModerationLog";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Response";

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "EntityType";

-- DropEnum
DROP TYPE "ModerationAction";

-- DropEnum
DROP TYPE "QuestionStatus";

-- DropEnum
DROP TYPE "ResponseStatus";

-- DropEnum
DROP TYPE "ResponseType";

-- DropEnum
DROP TYPE "TokenType";

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
