/*
  Warnings:

  - Added the required column `createdById` to the `FireFighting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `FireFightingAlarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedbackcomplain` ADD COLUMN `createdByTenant` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `firefighting` ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `firefightingalarm` ADD COLUMN `createdById` INTEGER NOT NULL;
