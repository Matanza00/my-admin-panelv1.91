/*
  Warnings:

  - You are about to drop the column `dieselEnginePumpStatus` on the `firefighting` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyLightsStatus` on the `firefighting` table. All the data in the column will be lost.
  - You are about to drop the column `externalHydrantsStatus` on the `firefighting` table. All the data in the column will be lost.
  - You are about to drop the column `hoseReelCabinetsStatus` on the `firefighting` table. All the data in the column will be lost.
  - You are about to drop the column `waterStorageTanksStatus` on the `firefighting` table. All the data in the column will be lost.
  - You are about to drop the column `wetRisersStatus` on the `firefighting` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `FireFighting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `firefighting` DROP COLUMN `dieselEnginePumpStatus`,
    DROP COLUMN `emergencyLightsStatus`,
    DROP COLUMN `externalHydrantsStatus`,
    DROP COLUMN `hoseReelCabinetsStatus`,
    DROP COLUMN `waterStorageTanksStatus`,
    DROP COLUMN `wetRisersStatus`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `FireFightingAlarm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `firefighterName` VARCHAR(191) NOT NULL,
    `dieselEnginePumpStatus` BOOLEAN NOT NULL DEFAULT false,
    `wetRisersStatus` BOOLEAN NOT NULL DEFAULT false,
    `hoseReelCabinetsStatus` BOOLEAN NOT NULL DEFAULT false,
    `externalHydrantsStatus` BOOLEAN NOT NULL DEFAULT false,
    `waterStorageTanksStatus` BOOLEAN NOT NULL DEFAULT false,
    `emergencyLightsStatus` BOOLEAN NOT NULL DEFAULT false,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
