/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invite_code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invite_code` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status",
ADD COLUMN     "invite_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "Project_invite_code_key" ON "Project"("invite_code");
