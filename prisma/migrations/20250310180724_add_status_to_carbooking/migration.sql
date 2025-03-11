-- AlterTable
ALTER TABLE `carbooking` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'BOOKED',
    ALTER COLUMN `distanceTraveled` DROP DEFAULT;
