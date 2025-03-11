-- CreateTable
CREATE TABLE `FeedbackComplain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `complain` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `complainNo` VARCHAR(191) NOT NULL,
    `complainBy` VARCHAR(191) NULL,
    `floorNo` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `listServices` VARCHAR(191) NOT NULL,
    `materialReq` VARCHAR(191) NULL,
    `actionTaken` VARCHAR(191) NULL,
    `attendedBy` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `FeedbackComplain_complainNo_key`(`complainNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobSlip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `complainNo` VARCHAR(191) NOT NULL,
    `complainBy` VARCHAR(191) NULL,
    `floorNo` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `inventoryRecieptNo` VARCHAR(191) NULL,
    `location` VARCHAR(191) NOT NULL,
    `complaintDesc` VARCHAR(191) NOT NULL,
    `materialReq` VARCHAR(191) NOT NULL,
    `actionTaken` VARCHAR(191) NOT NULL,
    `attendedBy` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `completed_At` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL,
    `supervisorApproval` BOOLEAN NOT NULL,
    `managementApproval` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `picture` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DutyChart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `supervisor` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `timeIn` DATETIME(3) NOT NULL,
    `timeOut` DATETIME(3) NOT NULL,
    `lunchIn` DATETIME(3) NULL,
    `lunchOut` DATETIME(3) NULL,
    `dutyChartId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantName` VARCHAR(191) NOT NULL,
    `totalAreaSq` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `floor` VARCHAR(191) NOT NULL,
    `occupiedArea` DOUBLE NOT NULL,
    `location` VARCHAR(191) NULL,
    `tenantId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Area_tenantId_fkey`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `occupancy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `totalArea` DOUBLE NOT NULL,
    `rentedArea` DOUBLE NOT NULL,
    `occupancyArea` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Occupancy_tenantId_fkey`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JanitorialAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `supervisor` VARCHAR(191) NOT NULL,
    `totalJanitors` INTEGER NOT NULL,
    `strength` INTEGER NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JanitorAbsence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isAbsent` BOOLEAN NOT NULL,
    `janitorialAttendanceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JanitorialReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `supervisor` VARCHAR(191) NOT NULL,
    `tenant` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubJanReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `floorNo` VARCHAR(191) NULL,
    `toilet` VARCHAR(191) NOT NULL,
    `lobby` VARCHAR(191) NOT NULL,
    `staircase` VARCHAR(191) NOT NULL,
    `janitorialReportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NULL,
    `departmentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleDepartmentPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NULL,
    `permissionId` INTEGER NULL,
    `departmentId` INTEGER NULL,

    UNIQUE INDEX `RoleDepartmentPermission_roleId_permissionId_departmentId_key`(`roleId`, `permissionId`, `departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FCUReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `supervisorApproval` BOOLEAN NOT NULL,
    `engineerApproval` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FloorFC` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `floorFrom` VARCHAR(191) NOT NULL,
    `floorTo` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `verifiedBy` VARCHAR(191) NOT NULL,
    `attendedBy` VARCHAR(191) NOT NULL,
    `fcuReportId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotWaterBoiler` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `StartTime` DATETIME(3) NOT NULL,
    `ShutdownTime` DATETIME(3) NOT NULL,
    `Remarks` VARCHAR(191) NOT NULL,
    `OperatorName` VARCHAR(191) NOT NULL,
    `SupervisorName` VARCHAR(191) NOT NULL,
    `EngineerName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeHour` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boilerId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `HotWaterIn` DOUBLE NOT NULL,
    `HotWaterOut` DOUBLE NOT NULL,
    `ExhaustTemp` DOUBLE NOT NULL,
    `FurnacePressure` DOUBLE NOT NULL,
    `assistantSupervisor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbsorbtionChiller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `StartTime` DATETIME(3) NOT NULL,
    `ShutdownTime` DATETIME(3) NOT NULL,
    `Remarks` VARCHAR(191) NOT NULL,
    `OperatorName` VARCHAR(191) NOT NULL,
    `SupervisorName` VARCHAR(191) NOT NULL,
    `EngineerName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chiller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chillerId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ColdWaterIn` DOUBLE NOT NULL,
    `ColdWaterOut` DOUBLE NOT NULL,
    `ChillingWaterIn` DOUBLE NOT NULL,
    `ChillingWaterOut` DOUBLE NOT NULL,
    `assistantSupervisor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaterManagement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `supervisorName` VARCHAR(191) NOT NULL,
    `operatorName` VARCHAR(191) NOT NULL,
    `engineerName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pump` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `capacity` DOUBLE NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `waterManagementId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PumpCheck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pumpId` INTEGER NOT NULL,
    `waterSealStatus` VARCHAR(191) NOT NULL,
    `pumpBearingStatus` VARCHAR(191) NOT NULL,
    `motorBearingStatus` VARCHAR(191) NOT NULL,
    `rubberCouplingStatus` VARCHAR(191) NOT NULL,
    `pumpImpellerStatus` VARCHAR(191) NOT NULL,
    `mainValvesStatus` VARCHAR(191) NOT NULL,
    `motorWindingStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlumbingProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `plumberName` VARCHAR(191) NOT NULL,
    `supervisorName` VARCHAR(191) NOT NULL,
    `engineerName` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `locationName` VARCHAR(191) NOT NULL,
    `locationFloor` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `plumbingProjectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomName` VARCHAR(191) NOT NULL,
    `locationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlumbingCheck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `washBasin` BOOLEAN NOT NULL DEFAULT false,
    `shower` BOOLEAN NOT NULL DEFAULT false,
    `waterTaps` BOOLEAN NOT NULL DEFAULT false,
    `commode` BOOLEAN NOT NULL DEFAULT false,
    `indianWC` BOOLEAN NOT NULL DEFAULT false,
    `englishWC` BOOLEAN NOT NULL DEFAULT false,
    `waterFlushKit` BOOLEAN NOT NULL DEFAULT false,
    `waterDrain` BOOLEAN NOT NULL DEFAULT false,
    `roomId` INTEGER NOT NULL,

    UNIQUE INDEX `PlumbingCheck_roomId_key`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FireFighting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `firefighterName` VARCHAR(191) NOT NULL,
    `addressableSmokeStatus` BOOLEAN NOT NULL DEFAULT false,
    `fireAlarmingSystemStatus` BOOLEAN NOT NULL DEFAULT false,
    `dieselEnginePumpStatus` BOOLEAN NOT NULL DEFAULT false,
    `wetRisersStatus` BOOLEAN NOT NULL DEFAULT false,
    `hoseReelCabinetsStatus` BOOLEAN NOT NULL DEFAULT false,
    `externalHydrantsStatus` BOOLEAN NOT NULL DEFAULT false,
    `waterStorageTanksStatus` BOOLEAN NOT NULL DEFAULT false,
    `emergencyLightsStatus` BOOLEAN NOT NULL DEFAULT false,
    `remarks` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Generator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `genSetNo` VARCHAR(191) NOT NULL,
    `power` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `engOil` BOOLEAN NOT NULL DEFAULT false,
    `fuelFilter` BOOLEAN NOT NULL DEFAULT false,
    `airFilter` BOOLEAN NOT NULL DEFAULT false,
    `currHrs` INTEGER NOT NULL,
    `currDate` DATETIME(3) NOT NULL,
    `lastHrs` INTEGER NOT NULL,
    `lastDate` DATETIME(3) NOT NULL,
    `electricianName` VARCHAR(191) NOT NULL,
    `supervisorName` VARCHAR(191) NOT NULL,
    `engineerName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneratorFuel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `generatorId` INTEGER NOT NULL,
    `fuelLast` INTEGER NOT NULL,
    `fuelConsumed` INTEGER NOT NULL,
    `fuelReceived` INTEGER NOT NULL,
    `available` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transformers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transformerNo` VARCHAR(191) NOT NULL,
    `lastMaintenance` DATETIME(3) NULL,
    `nextMaintenance` DATETIME(3) NULL,
    `lastDehydration` DATETIME(3) NULL,
    `nextDehydration` DATETIME(3) NULL,
    `engineer` INTEGER NOT NULL,
    `temp` DOUBLE NULL,
    `tempStatus` VARCHAR(191) NULL,
    `HTvoltage` DOUBLE NULL,
    `HTStatus` VARCHAR(191) NULL,
    `LTvoltage` DOUBLE NULL,
    `LTStatus` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FirefightingDuty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `shift` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `securityreport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `observedBy` INTEGER NOT NULL,
    `supervisor` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `timeNoted` DATETIME(3) NOT NULL,
    `timeSolved` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailydutyreport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `shift` VARCHAR(191) NOT NULL,
    `supervisor` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersec` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `timeIn` DATETIME(3) NOT NULL,
    `timeOut` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dailyDutyId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `UserSec_dailyDutyId_fkey`(`dailyDutyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cctvreport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `operationalReport` BOOLEAN NOT NULL,
    `cctvOperator` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `camera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cameraName` VARCHAR(191) NOT NULL,
    `cameraNo` VARCHAR(191) NOT NULL,
    `cameraLocation` VARCHAR(191) NOT NULL,
    `cctvReportId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Camera_cctvReportId_fkey`(`cctvReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdById` INTEGER NOT NULL,
    `altText` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `sentAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `templateText` VARCHAR(191) NOT NULL,
    `isEditable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NotificationTemplate_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserFirefightingDuty` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserFirefightingDuty_AB_unique`(`A`, `B`),
    INDEX `_UserFirefightingDuty_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FeedbackComplain` ADD CONSTRAINT `FeedbackComplain_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobSlip` ADD CONSTRAINT `JobSlip_complainNo_fkey` FOREIGN KEY (`complainNo`) REFERENCES `FeedbackComplain`(`complainNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_dutyChartId_fkey` FOREIGN KEY (`dutyChartId`) REFERENCES `DutyChart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `area` ADD CONSTRAINT `Area_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `occupancy` ADD CONSTRAINT `Occupancy_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JanitorAbsence` ADD CONSTRAINT `JanitorAbsence_janitorialAttendanceId_fkey` FOREIGN KEY (`janitorialAttendanceId`) REFERENCES `JanitorialAttendance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubJanReport` ADD CONSTRAINT `SubJanReport_janitorialReportId_fkey` FOREIGN KEY (`janitorialReportId`) REFERENCES `JanitorialReport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleDepartmentPermission` ADD CONSTRAINT `RoleDepartmentPermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleDepartmentPermission` ADD CONSTRAINT `RoleDepartmentPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleDepartmentPermission` ADD CONSTRAINT `RoleDepartmentPermission_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FloorFC` ADD CONSTRAINT `FloorFC_fcuReportId_fkey` FOREIGN KEY (`fcuReportId`) REFERENCES `FCUReport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeHour` ADD CONSTRAINT `TimeHour_boilerId_fkey` FOREIGN KEY (`boilerId`) REFERENCES `HotWaterBoiler`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chiller` ADD CONSTRAINT `Chiller_chillerId_fkey` FOREIGN KEY (`chillerId`) REFERENCES `AbsorbtionChiller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pump` ADD CONSTRAINT `Pump_waterManagementId_fkey` FOREIGN KEY (`waterManagementId`) REFERENCES `WaterManagement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PumpCheck` ADD CONSTRAINT `PumpCheck_pumpId_fkey` FOREIGN KEY (`pumpId`) REFERENCES `Pump`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_plumbingProjectId_fkey` FOREIGN KEY (`plumbingProjectId`) REFERENCES `PlumbingProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlumbingCheck` ADD CONSTRAINT `PlumbingCheck_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GeneratorFuel` ADD CONSTRAINT `GeneratorFuel_generatorId_fkey` FOREIGN KEY (`generatorId`) REFERENCES `Generator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersec` ADD CONSTRAINT `UserSec_dailyDutyId_fkey` FOREIGN KEY (`dailyDutyId`) REFERENCES `dailydutyreport`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `camera` ADD CONSTRAINT `Camera_cctvReportId_fkey` FOREIGN KEY (`cctvReportId`) REFERENCES `cctvreport`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `NotificationTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFirefightingDuty` ADD CONSTRAINT `_UserFirefightingDuty_A_fkey` FOREIGN KEY (`A`) REFERENCES `FirefightingDuty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFirefightingDuty` ADD CONSTRAINT `_UserFirefightingDuty_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
