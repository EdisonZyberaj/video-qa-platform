/*
  Warnings:

  - The primary key for the `Survey_Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileId` on the `Survey_Video` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `Survey_Video` table. All the data in the column will be lost.
  - You are about to drop the column `servey_video_id` on the `Survey_Video` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedAt` on the `Survey_Video` table. All the data in the column will be lost.
  - You are about to drop the column `webContentLink` on the `Survey_Video` table. All the data in the column will be lost.
  - You are about to drop the column `webViewLink` on the `Survey_Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey_Video" DROP CONSTRAINT "Survey_Video_pkey",
DROP COLUMN "fileId",
DROP COLUMN "fileName",
DROP COLUMN "servey_video_id",
DROP COLUMN "uploadedAt",
DROP COLUMN "webContentLink",
DROP COLUMN "webViewLink",
ADD COLUMN     "survey_video_id" SERIAL NOT NULL,
ADD CONSTRAINT "Survey_Video_pkey" PRIMARY KEY ("survey_video_id");
