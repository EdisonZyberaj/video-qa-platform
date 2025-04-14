/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE answer_answer_id_seq;
ALTER TABLE "Answer" ALTER COLUMN "answer_Id" SET DEFAULT nextval('answer_answer_id_seq');
ALTER SEQUENCE answer_answer_id_seq OWNED BY "Answer"."answer_Id";

-- AlterTable
CREATE SEQUENCE question_question_id_seq;
ALTER TABLE "Question" ALTER COLUMN "question_id" SET DEFAULT nextval('question_question_id_seq');
ALTER SEQUENCE question_question_id_seq OWNED BY "Question"."question_id";

-- AlterTable
CREATE SEQUENCE survey_survey_id_seq;
ALTER TABLE "Survey" ALTER COLUMN "survey_id" SET DEFAULT nextval('survey_survey_id_seq');
ALTER SEQUENCE survey_survey_id_seq OWNED BY "Survey"."survey_id";

-- AlterTable
CREATE SEQUENCE survey_video_servey_video_id_seq;
ALTER TABLE "Survey_Video" ALTER COLUMN "servey_video_id" SET DEFAULT nextval('survey_video_servey_video_id_seq');
ALTER SEQUENCE survey_video_servey_video_id_seq OWNED BY "Survey_Video"."servey_video_id";

-- AlterTable
CREATE SEQUENCE user_user_id_seq;
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT nextval('user_user_id_seq');
ALTER SEQUENCE user_user_id_seq OWNED BY "User"."user_id";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
