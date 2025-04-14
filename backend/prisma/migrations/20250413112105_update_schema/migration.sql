/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ASKER', 'RESPONDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'DATA_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'MACHINE_LEARNING', 'CYBERSECURITY', 'CLOUD_COMPUTING', 'DEVOPS', 'DATABASES', 'BLOCKCHAIN', 'HEALTH_AND_MEDICINE', 'MENTAL_HEALTH', 'PHYSICAL_FITNESS', 'NUTRITION', 'BUSINESS', 'ENTREPRENEURSHIP', 'MARKETING', 'FINANCE', 'INVESTING', 'CAREER_ADVICE', 'EDUCATION', 'LANGUAGES', 'MATHEMATICS', 'SCIENCE', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ASTRONOMY', 'ENVIRONMENTAL_SCIENCE', 'HISTORY', 'POLITICS', 'LAW', 'PHILOSOPHY', 'PSYCHOLOGY', 'SOCIOLOGY', 'ARTS_AND_CULTURE', 'MUSIC', 'LITERATURE', 'FILM_AND_TELEVISION', 'GAMING', 'TRAVEL', 'COOKING', 'FASHION', 'RELATIONSHIPS', 'PARENTING', 'HOME_IMPROVEMENT', 'GARDENING', 'PETS', 'AUTOMOTIVE', 'SPORTS', 'DIY_AND_CRAFTS', 'PHOTOGRAPHY');

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "isActive",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Survey" (
    "survey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "answer_Id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_Id")
);

-- CreateTable
CREATE TABLE "Survey_Video" (
    "servey_video_id" INTEGER NOT NULL,
    "question_link" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "uploaderId" INTEGER NOT NULL,

    CONSTRAINT "Survey_Video_pkey" PRIMARY KEY ("servey_video_id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
