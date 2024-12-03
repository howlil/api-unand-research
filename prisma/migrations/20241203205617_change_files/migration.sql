/*
  Warnings:

  - Added the required column `status` to the `Project_Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project_Collaborator" ADD COLUMN     "status" "Status" NOT NULL;
