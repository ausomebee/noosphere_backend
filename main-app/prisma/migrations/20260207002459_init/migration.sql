/*
  Warnings:

  - You are about to drop the column `reshedule` on the `clientNotificationSettings` table. All the data in the column will be lost.
  - Added the required column `reschedule` to the `clientNotificationSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientNotificationSettings" DROP COLUMN "reshedule",
ADD COLUMN     "reschedule" BOOLEAN NOT NULL;
