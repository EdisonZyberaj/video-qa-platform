/*
  Warnings:

  - Added the required column `fileId` to the `Survey_Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Survey_Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webContentLink` to the `Survey_Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webViewLink` to the `Survey_Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey_Video" ADD COLUMN     "fileId" TEXT NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "webContentLink" TEXT NOT NULL,
ADD COLUMN     "webViewLink" TEXT NOT NULL;
