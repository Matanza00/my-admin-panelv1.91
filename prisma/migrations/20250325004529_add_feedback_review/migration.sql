-- CreateTable
CREATE TABLE `feedbackComplainReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedbackComplainId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comments` VARCHAR(191) NULL,
    `satisfied` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `feedbackComplainReview_feedbackComplainId_key`(`feedbackComplainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedbackComplainReview` ADD CONSTRAINT `feedbackComplainReview_feedbackComplainId_fkey` FOREIGN KEY (`feedbackComplainId`) REFERENCES `FeedbackComplain`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
