-- AlterTable
ALTER TABLE `order` ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending';
