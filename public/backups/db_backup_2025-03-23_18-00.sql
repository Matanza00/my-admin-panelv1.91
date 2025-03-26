-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: fms_v1
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('000ebfcd-5e04-452c-9712-c98784c20e4c','20b3910b78ae4fcfb2dc6ef4d1174550d4ae928e0cb9c0cac008b5a9cdc73ad8','2025-02-25 11:42:11.537','20250225114211_add_locations',NULL,NULL,'2025-02-25 11:42:11.210',1),('352297ef-b792-4a11-a16d-d558e024987f','25bdee37021b24da47d5da9259390d7cdcde3b5f488923733b90bf927463bf9d','2025-03-10 17:39:29.744','20250310173927_add_car_booking',NULL,NULL,'2025-03-10 17:39:27.476',1),('42bfbcd2-c2ba-4e7d-bb74-418deb4600ed','929deb66e217fa66f5acc17b9e80b17e82ff9f2af4b05b0f8d283df97da10940','2025-03-19 00:50:57.589','20250319005055_firefighterissue_feedback_createdby_tenants',NULL,NULL,'2025-03-19 00:50:56.283',1),('4a4d7c6e-3df2-47a1-82db-1011ad5eb87f','1d6ee6b3cd8e22808b3ed2ca49b0c12cecc2bb0d1b7462d94821fa0e5d5a7925','2025-02-05 11:11:56.517','20250205111126_new_schema',NULL,NULL,'2025-02-05 11:11:26.529',1),('811d756b-592c-4161-857a-10a55e29da64','cc15d44769affffe4d64d639d135d95ad5b442dd3ab3b0c382e6a29a1f6d38b7','2025-03-07 01:51:03.193','20250307015101_daily_duty_sec_userid',NULL,NULL,'2025-03-07 01:51:01.770',1),('8df369d9-6f44-4924-aa27-133d451b0541','c4830b9d919179131b6352bbe33e87cfe25b9ce701450379802e5d99ecdd22fb','2025-02-24 10:47:07.028','20250224104705_add_new_fields',NULL,NULL,'2025-02-24 10:47:05.701',1),('8e8db17c-70e2-40a0-bfbd-d8a17b857042','6dfcc014e4e129cf527d03427001a4f4ff26bbd75d7b39c594805968c36030f6','2025-03-14 00:01:48.137','20250314000146_firefightingalarm',NULL,NULL,'2025-03-14 00:01:47.030',1),('9e06bbcf-9618-4ab4-827f-b36686d4693e','89fba231dddcf24c65b3f45ea1d081bf0eb0f20dc0ecc1b01fc99fa01d8bc9d9','2025-03-10 18:07:24.714','20250310180724_add_status_to_carbooking',NULL,NULL,'2025-03-10 18:07:24.487',1),('be351947-b904-48ac-8384-b7a689bbc8f8','96e2458e333f97c6193207369362b82ab4f47c3adff172cfae5929c52b8fdff6','2025-03-06 04:05:27.252','20250306040523_fleet_module',NULL,NULL,'2025-03-06 04:05:23.133',1),('c7ad320c-8b10-4c9e-a91b-ed6da37fced1','4760151492b6a1f1e68b03552d20990b8d94bf239966a13ec2b3610cb30c768b','2025-02-05 22:37:42.051','20250205223741_userid_in_tenants',NULL,NULL,'2025-02-05 22:37:41.761',1),('ce59e969-8bdf-4df8-97d9-d59817cc3052','21a3d1e5e9b345f8dd78db35178bc61cbf21628a9bab5720f8dca8bbb3c9f266','2025-03-12 02:06:04.634','20250312020603_add_attendance_timeout',NULL,NULL,'2025-03-12 02:06:03.658',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_userfirefightingduty`
--

DROP TABLE IF EXISTS `_userfirefightingduty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_userfirefightingduty` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL,
  UNIQUE KEY `_UserFirefightingDuty_AB_unique` (`A`,`B`),
  KEY `_UserFirefightingDuty_B_index` (`B`),
  CONSTRAINT `_UserFirefightingDuty_A_fkey` FOREIGN KEY (`A`) REFERENCES `firefightingduty` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_UserFirefightingDuty_B_fkey` FOREIGN KEY (`B`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_userfirefightingduty`
--

LOCK TABLES `_userfirefightingduty` WRITE;
/*!40000 ALTER TABLE `_userfirefightingduty` DISABLE KEYS */;
INSERT INTO `_userfirefightingduty` VALUES (1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(2,52),(2,53);
/*!40000 ALTER TABLE `_userfirefightingduty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `absorbtionchiller`
--

DROP TABLE IF EXISTS `absorbtionchiller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `absorbtionchiller` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `StartTime` datetime(3) NOT NULL,
  `ShutdownTime` datetime(3) NOT NULL,
  `Remarks` varchar(191) NOT NULL,
  `OperatorName` varchar(191) NOT NULL,
  `SupervisorName` varchar(191) NOT NULL,
  `EngineerName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absorbtionchiller`
--

LOCK TABLES `absorbtionchiller` WRITE;
/*!40000 ALTER TABLE `absorbtionchiller` DISABLE KEYS */;
INSERT INTO `absorbtionchiller` VALUES (1,'2024-12-24 11:30:27.291','2024-12-24 01:30:00.000','2024-12-24 03:30:00.000','Testing SaudiPak GG','KhuramSultan','Khuram Sultan',NULL,'2024-12-24 11:30:27.291','2025-03-13 01:33:17.993'),(2,'2025-02-12 08:17:34.202','2025-02-11 21:00:00.000','2025-02-12 08:00:00.000','Test','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-02-12 08:17:34.202','2025-02-12 08:53:56.877'),(3,'2025-02-12 08:52:41.800','2025-02-10 17:52:00.000','2025-02-11 17:52:00.000','Test','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-02-12 08:52:41.800','2025-02-12 09:34:44.599'),(4,'2025-02-17 06:02:11.868','2025-02-16 20:00:00.000','2025-02-17 08:00:00.000','gg','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-02-17 06:02:11.868','2025-02-17 08:58:35.093'),(5,'2025-02-24 11:35:06.760','2025-02-24 06:34:00.000','2025-02-24 12:40:00.000','DFA Chiller ','Gul Nawaz Khan','Asif Zia Tehsecn',NULL,'2025-02-24 11:35:06.760','2025-02-24 11:48:25.694'),(6,'2025-03-05 05:36:42.760','2025-03-05 22:00:00.000','2025-03-06 05:15:00.000','everything is checked and found ok','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-03-05 05:36:42.760','2025-03-06 04:32:57.337'),(7,'2025-03-10 14:54:30.741','2025-03-10 14:00:00.000','2025-03-10 18:00:00.000','All check . Okay!','3','2',NULL,'2025-03-10 14:54:30.741','2025-03-10 14:54:30.741'),(8,'2025-03-11 04:41:56.800','2025-03-11 04:40:00.000','2025-03-11 10:15:00.000','checked and found ok','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-03-11 04:41:56.800','2025-03-11 04:48:49.897'),(9,'2025-03-12 07:47:39.588','2025-03-12 03:00:00.000','2025-03-12 10:00:00.000','ok','Iftikhaer Ahmed','Asif Zia Tehsecn',NULL,'2025-03-12 07:47:39.588','2025-03-12 07:50:30.812'),(10,'2025-03-13 07:17:39.095','2025-03-13 04:00:00.000','2025-03-13 10:00:00.000','ok','Dahnyal Abbasi','Asif Zia Tehsecn',NULL,'2025-03-13 07:17:39.095','2025-03-14 23:03:26.817'),(11,'2025-03-14 23:43:45.696','2025-03-14 23:43:00.000','2025-03-15 02:43:00.000','Checking Add and Edit both .','3','1',NULL,'2025-03-14 23:43:45.696','2025-03-14 23:43:45.696');
/*!40000 ALTER TABLE `absorbtionchiller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floor` varchar(191) NOT NULL,
  `occupiedArea` double NOT NULL,
  `location` varchar(191) DEFAULT NULL,
  `tenantId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Area_tenantId_fkey` (`tenantId`),
  CONSTRAINT `Area_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES (139,'5th',1523,'A',48,'2025-02-17 10:41:20.557','2025-02-17 10:41:20.557',NULL),(140,'5th',5454,'B+C+Central Area',49,'2025-02-17 10:42:31.894','2025-02-17 10:42:31.894',NULL),(141,'9th',3419,'A1+B+B1',50,'2025-02-17 10:43:33.636','2025-02-17 10:43:33.636',NULL),(142,'9th',4092,'C+C1+D',51,'2025-02-17 10:44:13.324','2025-02-17 10:44:13.324',NULL),(143,'10th',2243,'A1+B',52,'2025-02-17 10:45:06.380','2025-02-17 10:45:06.380',NULL),(144,'11th',1523,'D',53,'2025-02-17 10:45:47.141','2025-02-17 10:45:47.141',NULL),(147,'16th',2569,'B1+C',56,'2025-02-17 10:50:30.901','2025-02-17 10:50:30.901',NULL),(148,'16th',2570,'A1+B',57,'2025-02-17 10:51:02.338','2025-02-17 10:51:02.338',NULL),(149,'Ground-LRA',3500,'East',58,'2025-02-17 10:59:10.508','2025-02-17 10:59:10.508',NULL),(154,'2nd & 3rd',13555,'West+East-LRA',63,'2025-02-17 11:04:42.239','2025-02-17 11:04:42.239',NULL),(155,'2nd',3088,'East-LRA',64,'2025-02-17 11:05:25.675','2025-02-17 11:05:25.675',NULL),(156,'2nd',2267,'East-LRA',65,'2025-02-17 11:05:57.999','2025-02-17 11:05:57.999',NULL),(157,'Ground',3161,'EBC',66,'2025-02-17 11:06:58.279','2025-02-17 11:06:58.279',NULL),(159,'2nd',3046,'A+D',3,'2025-02-18 09:22:03.899','2025-02-18 09:22:03.899',NULL),(160,'2nd',5988,'Al+B+Bl+C+C1',3,'2025-02-18 09:22:04.029','2025-02-18 09:22:04.029',NULL),(161,'3rd',8616,'Complete',3,'2025-02-18 09:22:04.063','2025-02-18 09:22:04.063',NULL),(162,'4th',7511,'',3,'2025-02-18 09:22:04.079','2025-02-18 09:22:04.079',NULL),(163,'4th',1523,'D',3,'2025-02-18 09:22:04.112','2025-02-18 09:22:04.112',NULL),(164,'6th',8505,'Complete',3,'2025-02-18 09:22:04.129','2025-02-18 09:22:04.129',NULL),(165,'7th',9034,'Complete',3,'2025-02-18 09:22:04.154','2025-02-18 09:22:04.154',NULL),(166,'8th',9034,'Complete',3,'2025-02-18 09:22:04.187','2025-02-18 09:22:04.187',NULL),(167,'9th',1523,'A',3,'2025-02-18 09:22:04.220','2025-02-18 09:22:04.220',NULL),(168,'10th',1850,'A+A1/3',3,'2025-02-18 09:22:04.237','2025-02-18 09:22:04.237',NULL),(169,'10th',4942,'B1+C+C1+D',3,'2025-02-18 09:22:04.270','2025-02-18 09:22:04.270',NULL),(170,'11th',1523,'A',3,'2025-02-18 09:22:04.287','2025-02-18 09:22:04.287',NULL),(171,'11th',1721,'B',3,'2025-02-18 09:22:04.304','2025-02-18 09:22:04.304',NULL),(172,'11th',1721,'C',3,'2025-02-18 09:22:04.329','2025-02-18 09:22:04.329',NULL),(173,'12th',8500,'Complete',3,'2025-02-18 09:22:04.363','2025-02-18 09:22:04.363',NULL),(174,'14th',9034,'Complete',3,'2025-02-18 09:22:04.379','2025-02-18 09:22:04.379',NULL),(175,'15th',9034,'Complete',3,'2025-02-18 09:22:04.396','2025-02-18 09:22:04.396',NULL),(177,'Ground',420,'Courtyard',68,'2025-02-18 09:38:28.354','2025-02-18 09:38:28.354',NULL),(178,'1st',3015,'West (LRA) & C (HRA)',68,'2025-02-18 09:38:28.396','2025-02-18 09:38:28.396',NULL),(179,'5th',1523,'D',68,'2025-02-18 09:38:28.446','2025-02-18 09:38:28.446',NULL),(180,'2nd & 3rd',18023,'HRA & LRA',68,'2025-02-18 09:38:28.496','2025-02-18 09:38:28.496',NULL),(181,'13th',9034,'Complete',54,'2025-02-18 09:41:59.355','2025-02-18 09:41:59.355',NULL),(182,'16th',2372,'C1+D',54,'2025-02-18 09:41:59.397','2025-02-18 09:41:59.397',NULL),(187,'16',1523,'Complete+16th (A)',67,'2025-02-19 10:29:44.543','2025-02-19 10:29:44.543',NULL),(188,'17',6488,'Complete+17th (A)',67,'2025-02-19 10:29:44.685','2025-02-19 10:29:44.685',NULL),(189,'18',8500,'18th (A,B,C,D)',67,'2025-02-19 10:29:44.717','2025-02-19 10:29:44.717',NULL),(190,'19',9034,'19th (A,B,C,D)Complete',67,'2025-02-19 10:29:44.759','2025-02-19 10:29:44.759',NULL);
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `designation` varchar(191) NOT NULL,
  `timeIn` datetime(3) NOT NULL,
  `timeOut` datetime(3) DEFAULT NULL,
  `lunchIn` datetime(3) DEFAULT NULL,
  `lunchOut` datetime(3) DEFAULT NULL,
  `dutyChartId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Attendance_dutyChartId_fkey` (`dutyChartId`),
  CONSTRAINT `Attendance_dutyChartId_fkey` FOREIGN KEY (`dutyChartId`) REFERENCES `dutychart` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,'MuhammadAshiq','','2024-12-24 16:01:00.000','2024-12-24 12:00:00.000',NULL,NULL,1,'2024-12-24 10:49:14.793','2024-12-24 10:51:52.001',NULL),(2,'Nazar Rehman','','2025-03-12 01:46:00.000','2025-03-12 01:50:00.000','2025-03-12 01:50:00.000','2025-03-12 01:55:00.000',2,'2025-03-12 01:49:09.642','2025-03-12 01:49:09.642',NULL),(3,'Nazar Rehman','WELDING','2025-03-13 02:57:00.000','2025-03-12 03:54:00.000',NULL,NULL,9,'2025-03-12 02:57:12.111','2025-03-12 04:41:11.064',NULL);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camera`
--

DROP TABLE IF EXISTS `camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `camera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cameraName` varchar(191) NOT NULL,
  `cameraNo` varchar(191) NOT NULL,
  `cameraLocation` varchar(191) NOT NULL,
  `cctvReportId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Camera_cctvReportId_fkey` (`cctvReportId`),
  CONSTRAINT `Camera_cctvReportId_fkey` FOREIGN KEY (`cctvReportId`) REFERENCES `cctvreport` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camera`
--

LOCK TABLES `camera` WRITE;
/*!40000 ALTER TABLE `camera` DISABLE KEYS */;
INSERT INTO `camera` VALUES (1,'DVR 1','Camera-16','Lift Lobby-Basement-LRA',1,'2024-12-23 09:00:01.818','2024-12-23 09:00:01.818',NULL);
/*!40000 ALTER TABLE `camera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plate` varchar(191) NOT NULL,
  `vinNo` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL,
  `make` varchar(191) NOT NULL,
  `model` varchar(191) NOT NULL,
  `year` int(11) NOT NULL,
  `driverId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Car_plate_key` (`plate`),
  UNIQUE KEY `Car_vinNo_key` (`vinNo`),
  UNIQUE KEY `Car_driverId_key` (`driverId`),
  CONSTRAINT `Car_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (5,'ANH:627','ANH:627','ANH:627','ANH:627','ANH:627',627,NULL,'2025-03-10 17:29:08.046','2025-03-11 00:45:53.448'),(6,'AQA:425','AQA:425','AQA:425','AQA:425','AQA:425',425,NULL,'2025-03-10 17:29:08.095','2025-03-10 17:29:08.095'),(7,'IDH:3505','IDH:3505','IDH:3505','IDH:3505','IDH:3505',3505,NULL,'2025-03-10 17:29:08.201','2025-03-10 17:29:08.201'),(8,'BBB:581','BBB:581','BBB:581','BBB:581','BBB:581',581,NULL,'2025-03-10 17:29:08.236','2025-03-10 17:29:08.236'),(9,'IDN:293','IDN:293','IDN:293','IDN:293','IDN:293',293,NULL,'2025-03-10 17:29:08.269','2025-03-10 17:29:08.269'),(10,'KC:407','KC:407','KC:407','KC:407','KC:407',407,NULL,'2025-03-10 17:29:08.303','2025-03-10 17:29:08.303'),(11,'AKA:537','AKA:537','AKA:537','AKA:537','AKA:537',537,NULL,'2025-03-10 17:29:08.346','2025-03-10 17:29:08.346'),(12,'AJX:247','AJX:247','AJX:247','AJX:247','AJX:247',247,NULL,'2025-03-10 17:29:08.505','2025-03-10 17:29:08.505'),(13,'BLR:172','BLR:172','BLR:172','BLR:172','BLR:172',172,NULL,'2025-03-10 17:29:08.536','2025-03-10 17:29:08.536'),(14,'BNP:346','BNP:346','BNP:346','BNP:346','BNP:346',346,NULL,'2025-03-10 17:29:08.555','2025-03-10 17:29:08.555'),(15,'BBD:241','BBD:241','BBD:241','BBD:241','BBD:241',241,NULL,'2025-03-10 17:29:08.595','2025-03-10 17:29:08.595'),(16,'CAJ:513','CAJ:513','CAJ:513','CAJ:513','CAJ:513',513,NULL,'2025-03-10 17:29:08.618','2025-03-10 17:29:08.618'),(17,'BEH:391','BEH:391','BEH:391','BEH:391','BEH:391',391,NULL,'2025-03-10 17:29:08.653','2025-03-10 17:29:08.653');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carbooking`
--

DROP TABLE IF EXISTS `carbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carbooking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carId` int(11) NOT NULL,
  `driverId` int(11) NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) DEFAULT NULL,
  `odometerStart` int(11) NOT NULL,
  `odometerEnd` int(11) DEFAULT NULL,
  `distanceTraveled` int(11),
  `cost` decimal(65,30) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'BOOKED',
  PRIMARY KEY (`id`),
  KEY `CarBooking_carId_fkey` (`carId`),
  KEY `CarBooking_driverId_fkey` (`driverId`),
  CONSTRAINT `CarBooking_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `CarBooking_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carbooking`
--

LOCK TABLES `carbooking` WRITE;
/*!40000 ALTER TABLE `carbooking` DISABLE KEYS */;
INSERT INTO `carbooking` VALUES (1,5,2,'2025-03-10 17:44:00.000','2025-03-10 18:01:00.000',100,120,20,550.000000000000000000000000000000,'2025-03-10 17:45:02.530','2025-03-10 18:42:08.187','COMPLETED'),(2,6,2,'2025-03-10 18:42:00.000','2025-03-10 18:59:00.000',100,106,6,120.000000000000000000000000000000,'2025-03-10 18:42:31.646','2025-03-10 18:42:54.788','COMPLETED'),(3,17,2,'2025-03-11 04:08:00.000',NULL,100,NULL,NULL,NULL,'2025-03-11 04:08:13.187','2025-03-11 04:08:13.187','BOOKED'),(4,6,2,'2025-03-11 04:09:00.000',NULL,120,NULL,NULL,NULL,'2025-03-11 04:09:49.778','2025-03-11 04:09:49.778','BOOKED'),(5,16,2,'2025-03-11 04:09:00.000',NULL,125,NULL,NULL,NULL,'2025-03-11 04:10:01.683','2025-03-11 04:10:01.683','BOOKED'),(6,17,1,'2025-03-02 05:15:00.000','2025-03-03 06:15:00.000',80,98,18,580.000000000000000000000000000000,'2025-03-11 05:15:21.733','2025-03-11 05:16:06.143','COMPLETED');
/*!40000 ALTER TABLE `carbooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cctvreport`
--

DROP TABLE IF EXISTS `cctvreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cctvreport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `time` datetime(3) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `operationalReport` tinyint(1) NOT NULL,
  `cctvOperator` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cctvreport`
--

LOCK TABLES `cctvreport` WRITE;
/*!40000 ALTER TABLE `cctvreport` DISABLE KEYS */;
INSERT INTO `cctvreport` VALUES (1,'2024-12-22 00:00:00.000','2024-12-22 08:59:00.000','Test remarks',1,16,'2024-12-23 09:00:01.818','2024-12-23 09:00:01.818',NULL);
/*!40000 ALTER TABLE `cctvreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chiller`
--

DROP TABLE IF EXISTS `chiller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chiller` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chillerId` int(11) NOT NULL,
  `time` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `ColdWaterIn` double NOT NULL,
  `ColdWaterOut` double NOT NULL,
  `ChillingWaterIn` double NOT NULL,
  `ChillingWaterOut` double NOT NULL,
  `assistantSupervisor` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `HeatIn` double DEFAULT NULL,
  `HeatOut` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Chiller_chillerId_fkey` (`chillerId`),
  CONSTRAINT `Chiller_chillerId_fkey` FOREIGN KEY (`chillerId`) REFERENCES `absorbtionchiller` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chiller`
--

LOCK TABLES `chiller` WRITE;
/*!40000 ALTER TABLE `chiller` DISABLE KEYS */;
INSERT INTO `chiller` VALUES (12,2,'2025-02-12 03:17:00.000',100,105,105,107,'Asif ','2025-02-12 08:53:56.967','2025-02-12 08:53:56.967',NULL,NULL),(13,2,'2025-02-12 03:17:00.000',100,105,105,107,'Asif ','2025-02-12 08:53:56.967','2025-02-12 08:53:56.967',NULL,NULL),(14,2,'2025-02-12 16:53:00.000',100,100,100,100,'Asif','2025-02-12 08:53:56.967','2025-02-12 08:53:56.967',NULL,NULL),(15,3,'2025-02-12 17:52:00.000',1,2,1,1,'Asif','2025-02-12 09:34:44.773','2025-02-12 09:34:44.773',NULL,NULL),(16,3,'2025-02-12 06:53:00.000',2,2,2,2,'Asif','2025-02-12 09:34:44.773','2025-02-12 09:34:44.773',NULL,NULL),(19,4,'2025-02-17 01:02:00.000',97,103,97,104,'Asif ','2025-02-17 08:58:35.347','2025-02-17 08:58:35.347',NULL,NULL),(20,4,'2025-02-17 01:02:00.000',103,100,105,107,'Asif ','2025-02-17 08:58:35.347','2025-02-17 08:58:35.347',NULL,NULL),(22,5,'2025-02-24 06:35:00.000',1,1,55,51,'Asif','2025-02-24 11:48:25.855','2025-02-24 11:48:25.855',110,150),(70,6,'2025-03-06 15:54:00.000',0,0,0,0,'Asif','2025-03-06 04:32:57.436','2025-03-06 04:32:57.436',97,103),(71,6,'2025-03-06 04:30:00.000',0,0,0,0,'Asif ','2025-03-06 04:32:57.436','2025-03-06 04:32:57.436',97,103),(72,6,'2025-03-06 05:00:00.000',0,0,0,0,'Asif ','2025-03-06 04:32:57.436','2025-03-06 04:32:57.436',98,104),(73,6,'2025-03-06 06:00:00.000',0,0,0,0,'Asif ','2025-03-06 04:32:57.436','2025-03-06 04:32:57.436',98,104),(74,6,'2025-03-06 07:00:00.000',0,0,0,0,'Asif ','2025-03-06 04:32:57.436','2025-03-06 04:32:57.436',98,103),(75,7,'2025-03-10 14:54:30.741',0,0,0,0,'Test!','2025-03-10 14:54:30.741','2025-03-10 14:54:30.741',0,0),(81,8,'2025-03-11 04:41:00.000',0,0,0,0,'Asif ','2025-03-11 04:48:49.981','2025-03-11 04:48:49.981',97,104),(82,8,'2025-03-11 04:41:00.000',0,0,0,0,'Asif ','2025-03-11 04:48:49.981','2025-03-11 04:48:49.981',98,103),(83,8,'2025-03-11 05:00:00.000',0,0,0,0,'Asif ','2025-03-11 04:48:49.981','2025-03-11 04:48:49.981',98,104),(84,8,'2025-03-11 06:00:00.000',0,0,0,0,'Asif ','2025-03-11 04:48:49.981','2025-03-11 04:48:49.981',100,5),(90,9,'2025-03-12 07:00:00.000',0,0,0,0,'Asif ','2025-03-12 07:50:30.897','2025-03-12 07:50:30.897',97,100),(91,9,'2025-03-12 08:00:00.000',0,0,0,0,'Asif ','2025-03-12 07:50:30.897','2025-03-12 07:50:30.897',98,101),(92,9,'2025-03-12 17:05:00.000',0,0,0,0,'Asif ','2025-03-12 07:50:30.897','2025-03-12 07:50:30.897',97,102),(93,1,'2025-03-13 01:30:00.000',1,2,3,4,'Test','2025-03-13 01:33:18.072','2025-03-13 01:33:18.072',120,120),(94,1,'2025-03-13 02:31:00.000',2,3,4,5,'Test','2025-03-13 01:33:18.072','2025-03-13 01:33:18.072',122,122),(103,10,'2025-03-15 07:08:00.000',4,4,4,7,'Asif','2025-03-14 23:03:26.912','2025-03-14 23:03:26.912',7,7),(104,10,'2025-03-15 14:17:00.000',0,0,0,0,'','2025-03-14 23:03:26.912','2025-03-14 23:03:26.912',0,0),(105,10,'2025-03-15 07:18:00.000',2,2,5,5,'Asif','2025-03-14 23:03:26.912','2025-03-14 23:03:26.912',5,0),(106,10,'2025-03-14 23:03:00.000',2,2,2,5,'Asif','2025-03-14 23:03:26.912','2025-03-14 23:03:26.912',22,55),(107,11,'2025-03-14 23:43:45.696',1,1,55,51,'Asif','2025-03-14 23:43:45.696','2025-03-14 23:43:45.696',120,160);
/*!40000 ALTER TABLE `chiller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailydutyreport`
--

DROP TABLE IF EXISTS `dailydutyreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dailydutyreport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `shift` varchar(191) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailydutyreport`
--

LOCK TABLES `dailydutyreport` WRITE;
/*!40000 ALTER TABLE `dailydutyreport` DISABLE KEYS */;
INSERT INTO `dailydutyreport` VALUES (1,'2024-12-22 00:00:00.000','Morning',23,'2024-12-23 09:09:11.724','2025-03-07 02:14:17.776',NULL),(2,'2025-03-07 00:00:00.000','Morning',48,'2025-03-07 03:07:15.514','2025-03-14 02:31:38.771',NULL);
/*!40000 ALTER TABLE `dailydutyreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Department_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (30,'HVAC','HVAC'),(31,'Janitorial','JAN'),(32,'Security','SEC'),(33,'x-ray m','XRAY'),(34,'FireFighting','FF'),(35,'FireFightingAlarm','FFA'),(36,'CCTV','CCTV'),(37,'Lady Searcher','SRCH'),(38,'AMS','AMS'),(39,'Data Operator','DATA'),(40,'Security GUARD','GRD'),(41,'Building','BLD'),(42,'ELECTRICAL','ELC'),(43,'LIFTS','LIFT'),(44,'PLUMBING','PLU'),(45,'CARPENTER','CRP'),(46,'PAINTER','PNT'),(47,'MASON','MSN'),(48,'WELDING','WLD'),(49,'HOIST OPERATOR','HTO'),(50,'THIRD PARTY','3rd'),(51,'MISCELLANEOUS','MSC'),(52,'Administration','ADM'),(53,'Management','MNG'),(54,'Operations','OPS'),(55,'Technical','TEC'),(56,'bookkeeper',NULL),(57,'FireFighter','FF-A');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `age` int(11) NOT NULL,
  `department` varchar(191) NOT NULL,
  `phoneNo` varchar(191) NOT NULL,
  `cnic` varchar(191) NOT NULL,
  `emergencyContact` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Driver_phoneNo_key` (`phoneNo`),
  UNIQUE KEY `Driver_cnic_key` (`cnic`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES (1,'Usman Nadeem',24,'IT - Software','03032743621','4210186400999','03032743621','2025-03-06 04:53:12.324','2025-03-06 04:59:38.592'),(2,'Usman Test',25,'IT - Software','03032743622','4210186400998','03032743622','2025-03-08 01:47:02.699','2025-03-08 01:47:02.699');
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dutychart`
--

DROP TABLE IF EXISTS `dutychart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dutychart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `supervisor` varchar(191) NOT NULL,
  `remarks` varchar(191) NOT NULL,
  `picture` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dutychart`
--

LOCK TABLES `dutychart` WRITE;
/*!40000 ALTER TABLE `dutychart` DISABLE KEYS */;
INSERT INTO `dutychart` VALUES (1,'2024-12-24 07:01:00.000','MushtaqAhmedChishti','Testing Duty Chart',NULL,'2024-12-24 10:49:14.793','2024-12-24 10:51:51.841',NULL),(2,'2025-03-12 01:39:00.000','103','Test by Usman','/uploads/image-1741744149510.jpg','2025-03-12 01:49:09.642','2025-03-12 01:49:09.642',NULL),(3,'2025-03-12 02:16:00.000','103','Test By Usman',NULL,'2025-03-12 02:16:50.568','2025-03-12 02:16:50.568',NULL),(4,'2025-03-12 02:18:00.000','104','Test By Usman',NULL,'2025-03-12 02:19:11.100','2025-03-12 02:19:11.100',NULL),(5,'2025-03-12 02:40:00.000','103','Test By Usman Last time','/uploads/image-1741747244962.jpg','2025-03-12 02:40:45.095','2025-03-12 02:40:45.095',NULL),(6,'2025-03-12 02:41:00.000','103','Test by Usman designation',NULL,'2025-03-12 02:41:52.369','2025-03-12 02:41:52.369',NULL),(7,'2025-03-05 02:47:00.000','103','department',NULL,'2025-03-12 02:49:12.515','2025-03-12 02:49:12.515',NULL),(8,'2025-03-12 02:50:00.000','12','department 2',NULL,'2025-03-12 02:52:27.986','2025-03-12 04:49:28.710',NULL),(9,'2025-03-12 02:56:00.000','103','name',NULL,'2025-03-12 02:57:12.111','2025-03-12 04:41:11.011',NULL);
/*!40000 ALTER TABLE `dutychart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fcureport`
--

DROP TABLE IF EXISTS `fcureport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fcureport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `remarks` varchar(191) NOT NULL,
  `supervisorApproval` tinyint(1) NOT NULL,
  `engineerApproval` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fcureport`
--

LOCK TABLES `fcureport` WRITE;
/*!40000 ALTER TABLE `fcureport` DISABLE KEYS */;
INSERT INTO `fcureport` VALUES (1,'2024-12-23 09:09:53.999','Testing',1,1),(2,'2024-12-24 11:24:33.651','Test',1,1),(3,'2025-03-06 04:57:39.420','checked and found ok',1,1),(4,'2025-03-11 04:50:14.397','',1,1),(5,'2025-03-12 14:22:24.487','3rd month of calendar ',0,0),(6,'2025-03-13 02:42:10.401','Test By usman for floors addition . Ground floor + 18,19. Updated Checked.',1,1),(7,'2025-03-13 07:08:41.551','abc',1,1),(8,'2025-03-13 18:21:14.239','Testing supervisor',1,1);
/*!40000 ALTER TABLE `fcureport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbackcomplain`
--

DROP TABLE IF EXISTS `feedbackcomplain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedbackcomplain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complain` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `complainNo` varchar(191) NOT NULL,
  `complainBy` varchar(191) DEFAULT NULL,
  `floorNo` varchar(191) NOT NULL,
  `area` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `listServices` varchar(191) NOT NULL,
  `materialReq` varchar(191) DEFAULT NULL,
  `actionTaken` varchar(191) DEFAULT NULL,
  `attendedBy` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `tenantId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `locations` varchar(191) DEFAULT NULL,
  `createdByTenant` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FeedbackComplain_complainNo_key` (`complainNo`),
  KEY `FeedbackComplain_tenantId_fkey` (`tenantId`),
  CONSTRAINT `FeedbackComplain_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbackcomplain`
--

LOCK TABLES `feedbackcomplain` WRITE;
/*!40000 ALTER TABLE `feedbackcomplain` DISABLE KEYS */;
INSERT INTO `feedbackcomplain` VALUES (18,'Faulty Door sensor','2025-02-18 00:00:00.000','CMP-1739853128872','','Ground Floor','HRA','A','Lift Operations','(01) Door Sensor (01) Insulation Tap (01) cable Tie 12\'','Acknowledge','Anees Ahmed','Faulty Door SEnsor','In Progress',67,'2025-02-18 04:32:08.882','2025-02-18 04:34:01.901',NULL,NULL,0),(19,'Faulty Seat  cover','2025-02-18 00:00:00.000','CMP-1739859019049','','18th','HRA','D','Plumbing Services','(01) Seat cover','Acknowledge','Anees Ahmed','Faulty Seat cover','In Progress',67,'2025-02-18 06:10:19.057','2025-02-18 06:11:57.178',NULL,NULL,0),(20,'Faulty Led light','2025-02-18 00:00:00.000','CMP-1739859455920','','9th','HRA','','Electric Services','(03) led Light 12w (01) Led 10w ','Acknowledge','Anees Ahmed','Faulty led light','In Progress',50,'2025-02-18 06:17:35.929','2025-02-18 06:19:48.832',NULL,NULL,0),(21,'Faulty Led light 123','2025-02-20 00:00:00.000','CMP-1740046003654','','Ground Floor','HRA','A','Electric Services','(02) LED light 36w','Acknowledge','Anees Ahmed','Faulty 123','In Progress',67,'2025-02-20 10:06:43.696','2025-02-20 12:07:45.290',NULL,NULL,0),(22,'Faulty multi  socket ','2025-02-20 00:00:00.000','CMP-1740046348253','','Ground Floor','HRA','','Electric Services','(01) multi socket','Acknowledge','Anees Ahmed','Faulti','In Progress',67,'2025-02-20 10:12:28.257','2025-02-20 10:15:25.085',NULL,NULL,0),(23,'Faulty Multi socket ','2025-02-20 00:00:00.000','CMP-1740046756861','','Ground Floor','LRA','A','Electric Services','(01) Led Light 10w 2x2 (01) Tube Rod 18w 2x2 (01) starter','Acknowledge','Anees Ahmed','','In Progress',67,'2025-02-20 10:19:16.872','2025-02-20 10:23:34.242',NULL,NULL,0),(25,'DUCT ','2025-02-21 00:00:00.000','CMP-1740112556398','','Ground Floor','HRA','','Electric Services','(01) Duct 16x16','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-02-21 04:35:56.410','2025-02-21 04:37:35.322',NULL,NULL,0),(26,'Faulty Bottle Trap and Basin waste','2025-02-21 00:00:00.000','CMP-1740118449698','','Ground Floor','HRA','','Plumbing Services','(01) Basin Waste (01) Bottle Trap ','Acknowledge','Anees Ahmed','Faulty Basin trap','In Progress',67,'2025-02-21 06:14:09.712','2025-02-21 06:16:13.598',NULL,NULL,0),(27,'Faulty Led Light','2025-02-25 00:00:00.000','CMP-1740462980392','','19th','HRA','','Electric Services','(05) Led Light 36w ','Acknowledge','Anees Ahmed','Faulty led light','In Progress',67,'2025-02-25 05:56:20.400','2025-02-25 05:57:11.940',NULL,NULL,0),(28,'Faulty Led light','2025-02-25 00:00:00.000','CMP-1740463156432','','18th','HRA','D','Electric Services','(02) LED light 36w','Acknowledge','Anees Ahmed','FAULTY LED LIGHT','In Progress',67,'2025-02-25 05:59:16.440','2025-02-25 06:01:31.886',NULL,NULL,0),(29,'White wash','2025-02-25 00:00:00.000','CMP-1740468892429','','','LRA','','Painting Services','(01) GLN Off White Plastic Emulsion (01) GLN Matt Enamel (01) wheater sheet sand stone','Acknowledged, updated','Anees Ahmed','','In Progress',67,'2025-02-25 07:34:52.435','2025-03-07 06:29:06.918',NULL,'Testing locations',0),(30,'Paint','2025-02-26 00:00:00.000','CMP-1740546416378','','9th','HRA','C','Painting Services','(01) Bucket White Emulsion','Acknowledge','Anees Ahmed','','In Progress',67,'2025-02-26 05:06:56.382','2025-03-07 06:25:53.038',NULL,'C Tower ',0),(31,'Table paint','2025-03-06 00:00:00.000','CMP-1741240871868','','Basement','HRA','','Painting Services','(01) GLN Golden Brown','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-06 06:01:11.883','2025-03-07 00:44:09.483',NULL,'Janitorial  Room',0),(32,'New Installation ','2025-03-07 00:00:00.000','CMP-1741327817663','','19th','HRA','D','HVAC Services','(01) Split Ac Dawlance 1.5 ton (02) Insulation Tap (01) pin shoo 10Amp (01pkt) rawal plug','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-07 06:10:17.668','2025-03-07 06:21:01.708',NULL,NULL,0),(33,'Faulty Toilet Shower','2025-03-07 00:00:00.000','CMP-1741328629901','','4th','HRA','A','Plumbing Services','(01) Toilet Shower with pipe','Acknowledge','Anees Ahmed','','In Progress',3,'2025-03-07 06:23:49.904','2025-03-07 06:25:07.088',NULL,NULL,0),(34,'Faulty Widow Repair','2025-03-07 00:00:00.000','CMP-1741329260437','','7th','HRA','','Mason Services','(03) Sikaflex','Acknowledge','Anees Ahmed','','In Progress',3,'2025-03-07 06:34:20.445','2025-03-07 06:36:19.673',NULL,NULL,0),(35,'Faulty Muslim Shower ','2025-03-10 00:00:00.000','CMP-1741581735050','','17th','HRA','D','Plumbing Services','(01) Muslim Shower With Pipe','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-10 04:42:15.055','2025-03-10 04:45:02.878',NULL,NULL,0),(36,'Faulty Head Spindle And Muslim shower With Pipe','2025-03-10 00:00:00.000','CMP-1741582157209','','2nd','HRA','D','Plumbing Services','(02) Faulty Head Spindle (01) Muslim Shower With Pipe','Acknowledge','Anees Ahmed','','In Progress',3,'2025-03-10 04:49:17.216','2025-03-10 04:51:06.001',NULL,NULL,0),(37,'Relocation of power Connection And cable Duct for Installation Of New Ac At CFO Room','2025-03-10 00:00:00.000','CMP-1741587963067','','19th','HRA','D','Electric Services','(40MTR) Cable 1.5mm (10MTR) Cat 6 cable (02) Insulation Tap (04) Rawal PLug (02) Duct 16x38 (02) PKT Cable tie 18\"','Acknowledge','Anees Ahmed','Work Done','In Progress',67,'2025-03-10 06:26:03.075','2025-03-10 09:22:48.552',NULL,NULL,0),(38,'White wash','2025-03-11 00:00:00.000','CMP-1741675101148','','9th','HRA','D','Painting Services','(01) Bucket Ash white Emulsion Berger','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-11 06:38:21.152','2025-03-12 01:38:18.946',NULL,NULL,0),(42,'Faulty Led Light','2025-03-12 00:00:00.000','CMP-1741756452127','','Ground Floor','HRA','D','Electric Services','(03) 12w Led Light ','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-12 05:14:12.139','2025-03-12 05:19:12.415',NULL,NULL,0),(43,'Faulty Multi Socket ','2025-03-12 00:00:00.000','CMP-1741759253417','','Ground Floor','HRA','A','Electric Services','(01) Multi socket with Box (03) MTR Cable 1.5mm','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-12 06:00:53.425','2025-03-14 05:26:16.935',NULL,'Scissor Gate Courtyard area',0),(44,'The plumbing water supply pump is currently faulty and requires extensive repair, including shaft polishing, resurfacing of side plates, bearing hub, and lathe machining; replacement of flang','2025-03-12 00:00:00.000','CMP-1741769668076','','Basement','HRA','D','Plumbing Services','Repairing of Pump. * Shaft polish, side plates, bearing hb, layth & sizing. * Flange bush and dories * Replacement of bearings * Bush and seals replacement. * Replacemment of Pump oil. * Repl','03 quotations are sought as in house repair is not possible.','Amjad Khalil Abid','','Pending',67,'2025-03-12 08:54:28.082','2025-03-12 08:54:28.082',NULL,NULL,0),(45,'LRA X-Ray baggage scanning machine is faulty','2025-03-12 00:00:00.000','CMP-1741770704087','','Ground Floor','LRA','A','Security Services','LOW VOLTAGE POWER SUPPLY, LCD, MAIN ELECTRONIC CARD, COMPLETE SERVICES AND KEYPAD REPAIRE','03 quotations are sought and PDAC approval will be sought.','Amjad Khalil Abid','In house repair is not possible.','Pending',67,'2025-03-12 09:11:44.098','2025-03-12 09:11:44.098',NULL,NULL,0),(46,'Relocation of Ups From CCTV to ATM  cabin','2025-03-12 00:00:00.000','CMP-1741771057111','','Ground Floor','HRA','C','Electric Services','(10)MTR cable 2.5mm 3core (01) power plug with Box (01) 3 pin shoo 15 Amp (02) Duct 16x38 (10) MTR Cale 1.5mm 3 core (01) BOx screw 1.5x8 (01) PKT rawal plug','Acknowledge','Anees Ahmed','','Pending',67,'2025-03-12 09:17:37.119','2025-03-12 09:43:56.866',NULL,'ATM Cabin',0),(50,'New Installation for LED','2025-03-14 00:00:00.000','CMP-1741928533460','','19th','HRA','D','Electric Services','(01) Multi Socket 13Amp  With Box  (06) MTR 1.5mm Cable (01) Shoo 3 pin 5 amp (01) Insulation  Tap','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-03-14 05:02:13.465','2025-03-15 01:34:19.574',NULL,'Finance Division (CFO Room)',0),(51,'Hack saw Blade','2025-03-14 00:00:00.000','CMP-1741928937192','','19th','HRA','B','Electric Services','(02) Hack saw Blade','Acknowledge','Anees Ahmed','Faulty ','In Progress',67,'2025-03-14 05:08:57.196','2025-03-14 07:24:54.880',NULL,'19th floor',0),(52,' Installation of Multi socket for Diesel pump ','2025-03-14 00:00:00.000','CMP-1741929541712','','Rooftop','HRA','B','Electric Services','(02) Multi Socket with Box','Acknowledge','Anees Ahmed','Faulty ','In Progress',67,'2025-03-14 05:19:01.718','2025-03-14 05:20:10.970',NULL,'LRA Roof Top ',0),(53,'Testing Tenant complain as Huawei','2025-03-01 00:00:00.000','CMP-1741936999818','','Basement','LRA','','Overall Services','Wire Needed','Test','Ma Xue Li','Testing','Pending',3,'2025-03-14 07:23:19.827','2025-03-14 07:23:19.827',NULL,'Supervisor Testing',0),(54,'Declined by Admin/Supervisor','2025-03-23 01:28:09.137','CMP-1742007692770','','undefined','','','','','','Anees Ahmed','Declined from dashboard','DECLINE',3,'2025-03-15 03:01:32.779','2025-03-23 01:44:09.179',NULL,'',1),(55,'Faulty Contractor','2025-03-17 00:00:00.000','CMP-1742189987303','','Rooftop','LRA','C1','Lift Operations','(01) Contractor','Acknowledge','Anees Ahmed','Faulty','In Progress',67,'2025-03-17 05:39:47.316','2025-03-17 05:42:41.017',NULL,'Machine Room LRA ',0),(56,'White Wash','2025-03-17 00:00:00.000','CMP-1742192146817','','9th','HRA','C','Painting Services','(01) White Bucket Emulsion Berger ','Acknowledge','Anees Ahmed','white Wash','In Progress',67,'2025-03-17 06:15:46.821','2025-03-17 06:16:50.807',NULL,' 9th floor C Block',0),(57,'Replaced Led Lights ','2025-03-17 00:00:00.000','CMP-1742203974101','','18th','HRA','B','Electric Services','(02) Led ceiling Light 12w  (02) Surface Mount Light 18w','Acknowledge','Anees Ahmed','Replaced','In Progress',67,'2025-03-17 09:32:54.122','2025-03-17 09:34:23.207',NULL,'Photocopier Room',0),(58,'Faulty Multi Plug 13Amp ','2025-03-18 00:00:00.000','CMP-1742275610406','','Ground Floor','HRA','B','Electric Services','(01) Multi socket 13Amp','Acknowledge','Anees Ahmed','Faulty','In Progress',67,'2025-03-18 05:26:50.415','2025-03-18 05:30:14.566',NULL,'Security Room ',0),(59,'Installation of new printer ','2025-03-18 00:00:00.000','CMP-1742276332435','','17th','HRA','B','Electric Services','(02) PVC duct 16/38 (01) Screw 3/4x6 (32) MTR CAt 6 cable','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-03-18 05:38:52.454','2025-03-20 04:52:54.716',NULL,'17th Floor (GSBD)',0),(60,' For Installation of New Lights','2025-03-18 00:00:00.000','CMP-1742277148071','','Ground Floor','HRA','B','Electric Services','(20) MTR Cable 1.5mm  (02) Connector Strip 15Amp (01) Insulation Tap','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-03-18 05:52:28.080','2025-03-18 05:54:43.800',NULL,'Ground floor lobby',0),(61,'Tenant Huawei ','2025-03-19 00:00:00.000','CMP-1742347230076','','undefined','LRA','D','Overall Services','Testing','Test','Ma Xue Li','Declined from dashboard','DECLINE',3,'2025-03-19 01:20:30.089','2025-03-23 01:45:05.733',NULL,'Testing locations',1),(62,'Testing Notification for Anees','2025-03-19 00:00:00.000','CMP-1742362156398','','Rooftop','LRA','D','Overall Services','Testing','Test plum','Anees Ahmed','test','Pending',3,'2025-03-19 05:29:16.450','2025-03-19 05:29:16.450',NULL,'Testing locations',0),(63,'Making New Extension Bord','2025-03-19 00:00:00.000','CMP-1742369504810','','Basement','HRA','C','HVAC Services','(08) MTR Cable 1.5mm 3 core (02) Insulation Tap (02) 3Pin shoo 10 Amp (02) Multi Socket','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-03-19 07:31:44.835','2025-03-19 07:34:58.040',NULL,'Plant Room',0),(64,'To Improve Lighting ','2025-03-19 00:00:00.000','CMP-1742370687616','','Basement','HRA','','HVAC Services','(01) Energy Saver 23w (02) Bulb Screw 60w','Acknowledge','Anees Ahmed','New Installation','In Progress',67,'2025-03-19 07:51:27.631','2025-03-19 07:52:45.332',NULL,'Plant Room',0),(65,'Faulty led lights','2025-03-19 00:00:00.000','CMP-1742370899116','','18th','HRA','','Electric Services','(03) 36W LED Lights','Acknowledge','Anees Ahmed','Faulty','In Progress',67,'2025-03-19 07:54:59.124','2025-03-19 07:55:59.134',NULL,'Audit Division',0),(66,'Faulty led light','2025-03-19 00:00:00.000','CMP-1742371075285','','Ground Floor','HRA','A1','Electric Services','(01) 36w Led light ','Acknowledge','Anees Ahmed','Faulty ','In Progress',67,'2025-03-19 07:57:55.300','2025-03-19 07:58:41.323',NULL,'Masque',0),(67,'Faulty led Lights ','2025-03-19 00:00:00.000','CMP-1742371290919','','Ground Floor','LRA','A','Electric Services','(03) 10w led light','Acknowledge','Anees Ahmed','Faulty ','In Progress',67,'2025-03-19 08:01:30.929','2025-03-19 08:02:36.763',NULL,'LRA Ground Floor Handicap washroom',0),(68,'Faulty Ball Valve 1\",  Ball valve 3/4 ,Ball valve 1/2','2025-03-20 00:00:00.000','CMP-1742445539119','','Basement','HRA','','Plumbing Services','(01) Ball Valve 1\"  (01) Ball Valve 3/4 (01) Ball Valve 1/2','Acknowledge','Anees Ahmed','','In Progress',67,'2025-03-20 04:38:59.132','2025-03-20 04:39:58.660',NULL,'Plant Room , Parking area ',0),(69,'Faulty Camera ','2025-03-20 00:00:00.000','CMP-1742446248451','','Ground Floor','LRA','A','CCTV Services','(01) Camera  4mp IP Bullet (04) BNC (02) Insulation Tap (01) Clump Too (10) Rj 45  Connector ','Acknowledge','Anees Ahmed','Faulty ','In Progress',67,'2025-03-20 04:50:48.465','2025-03-20 04:51:30.805',NULL,'LRA IN Gate',0),(70,'Making New Extension Bord','2025-03-20 00:00:00.000','CMP-1742448795119','','18th','HRA','B','Electric Services','(03) Multi socket 13 Amp with Box (03) MTR cable 1.5mm (01) 3 pin shoo 15 amp (01) Insulation Tap','Acknowledge','Anees Ahmed','New Extension','In Progress',67,'2025-03-20 05:33:15.125','2025-03-20 05:35:17.695',NULL,'CFD Division ',0),(71,'Faulty Multi Socket ','2025-03-20 00:00:00.000','CMP-1742465282154','','19th','HRA','D','Electric Services','(02) Multi Socket with BOx','Acknowledge','Anees Ahmed','Faulty ','Pending',67,'2025-03-20 10:08:02.162','2025-03-20 10:08:02.162',NULL,'Finance Division',0);
/*!40000 ALTER TABLE `feedbackcomplain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `firefighting`
--

DROP TABLE IF EXISTS `firefighting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `firefighting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `firefighterName` varchar(191) NOT NULL,
  `addressableSmokeStatus` tinyint(1) NOT NULL DEFAULT 0,
  `fireAlarmingSystemStatus` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deletedAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `createdById` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `firefighting`
--

LOCK TABLES `firefighting` WRITE;
/*!40000 ALTER TABLE `firefighting` DISABLE KEYS */;
INSERT INTO `firefighting` VALUES (2,'2025-03-18 00:00:00.000','Ahsan Ali',1,0,'All Okay!','2025-03-19 00:52:04.544',NULL,'2025-03-19 01:02:48.361',153),(3,'2025-03-23 00:00:00.000','Ahsan Ali',1,1,'Ok!','2025-03-23 00:22:42.740',NULL,'2025-03-23 00:22:42.740',155);
/*!40000 ALTER TABLE `firefighting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `firefightingalarm`
--

DROP TABLE IF EXISTS `firefightingalarm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `firefightingalarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `firefighterName` varchar(191) NOT NULL,
  `dieselEnginePumpStatus` tinyint(1) NOT NULL DEFAULT 0,
  `wetRisersStatus` tinyint(1) NOT NULL DEFAULT 0,
  `hoseReelCabinetsStatus` tinyint(1) NOT NULL DEFAULT 0,
  `externalHydrantsStatus` tinyint(1) NOT NULL DEFAULT 0,
  `waterStorageTanksStatus` tinyint(1) NOT NULL DEFAULT 0,
  `emergencyLightsStatus` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `createdById` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `firefightingalarm`
--

LOCK TABLES `firefightingalarm` WRITE;
/*!40000 ALTER TABLE `firefightingalarm` DISABLE KEYS */;
INSERT INTO `firefightingalarm` VALUES (2,'2025-03-19 00:00:00.000','Wajid Ali',1,1,1,1,1,1,'All Okay!','2025-03-19 00:52:20.779','2025-03-19 01:10:55.126',NULL,153),(3,'2025-03-23 00:00:00.000','Wajid Ali',1,1,1,0,0,0,'ok!','2025-03-23 00:24:57.928','2025-03-23 00:35:22.847',NULL,155);
/*!40000 ALTER TABLE `firefightingalarm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `firefightingduty`
--

DROP TABLE IF EXISTS `firefightingduty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `firefightingduty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `shift` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `firefightingduty`
--

LOCK TABLES `firefightingduty` WRITE;
/*!40000 ALTER TABLE `firefightingduty` DISABLE KEYS */;
INSERT INTO `firefightingduty` VALUES (1,'2025-03-07 00:00:00.000','Evening','2025-03-07 01:29:12.020','2025-03-07 01:29:12.020'),(2,'2025-03-06 00:00:00.000','Morning','2025-03-07 01:29:32.903','2025-03-07 01:29:32.903');
/*!40000 ALTER TABLE `firefightingduty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floorfc`
--

DROP TABLE IF EXISTS `floorfc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floorfc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floorFrom` varchar(191) NOT NULL,
  `floorTo` varchar(191) NOT NULL,
  `details` varchar(191) NOT NULL,
  `verifiedBy` varchar(191) NOT NULL,
  `attendedBy` varchar(191) NOT NULL,
  `fcuReportId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FloorFC_fcuReportId_fkey` (`fcuReportId`),
  CONSTRAINT `FloorFC_fcuReportId_fkey` FOREIGN KEY (`fcuReportId`) REFERENCES `fcureport` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floorfc`
--

LOCK TABLES `floorfc` WRITE;
/*!40000 ALTER TABLE `floorfc` DISABLE KEYS */;
INSERT INTO `floorfc` VALUES (3,'17','10','ok','1','3',3),(4,'17','16','ok','1','4',3),(5,'17','19','done','1','3',3),(6,'17','17','','1','4',4),(9,'18','19','Good','1','7',1),(10,'1','2','Good','1','3',1),(11,'16','17','Okay','1','3',5),(13,'Ground','10','Test By usman for floors addition . Ground floor + 18,19','2','9',6),(15,'14','16','','1','5',7),(16,'18','18','','1','3',8);
/*!40000 ALTER TABLE `floorfc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generator`
--

DROP TABLE IF EXISTS `generator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `genSetNo` varchar(191) NOT NULL,
  `power` varchar(191) NOT NULL,
  `capacity` int(11) NOT NULL,
  `engOil` tinyint(1) NOT NULL DEFAULT 0,
  `fuelFilter` tinyint(1) NOT NULL DEFAULT 0,
  `airFilter` tinyint(1) NOT NULL DEFAULT 0,
  `currHrs` int(11) NOT NULL,
  `currDate` datetime(3) NOT NULL,
  `lastHrs` int(11) NOT NULL,
  `lastDate` datetime(3) NOT NULL,
  `electricianName` varchar(191) NOT NULL,
  `supervisorName` varchar(191) NOT NULL,
  `engineerName` varchar(191) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generator`
--

LOCK TABLES `generator` WRITE;
/*!40000 ALTER TABLE `generator` DISABLE KEYS */;
INSERT INTO `generator` VALUES (1,'2025-03-07 01:06:46.305','Gen 1','CAT 650 kVA Set No. 1 Model (C-18)',1000,0,0,0,0,'2025-03-07 00:00:00.000',0,'2025-03-07 01:06:46.305','117','','114');
/*!40000 ALTER TABLE `generator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generatorfuel`
--

DROP TABLE IF EXISTS `generatorfuel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generatorfuel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `generatorId` int(11) NOT NULL,
  `fuelLast` int(11) NOT NULL,
  `fuelConsumed` int(11) NOT NULL,
  `fuelReceived` int(11) NOT NULL,
  `available` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `GeneratorFuel_generatorId_fkey` (`generatorId`),
  CONSTRAINT `GeneratorFuel_generatorId_fkey` FOREIGN KEY (`generatorId`) REFERENCES `generator` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generatorfuel`
--

LOCK TABLES `generatorfuel` WRITE;
/*!40000 ALTER TABLE `generatorfuel` DISABLE KEYS */;
INSERT INTO `generatorfuel` VALUES (1,1,0,0,0,0);
/*!40000 ALTER TABLE `generatorfuel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotwaterboiler`
--

DROP TABLE IF EXISTS `hotwaterboiler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotwaterboiler` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `StartTime` datetime(3) NOT NULL,
  `ShutdownTime` datetime(3) NOT NULL,
  `Remarks` varchar(191) NOT NULL,
  `OperatorName` varchar(191) NOT NULL,
  `SupervisorName` varchar(191) NOT NULL,
  `EngineerName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotwaterboiler`
--

LOCK TABLES `hotwaterboiler` WRITE;
/*!40000 ALTER TABLE `hotwaterboiler` DISABLE KEYS */;
INSERT INTO `hotwaterboiler` VALUES (1,'2025-02-12 08:51:41.424','2025-03-05 07:00:00.000','2025-03-05 14:15:00.000','Test','3','1',NULL,'2025-02-12 08:51:41.424','2025-03-07 01:03:39.404'),(2,'2025-03-11 04:45:06.716','2025-03-11 03:00:00.000','2025-03-11 10:15:00.000','ok','3','1',NULL,'2025-03-11 04:45:06.716','2025-03-11 04:47:53.626'),(3,'2025-03-12 07:52:03.125','2025-03-12 03:00:00.000','2025-03-12 10:00:00.000','testing','5','1',NULL,'2025-03-12 07:52:03.125','2025-03-12 09:07:12.724'),(4,'2025-03-12 09:11:25.424','2025-03-12 03:00:00.000','2025-03-12 10:15:00.000','ok','Noman Israz','Asif Zia Tehsecn',NULL,'2025-03-12 09:11:25.424','2025-03-14 22:55:57.673'),(5,'2025-03-13 01:29:35.533','2025-03-13 01:30:00.000','2025-03-13 07:30:00.000','Test By Usman , Tested Operator and Supervisor dropdown. Correct!','Iftikhaer Ahmed','Khuram Sultan',NULL,'2025-03-13 01:29:35.533','2025-03-13 01:52:27.820'),(6,'2025-03-13 01:39:24.930','2025-03-13 01:40:00.000','2025-03-13 01:45:00.000','Usman Test','3','1',NULL,'2025-03-13 01:39:24.930','2025-03-13 01:39:24.930'),(7,'2025-03-13 07:13:12.798','2025-03-13 04:00:00.000','2025-03-13 10:12:00.000','abcd','Noman Israz','Asif Zia Tehsecn',NULL,'2025-03-13 07:13:12.798','2025-03-14 22:56:19.999'),(8,'2025-03-14 23:35:28.977','2025-03-13 23:35:00.000','2025-03-14 23:35:00.000','Testing the time in Timehours','3','1',NULL,'2025-03-14 23:35:28.977','2025-03-14 23:35:28.977'),(10,'2025-03-14 23:40:01.795','2025-03-14 23:39:00.000','2025-03-15 02:39:00.000','Checking Add time ','Samad Mehmood','Asif Zia Tehsecn',NULL,'2025-03-14 23:40:01.795','2025-03-14 23:40:18.122');
/*!40000 ALTER TABLE `hotwaterboiler` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance`
--

DROP TABLE IF EXISTS `insurance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insurance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carId` int(11) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `images` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Insurance_carId_fkey` (`carId`),
  CONSTRAINT `Insurance_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance`
--

LOCK TABLES `insurance` WRITE;
/*!40000 ALTER TABLE `insurance` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `janitorabsence`
--

DROP TABLE IF EXISTS `janitorabsence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `janitorabsence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `isAbsent` tinyint(1) NOT NULL,
  `janitorialAttendanceId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `JanitorAbsence_janitorialAttendanceId_fkey` (`janitorialAttendanceId`),
  CONSTRAINT `JanitorAbsence_janitorialAttendanceId_fkey` FOREIGN KEY (`janitorialAttendanceId`) REFERENCES `janitorialattendance` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `janitorabsence`
--

LOCK TABLES `janitorabsence` WRITE;
/*!40000 ALTER TABLE `janitorabsence` DISABLE KEYS */;
INSERT INTO `janitorabsence` VALUES (199,'Yonus Masih',1,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(200,'Afrahim Fareed',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(201,'M. Waqar',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(202,'Ishaq Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(203,'Salim Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(204,'Amjid Ali',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(205,'Adnan Faisal',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(206,'Vishal William',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(207,'M. Waqas',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(208,'Asghar Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(209,'Farooq Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(210,'Adeel Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(211,'Arif Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(212,'Thomas Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(213,'Iftikhar Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(214,'Raiz Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(215,'Asif Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(216,'Kashif Khokhar',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(217,'M. Haseeb',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(218,'M.Asif',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(219,'Basit Hussain',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(220,'Nadeem Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(221,'Aryan Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(222,'Horab Sarfraz',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(223,'M. Usman',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(224,'Johar Shafique',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(225,'M. Zubair',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(226,'Obaid Masih',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(227,'Arslan Haroon',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(228,'Yasir',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(229,'Annees ul Hussan',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(230,'Jamshaid hussan',0,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183'),(231,'Sharbat Ali',1,1,'2025-03-12 02:31:28.183','2025-03-12 02:31:28.183');
/*!40000 ALTER TABLE `janitorabsence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `janitorialattendance`
--

DROP TABLE IF EXISTS `janitorialattendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `janitorialattendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `supervisor` varchar(191) NOT NULL,
  `totalJanitors` int(11) NOT NULL,
  `strength` int(11) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `janitorialattendance`
--

LOCK TABLES `janitorialattendance` WRITE;
/*!40000 ALTER TABLE `janitorialattendance` DISABLE KEYS */;
INSERT INTO `janitorialattendance` VALUES (1,'2025-03-12 02:21:56.795','12',33,31,'Test By Usman','2025-03-12 02:21:56.798','2025-03-12 02:31:28.183');
/*!40000 ALTER TABLE `janitorialattendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `janitorialreport`
--

DROP TABLE IF EXISTS `janitorialreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `janitorialreport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `supervisor` varchar(191) NOT NULL,
  `tenant` varchar(191) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `janitorialreport`
--

LOCK TABLES `janitorialreport` WRITE;
/*!40000 ALTER TABLE `janitorialreport` DISABLE KEYS */;
INSERT INTO `janitorialreport` VALUES (5,'2025-02-19','12','Huawei Technologies Pakistan (Pvt) Ltd.','All clean'),(6,'2025-03-13','12','Huawei Technologies Pakistan (Pvt) Ltd.','Test By Usman'),(7,'2025-03-01','12','Huawei Technologies Pakistan (Pvt) Ltd.','check export');
/*!40000 ALTER TABLE `janitorialreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobslip`
--

DROP TABLE IF EXISTS `jobslip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobslip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `jobId` varchar(191) NOT NULL,
  `complainNo` varchar(191) NOT NULL,
  `complainBy` varchar(191) DEFAULT NULL,
  `floorNo` varchar(191) NOT NULL,
  `area` varchar(191) NOT NULL,
  `inventoryRecieptNo` varchar(191) DEFAULT NULL,
  `location` varchar(191) NOT NULL,
  `complaintDesc` varchar(191) NOT NULL,
  `materialReq` varchar(191) NOT NULL,
  `actionTaken` varchar(191) NOT NULL,
  `attendedBy` varchar(191) NOT NULL,
  `department` varchar(191) NOT NULL,
  `remarks` varchar(191) NOT NULL,
  `completed_At` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL,
  `supervisorApproval` tinyint(1) NOT NULL,
  `managementApproval` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `picture` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `JobSlip_complainNo_fkey` (`complainNo`),
  CONSTRAINT `JobSlip_complainNo_fkey` FOREIGN KEY (`complainNo`) REFERENCES `feedbackcomplain` (`complainNo`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobslip`
--

LOCK TABLES `jobslip` WRITE;
/*!40000 ALTER TABLE `jobslip` DISABLE KEYS */;
INSERT INTO `jobslip` VALUES (6,'2025-02-18 04:33:40.633','null-HRA/DC/01','CMP-1739853128872','N/A','Ground Floor','HRA','148','A','Faulty Door Sensor','(01) Door Sensor (01) Insulation Tap (01) cable Tie 12\'','Acknowledge','','43','',NULL,'In Progress',0,0,'2025-02-18 04:33:40.635','2025-02-21 06:35:54.034',NULL,NULL),(46,'2025-02-18 06:11:57.136','null-HRA/DC/41','CMP-1739859019049','N/A','18th','HRA','150','D','Faulty Seat Cover','(01) Seat cover','Acknowledge','120','44',' D Tower 18th Floor',NULL,'In Progress',0,0,'2025-02-18 06:11:57.138','2025-02-21 06:36:21.201',NULL,NULL),(47,'2025-02-18 06:19:48.748','null-HRA/DC/42','CMP-1739859455920','N/A','9th','HRA','148','','Faulty led light','(03) led Light 12w (01) Led 10w (01) Insulation Tap','Acknowledge','117','42','9th floor Washroom','2025-03-06 02:52:02.597','Verified & Closed',1,0,'2025-02-18 06:19:48.752','2025-03-06 02:52:02.742',NULL,'/uploads/slips/image-1741229291553.jpg'),(48,'2025-02-20 10:10:31.388','null-HRA/DC/01','CMP-1740046003654','N/A','Ground Floor','HRA','123','A','Faulty led light 36w','(02) led light 36w','Processed','117','42','Faulty  led light',NULL,'In Progress',0,0,'2025-02-20 10:10:31.413','2025-02-21 06:35:26.113',NULL,NULL),(50,'2025-02-20 10:15:24.945','null-HRA/DC/03','CMP-1740046348253','N/A','Ground Floor','HRA','153','','faulty Multi socket','(01) multi socket 13amp','Acknowledge','117','42','HOBD ',NULL,'In Progress',0,0,'2025-02-20 10:15:24.949','2025-02-20 12:18:41.967',NULL,NULL),(51,'2025-02-20 10:23:34.191','null-LRA/DC/01','CMP-1740046756861','N/A','Ground Floor','LRA','156','A','faulty led rod','(01) Led Light 10w 2x2 (01) Tube Rod 18w 2x2 (01) starter','Acknowledge','117','42','Low rise parking area washroom',NULL,'In Progress',0,0,'2025-02-20 10:23:34.197','2025-02-21 06:36:43.598',NULL,NULL),(53,'2025-02-21 04:37:35.256','null-HRA/DC/01','CMP-1740112556398','N/A','Ground Floor','HRA','155','','New installation','(01) pvc Duct 16x16','Acknowledge','117','42','New installation',NULL,'Verified & Closed',1,0,'2025-02-21 04:37:35.259','2025-03-06 03:06:38.672',NULL,NULL),(54,'2025-02-21 06:16:13.545','null-HRA/DC/02','CMP-1740118449698','N/A','Ground Floor','HRA','154','','Faulty Basin waste And Bottle trap','(01) Basin Waste (01) Bottle Trap ','Acknowledge','122','44','Faulty',NULL,'In Progress',0,0,'2025-02-21 06:16:13.551','2025-02-21 06:34:00.041',NULL,NULL),(55,'2025-02-25 05:57:11.859','null-HRA/DC/01','CMP-1740462980392','N/A','19th','HRA','161','','Faulty LED Light','(05) Led Light 36w ','Acknowledge','117','42','HR Division',NULL,'Verified & Closed',1,0,'2025-02-25 05:57:11.866','2025-03-06 02:49:58.412',NULL,NULL),(56,'2025-02-25 06:01:31.832','null-HRA/DC/02','CMP-1740463156432','N/A','18th','HRA','160','D','Faulty LED Light','(02) LED light 36w','Acknowledge','117','42','faulty led light , updating it',NULL,'Verified & Closed',1,0,'2025-02-25 06:01:31.836','2025-03-06 03:03:38.205',NULL,NULL),(59,'2025-03-07 00:00:00.000','HVAC-HRA/DC/01','CMP-1741327817663','N/A','19th','HRA','174-175','NULL','New Split Ac Is Required to be Installed on 19th floor D Tower','(01) Split Ac Dawlance 1.5 ton (02) Insulation Tap (01) 3 pin Shoo 10 Amp  (01 PKT) Rawal plug ','Acknowledge','8','30','D tower',NULL,'In Progress',0,0,'2025-03-07 06:18:58.892','2025-03-07 06:30:53.460',NULL,NULL),(60,'2025-03-07 00:00:00.000','PLU-HRA/DC/01','CMP-1741328629901','N/A','4th','HRA','173','NULL','Faulty Toilet Shower','(01) Toilet Shower With Pipe','Acknowledge','122','44','Electric Side washroom',NULL,'In Progress',0,0,'2025-03-07 06:25:06.972','2025-03-07 06:30:18.942',NULL,NULL),(61,'2025-03-07 00:00:00.000','PLU-HRA/DC/02','CMP-1740546416378','N/A','9th','HRA','176','C Tower ','white Wash','(01) Bucket White Emulsion','Acknowledge','N/A','44','C tower',NULL,'In Progress',0,0,'2025-03-07 06:25:52.980','2025-03-07 06:51:01.191',NULL,NULL),(62,'2025-03-07 00:00:00.000','PNT-LRA/DC/01','CMP-1740468892429','N/A','','LRA','179','Testing locations','white Wash','(01) GLN Off White Plastic Emulsion (01) GLN Matt Enamel (01) wheater sheet sand stone','Acknowledge','125','46','Sumitomo 2nd floor',NULL,'In Progress',0,0,'2025-03-07 06:29:06.810','2025-03-10 05:26:04.909',NULL,NULL),(63,'2025-03-07 00:00:00.000','MSN-HRA/DC/01','CMP-1741329260437','N/A','7th','HRA','197','NULL','Widow Repair','(03) Sikaflex','Acknowledge','128','47','A tower , B Tower , C tower ',NULL,'In Progress',0,0,'2025-03-07 06:36:19.564','2025-03-19 08:55:26.757',NULL,NULL),(64,'2025-03-10 00:00:00.000','PLU-HRA/DC/01','CMP-1741581735050','N/A','17th','HRA','178','NULL','Faulty Muslim Shower','(01) Faulty Muslim Shower With Pipe','Acknowledge','122','44','Washroom Kitchen Kitchen Side','2025-03-11 08:14:06.578','Verified & Closed',1,0,'2025-03-10 04:45:02.807','2025-03-11 08:14:06.580',NULL,'/uploads/slips/image-1741680846445.jpg'),(65,'2025-03-10 00:00:00.000','PLU-HRA/DC/02','CMP-1741582157209','N/A','2nd','HRA','177','NULL','Faulty Spindle Head And Muslim shower','(02) Head Spindle (01) Muslim shower With pipe','Acknowledge','122','44','Kitchen Side washroom',NULL,'Verified & Closed',1,0,'2025-03-10 04:51:05.909','2025-03-11 08:36:54.821',NULL,NULL),(66,'2025-03-10 00:00:00.000','ELC-HRA/DC/01','CMP-1741587963067','N/A','19th','HRA','180','NULL','Relocation of power Connection And cable Duct for Installation Of New Ac At CFO Room','(40MTR) Cable 1.5mm (10MTR) Cat 6 cable (02) Insulation Tap (04) Rawal PLug (02) Duct 16x38 (02) PKT Cable tie 18\"','Acknowledge','117','42','CFO room 19th floor',NULL,'In Progress',0,0,'2025-03-10 06:29:01.644','2025-03-10 07:03:38.542',NULL,NULL),(67,'2025-03-11 00:00:00.000','PNT-HRA/DC/01','CMP-1741675101148','N/A','9th','HRA',NULL,'NULL','white Wash','(01) Bucket Ash white Emulsion Berger','Acknowledge','126','46','C tower , D tower 9th floor',NULL,'Pending',0,0,'2025-03-11 06:41:07.321','2025-03-11 06:41:07.321',NULL,NULL),(71,'2025-03-12 00:00:00.000','ELC-HRA/DC/01','CMP-1741756452127','N/A','Ground Floor','HRA','183','NULL','Faulty LED Light','(03) Led light 12w','Acknowledge','117','42','Main Lobby',NULL,'In Progress',0,0,'2025-03-12 05:19:12.275','2025-03-12 09:25:47.800',NULL,NULL),(72,'2025-03-13 00:00:00.000','ELC-HRA/DC/01','CMP-1741759253417','N/A','Ground Floor','HRA','184','Scissor Gate Courtyard area','Faulty Multi socket','(01) Multi socket with Box (03) MTR Cale 1.5mm','Acknowledge','117','42','Scissor Gate Courtyard area',NULL,'In Progress',0,0,'2025-03-13 05:45:26.152','2025-03-14 05:27:28.855',NULL,NULL),(74,'2025-03-14 00:00:00.000','ELC-HRA/DC/01','CMP-1741928533460','N/A','19th','HRA','185','Finance Division (CFO Room)',' New Installation for LED',' (01) Multi Socket 13Amp With Box (06) MTR 1.5mm Cable (01) Shoo 3 pin 5 amp (01) Insulation Tap','Acknowledge','117','42','New Installation',NULL,'In Progress',0,0,'2025-03-14 05:06:27.249','2025-03-14 05:25:14.900',NULL,NULL),(76,'2025-03-14 00:00:00.000','ELC-HRA/DC/03','CMP-1741929541712','N/A','Rooftop','HRA','186','LRA Roof Top ',' Installation of Multi socket for Diesel pump','(02) Multi Socket with Box','Acknowledge','117','42','Faulty Multi socket',NULL,'In Progress',0,0,'2025-03-14 05:20:10.908','2025-03-14 05:38:05.760',NULL,NULL),(77,'2025-03-14 00:00:00.000','ELC-HRA/DC/04','CMP-1741928937192','N/A','19th','HRA','190','19th floor','Electrian needed','Electrian needed','Electrian needed','115','42','Electrian needed',NULL,'In Progress',0,0,'2025-03-14 07:24:54.831','2025-03-18 04:52:15.526',NULL,NULL),(78,'2025-03-15 00:00:00.000','ELC-HRA/DC/01','CMP-1741928533460','N/A','19th','HRA',NULL,'Finance Division (CFO Room)','Old Installation for LED','Light Bulb','Testing Electrician','115','42','Routine check completed.',NULL,'Pending',0,0,'2025-03-15 01:34:19.458','2025-03-15 01:34:19.458',NULL,NULL),(79,'2025-03-17 00:00:00.000','LIFT-LRA/DC/01','CMP-1742189987303','N/A','Rooftop','LRA','187','Machine Room LRA ','Faulty Contractor','(01) Contractor','Acknowledge','118','43','Faulty',NULL,'In Progress',0,0,'2025-03-17 05:42:40.917','2025-03-17 05:47:50.210',NULL,NULL),(80,'2025-03-17 00:00:00.000','PNT-HRA/DC/01','CMP-1742192146817','N/A','9th','HRA','188',' 9th floor C Block','white Wash','(01) White Bucket Emulsion Berger','Acknowledge','125','46','C tower',NULL,'In Progress',0,0,'2025-03-17 06:16:50.720','2025-03-17 09:15:41.131',NULL,NULL),(81,'2025-03-17 00:00:00.000','ELC-HRA/DC/01','CMP-1742203974101','N/A','18th','HRA',NULL,'Photocopier Room','Replaced Led Light ','(02) Led ceiling Light 12w (02) Surface Mount Light 18w','Acknowledge','115','42','Replaced',NULL,'Pending',0,0,'2025-03-17 09:34:23.144','2025-03-17 09:34:23.144',NULL,NULL),(82,'2025-03-18 00:00:00.000','ELC-HRA/DC/01','CMP-1742275610406','N/A','Ground Floor','HRA','191','Security Room ','Faulty Multi plug ','(01) Multi Plug 13Amp','Acknowledge','117','42','FAULTY ',NULL,'In Progress',0,0,'2025-03-18 05:30:14.395','2025-03-18 06:24:09.578',NULL,NULL),(83,'2025-03-18 00:00:00.000','ELC-HRA/DC/02','CMP-1742276332435','N/A','17th','HRA','192 &199','17th Floor (GSBD)','Installation of new printer','(02) PVC duct 16/38  (01) Screw 3/4 x6 (32) CAt  6 Cable','Acknowledge','','42','New Installation',NULL,'In Progress',0,0,'2025-03-18 05:41:34.808','2025-03-20 05:08:54.686',NULL,NULL),(84,'2025-03-18 00:00:00.000','ELC-HRA/DC/03','CMP-1742277148071','N/A','Ground Floor','HRA','193','Ground floor lobby','For Installation of New Lights',' (20) MTR Cable 1.5mm (02) Connector Strip 15Amp (01)','Acknowledge','117','42','New Installation',NULL,'In Progress',0,0,'2025-03-18 05:54:43.692','2025-03-18 06:28:57.240',NULL,NULL),(85,'2025-03-19 00:00:00.000','HVAC-HRA/DC/01','CMP-1742369504810','N/A','Basement','HRA','194','Plant Room','Making New Extension Bord',' (08) MTR Cable 1.5mm 3 core (02) Insulation Tap (02) 3Pin shoo 10 Amp (02) Multi Socket','','6','30','New intallation',NULL,'In Progress',0,0,'2025-03-19 07:34:57.970','2025-03-19 07:39:25.997',NULL,NULL),(86,'2025-03-19 00:00:00.000','HVAC-HRA/DC/02','CMP-1742370687616','N/A','Basement','HRA','195','Plant Room','To Improve Lighting',' (01) Energy Saver 23w (02) Bulb Screw 60w','Acknowledge','6','30','Basement Plant room',NULL,'In Progress',0,0,'2025-03-19 07:52:45.277','2025-03-19 08:05:33.297',NULL,NULL),(87,'2025-03-19 00:00:00.000','ELC-HRA/DC/01','CMP-1742370899116','N/A','18th','HRA',NULL,'Audit Division','Faulty Led lights','(03) 36W LED Lights','Acknowledge','116','42','Faulty',NULL,'Pending',0,0,'2025-03-19 07:55:59.071','2025-03-19 07:55:59.071',NULL,NULL),(88,'2025-03-19 00:00:00.000','ELC-HRA/DC/02','CMP-1742371075285','N/A','Ground Floor','HRA',NULL,'Masque','Faulty LED Light','(01) Led light 36w','Acknowledge','116','42','Masque',NULL,'Pending',0,0,'2025-03-19 07:58:41.272','2025-03-19 07:58:41.272',NULL,NULL),(89,'2025-03-19 00:00:00.000','ELC-LRA/DC/01','CMP-1742371290919','N/A','Ground Floor','LRA','196','LRA Ground Floor Handicap washroom','Faulty led Lights',' (03) 10w led light','Acknowledge','116','42','faulty',NULL,'In Progress',0,0,'2025-03-19 08:02:36.653','2025-03-19 08:09:22.519',NULL,NULL),(90,'2025-03-20 00:00:00.000','PLU-HRA/DC/01','CMP-1742445539119','N/A','Basement','HRA','198','Plant Room , Parking area ',' Faulty Ball Valve 1\", Ball valve 3/4 ,Ball valve 1/2',' (01) Ball Valve 1\" (01) Ball Valve 3/4 (01) Ball Valve 1/2','Acknowledge','120','44','',NULL,'In Progress',0,0,'2025-03-20 04:39:58.541','2025-03-20 04:51:35.607',NULL,NULL),(91,'2025-03-20 00:00:00.000','CCTV-LRA/DC/01','CMP-1742446248451','N/A','Ground Floor','LRA',NULL,'LRA IN Gate','Faulty Camera',' (01) Camera 4mp IP Bullet (04) BNC (02) Insulation Tap (01) Clump Too (10) Rj 45 Connector','Acknowledge','57','36','FAulty',NULL,'Pending',0,0,'2025-03-20 04:51:30.752','2025-03-20 04:51:30.752',NULL,NULL);
/*!40000 ALTER TABLE `jobslip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationName` varchar(191) NOT NULL,
  `locationFloor` varchar(191) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `plumbingProjectId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Location_plumbingProjectId_fkey` (`plumbingProjectId`),
  CONSTRAINT `Location_plumbingProjectId_fkey` FOREIGN KEY (`plumbingProjectId`) REFERENCES `plumbingproject` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Kitchen Side','First Floor',NULL,1),(2,'Kitchen Side','10th Floor',NULL,2),(3,'Prayer Area','Ground Floor',NULL,3),(4,'Prayer Area','Ground Floor',NULL,4),(5,'Elect. Room Side','19th Floor',NULL,5),(6,'Prayer Area','Ground Floor',NULL,6),(7,'Kitchen Side','10th Floor',NULL,7),(8,'Prayer Area','Ground Floor',NULL,8),(9,'Prayer Area','Ground Floor',NULL,9),(10,'Prayer Area','Ground Floor',NULL,10),(11,'Kitchen Side','First Floor',NULL,11),(12,'Elect. Room Side','First Floor','All Checks are loaded . No need to reselect the floor again.',12),(13,'Prayer Area','Ground Floor','see below',13);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenancerecord`
--

DROP TABLE IF EXISTS `maintenancerecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenancerecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carId` int(11) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `images` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `MaintenanceRecord_carId_fkey` (`carId`),
  CONSTRAINT `MaintenanceRecord_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `car` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenancerecord`
--

LOCK TABLES `maintenancerecord` WRITE;
/*!40000 ALTER TABLE `maintenancerecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenancerecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `templateId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdById` int(11) NOT NULL,
  `altText` varchar(191) DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Notification_templateId_fkey` (`templateId`),
  CONSTRAINT `Notification_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `notificationtemplate` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,1,156,153,'Hello Technician User, Jobslip TEC-LRA/DC/02 has been created by Super Admin.','/customer-relation/job-slip/view/2',0,'2025-02-05 22:57:33.407','2025-02-05 22:57:33.407',NULL),(2,1,115,153,'Hello Adil Ashraf, Jobslip null-LRA/DC/01 has been created by Super Admin.','/customer-relation/job-slip/view/3',1,'2025-02-06 06:51:08.458','2025-02-10 09:23:56.362',NULL),(3,1,104,104,'Hello Anees Ahmed, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',1,'2025-02-06 07:20:48.398','2025-02-10 08:49:13.282',NULL),(4,1,12,104,'Hello Shehroze Khan, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',0,'2025-02-06 07:20:48.398','2025-02-06 07:20:48.398',NULL),(5,1,113,104,'Hello Amjad Khalil Abid, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',0,'2025-02-06 07:20:48.398','2025-02-06 07:20:48.398',NULL),(6,1,107,104,'Hello Amjad Khalil Abid, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',1,'2025-02-06 07:20:48.398','2025-02-10 08:57:44.838',NULL),(7,1,13,104,'Hello M.Qasim, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',0,'2025-02-06 07:20:48.398','2025-02-06 07:20:48.398',NULL),(8,1,108,104,'Hello Shafiq Ur Rehman, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',1,'2025-02-06 07:20:48.398','2025-02-13 04:08:56.806',NULL),(9,1,105,104,'Hello Mushtaq Ahmed Chishti, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',0,'2025-02-06 07:20:48.398','2025-02-06 07:20:48.398',NULL),(10,1,103,104,'Hello Naseer Ahmed, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',0,'2025-02-06 07:20:48.398','2025-02-06 07:20:48.398',NULL),(11,1,106,104,'Hello Rizwan Mushtaq, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',1,'2025-02-06 07:20:48.398','2025-02-18 11:58:49.995',NULL),(12,1,154,104,'Hello Admin User, Janitorial inspection report created by Anees Ahmed','/janitorial/report/view/1',1,'2025-02-06 07:20:48.398','2025-02-10 09:07:48.446',NULL),(13,1,104,153,'Hello Anees Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',1,'2025-02-06 07:24:16.087','2025-02-10 08:50:15.435',NULL),(14,1,103,153,'Hello Naseer Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',0,'2025-02-06 07:24:16.087','2025-02-06 07:24:16.087',NULL),(15,1,113,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',0,'2025-02-06 07:24:16.087','2025-02-06 07:24:16.087',NULL),(16,1,106,153,'Hello Rizwan Mushtaq, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',1,'2025-02-06 07:24:16.087','2025-02-18 12:17:04.958',NULL),(17,1,12,153,'Hello Shehroze Khan, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',0,'2025-02-06 07:24:16.087','2025-02-06 07:24:16.087',NULL),(18,1,107,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',1,'2025-02-06 07:24:16.087','2025-02-10 08:57:41.968',NULL),(19,1,13,153,'Hello M.Qasim, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',0,'2025-02-06 07:24:16.087','2025-02-06 07:24:16.087',NULL),(20,1,108,153,'Hello Shafiq Ur Rehman, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',1,'2025-02-06 07:24:16.087','2025-02-13 04:08:40.169',NULL),(21,1,105,153,'Hello Mushtaq Ahmed Chishti, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',0,'2025-02-06 07:24:16.087','2025-02-06 07:24:16.087',NULL),(22,1,154,153,'Hello Admin User, Janitorial inspection report created by Super Admin','/janitorial/report/view/2',1,'2025-02-06 07:24:16.087','2025-02-10 09:07:56.255',NULL),(23,1,103,153,'Hello Naseer Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',0,'2025-02-06 07:27:00.484','2025-02-06 07:27:00.484',NULL),(24,1,113,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',0,'2025-02-06 07:27:00.484','2025-02-06 07:27:00.484',NULL),(25,1,104,153,'Hello Anees Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',1,'2025-02-06 07:27:00.484','2025-02-10 08:49:06.274',NULL),(26,1,105,153,'Hello Mushtaq Ahmed Chishti, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',0,'2025-02-06 07:27:00.484','2025-02-06 07:27:00.484',NULL),(27,1,12,153,'Hello Shehroze Khan, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',0,'2025-02-06 07:27:00.484','2025-02-06 07:27:00.484',NULL),(28,1,108,153,'Hello Shafiq Ur Rehman, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',1,'2025-02-06 07:27:00.485','2025-02-13 04:08:38.391',NULL),(29,1,13,153,'Hello M.Qasim, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',0,'2025-02-06 07:27:00.484','2025-02-06 07:27:00.484',NULL),(30,1,107,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',1,'2025-02-06 07:27:00.485','2025-02-10 08:57:38.946',NULL),(31,1,106,153,'Hello Rizwan Mushtaq, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',1,'2025-02-06 07:27:00.485','2025-02-18 12:01:35.536',NULL),(32,1,154,153,'Hello Admin User, Janitorial inspection report created by Super Admin','/janitorial/report/view/3',1,'2025-02-06 07:27:00.485','2025-02-10 09:19:33.902',NULL),(33,1,113,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',0,'2025-02-06 07:28:59.929','2025-02-06 07:28:59.929',NULL),(34,1,104,153,'Hello Anees Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',1,'2025-02-06 07:28:59.929','2025-02-10 08:36:51.507',NULL),(35,1,103,153,'Hello Naseer Ahmed, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',0,'2025-02-06 07:28:59.929','2025-02-06 07:28:59.929',NULL),(36,1,107,153,'Hello Amjad Khalil Abid, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',1,'2025-02-06 07:28:59.930','2025-02-10 08:57:36.418',NULL),(37,1,12,153,'Hello Shehroze Khan, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',0,'2025-02-06 07:28:59.929','2025-02-06 07:28:59.929',NULL),(38,1,13,153,'Hello M.Qasim, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',0,'2025-02-06 07:28:59.930','2025-02-06 07:28:59.930',NULL),(39,1,106,153,'Hello Rizwan Mushtaq, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',1,'2025-02-06 07:28:59.930','2025-02-18 12:16:48.891',NULL),(40,1,108,153,'Hello Shafiq Ur Rehman, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',1,'2025-02-06 07:28:59.930','2025-02-13 04:08:36.453',NULL),(41,1,105,153,'Hello Mushtaq Ahmed Chishti, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',0,'2025-02-06 07:28:59.929','2025-02-06 07:28:59.929',NULL),(42,1,154,153,'Hello Admin User, Janitorial inspection report created by Super Admin','/janitorial/report/view/4',1,'2025-02-06 07:28:59.930','2025-02-10 09:19:38.532',NULL),(43,1,126,104,'Hello Ghulam Bahadar, Jobslip null-HRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/4',0,'2025-02-10 06:27:46.906','2025-02-10 06:27:46.906',NULL),(44,1,115,104,'Hello Adil Ashraf, Jobslip null-LRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/5',1,'2025-02-10 09:21:19.280','2025-02-10 09:23:44.342',NULL),(45,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/2',0,'2025-02-12 08:17:34.373','2025-02-12 08:17:34.373','2025-02-12 08:17:34.368'),(46,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/1',0,'2025-02-12 08:37:02.346','2025-02-12 08:37:02.346','2025-02-12 08:37:02.336'),(47,2,113,2,'A new hot-water-boiler report has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/1',0,'2025-02-12 08:51:41.576','2025-02-12 08:51:41.576','2025-02-12 08:51:41.569'),(48,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/3',0,'2025-02-12 08:52:41.864','2025-02-12 08:52:41.864','2025-02-12 08:52:41.862'),(49,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/4',0,'2025-02-17 06:02:12.446','2025-02-17 06:02:12.446','2025-02-17 06:02:12.424'),(50,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',1,'2025-02-17 09:04:00.265','2025-02-18 12:00:31.841',NULL),(51,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',1,'2025-02-17 09:04:00.265','2025-03-06 03:07:49.001',NULL),(52,1,154,154,'Hello Admin User, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',0,'2025-02-17 09:04:00.265','2025-02-17 09:04:00.265',NULL),(53,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',0,'2025-02-17 09:04:00.292','2025-02-17 09:04:00.292',NULL),(54,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',0,'2025-02-17 09:04:00.265','2025-02-17 09:04:00.265',NULL),(55,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',0,'2025-02-17 09:04:00.265','2025-02-17 09:04:00.265',NULL),(56,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',1,'2025-02-17 09:04:00.266','2025-02-18 06:12:10.715',NULL),(57,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1739783040033) has been submitted.','/customer-relation/feedback-complain/view/17',0,'2025-02-17 09:04:00.266','2025-02-17 09:04:00.266',NULL),(58,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',0,'2025-02-18 04:32:09.182','2025-02-18 04:32:09.182',NULL),(59,1,154,154,'Hello Admin User, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',0,'2025-02-18 04:32:09.182','2025-02-18 04:32:09.182',NULL),(60,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',0,'2025-02-18 04:32:09.222','2025-02-18 04:32:09.222',NULL),(61,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',1,'2025-02-18 04:32:09.182','2025-02-28 07:08:05.194',NULL),(62,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',0,'2025-02-18 04:32:09.222','2025-02-18 04:32:09.222',NULL),(63,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',1,'2025-02-18 04:32:09.222','2025-02-18 06:08:03.904',NULL),(64,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',1,'2025-02-18 04:32:09.182','2025-03-06 03:07:56.593',NULL),(65,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739853128872) has been submitted.','/customer-relation/feedback-complain/view/18',0,'2025-02-18 04:32:09.223','2025-02-18 04:32:09.223',NULL),(66,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',1,'2025-02-18 06:10:19.267','2025-03-06 03:07:46.515',NULL),(67,1,154,154,'Hello Admin User, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',0,'2025-02-18 06:10:19.267','2025-02-18 06:10:19.267',NULL),(68,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',0,'2025-02-18 06:10:19.267','2025-02-18 06:10:19.267',NULL),(69,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',0,'2025-02-18 06:10:19.267','2025-02-18 06:10:19.267',NULL),(70,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',1,'2025-02-18 06:10:19.267','2025-02-18 11:59:22.220',NULL),(71,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',0,'2025-02-18 06:10:19.267','2025-02-18 06:10:19.267',NULL),(72,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',0,'2025-02-18 06:10:19.268','2025-02-18 06:10:19.268',NULL),(73,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1739859019049) has been submitted.','/customer-relation/feedback-complain/view/19',1,'2025-02-18 06:10:19.267','2025-02-20 04:52:31.599',NULL),(74,1,120,104,'Hello Shabbir Ahmed, Jobslip null-HRA/DC/41 has been created by Anees Ahmed.','/customer-relation/job-slip/view/46',0,'2025-02-18 06:11:57.220','2025-02-18 06:11:57.220',NULL),(75,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',1,'2025-02-18 06:17:36.081','2025-02-18 09:54:43.367',NULL),(76,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',0,'2025-02-18 06:17:36.081','2025-02-18 06:17:36.081',NULL),(77,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',1,'2025-02-18 06:17:36.081','2025-03-06 03:07:59.973',NULL),(78,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',0,'2025-02-18 06:17:36.081','2025-02-18 06:17:36.081',NULL),(79,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',1,'2025-02-18 06:17:36.081','2025-02-20 04:52:11.554',NULL),(80,1,154,154,'Hello Admin User, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',0,'2025-02-18 06:17:36.081','2025-02-18 06:17:36.081',NULL),(81,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',0,'2025-02-18 06:17:36.081','2025-02-18 06:17:36.081',NULL),(82,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1739859455920) has been submitted.','/customer-relation/feedback-complain/view/20',0,'2025-02-18 06:17:36.081','2025-02-18 06:17:36.081',NULL),(83,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/42 has been created by Anees Ahmed.','/customer-relation/job-slip/view/47',0,'2025-02-18 06:19:49.001','2025-02-18 06:19:49.001',NULL),(84,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/2',0,'2025-02-20 05:18:20.773','2025-02-20 05:18:20.773','2025-02-20 05:18:20.767'),(85,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(86,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(87,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(88,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(89,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(90,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',0,'2025-02-20 10:06:44.443','2025-02-20 10:06:44.443',NULL),(91,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',1,'2025-02-20 10:06:44.443','2025-03-06 03:08:02.579',NULL),(92,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740046003654) has been submitted.','/customer-relation/feedback-complain/view/21',1,'2025-02-20 10:06:44.443','2025-03-05 05:34:45.104',NULL),(93,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/48',0,'2025-02-20 10:10:31.797','2025-02-20 10:10:31.797',NULL),(94,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/02 has been created by Anees Ahmed.','/customer-relation/job-slip/view/49',0,'2025-02-20 10:10:35.693','2025-02-20 10:10:35.693',NULL),(95,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',1,'2025-02-20 10:12:28.417','2025-03-06 03:08:04.877',NULL),(96,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(97,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(98,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(99,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(100,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',1,'2025-02-20 10:12:28.417','2025-03-06 06:04:51.471',NULL),(101,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(102,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046348253) has been submitted.','/customer-relation/feedback-complain/view/22',0,'2025-02-20 10:12:28.417','2025-02-20 10:12:28.417',NULL),(103,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/03 has been created by Anees Ahmed.','/customer-relation/job-slip/view/50',0,'2025-02-20 10:15:25.124','2025-02-20 10:15:25.124',NULL),(104,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',1,'2025-02-20 10:19:17.109','2025-03-06 03:08:07.240',NULL),(105,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(106,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(107,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(108,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(109,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(110,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',1,'2025-02-20 10:19:17.109','2025-03-05 05:32:48.189',NULL),(111,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740046756861) has been submitted.','/customer-relation/feedback-complain/view/23',0,'2025-02-20 10:19:17.109','2025-02-20 10:19:17.109',NULL),(112,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-LRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/51',0,'2025-02-20 10:23:34.307','2025-02-20 10:23:34.307',NULL),(113,1,115,153,'Hello Adil Ashraf, Jobslip null-HRA/DC/04 has been created by Super Admin.','/customer-relation/job-slip/view/52',0,'2025-02-20 11:59:27.501','2025-02-20 11:59:27.501',NULL),(114,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(115,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(116,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(117,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',1,'2025-02-20 12:11:12.731','2025-03-06 03:08:09.723',NULL),(118,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(119,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(120,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',0,'2025-02-20 12:11:12.731','2025-02-20 12:11:12.731',NULL),(121,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740053472519) has been submitted.','/customer-relation/feedback-complain/view/24',1,'2025-02-20 12:11:12.731','2025-03-19 05:28:30.356',NULL),(122,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',1,'2025-02-21 04:35:56.506','2025-03-06 03:08:12.427',NULL),(123,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.506','2025-02-21 04:35:56.506',NULL),(124,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.506','2025-02-21 04:35:56.506',NULL),(125,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.506','2025-02-21 04:35:56.506',NULL),(126,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.507','2025-02-21 04:35:56.507',NULL),(127,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',1,'2025-02-21 04:35:56.506','2025-02-21 06:16:26.614',NULL),(128,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.506','2025-02-21 04:35:56.506',NULL),(129,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740112556398) has been submitted.','/customer-relation/feedback-complain/view/25',0,'2025-02-21 04:35:56.506','2025-02-21 04:35:56.506',NULL),(130,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/53',0,'2025-02-21 04:37:35.445','2025-02-21 04:37:35.445',NULL),(131,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.852','2025-02-21 06:14:09.852',NULL),(132,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',1,'2025-02-21 06:14:09.852','2025-03-06 03:07:43.775',NULL),(133,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.852','2025-02-21 06:14:09.852',NULL),(134,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.852','2025-02-21 06:14:09.852',NULL),(135,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.853','2025-02-21 06:14:09.853',NULL),(136,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.853','2025-02-21 06:14:09.853',NULL),(137,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',1,'2025-02-21 06:14:09.853','2025-03-05 05:32:42.753',NULL),(138,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740118449698) has been submitted.','/customer-relation/feedback-complain/view/26',0,'2025-02-21 06:14:09.853','2025-02-21 06:14:09.853',NULL),(139,1,122,104,'Hello Jamil, Jobslip null-HRA/DC/02 has been created by Anees Ahmed.','/customer-relation/job-slip/view/54',0,'2025-02-21 06:16:13.646','2025-02-21 06:16:13.646',NULL),(140,2,113,153,'A new Absorption Chiller form has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/5',0,'2025-02-24 11:35:07.052','2025-02-24 11:35:07.052','2025-02-24 11:35:07.051'),(141,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',1,'2025-02-25 05:56:20.511','2025-03-06 03:07:35.422',NULL),(142,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',0,'2025-02-25 05:56:20.511','2025-02-25 05:56:20.511',NULL),(143,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',0,'2025-02-25 05:56:20.511','2025-02-25 05:56:20.511',NULL),(144,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',1,'2025-02-25 05:56:20.511','2025-02-28 07:05:32.590',NULL),(145,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',0,'2025-02-25 05:56:20.511','2025-02-25 05:56:20.511',NULL),(146,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',1,'2025-02-25 05:56:20.511','2025-03-06 04:57:06.387',NULL),(147,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',0,'2025-02-25 05:56:20.511','2025-02-25 05:56:20.511',NULL),(148,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740462980392) has been submitted.','/customer-relation/feedback-complain/view/27',0,'2025-02-25 05:56:20.511','2025-02-25 05:56:20.511',NULL),(149,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/01 has been created by Anees Ahmed.','/customer-relation/job-slip/view/55',0,'2025-02-25 05:57:11.988','2025-02-25 05:57:11.988',NULL),(150,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',0,'2025-02-25 05:59:16.550','2025-02-25 05:59:16.550',NULL),(151,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',1,'2025-02-25 05:59:16.550','2025-03-06 03:07:41.622',NULL),(152,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',1,'2025-02-25 05:59:16.550','2025-02-28 07:06:52.714',NULL),(153,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',0,'2025-02-25 05:59:16.550','2025-02-25 05:59:16.550',NULL),(154,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',0,'2025-02-25 05:59:16.550','2025-02-25 05:59:16.550',NULL),(155,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',1,'2025-02-25 05:59:16.550','2025-03-05 05:32:35.847',NULL),(156,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',0,'2025-02-25 05:59:16.550','2025-02-25 05:59:16.550',NULL),(157,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740463156432) has been submitted.','/customer-relation/feedback-complain/view/28',0,'2025-02-25 05:59:16.551','2025-02-25 05:59:16.551',NULL),(158,1,117,104,'Hello Waheed Ur Rehman, Jobslip null-HRA/DC/02 has been created by Anees Ahmed.','/customer-relation/job-slip/view/56',0,'2025-02-25 06:01:31.942','2025-02-25 06:01:31.942',NULL),(159,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',0,'2025-02-25 07:34:52.485','2025-02-25 07:34:52.485',NULL),(160,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',0,'2025-02-25 07:34:52.485','2025-02-25 07:34:52.485',NULL),(161,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',1,'2025-02-25 07:34:52.485','2025-02-28 07:04:40.820',NULL),(162,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',0,'2025-02-25 07:34:52.485','2025-02-25 07:34:52.485',NULL),(163,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',1,'2025-02-25 07:34:52.485','2025-03-05 05:30:17.200',NULL),(164,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',1,'2025-02-25 07:34:52.485','2025-03-06 03:07:37.791',NULL),(165,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',0,'2025-02-25 07:34:52.485','2025-02-25 07:34:52.485',NULL),(166,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740468892429) has been submitted.','/customer-relation/feedback-complain/view/29',0,'2025-02-25 07:34:52.485','2025-02-25 07:34:52.485',NULL),(167,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',1,'2025-02-26 05:06:56.648','2025-03-06 03:07:31.949',NULL),(168,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',0,'2025-02-26 05:06:56.648','2025-02-26 05:06:56.648',NULL),(169,1,154,154,'Hello Admin User, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',0,'2025-02-26 05:06:56.648','2025-02-26 05:06:56.648',NULL),(170,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',0,'2025-02-26 05:06:56.648','2025-02-26 05:06:56.648',NULL),(171,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',0,'2025-02-26 05:06:56.648','2025-02-26 05:06:56.648',NULL),(172,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',1,'2025-02-26 05:06:56.648','2025-02-26 05:07:38.261',NULL),(173,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',0,'2025-02-26 05:06:56.648','2025-02-26 05:06:56.648',NULL),(174,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1740546416378) has been submitted.','/customer-relation/feedback-complain/view/30',1,'2025-02-26 05:06:56.648','2025-02-28 06:59:03.825',NULL),(175,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/6',0,'2025-03-05 05:36:42.938','2025-03-05 05:36:42.938','2025-03-05 05:36:42.937'),(176,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(177,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',1,'2025-03-06 02:38:28.752','2025-03-06 03:07:29.699',NULL),(178,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(179,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(180,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',1,'2025-03-06 02:38:28.752','2025-03-19 05:28:27.907',NULL),(181,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(182,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(183,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1740468892429) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/29',0,'2025-03-06 02:38:28.752','2025-03-06 02:38:28.752',NULL),(184,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',1,'2025-03-06 02:45:01.731','2025-03-06 02:56:05.798',NULL),(185,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.731','2025-03-06 02:45:01.731',NULL),(186,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.731','2025-03-06 02:45:01.731',NULL),(187,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.731','2025-03-06 02:45:01.731',NULL),(188,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.731','2025-03-06 02:45:01.731',NULL),(189,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.731','2025-03-06 02:45:01.731',NULL),(190,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',0,'2025-03-06 02:45:01.732','2025-03-06 02:45:01.732',NULL),(191,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1740546416378) has changed to \"Pending\".','/customer-relation/feedback-complain/view/30',1,'2025-03-06 02:45:01.732','2025-03-06 04:56:51.825',NULL),(192,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/42 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:47:46.539','2025-03-06 02:47:46.539',NULL),(193,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/42 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:47:46.539','2025-03-06 02:47:46.539',NULL),(194,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/55',0,'2025-03-06 02:49:58.518','2025-03-06 02:49:58.518',NULL),(195,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/55',0,'2025-03-06 02:49:58.518','2025-03-06 02:49:58.518',NULL),(196,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/42 has changed to \"Resolved\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:51:20.061','2025-03-06 02:51:20.061',NULL),(197,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/42 has changed to \"Resolved\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:51:20.061','2025-03-06 02:51:20.061',NULL),(198,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/42 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:51:47.395','2025-03-06 02:51:47.395',NULL),(199,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/42 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/47',0,'2025-03-06 02:51:47.395','2025-03-06 02:51:47.395',NULL),(200,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 02:53:39.556','2025-03-06 02:53:39.556',NULL),(201,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 02:53:39.556','2025-03-06 02:53:39.556',NULL),(202,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 02:59:35.705','2025-03-06 02:59:35.705',NULL),(203,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 02:59:35.705','2025-03-06 02:59:35.705',NULL),(204,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 03:03:33.522','2025-03-06 03:03:33.522',NULL),(205,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/56',0,'2025-03-06 03:03:33.522','2025-03-06 03:03:33.522',NULL),(206,1,107,107,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/53',1,'2025-03-06 03:06:38.736','2025-03-06 03:07:03.068',NULL),(207,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip null-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/53',0,'2025-03-06 03:06:38.736','2025-03-06 03:06:38.736',NULL),(208,1,117,117,'Hello Waheed Ur Rehman, the status of JobSlip null-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/53',0,'2025-03-06 03:06:38.736','2025-03-06 03:06:38.736',NULL),(209,2,113,2,'A new FCU report has been created by Khuram Sultan with remarks: checked and found ok','/daily-maintenance/fcu-report/view/3',0,'2025-03-06 04:57:39.597','2025-03-06 04:57:39.597','2025-03-06 04:57:39.592'),(210,2,107,2,'A new FCU report has been created by Khuram Sultan with remarks: checked and found ok','/daily-maintenance/fcu-report/view/3',0,'2025-03-06 04:57:39.597','2025-03-06 04:57:39.597','2025-03-06 04:57:39.592'),(211,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(212,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(213,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(214,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',1,'2025-03-06 06:01:12.129','2025-03-19 05:28:25.222',NULL),(215,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',1,'2025-03-06 06:01:12.129','2025-03-11 07:18:48.756',NULL),(216,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(217,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(218,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741240871868) has been submitted.','/customer-relation/feedback-complain/view/31',0,'2025-03-06 06:01:12.129','2025-03-06 06:01:12.129',NULL),(219,2,107,104,'A new generator record has been added by Anees Ahmed.','/daily-maintenance/generator/view/1',0,'2025-03-07 01:06:46.430','2025-03-07 01:06:46.430','2025-03-07 01:06:46.418'),(220,2,113,104,'A new generator record has been added by Anees Ahmed.','/daily-maintenance/generator/view/1',0,'2025-03-07 01:06:46.430','2025-03-07 01:06:46.430','2025-03-07 01:06:46.418'),(221,2,107,104,'A new firefighting duty for shift: Evening , created by Anees Ahmed.','/security-services/firefighting-duty/view/1',0,'2025-03-07 01:29:12.262','2025-03-07 01:29:12.262','2025-03-07 01:29:12.259'),(222,2,113,104,'A new firefighting duty for shift: Evening , created by Anees Ahmed.','/security-services/firefighting-duty/view/1',0,'2025-03-07 01:29:12.262','2025-03-07 01:29:12.262','2025-03-07 01:29:12.259'),(223,2,113,104,'A new firefighting duty for shift: Morning , created by Anees Ahmed.','/security-services/firefighting-duty/view/2',0,'2025-03-07 01:29:33.065','2025-03-07 01:29:33.065','2025-03-07 01:29:33.055'),(224,2,107,104,'A new firefighting duty for shift: Morning , created by Anees Ahmed.','/security-services/firefighting-duty/view/2',0,'2025-03-07 01:29:33.065','2025-03-07 01:29:33.065','2025-03-07 01:29:33.055'),(225,2,113,104,'A new security report has been created by Anees Ahmed.','/security-services/security-reports/view/1',0,'2025-03-07 01:33:26.977','2025-03-07 01:33:26.977','2025-03-07 01:33:26.966'),(226,2,107,104,'A new security report has been created by Anees Ahmed.','/security-services/security-reports/view/1',0,'2025-03-07 01:33:26.977','2025-03-07 01:33:26.977','2025-03-07 01:33:26.966'),(227,2,107,104,'A new daily duty report for shift Morning has been created by Anees Ahmed.','/security-services/daily-duty-security/view/2',0,'2025-03-07 03:07:15.721','2025-03-07 03:07:15.721','2025-03-07 03:07:15.719'),(228,2,113,104,'A new daily duty report for shift Morning has been created by Anees Ahmed.','/security-services/daily-duty-security/view/2',0,'2025-03-07 03:07:15.721','2025-03-07 03:07:15.721','2025-03-07 03:07:15.719'),(229,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',1,'2025-03-07 06:10:17.847','2025-03-11 07:18:46.747',NULL),(230,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(231,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(232,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(233,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(234,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(235,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',0,'2025-03-07 06:10:17.847','2025-03-07 06:10:17.847',NULL),(236,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741327817663) has been submitted.','/customer-relation/feedback-complain/view/32',1,'2025-03-07 06:10:17.847','2025-03-19 05:28:24.252',NULL),(237,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',1,'2025-03-07 06:23:50.053','2025-03-11 07:18:44.789',NULL),(238,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.053','2025-03-07 06:23:50.053',NULL),(239,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.053','2025-03-07 06:23:50.053',NULL),(240,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.053','2025-03-07 06:23:50.053',NULL),(241,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.053','2025-03-07 06:23:50.053',NULL),(242,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.053','2025-03-07 06:23:50.053',NULL),(243,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',0,'2025-03-07 06:23:50.054','2025-03-07 06:23:50.054',NULL),(244,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741328629901) has been submitted.','/customer-relation/feedback-complain/view/33',1,'2025-03-07 06:23:50.053','2025-03-19 05:28:19.787',NULL),(245,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(246,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',1,'2025-03-07 06:34:20.646','2025-03-11 07:18:42.270',NULL),(247,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(248,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(249,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',1,'2025-03-07 06:34:20.646','2025-03-19 05:28:19.889',NULL),(250,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(251,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(252,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741329260437) has been submitted.','/customer-relation/feedback-complain/view/34',0,'2025-03-07 06:34:20.646','2025-03-07 06:34:20.646',NULL),(253,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(254,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',1,'2025-03-10 04:42:15.365','2025-03-17 06:29:17.522',NULL),(255,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(256,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',1,'2025-03-10 04:42:15.365','2025-03-11 07:18:40.333',NULL),(257,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(258,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(259,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(260,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741581735050) has been submitted.','/customer-relation/feedback-complain/view/35',0,'2025-03-10 04:42:15.365','2025-03-10 04:42:15.365',NULL),(261,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(262,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(263,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(264,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',1,'2025-03-10 04:49:17.557','2025-03-11 07:18:38.374',NULL),(265,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',1,'2025-03-10 04:49:17.557','2025-03-13 06:38:18.631',NULL),(266,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(267,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(268,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741582157209) has been submitted.','/customer-relation/feedback-complain/view/36',0,'2025-03-10 04:49:17.557','2025-03-10 04:49:17.557',NULL),(269,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.140','2025-03-10 06:26:03.140',NULL),(270,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.140','2025-03-10 06:26:03.140',NULL),(271,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',1,'2025-03-10 06:26:03.140','2025-03-11 07:18:35.997',NULL),(272,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.140','2025-03-10 06:26:03.140',NULL),(273,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',1,'2025-03-10 06:26:03.140','2025-03-10 09:25:11.659',NULL),(274,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.140','2025-03-10 06:26:03.140',NULL),(275,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.141','2025-03-10 06:26:03.141',NULL),(276,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741587963067) has been submitted.','/customer-relation/feedback-complain/view/37',0,'2025-03-10 06:26:03.140','2025-03-10 06:26:03.140',NULL),(277,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/3',0,'2025-03-10 07:15:46.787','2025-03-10 07:15:46.787','2025-03-10 07:15:46.781'),(278,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/3',0,'2025-03-10 07:15:46.787','2025-03-10 07:15:46.787','2025-03-10 07:15:46.781'),(279,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/4',0,'2025-03-10 07:23:08.581','2025-03-10 07:23:08.581','2025-03-10 07:23:08.579'),(280,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/4',0,'2025-03-10 07:23:08.581','2025-03-10 07:23:08.581','2025-03-10 07:23:08.579'),(281,2,107,112,'A new Absorption Chiller form has been created by Hammad Raza.','/daily-maintenance/absorptionchiller/view/7',0,'2025-03-10 14:54:30.928','2025-03-10 14:54:30.928','2025-03-10 14:54:30.920'),(282,2,113,112,'A new Absorption Chiller form has been created by Hammad Raza.','/daily-maintenance/absorptionchiller/view/7',0,'2025-03-10 14:54:30.928','2025-03-10 14:54:30.928','2025-03-10 14:54:30.920'),(283,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/5',0,'2025-03-10 15:12:40.251','2025-03-10 15:12:40.251','2025-03-10 15:12:40.250'),(284,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/5',0,'2025-03-10 15:12:40.251','2025-03-10 15:12:40.251','2025-03-10 15:12:40.250'),(285,2,107,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/8',0,'2025-03-11 04:41:56.980','2025-03-11 04:41:56.980','2025-03-11 04:41:56.977'),(286,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/8',0,'2025-03-11 04:41:56.980','2025-03-11 04:41:56.980','2025-03-11 04:41:56.978'),(287,2,107,2,'A new hot-water-boiler report has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/2',0,'2025-03-11 04:45:06.916','2025-03-11 04:45:06.916','2025-03-11 04:45:06.914'),(288,2,113,2,'A new hot-water-boiler report has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/2',0,'2025-03-11 04:45:06.916','2025-03-11 04:45:06.916','2025-03-11 04:45:06.914'),(289,2,107,2,'A new FCU report has been created by Khuram Sultan with remarks: ','/daily-maintenance/fcu-report/view/4',0,'2025-03-11 04:50:14.624','2025-03-11 04:50:14.624','2025-03-11 04:50:14.622'),(290,2,113,2,'A new FCU report has been created by Khuram Sultan with remarks: ','/daily-maintenance/fcu-report/view/4',0,'2025-03-11 04:50:14.624','2025-03-11 04:50:14.624','2025-03-11 04:50:14.622'),(291,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/6',0,'2025-03-11 05:01:45.221','2025-03-11 05:01:45.221','2025-03-11 05:01:45.217'),(292,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/6',0,'2025-03-11 05:01:45.221','2025-03-11 05:01:45.221','2025-03-11 05:01:45.217'),(293,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(294,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(295,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',1,'2025-03-11 06:38:21.628','2025-03-13 06:38:10.258',NULL),(296,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',1,'2025-03-11 06:38:21.628','2025-03-11 07:18:29.374',NULL),(297,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(298,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(299,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(300,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741675101148) has been submitted.','/customer-relation/feedback-complain/view/38',0,'2025-03-11 06:38:21.628','2025-03-11 06:38:21.628',NULL),(301,1,108,108,'Hello Shafiq Ur Rehman, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.847','2025-03-11 07:28:47.847',NULL),(302,1,107,107,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.847','2025-03-11 07:28:47.847',NULL),(303,1,106,106,'Hello Rizwan Mushtaq, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.847','2025-03-11 07:28:47.847',NULL),(304,1,154,154,'Hello Admin User, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',1,'2025-03-11 07:28:47.847','2025-03-11 07:29:13.982',NULL),(305,1,103,103,'Hello Naseer Ahmed, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.865','2025-03-11 07:28:47.865',NULL),(306,1,104,104,'Hello Anees Ahmed, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',1,'2025-03-11 07:28:47.865','2025-03-12 06:13:44.675',NULL),(307,1,105,105,'Hello Mushtaq Ahmed Chishti, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.865','2025-03-11 07:28:47.865',NULL),(308,1,113,113,'Hello Amjad Khalil Abid, a new feedback complain (CMP-1741678127610) has been submitted.','/customer-relation/feedback-complain/view/39',0,'2025-03-11 07:28:47.865','2025-03-11 07:28:47.865',NULL),(309,1,107,107,'Hello Amjad Khalil Abid, the status of JobSlip PLU-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/64',0,'2025-03-11 08:13:25.461','2025-03-11 08:13:25.461',NULL),(310,1,122,122,'Hello Jamil, the status of JobSlip PLU-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/64',0,'2025-03-11 08:13:25.461','2025-03-11 08:13:25.461',NULL),(311,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip PLU-HRA/DC/01 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/64',0,'2025-03-11 08:13:25.461','2025-03-11 08:13:25.461',NULL),(312,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(313,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(314,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(315,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(316,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(317,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(318,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',1,'2025-03-11 08:14:34.340','2025-03-12 06:12:38.114',NULL),(319,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1741678127610) has changed to \"Resolved\".','/customer-relation/feedback-complain/view/39',0,'2025-03-11 08:14:34.340','2025-03-11 08:14:34.340',NULL),(320,1,113,113,'Hello Amjad Khalil Abid, the status of JobSlip PLU-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/65',0,'2025-03-11 08:36:54.938','2025-03-11 08:36:54.938',NULL),(321,1,122,122,'Hello Jamil, the status of JobSlip PLU-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/65',0,'2025-03-11 08:36:54.938','2025-03-11 08:36:54.938',NULL),(322,1,107,107,'Hello Amjad Khalil Abid, the status of JobSlip PLU-HRA/DC/02 has changed to \"Verified & Closed\".','/customer-relation/job-slip/view/65',0,'2025-03-11 08:36:54.938','2025-03-11 08:36:54.938',NULL),(323,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/7',0,'2025-03-12 07:40:03.404','2025-03-12 07:40:03.404','2025-03-12 07:40:03.394'),(324,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/7',0,'2025-03-12 07:40:03.404','2025-03-12 07:40:03.404','2025-03-12 07:40:03.394'),(325,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/8',0,'2025-03-12 07:44:21.372','2025-03-12 07:44:21.372','2025-03-12 07:44:21.364'),(326,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/8',0,'2025-03-12 07:44:21.372','2025-03-12 07:44:21.372','2025-03-12 07:44:21.364'),(327,2,113,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/9',0,'2025-03-12 07:47:39.773','2025-03-12 07:47:39.773','2025-03-12 07:47:39.770'),(328,2,107,2,'A new Absorption Chiller form has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/9',0,'2025-03-12 07:47:39.773','2025-03-12 07:47:39.773','2025-03-12 07:47:39.769'),(329,2,113,2,'A new hot-water-boiler report has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/3',0,'2025-03-12 07:52:03.361','2025-03-12 07:52:03.361','2025-03-12 07:52:03.358'),(330,2,107,2,'A new hot-water-boiler report has been created by Khuram Sultan.','/daily-maintenance/absorptionchiller/view/3',0,'2025-03-12 07:52:03.361','2025-03-12 07:52:03.361','2025-03-12 07:52:03.357'),(331,2,107,108,'A new hot-water-boiler report has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/4',0,'2025-03-12 09:11:25.595','2025-03-12 09:11:25.595','2025-03-12 09:11:25.587'),(332,2,113,108,'A new hot-water-boiler report has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/4',0,'2025-03-12 09:11:25.595','2025-03-12 09:11:25.595','2025-03-12 09:11:25.587'),(333,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/9',0,'2025-03-12 09:15:30.429','2025-03-12 09:15:30.429','2025-03-12 09:15:30.425'),(334,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/9',0,'2025-03-12 09:15:30.429','2025-03-12 09:15:30.429','2025-03-12 09:15:30.425'),(335,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/10',0,'2025-03-12 09:18:32.186','2025-03-12 09:18:32.186','2025-03-12 09:18:32.180'),(336,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/10',0,'2025-03-12 09:18:32.186','2025-03-12 09:18:32.186','2025-03-12 09:18:32.180'),(337,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/11',0,'2025-03-12 13:55:33.410','2025-03-12 13:55:33.410','2025-03-12 13:55:33.399'),(338,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/11',0,'2025-03-12 13:55:33.410','2025-03-12 13:55:33.410','2025-03-12 13:55:33.399'),(339,2,107,155,'A new FCU report has been created by Supervisor User with remarks: 3rd month of calendar ','/daily-maintenance/fcu-report/view/5',0,'2025-03-12 14:22:24.557','2025-03-12 14:22:24.557','2025-03-12 14:22:24.553'),(340,2,113,155,'A new FCU report has been created by Supervisor User with remarks: 3rd month of calendar ','/daily-maintenance/fcu-report/view/5',0,'2025-03-12 14:22:24.557','2025-03-12 14:22:24.557','2025-03-12 14:22:24.553'),(341,2,107,103,'A new hot-water-boiler report has been created by Naseer Ahmed.','/daily-maintenance/absorptionchiller/view/5',0,'2025-03-13 01:29:35.692','2025-03-13 01:29:35.692','2025-03-13 01:29:35.689'),(342,2,113,103,'A new hot-water-boiler report has been created by Naseer Ahmed.','/daily-maintenance/absorptionchiller/view/5',0,'2025-03-13 01:29:35.692','2025-03-13 01:29:35.692','2025-03-13 01:29:35.690'),(343,2,107,103,'A new hot-water-boiler report has been created by Naseer Ahmed.','/daily-maintenance/absorptionchiller/view/6',0,'2025-03-13 01:39:25.056','2025-03-13 01:39:25.056','2025-03-13 01:39:25.052'),(344,2,113,103,'A new hot-water-boiler report has been created by Naseer Ahmed.','/daily-maintenance/absorptionchiller/view/6',0,'2025-03-13 01:39:25.056','2025-03-13 01:39:25.056','2025-03-13 01:39:25.052'),(345,2,107,103,'A new FCU report has been created by Naseer Ahmed with remarks: Test By usman for floors addition . Ground floor + 18,19','/daily-maintenance/fcu-report/view/6',0,'2025-03-13 02:42:10.542','2025-03-13 02:42:10.542','2025-03-13 02:42:10.539'),(346,2,113,103,'A new FCU report has been created by Naseer Ahmed with remarks: Test By usman for floors addition . Ground floor + 18,19','/daily-maintenance/fcu-report/view/6',0,'2025-03-13 02:42:10.542','2025-03-13 02:42:10.542','2025-03-13 02:42:10.539'),(347,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/12',0,'2025-03-13 02:46:41.251','2025-03-13 02:46:41.251','2025-03-13 02:46:41.248'),(348,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/12',0,'2025-03-13 02:46:41.251','2025-03-13 02:46:41.251','2025-03-13 02:46:41.248'),(349,2,107,108,'A new FCU report has been created by Shafiq Ur Rehman with remarks: abc','/daily-maintenance/fcu-report/view/7',0,'2025-03-13 07:08:41.798','2025-03-13 07:08:41.798','2025-03-13 07:08:41.795'),(350,2,113,108,'A new FCU report has been created by Shafiq Ur Rehman with remarks: abc','/daily-maintenance/fcu-report/view/7',0,'2025-03-13 07:08:41.799','2025-03-13 07:08:41.799','2025-03-13 07:08:41.795'),(351,2,107,108,'A new hot-water-boiler report has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/7',0,'2025-03-13 07:13:13.063','2025-03-13 07:13:13.063','2025-03-13 07:13:13.060'),(352,2,113,108,'A new hot-water-boiler report has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/7',0,'2025-03-13 07:13:13.063','2025-03-13 07:13:13.063','2025-03-13 07:13:13.060'),(353,2,107,108,'A new Absorption Chiller form has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/10',0,'2025-03-13 07:17:39.259','2025-03-13 07:17:39.259','2025-03-13 07:17:39.250'),(354,2,113,108,'A new Absorption Chiller form has been created by Shafiq Ur Rehman.','/daily-maintenance/absorptionchiller/view/10',0,'2025-03-13 07:17:39.259','2025-03-13 07:17:39.259','2025-03-13 07:17:39.250'),(355,2,113,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/13',0,'2025-03-13 07:19:39.662','2025-03-13 07:19:39.662','2025-03-13 07:19:39.659'),(356,2,107,103,'A new plumbing project titled \"undefined\" has been created by Naseer Ahmed.','/daily-maintenance/plumbing/view/13',0,'2025-03-13 07:19:39.662','2025-03-13 07:19:39.662','2025-03-13 07:19:39.659'),(357,2,107,104,'A new FCU report has been created by Anees Ahmed with remarks: Testing supervisor','/daily-maintenance/fcu-report/view/8',0,'2025-03-13 18:21:14.288','2025-03-13 18:21:14.288','2025-03-13 18:21:14.286'),(358,2,113,104,'A new FCU report has been created by Anees Ahmed with remarks: Testing supervisor','/daily-maintenance/fcu-report/view/8',0,'2025-03-13 18:21:14.288','2025-03-13 18:21:14.288','2025-03-13 18:21:14.286'),(359,2,107,155,'A new hot-water-boiler report has been created by Supervisor User.','/daily-maintenance/absorptionchiller/view/8',0,'2025-03-14 23:35:29.199','2025-03-14 23:35:29.199','2025-03-14 23:35:29.160'),(360,2,113,155,'A new hot-water-boiler report has been created by Supervisor User.','/daily-maintenance/absorptionchiller/view/8',0,'2025-03-14 23:35:29.199','2025-03-14 23:35:29.199','2025-03-14 23:35:29.160'),(361,2,174,155,'A new hot-water-boiler report has been created by Supervisor User.','/daily-maintenance/absorptionchiller/view/8',0,'2025-03-14 23:35:29.199','2025-03-14 23:35:29.199','2025-03-14 23:35:29.160'),(362,2,113,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/9',0,'2025-03-14 23:37:17.346','2025-03-14 23:37:17.346','2025-03-14 23:37:17.343'),(363,2,107,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/9',0,'2025-03-14 23:37:17.346','2025-03-14 23:37:17.346','2025-03-14 23:37:17.342'),(364,2,174,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/9',0,'2025-03-14 23:37:17.353','2025-03-14 23:37:17.353','2025-03-14 23:37:17.343'),(365,2,107,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/10',0,'2025-03-14 23:40:02.027','2025-03-14 23:40:02.027','2025-03-14 23:40:02.024'),(366,2,174,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/10',0,'2025-03-14 23:40:02.027','2025-03-14 23:40:02.027','2025-03-14 23:40:02.025'),(367,2,113,153,'A new hot-water-boiler report has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/10',0,'2025-03-14 23:40:02.027','2025-03-14 23:40:02.027','2025-03-14 23:40:02.025'),(368,2,174,153,'A new Absorption Chiller form has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/11',0,'2025-03-14 23:43:45.946','2025-03-14 23:43:45.946','2025-03-14 23:43:45.940'),(369,2,107,153,'A new Absorption Chiller form has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/11',0,'2025-03-14 23:43:45.946','2025-03-14 23:43:45.946','2025-03-14 23:43:45.940'),(370,2,113,153,'A new Absorption Chiller form has been created by Super Admin.','/daily-maintenance/absorptionchiller/view/11',0,'2025-03-14 23:43:45.946','2025-03-14 23:43:45.946','2025-03-14 23:43:45.940'),(371,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(372,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(373,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(374,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(375,1,174,174,'Hello Manager, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(376,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(377,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(378,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(379,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1742448795119) has changed to \"In Progress\".','/customer-relation/feedback-complain/view/70',0,'2025-03-20 05:35:18.005','2025-03-20 05:35:18.005',NULL),(380,1,174,174,'Hello Manager, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(381,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(382,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(383,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(384,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(385,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(386,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(387,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(388,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:25:51.554','2025-03-23 01:25:51.554',NULL),(389,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.276','2025-03-23 01:28:09.276',NULL),(390,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.276','2025-03-23 01:28:09.276',NULL),(391,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.276','2025-03-23 01:28:09.276',NULL),(392,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.276','2025-03-23 01:28:09.276',NULL),(393,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.276','2025-03-23 01:28:09.276',NULL),(394,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.277','2025-03-23 01:28:09.277',NULL),(395,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.277','2025-03-23 01:28:09.277',NULL),(396,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.277','2025-03-23 01:28:09.277',NULL),(397,1,174,174,'Hello Manager, the status of feedback complaint (CMP-1742007692770) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/54',0,'2025-03-23 01:28:09.277','2025-03-23 01:28:09.277',NULL),(398,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.048','2025-03-23 01:32:55.048',NULL),(399,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.048','2025-03-23 01:32:55.048',NULL),(400,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.048','2025-03-23 01:32:55.048',NULL),(401,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.048','2025-03-23 01:32:55.048',NULL),(402,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.049','2025-03-23 01:32:55.049',NULL),(403,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.049','2025-03-23 01:32:55.049',NULL),(404,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.049','2025-03-23 01:32:55.049',NULL),(405,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.049','2025-03-23 01:32:55.049',NULL),(406,1,174,174,'Hello Manager, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:32:55.049','2025-03-23 01:32:55.049',NULL),(407,1,106,106,'Hello Rizwan Mushtaq, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(408,1,108,108,'Hello Shafiq Ur Rehman, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(409,1,113,113,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(410,1,174,174,'Hello Manager, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(411,1,107,107,'Hello Amjad Khalil Abid, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(412,1,105,105,'Hello Mushtaq Ahmed Chishti, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(413,1,154,154,'Hello Admin User, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(414,1,104,104,'Hello Anees Ahmed, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL),(415,1,103,103,'Hello Naseer Ahmed, the status of feedback complaint (CMP-1742347230076) has changed to \"DECLINE\".','/customer-relation/feedback-complain/view/61',0,'2025-03-23 01:45:05.794','2025-03-23 01:45:05.794',NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificationtemplate`
--

DROP TABLE IF EXISTS `notificationtemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificationtemplate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `templateText` varchar(191) NOT NULL,
  `isEditable` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `NotificationTemplate_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificationtemplate`
--

LOCK TABLES `notificationtemplate` WRITE;
/*!40000 ALTER TABLE `notificationtemplate` DISABLE KEYS */;
INSERT INTO `notificationtemplate` VALUES (1,'Added Jobslip','{altText}',1,'2024-12-23 01:07:01.964','2024-12-23 01:07:01.964'),(2,'Added Daily','Hello {targetUser}, {altText}',1,'2024-12-23 01:07:13.832','2024-12-23 01:07:13.832'),(3,'Updated Jobslip Invoice','Hello {targetUser},{createdUser} Updated MIF No. of Jobslip .{altText}',1,'2024-12-23 01:07:27.653','2024-12-23 01:07:27.653'),(4,'Status Change FeedbackComplain','{altText}',1,'0000-00-00 00:00:00.000','0000-00-00 00:00:00.000');
/*!40000 ALTER TABLE `notificationtemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `occupancy`
--

DROP TABLE IF EXISTS `occupancy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `occupancy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenantId` int(11) NOT NULL,
  `totalArea` double NOT NULL,
  `rentedArea` double NOT NULL,
  `occupancyArea` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Occupancy_tenantId_fkey` (`tenantId`),
  CONSTRAINT `Occupancy_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `occupancy`
--

LOCK TABLES `occupancy` WRITE;
/*!40000 ALTER TABLE `occupancy` DISABLE KEYS */;
/*!40000 ALTER TABLE `occupancy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plumbingcheck`
--

DROP TABLE IF EXISTS `plumbingcheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plumbingcheck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `washBasin` tinyint(1) NOT NULL DEFAULT 0,
  `shower` tinyint(1) NOT NULL DEFAULT 0,
  `waterTaps` tinyint(1) NOT NULL DEFAULT 0,
  `commode` tinyint(1) NOT NULL DEFAULT 0,
  `indianWC` tinyint(1) NOT NULL DEFAULT 0,
  `englishWC` tinyint(1) NOT NULL DEFAULT 0,
  `waterFlushKit` tinyint(1) NOT NULL DEFAULT 0,
  `waterDrain` tinyint(1) NOT NULL DEFAULT 0,
  `roomId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PlumbingCheck_roomId_key` (`roomId`),
  CONSTRAINT `PlumbingCheck_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plumbingcheck`
--

LOCK TABLES `plumbingcheck` WRITE;
/*!40000 ALTER TABLE `plumbingcheck` DISABLE KEYS */;
INSERT INTO `plumbingcheck` VALUES (1,1,1,0,0,0,0,0,0,1),(2,1,0,0,0,1,0,1,0,2),(3,1,1,0,1,0,0,0,0,3),(4,1,1,1,1,1,1,1,1,4),(5,1,1,1,1,1,1,0,0,5),(6,1,1,1,1,1,1,1,1,6),(7,1,1,1,1,1,1,1,1,7),(8,1,1,1,1,1,1,1,1,8),(9,1,1,1,1,1,1,1,1,9),(10,1,1,1,1,1,1,1,1,10),(11,1,1,1,0,0,0,0,0,11),(12,1,1,1,0,0,0,0,0,12),(13,1,1,1,1,1,1,1,1,13),(14,1,1,1,1,1,1,1,1,14),(15,1,1,1,1,1,1,1,1,15),(16,0,0,0,0,0,0,0,0,16),(17,0,0,0,0,0,0,0,0,17),(18,1,1,1,1,1,1,1,1,18),(19,1,1,1,1,1,1,1,1,19),(20,1,1,1,1,1,1,1,1,20),(21,0,0,0,0,0,0,0,0,21),(22,0,0,0,0,0,0,0,0,22),(23,0,0,0,0,0,0,0,0,23),(24,1,1,1,1,1,1,1,1,24),(25,1,1,1,1,1,1,1,1,25),(26,1,1,1,1,1,1,1,1,26),(27,1,1,0,0,0,0,0,0,27),(28,1,1,0,0,0,0,0,0,28),(29,0,1,1,1,1,0,0,0,29),(30,0,1,1,1,1,0,0,0,30),(39,1,1,1,1,1,1,1,1,31),(40,1,1,1,1,1,1,1,1,32),(41,1,1,1,1,1,1,1,1,33);
/*!40000 ALTER TABLE `plumbingcheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plumbingproject`
--

DROP TABLE IF EXISTS `plumbingproject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plumbingproject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `plumberName` varchar(191) NOT NULL,
  `supervisorName` varchar(191) NOT NULL,
  `engineerName` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plumbingproject`
--

LOCK TABLES `plumbingproject` WRITE;
/*!40000 ALTER TABLE `plumbingproject` DISABLE KEYS */;
INSERT INTO `plumbingproject` VALUES (1,'2025-02-12 08:37:01.806','122','103',NULL),(2,'2025-02-20 05:18:20.323','122','103',NULL),(3,'2025-03-10 07:15:46.474','122','103',NULL),(4,'2025-03-10 07:23:08.447','11','103',NULL),(5,'2025-03-10 15:12:40.168','11','103',NULL),(6,'2025-03-11 05:01:45.051','122','103',NULL),(7,'2025-03-12 07:40:03.285','11','103',NULL),(8,'2025-03-12 07:44:21.248','11','103',NULL),(9,'2025-03-12 09:15:30.364','11','103',NULL),(10,'2025-03-12 09:18:32.043','11','103',NULL),(11,'2025-03-12 13:55:33.257','158','103',NULL),(12,'2025-03-13 02:46:41.157','120','104',NULL),(13,'2025-03-13 07:19:39.306','11','103',NULL);
/*!40000 ALTER TABLE `plumbingproject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pump`
--

DROP TABLE IF EXISTS `pump`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pump` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `capacity` double NOT NULL,
  `location` varchar(191) NOT NULL,
  `waterManagementId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pump_waterManagementId_fkey` (`waterManagementId`),
  CONSTRAINT `Pump_waterManagementId_fkey` FOREIGN KEY (`waterManagementId`) REFERENCES `watermanagement` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pump`
--

LOCK TABLES `pump` WRITE;
/*!40000 ALTER TABLE `pump` DISABLE KEYS */;
/*!40000 ALTER TABLE `pump` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pumpcheck`
--

DROP TABLE IF EXISTS `pumpcheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pumpcheck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pumpId` int(11) NOT NULL,
  `waterSealStatus` varchar(191) NOT NULL,
  `pumpBearingStatus` varchar(191) NOT NULL,
  `motorBearingStatus` varchar(191) NOT NULL,
  `rubberCouplingStatus` varchar(191) NOT NULL,
  `pumpImpellerStatus` varchar(191) NOT NULL,
  `mainValvesStatus` varchar(191) NOT NULL,
  `motorWindingStatus` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PumpCheck_pumpId_fkey` (`pumpId`),
  CONSTRAINT `PumpCheck_pumpId_fkey` FOREIGN KEY (`pumpId`) REFERENCES `pump` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pumpcheck`
--

LOCK TABLES `pumpcheck` WRITE;
/*!40000 ALTER TABLE `pumpcheck` DISABLE KEYS */;
/*!40000 ALTER TABLE `pumpcheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (8,'admin'),(13,'fleet_admin'),(11,'manager'),(7,'super_admin'),(9,'supervisor'),(10,'technician'),(12,'tenant');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roledepartmentpermission`
--

DROP TABLE IF EXISTS `roledepartmentpermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roledepartmentpermission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) DEFAULT NULL,
  `permissionId` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RoleDepartmentPermission_roleId_permissionId_departmentId_key` (`roleId`,`permissionId`,`departmentId`),
  KEY `RoleDepartmentPermission_permissionId_fkey` (`permissionId`),
  KEY `RoleDepartmentPermission_departmentId_fkey` (`departmentId`),
  CONSTRAINT `RoleDepartmentPermission_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `RoleDepartmentPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `RoleDepartmentPermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roledepartmentpermission`
--

LOCK TABLES `roledepartmentpermission` WRITE;
/*!40000 ALTER TABLE `roledepartmentpermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `roledepartmentpermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomName` varchar(191) NOT NULL,
  `locationId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Room_locationId_fkey` (`locationId`),
  CONSTRAINT `Room_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'W/Room-1',1),(2,'Kitchen',1),(3,'W/Room-1',2),(4,'Kitchen',2),(5,'W/Room-1',3),(6,'W/Room-2',3),(7,'Ablution Area',3),(8,'W/Room-1',4),(9,'W/Room-2',4),(10,'Ablution Area',4),(11,'W/Room-1',5),(12,'W/Room-2',5),(13,'W/Room-1',6),(14,'W/Room-2',6),(15,'Ablution Area',6),(16,'W/Room-1',7),(17,'Kitchen',7),(18,'W/Room-1',8),(19,'W/Room-2',8),(20,'Ablution Area',8),(21,'W/Room-1',9),(22,'W/Room-2',9),(23,'Ablution Area',9),(24,'W/Room-1',10),(25,'W/Room-2',10),(26,'Ablution Area',10),(27,'W/Room-1',11),(28,'Kitchen',11),(29,'W/Room-1',12),(30,'W/Room-2',12),(31,'W/Room-1',13),(32,'W/Room-2',13),(33,'Ablution Area',13);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `securityreport`
--

DROP TABLE IF EXISTS `securityreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `securityreport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `observedBy` int(11) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `description` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `timeNoted` datetime(3) NOT NULL,
  `timeSolved` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `securityreport`
--

LOCK TABLES `securityreport` WRITE;
/*!40000 ALTER TABLE `securityreport` DISABLE KEYS */;
INSERT INTO `securityreport` VALUES (1,'2025-03-06 00:00:00.000',63,48,'Testing by Usman','Testing by Usman','2025-03-06 15:00:00.000','2025-03-06 16:00:00.000','2025-03-07 01:33:26.898','2025-03-10 09:15:59.126',NULL);
/*!40000 ALTER TABLE `securityreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjanreport`
--

DROP TABLE IF EXISTS `subjanreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjanreport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floorNo` varchar(191) DEFAULT NULL,
  `toilet` varchar(191) NOT NULL,
  `lobby` varchar(191) NOT NULL,
  `staircase` varchar(191) NOT NULL,
  `janitorialReportId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SubJanReport_janitorialReportId_fkey` (`janitorialReportId`),
  CONSTRAINT `SubJanReport_janitorialReportId_fkey` FOREIGN KEY (`janitorialReportId`) REFERENCES `janitorialreport` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjanreport`
--

LOCK TABLES `subjanreport` WRITE;
/*!40000 ALTER TABLE `subjanreport` DISABLE KEYS */;
INSERT INTO `subjanreport` VALUES (5,'10','Satisfactory','Satisfactory','Satisfactory',5),(6,'17','Satisfactory','Satisfactory','Satisfactory',6),(7,'1','Satisfactory','Satisfactory','Satisfactory',6),(8,'19','Unsatisfactory','Satisfactory','Satisfactory',6),(9,'Basement','Satisfactory','Satisfactory','Satisfactory',7),(10,'Ground Floor','Satisfactory','Satisfactory','Satisfactory',7),(11,'7','Unsatisfactory','Satisfactory','Satisfactory',7);
/*!40000 ALTER TABLE `subjanreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenants`
--

DROP TABLE IF EXISTS `tenants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tenants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenantName` varchar(191) NOT NULL,
  `totalAreaSq` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenants`
--

LOCK TABLES `tenants` WRITE;
/*!40000 ALTER TABLE `tenants` DISABLE KEYS */;
INSERT INTO `tenants` VALUES (3,'Huawei Technologies Pakistan (Pvt) Ltd.',93105,'2024-12-18 11:41:19.534','2025-02-18 09:22:04.413',NULL,159),(48,'Taisei Corporation',1523,'2025-02-17 10:41:20.557','2025-02-17 10:41:20.557',NULL,NULL),(49,'Sinohydro Corporation',5454,'2025-02-17 10:42:31.894','2025-02-17 10:42:31.894',NULL,NULL),(50,'SAAB International',3419,'2025-02-17 10:43:33.636','2025-02-17 10:43:33.636',NULL,NULL),(51,'Vacant',4092,'2025-02-17 10:44:13.324','2025-02-17 10:44:13.324',NULL,NULL),(52,'Saudi Pak Real State Limited',2243,'2025-02-17 10:45:06.380','2025-02-17 10:45:06.380',NULL,NULL),(53,'Capital Strategies Group (Private) Limited',1523,'2025-02-17 10:45:47.141','2025-02-17 10:45:47.141',NULL,NULL),(54,'Pak China Investment Company Limited',11406,'2025-02-17 10:47:19.328','2025-02-18 09:41:59.422',NULL,NULL),(56,'Alfalah Asset Management Limited',2569,'2025-02-17 10:50:30.901','2025-02-17 10:50:30.901',NULL,NULL),(57,'Vacant',2570,'2025-02-17 10:51:02.338','2025-02-17 10:51:02.338',NULL,NULL),(58,'Standard Chartered Bank (Pakistan) Limited',3500,'2025-02-17 10:59:10.508','2025-02-17 10:59:10.508',NULL,NULL),(63,'Ericsson Pakistan (Pvt) Limited',13555,'2025-02-17 11:04:42.239','2025-02-17 11:04:42.239',NULL,NULL),(64,'Professional Employers (Pvt) Limited',3088,'2025-02-17 11:05:25.675','2025-02-17 11:05:25.675',NULL,NULL),(65,'Sumitomo Corporation Asia & Oceania Pte. Ltd.',2267,'2025-02-17 11:05:57.999','2025-02-17 11:05:57.999',NULL,NULL),(66,'Executive Business Center',3161,'2025-02-17 11:06:58.279','2025-02-17 11:06:58.279',NULL,NULL),(67,'Saudi Pak Ind. & Agr. Inv. Co. Ltd.',25545,'2025-02-17 11:54:45.019','2025-02-19 10:29:44.801',NULL,NULL),(68,'ICSI (Pvt) Limited',22981,'2025-02-18 09:35:34.841','2025-02-18 09:38:28.710',NULL,NULL);
/*!40000 ALTER TABLE `tenants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timehour`
--

DROP TABLE IF EXISTS `timehour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timehour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `boilerId` int(11) NOT NULL,
  `time` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `HotWaterIn` double NOT NULL,
  `HotWaterOut` double NOT NULL,
  `ExhaustTemp` double NOT NULL,
  `FurnacePressure` double NOT NULL,
  `assistantSupervisor` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TimeHour_boilerId_fkey` (`boilerId`),
  CONSTRAINT `TimeHour_boilerId_fkey` FOREIGN KEY (`boilerId`) REFERENCES `hotwaterboiler` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timehour`
--

LOCK TABLES `timehour` WRITE;
/*!40000 ALTER TABLE `timehour` DISABLE KEYS */;
INSERT INTO `timehour` VALUES (26,1,'2025-03-07 03:05:00.000',1,1,1,1,'Asif','2025-03-07 01:03:39.465','2025-03-07 01:03:39.465'),(28,1,'2025-03-07 03:00:00.000',2,4,5,6,'Asif ','2025-03-07 01:03:39.465','2025-03-07 01:03:39.465'),(29,1,'2025-03-07 13:00:00.000',2,3,4,5,'Asif ','2025-03-07 01:03:39.465','2025-03-07 01:03:39.465'),(33,2,'2025-03-11 04:45:00.000',2,4,12,3,'Asif ','2025-03-11 04:47:53.704','2025-03-11 04:47:53.704'),(34,2,'2025-03-11 05:00:00.000',3,5,11,2,'Asif ','2025-03-11 04:47:53.704','2025-03-11 04:47:53.704'),(35,2,'2025-03-11 06:00:00.000',3,4,13,4,'Asif ','2025-03-11 04:47:53.704','2025-03-11 04:47:53.704'),(41,3,'2025-03-12 08:00:00.000',2,3,4,5,'Asif','2025-03-12 09:07:12.778','2025-03-12 09:07:12.778'),(42,3,'2025-03-12 09:00:00.000',5,4,3,2,'Asif','2025-03-12 09:07:12.778','2025-03-12 09:07:12.778'),(43,3,'2025-03-12 10:07:00.000',2,4,2,5,'Asif','2025-03-12 09:07:12.778','2025-03-12 09:07:12.778'),(56,5,'2025-03-13 01:29:00.000',12,12,12,12,'Asif','2025-03-13 01:52:27.947','2025-03-13 01:52:27.947'),(62,4,'2025-03-14 22:55:00.000',1,1,2,2,'asif','2025-03-14 22:55:57.730','2025-03-14 22:55:57.730'),(63,7,'2025-03-15 09:13:00.000',5,5,5,5,'asif','2025-03-14 22:56:20.133','2025-03-14 22:56:20.133'),(64,7,'2025-03-15 09:14:00.000',4,4,44,4,'Asif','2025-03-14 22:56:20.133','2025-03-14 22:56:20.133'),(65,7,'2025-03-14 22:56:00.000',3,3,33,3,'Asif','2025-03-14 22:56:20.133','2025-03-14 22:56:20.133'),(66,8,'2025-03-14 23:35:29.062',1,1,1,1,'Asif','2025-03-14 23:35:29.062','2025-03-14 23:35:29.062'),(69,10,'2025-03-15 00:40:00.000',11,11,11,11,'Asif','2025-03-14 23:40:18.209','2025-03-14 23:40:18.209');
/*!40000 ALTER TABLE `timehour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transformers`
--

DROP TABLE IF EXISTS `transformers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transformers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `transformerNo` varchar(191) NOT NULL,
  `lastMaintenance` datetime(3) DEFAULT NULL,
  `nextMaintenance` datetime(3) DEFAULT NULL,
  `lastDehydration` datetime(3) DEFAULT NULL,
  `nextDehydration` datetime(3) DEFAULT NULL,
  `engineer` int(11) NOT NULL,
  `temp` double DEFAULT NULL,
  `tempStatus` varchar(191) DEFAULT NULL,
  `HTvoltage` double DEFAULT NULL,
  `HTStatus` varchar(191) DEFAULT NULL,
  `LTvoltage` double DEFAULT NULL,
  `LTStatus` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transformers`
--

LOCK TABLES `transformers` WRITE;
/*!40000 ALTER TABLE `transformers` DISABLE KEYS */;
INSERT INTO `transformers` VALUES (1,'2024-12-24 00:00:00.000','Transformer No 1',NULL,'2025-01-24 00:00:00.000',NULL,'2025-01-24 00:00:00.000',541,38,'High',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `transformers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`),
  KEY `User_roleId_fkey` (`roleId`),
  KEY `User_departmentId_fkey` (`departmentId`),
  CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Asif Zia Tehsecn','asifziatehseen1985@gmail.com','asifziatehsecn','$2a$10$06XRRjWOTAeJxyOoKxIJtuuX/o/0vhZQ1hSk/FWCfj4hYMNBqOxBe',9,30,'2025-01-01 17:04:34.453','2025-01-07 08:35:19.991'),(2,'Khuram Sultan','ceo@hanke.pk','khuramsultan','$2a$10$L2r5S0qVoBFPTZG0h3UUMeiQlQoch0b4xfWkOt4goKJYHH8E/YOEa',9,30,'2025-01-01 17:04:34.528','2025-01-07 08:35:07.308'),(3,'Samad Mehmood','samadmehmood@example.com','samadmehmood','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.780','2025-01-01 17:04:34.780'),(4,'Asad Mehmood','asadmehmood@example.com','asadmehmood','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.842','2025-01-01 17:04:34.842'),(5,'Noman Israz','nomanisraz@example.com','nomanisraz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.872','2025-01-01 17:04:34.872'),(6,'Dahnyal Abbasi','dahnyalabbasi@example.com','dahnyalabbasi','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.908','2025-01-01 17:04:34.908'),(7,'Kashan Rahman','kashanrahman@example.com','kashanrahman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.951','2025-01-01 17:04:34.951'),(8,'Iftikhaer Ahmed','iftikhaerahmed@example.com','iftikhaerahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:34.983','2025-01-01 17:04:34.983'),(9,'Gul Nawaz Khan','gulnawazkhan@example.com','gulnawazkhan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:35.026','2025-01-01 17:04:35.026'),(10,'Nadeem Areshad','nadeemareshad@example.com','nadeemareshad','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,30,'2025-01-01 17:04:35.059','2025-01-01 17:04:35.059'),(11,'Muhmmad Jamil','muhmmadjamil@example.com','MuhammadJamil','$2a$10$NLYzEM1HjlkNV/sFDXEYL.AiPcCj8oBCDPmc12tJeikt/U8MGq.ny',10,44,'2025-01-01 17:04:35.081','2025-02-20 06:03:50.576'),(12,'Shehroze Khan','shehroze.awan72@gmail.com','shehrozekhan','$2a$10$uZSWq0pZxgqLsMgvbjVtquRbRNX2hknoaJ.sU1KS2QhsbR4.obkL2',9,31,'2025-01-01 17:04:35.100','2025-01-07 08:34:08.786'),(13,'M.Qasim','m.qasim@example.com','m.qasim','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,31,'2025-01-01 17:04:35.122','2025-01-01 17:04:35.122'),(14,'Yonus Masih','yonusmasih@example.com','yonusmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.142','2025-01-01 17:04:35.142'),(15,'Afrahim Fareed','afrahimfareed@example.com','afrahimfareed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.164','2025-01-01 17:04:35.164'),(16,'M. Waqar','m.waqar@example.com','m.waqar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.183','2025-01-01 17:04:35.183'),(17,'Ishaq Masih','ishaqmasih@example.com','ishaqmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.205','2025-01-01 17:04:35.205'),(18,'Salim Masih','salimmasih@example.com','salimmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.225','2025-01-01 17:04:35.225'),(19,'Amjid Ali','amjidali@example.com','amjidali','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.247','2025-01-01 17:04:35.247'),(20,'Adnan Faisal','adnanfaisal@example.com','adnanfaisal','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.267','2025-01-01 17:04:35.267'),(21,'Vishal William','vishalwilliam@example.com','vishalwilliam','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.289','2025-01-01 17:04:35.289'),(22,'M. Waqas','m.waqas@example.com','m.waqas','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.308','2025-01-01 17:04:35.308'),(23,'Asghar Masih','asgharmasih@example.com','asgharmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.330','2025-01-01 17:04:35.330'),(24,'Farooq Masih','farooqmasih@example.com','farooqmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.350','2025-01-01 17:04:35.350'),(25,'Adeel Masih','adeelmasih@example.com','adeelmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.372','2025-01-01 17:04:35.372'),(26,'Arif Masih','arifmasih@example.com','arifmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.392','2025-01-01 17:04:35.392'),(27,'Thomas Masih','thomasmasih@example.com','thomasmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.414','2025-01-01 17:04:35.414'),(28,'Iftikhar Masih','iftikharmasih@example.com','iftikharmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.433','2025-01-01 17:04:35.433'),(29,'Raiz Masih','raizmasih@example.com','raizmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.455','2025-01-01 17:04:35.455'),(30,'Asif Masih','asifmasih@example.com','asifmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.475','2025-01-01 17:04:35.475'),(31,'Kashif Khokhar','kashifkhokhar@example.com','kashifkhokhar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.497','2025-01-01 17:04:35.497'),(32,'M. Haseeb','m.haseeb@example.com','m.haseeb','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.517','2025-01-01 17:04:35.517'),(33,'M.Asif','m.asif@example.com','m.asif','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.539','2025-01-01 17:04:35.539'),(34,'Basit Hussain','basithussain@example.com','basithussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.558','2025-01-01 17:04:35.558'),(35,'Nadeem Masih','nadeemmasih@example.com','nadeemmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.580','2025-01-01 17:04:35.580'),(36,'Aryan Masih','aryanmasih@example.com','aryanmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.600','2025-01-01 17:04:35.600'),(37,'Horab Sarfraz','horabsarfraz@example.com','horabsarfraz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.622','2025-01-01 17:04:35.622'),(38,'M. Usman','m.usman@example.com','m.usman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.642','2025-01-01 17:04:35.642'),(39,'Johar Shafique','joharshafique@example.com','joharshafique','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.663','2025-01-01 17:04:35.663'),(40,'M. Zubair','m.zubair@example.com','m.zubair','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:35.693','2025-01-01 17:04:35.693'),(41,'Obaid Masih','obaidmasih@example.com','obaidmasih','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.108','2025-01-01 17:04:36.108'),(42,'Arslan Haroon','arslanharoon@example.com','arslanharoon','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.160','2025-01-01 17:04:36.160'),(43,'Yasir','yasir@example.com','yasir','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.216','2025-01-01 17:04:36.216'),(44,'Annees ul Hussan','anneesulhussan@example.com','anneesulhussan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.250','2025-01-01 17:04:36.250'),(45,'Jamshaid hussan','jamshaidhussan@example.com','jamshaidhussan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.283','2025-01-01 17:04:36.283'),(46,'Sharbat Ali','sharbatali@example.com','sharbatali','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,31,'2025-01-01 17:04:36.317','2025-01-01 17:04:36.317'),(47,'Abdul Rehman','abdulrehman@example.com','abdulrehman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,32,'2025-01-01 17:04:36.364','2025-01-01 17:04:36.364'),(48,'Faiz-ur -Rehman','faiz-ur-rehman@example.com','faiz-ur-rehman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,32,'2025-01-01 17:04:36.400','2025-01-01 17:04:36.400'),(49,'Ikhtiar Gul','ikhtiargul@example.com','ikhtiargul','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,32,'2025-01-01 17:04:36.433','2025-01-01 17:04:36.433'),(50,'M.Zareen','m.zareen@example.com','m.zareen','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,32,'2025-01-01 17:04:36.475','2025-01-01 17:04:36.475'),(51,'Sarfaraz khan','sarfarazkhan@example.com','sarfarazkhan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,34,'2025-01-01 17:04:36.497','2025-01-01 17:04:36.497'),(52,'Dildar','dildar@example.com','dildar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,34,'2025-01-01 17:04:36.525','2025-01-01 17:04:36.525'),(53,'Wajid Ali','wajidali@example.com','wajidali','$2a$10$dyTnKQtTzzlJsdQboC5R2ufab91ouyjghO6Fqb5nf9dYfO1uqWZU6',10,35,'2025-01-01 17:04:36.547','2025-03-23 01:00:47.030'),(54,'Jawad Hussain','jawadhussain@example.com','JawadHussain','$2a$10$42hutynvmc3gE46v4gon4.OcEOTNTrws04ii7VkCR0ybCx2i1joje',10,35,'2025-01-01 17:04:36.584','2025-02-20 11:22:07.338'),(55,'Muhammad Saqib','muhammadsaqib@example.com','muhammadsaqib','$2a$10$Z/2JNkfSxDGzAR8SB/JhRuIxzT2ZXSxUBKl/h8E0F5DAkNM0J9cle',10,35,'2025-01-01 17:04:36.625','2025-02-20 11:22:19.730'),(56,'Ahsan Ali','ahsanali@example.com','AhsanAli','$2a$10$ZYCp6x0r5Kynlu.knEHXRufu/31/tb/VuA2u9C7sX.CKu8uzsgq/W',10,57,'2025-01-01 17:04:36.664','2025-03-18 15:03:01.294'),(57,'Mudessar Hussain','mudessarhussain@example.com','mudessarhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,36,'2025-01-01 17:04:36.700','2025-01-01 17:04:36.700'),(58,'M.Kashif','mkashif8638@gmail.com','m.kashif','$2a$10$goohQvXTt.jshaqUO98F5.pQ7fJNwO9V52vCSFtSs2CPx6.pAuG6e',10,36,'2025-01-01 17:04:36.722','2025-01-07 08:32:32.997'),(59,'Sumaira','sumaira@example.com','sumaira','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,37,'2025-01-01 17:04:36.756','2025-01-01 17:04:36.756'),(60,'Soniya shah','soniyashah@example.com','soniyashah','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,37,'2025-01-01 17:04:36.792','2025-01-01 17:04:36.792'),(61,'M.Waseem Asif','m.waseemasif@example.com','m.waseemasif','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,38,'2025-01-01 17:04:36.830','2025-01-01 17:04:36.830'),(62,'Talha Rasheed','talharasheed@example.com','talharasheed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,39,'2025-01-01 17:04:36.850','2025-01-01 17:04:36.850'),(63,'Ghulam Sabir','ghulamsabir@example.com','ghulamsabir','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:36.883','2025-01-01 17:04:36.883'),(64,'Liaqat Hussain','liaqathussain@example.com','liaqathussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:36.905','2025-01-01 17:04:36.905'),(65,'Mehmood Javad','mehmoodjavad@example.com','mehmoodjavad','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:36.941','2025-01-01 17:04:36.941'),(66,'Nazir Hussain','nazirhussain@example.com','nazirhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:36.976','2025-01-01 17:04:36.976'),(67,'Ansar Mehmood','ansarmehmood@example.com','ansarmehmood','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.017','2025-01-01 17:04:37.017'),(68,'M.Akram','m.akram@example.com','m.akram','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.050','2025-01-01 17:04:37.050'),(69,'Muhammad','muhammad@example.com','muhammad','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.072','2025-01-01 17:04:37.072'),(70,'M.Iqbal','m.iqbal@example.com','m.iqbal','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.092','2025-01-01 17:04:37.092'),(71,'Parvaz Ahmed','parvazahmed@example.com','parvazahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.113','2025-01-01 17:04:37.113'),(72,'Areshad Mehmood','areshadmehmood@example.com','areshadmehmood','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.150','2025-01-01 17:04:37.150'),(73,'Abdul Qayyum','abdulqayyum@example.com','abdulqayyum','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.172','2025-01-01 17:04:37.172'),(74,'Mansha Ahmed','manshaahmed@example.com','manshaahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.200','2025-01-01 17:04:37.200'),(75,'Sultan Ahmed','sultanahmed@example.com','sultanahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.222','2025-01-01 17:04:37.222'),(76,'Zulfiqar Hussain','zulfiqarhussain@example.com','zulfiqarhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.242','2025-01-01 17:04:37.242'),(77,'Sardar Khan','sardarkhan@example.com','sardarkhan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.275','2025-01-01 17:04:37.275'),(78,'M.Munir','m.munir@example.com','m.munir','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.308','2025-01-01 17:04:37.308'),(79,'Tabraiz Abbasi','tabraizabbasi@example.com','tabraizabbasi','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.330','2025-01-01 17:04:37.330'),(80,'Ziyarat Gull','ziyaratgull@example.com','ziyaratgull','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.350','2025-01-01 17:04:37.350'),(81,'Nazakat Ali','nazakatali@example.com','nazakatali','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.372','2025-01-01 17:04:37.372'),(82,'Abid Hussain','abidhussain@example.com','abidhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.392','2025-01-01 17:04:37.392'),(83,'Alif Gull','alifgull@example.com','alifgull','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.414','2025-01-01 17:04:37.414'),(84,'Hasnain Gull','hasnaingull@example.com','hasnaingull','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.433','2025-01-01 17:04:37.433'),(85,'M.Arif','m.arif@example.com','m.arif','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.475','2025-01-01 17:04:37.475'),(86,'Nisar Ahmed','nisarahmed@example.com','nisarahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.497','2025-01-01 17:04:37.497'),(87,'Guldar Khan','guldarkhan@example.com','guldarkhan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.517','2025-01-01 17:04:37.517'),(88,'Sher Zaman','sherzaman@example.com','sherzaman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.539','2025-01-01 17:04:37.539'),(89,'Fazal-Rehman','fazal-rehman@example.com','fazal-rehman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.559','2025-01-01 17:04:37.559'),(90,'Khan Muhammad','khanmuhammad@example.com','khanmuhammad','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.580','2025-01-01 17:04:37.580'),(91,'M. Tabraiz','m.tabraiz@example.com','m.tabraiz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.600','2025-01-01 17:04:37.600'),(92,'Sarib Ali Shah','saribalishah@example.com','saribalishah','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.622','2025-01-01 17:04:37.622'),(93,'Ghulam Shabbir','ghulamshabbir@example.com','ghulamshabbir','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.642','2025-01-01 17:04:37.642'),(94,'M. Mumtaz','m.mumtaz@example.com','m.mumtaz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.664','2025-01-01 17:04:37.664'),(95,'Zulfiqar Ali','zulfiqarali@example.com','zulfiqarali','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.684','2025-01-01 17:04:37.684'),(96,'Saqib Aziz','saqibaziz@example.com','saqibaziz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.722','2025-01-01 17:04:37.722'),(97,'Sabtian Hussain','sabtianhussain@example.com','sabtianhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.742','2025-01-01 17:04:37.742'),(98,'M. Mehboob Hussain','m.mehboobhussain@example.com','m.mehboobhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.783','2025-01-01 17:04:37.783'),(99,'M. Ejaz','m.ejaz@example.com','m.ejaz','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.806','2025-01-01 17:04:37.806'),(100,'Ghulam Ansar','ghulamansar@example.com','ghulamansar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.850','2025-01-01 17:04:37.850'),(101,'M. khalid Khan','m.khalidkhan@example.com','m.khalidkhan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.872','2025-01-01 17:04:37.872'),(102,'Saeed Ahmed','saeedahmed@example.com','saeedahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,40,'2025-01-01 17:04:37.909','2025-01-01 17:04:37.909'),(103,'Naseer Ahmed','naseerahmed@example.com','naseerahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',9,41,'2025-01-01 17:04:37.931','2025-01-01 17:04:37.931'),(104,'Anees Ahmed','anees.abbasi1435@gmail.com','aneesahmed','$2a$10$1om6mW/kxsY6tFqHPVVrWu1mLXdK0p67a8KkdlQcJ1vOZS/vve3Qy',9,41,'2025-01-01 17:04:37.950','2025-01-07 08:33:34.010'),(105,'Mushtaq Ahmed Chishti','mushtaq.ahmed@saudipak.com','mushtaqahmedchishti','$2a$10$Oek11iXnbfQYPEuQDl7ute7Sxva4cbRGGWn7FaEbUf87dBv7f3Jm.',9,41,'2025-01-01 17:04:37.972','2025-01-07 08:33:50.373'),(106,'Rizwan Mushtaq','rizwan.mushtaq@saudipak.com','rizwanmushtaq','$2a$10$ae5evWYAOZRm0aKcr7drUO57y5.G8hr.2YEuZne6bEcn67grCYJUW',8,NULL,'2025-01-01 17:04:37.991','2025-01-07 08:31:06.419'),(107,'Amjad Khalil Abid','amjad.khalil@saudipak.com','amjadkhalilabid','$2a$10$0rKV9.FtkvQ64Tl38t3SdO/PblAA4xHr3EnQVUm9W/JF/IQgf0mmm',11,NULL,'2025-01-01 17:04:38.072','2025-03-06 03:06:23.109'),(108,'Shafiq Ur Rehman','shafiq.rehman@saudipak.com','shafiqurrehman','$2a$10$cvDEkeA3Xr8VYgOkgZXFoeyxj7x.pLsCn0WynUGpVyfzO8I3uceLu',8,NULL,'2025-01-01 17:04:38.101','2025-01-07 08:31:54.237'),(109,'Adnan Adil Hussain','adnanadilhussain@example.com','adnanadilhussain','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',7,NULL,'2025-01-01 17:04:38.150','2025-01-01 17:04:38.150'),(110,'Maqsood Ahmed Shaikh','maqsood.ahmed@saudipak.com','maqsoodahmedshaikh','$2a$10$Uz6nt91dsGa.Hn30mKk0XeZIDYjXYAir54tTdEeCkNVIxg7e6p0j2',7,NULL,'2025-01-01 17:04:38.209','2025-01-07 08:29:05.251'),(111,'Muhammad Yousaf Kharal','muhammadyousafkharal@example.com','muhammadyousafkharal','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',7,NULL,'2025-01-01 17:04:38.231','2025-01-01 17:04:38.231'),(112,'Hammad Raza','hammad.raza@saudipak.com','hammadraza','$2a$10$UIxM3Qo7pOEQ8kMILOQ9HOML4P9SDTO9R00OIqZP1kMFtsfrsyQZW',7,NULL,'2025-01-01 17:04:38.267','2025-03-08 03:04:59.804'),(113,'Amjad Khalil Abid','amjadkhalilabid1@example.com','amjadkhalilabid1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',11,NULL,'2025-01-01 17:04:38.289','2025-01-01 17:04:38.289'),(114,'Muhammad Ashiq','mashiq8007@gmail.com','muhammadashiq','$2a$10$7GNDMbkUxrXYw/dkOCFUEeCME6rq9fz9ZEqqk3xSYsDabVQbRDqkm',9,42,'2025-01-01 17:04:38.331','2025-01-07 10:06:40.265'),(115,'Adil Ashraf','adiladilashraf317@gmail.com','adilashraf','$2a$10$dBbMzQsFowr39mPVmEy55urK9nK5rn0gbQn/nItZdH58yhLFer1Yy',10,42,'2025-01-01 17:04:38.381','2025-01-07 10:07:15.045'),(116,'Hammad Rafique','hammad8105@gmail.com','hammadrafique','$2a$10$K7bzrVJUhOCRVUP2vAeSoOt3PvE6uMfbxm/O6Fs9sUefVRklOGQe2',10,42,'2025-01-01 17:04:38.400','2025-01-07 10:07:43.739'),(117,'Waheed Ur Rehman','wk6583868@gmail.com','waheedurrehman','$2a$10$D12AsIAT/QJiMQ0TVsxhROslfc3h8sZVzJi9bnDSyIxZePdI0kqPq',10,42,'2025-01-01 17:04:38.422','2025-01-07 10:08:50.259'),(118,'Aqib','aqib@example.com','aqib','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,43,'2025-01-01 17:04:38.442','2025-01-01 17:04:38.442'),(119,'Naveed','naveed@example.com','naveed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,43,'2025-01-01 17:04:38.464','2025-01-01 17:04:38.464'),(120,'Shabbir Ahmed','shabbirahmed@example.com','shabbirahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,44,'2025-01-01 17:04:38.517','2025-01-01 17:04:38.517'),(121,'Atta ur Rehman','attaurrehman@example.com','attaurrehman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,44,'2025-01-01 17:04:38.556','2025-01-01 17:04:38.556'),(122,'Jamil','mj248594@gmail.com','jamil','$2a$10$Bw96.s6mIqEuB83gpyL5r.8b7Xar8vBrWPnIb1u.H4F1Nyf9v/ige',10,44,'2025-01-01 17:04:38.583','2025-01-07 08:35:51.404'),(123,'Muhammad Boota','muhammadboota@example.com','muhammadboota','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,45,'2025-01-01 17:04:38.622','2025-01-01 17:04:38.622'),(124,'Nazir Ahmed','nazirahmed@example.com','nazirahmed','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,45,'2025-01-01 17:04:38.642','2025-01-01 17:04:38.642'),(125,'Qasid Ali','qasidali@example.com','qasidali','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,46,'2025-01-01 17:04:38.741','2025-01-01 17:04:38.741'),(126,'Ghulam Bahadar','ghulambahadar@example.com','ghulambahadar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,46,'2025-01-01 17:04:38.860','2025-01-01 17:04:38.860'),(127,'Patras','patras@example.com','patras','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,47,'2025-01-01 17:04:38.909','2025-01-01 17:04:38.909'),(128,'Shams Ul Hassan','shamsulhassan@example.com','shamsulhassan','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,47,'2025-01-01 17:04:38.956','2025-01-01 17:04:38.956'),(129,'Nazar Rehman','nazarrehman@example.com','nazarrehman','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,48,'2025-01-01 17:04:39.006','2025-01-01 17:04:39.006'),(130,'Nazar Rehman','nazarrehman8555@gmail.com','nazarrehman1','$2a$10$b9SOeY7xrHzoPFrSZlVdleTWCATJYi/IXIVmxnD/rkY/OK0iB1FB6',10,49,'2025-01-01 17:04:39.073','2025-01-07 08:34:45.082'),(131,'Mudasar','mudasar@example.com','mudasar','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,36,'2025-01-01 17:04:39.125','2025-01-01 17:04:39.125'),(132,'Kashif','kashif@example.com','kashif','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,36,'2025-01-01 17:04:39.167','2025-01-01 17:04:39.167'),(133,'Shani Trading','shanitrading@example.com','shanitrading','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.189','2025-01-01 17:04:39.189'),(134,'Sohail Jattalah','sohailjattalah@example.com','sohailjattalah','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.234','2025-01-01 17:04:39.234'),(135,'Fire & Safety','fire&safety@example.com','fire&safety','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.272','2025-01-01 17:04:39.272'),(136,'SPE','spe@example.com','spe','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.325','2025-01-01 17:04:39.325'),(137,'Hussain Sons','hussainsons@example.com','hussainsons','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.375','2025-01-01 17:04:39.375'),(138,'Ideal Homes','idealhomes@example.com','idealhomes','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.425','2025-01-01 17:04:39.425'),(139,'Allied Eng.','alliedeng.@example.com','alliedeng.','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.458','2025-01-01 17:04:39.458'),(140,'JeevaJee','jeevajee@example.com','jeevajee','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.609','2025-01-01 17:04:39.609'),(141,'ITC','itc@example.com','itc','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.631','2025-01-01 17:04:39.631'),(142,'M. Afzal Landscapping','m.afzallandscapping@example.com','m.afzallandscapping','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.667','2025-01-01 17:04:39.667'),(143,'Irfan & Co.','irfan&co.@example.com','irfan&co.','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.708','2025-01-01 17:04:39.708'),(144,'HANKE','hanke@example.com','hanke','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,50,'2025-01-01 17:04:39.759','2025-01-01 17:04:39.759'),(145,'Atta ur Rehman','attaurrehman1@example.com','attaurrehman1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,51,'2025-01-01 17:04:39.800','2025-01-01 17:04:39.800'),(146,'Nazir Ahmed','nazirahmed1@example.com','nazirahmed1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,51,'2025-01-01 17:04:39.822','2025-01-01 17:04:39.822'),(147,'Muhammad Boota','muhammadboota1@example.com','muhammadboota1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,51,'2025-01-01 17:04:40.206','2025-01-01 17:04:40.206'),(148,'Patras','patras1@example.com','patras1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,51,'2025-01-01 17:04:40.322','2025-01-01 17:04:40.322'),(149,'Shams Ul Hassan','shamsulhassan1@example.com','shamsulhassan1','$2a$10$YmPwX15fKyJo2gCHRoTv7OsOm1yjOWJNDnu0PFf7Gyz/Njki0BUGW',10,51,'2025-01-01 17:04:40.425','2025-01-01 17:04:40.425'),(150,'Adil Mehmood','Adil Mehmood','Adil Mehmood','$2a$10$TeU.cIKOjqSwqfjg4eiKquJnefvT7m6/RHEj5ATfkzU6RZ/UVF7Fa',10,33,'2025-01-01 17:08:02.835','2025-01-01 17:08:02.835'),(151,'Saqib Faraz','Saqib Faraz','Saqib Faraz','$2a$10$p5gHAV9dR833c/s8QGJHjumctkOt9zaPAqlPYmvHCxfONe3bFEbHW',10,33,'2025-01-01 17:08:20.830','2025-01-01 17:08:20.830'),(152,'Fakhar Rehman','Fakhar Rehman','Fakhar Rehman','$2a$10$.cKBRiRZojc2RcfZv3snAedMpsO8M5eOCU8Yr7dBQzVGMTyCGhCYC',10,33,'2025-01-01 17:08:36.906','2025-01-01 17:08:36.906'),(153,'Super Admin','superadmin@example.com','superadmin','$2a$10$LNeTbv59n5OmEC5YMH0.BerWS9ytpJUS27kUVnX.Hi30qOnsW.Tkm',7,52,'2025-01-03 12:09:25.646','2025-01-03 12:09:41.748'),(154,'Admin User','admin@example.com','admin','$2a$10$a7gb412jhSaGxjOEj/qdTOmf1IhhQJvWDGwyqcq5IT6lLgKFjKJ22',8,53,'2025-01-03 12:09:25.775','2025-01-03 12:09:41.917'),(155,'Supervisor User','supervisor@example.com','supervisor','$2a$10$3LheIc5Z1BLCSq7Is2pifuBXuzDEHNmYXCJNWRVEAMhJgTYg4wfey',9,54,'2025-01-03 12:09:26.253','2025-01-03 12:09:42.041'),(156,'Technician User','technician@example.com','technician','$2a$10$RHvpJ/P9zg7Lb3rrIZJcD.7mlB/gmVZXSTtHyOg9t92nkzzdyqYYm',10,55,'2025-01-03 12:09:26.391','2025-01-03 12:09:26.391'),(157,'Muhammad Ajmal','muhammad.ajmal@saudipak.com','MuhammadAjmal','$2a$10$ItfgYzpzBMh.kDCRWPO3LOtU/py.lWaF0u2gqEUOvqhNeS2/XHa1i',9,56,'2025-01-07 08:33:12.101','2025-01-07 09:22:10.246'),(158,'Plumber1(UsmanTest)','Plumber1(UsmanTest)','Plumber1(UsmanTest)','$2a$10$q3RQ4ZgIdgZUMU8POytZFu4H7S0CzarNeu2jVQmGFTor..Qv9PDjO',10,44,'2025-01-07 10:59:55.114','2025-01-07 10:59:55.114'),(159,'Ma Xue Li','maxueli8@huawei-partners.com','MaXueLi','$2a$10$Jja3t/9qBBPq2fOppN7hm.NgyrDfpSHrEaJkDwMrLRwf.Nm2FU696',12,31,'2025-01-22 08:42:30.247','2025-01-22 09:15:31.149'),(172,'zxccxz','zxccxz','zxccxz','$2a$10$78.DYKVxDDpGGcjZ9NVcNOeR/ymhprCIIrKFfTYVvAKis4f0e5vHC',12,NULL,'2025-01-29 14:14:19.148','2025-02-03 17:36:00.341'),(174,'Manager','Manager@example.com','Manager','$2a$10$F7KPi1jeEh/WRZ2fJtYV2ezbRKLno7/nAM79XPQ0Rf4oAtkmSFMEm',11,NULL,'2025-03-14 23:11:18.043','2025-03-14 23:11:18.043');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersec`
--

DROP TABLE IF EXISTS `usersec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `designation` varchar(191) NOT NULL,
  `timeIn` datetime(3) NOT NULL,
  `timeOut` datetime(3) NOT NULL,
  `location` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `dailyDutyId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserSec_dailyDutyId_fkey` (`dailyDutyId`),
  CONSTRAINT `UserSec_dailyDutyId_fkey` FOREIGN KEY (`dailyDutyId`) REFERENCES `dailydutyreport` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersec`
--

LOCK TABLES `usersec` WRITE;
/*!40000 ALTER TABLE `usersec` DISABLE KEYS */;
INSERT INTO `usersec` VALUES (4,'Usman Nadeem','Test Dev','2024-12-21 23:09:00.000','2024-12-22 00:09:00.000','Karachi, Sindh',NULL,1,'2025-03-07 02:14:17.776','2025-03-07 02:14:17.776',NULL),(5,'Usman Nadeem','Testing Development','2024-12-21 20:00:00.000','2024-12-21 21:00:00.000','Testing Development',NULL,1,'2025-03-07 02:14:17.776','2025-03-07 02:14:17.776',NULL),(6,'Usman Nadeem','Test Dev','2024-12-21 19:14:00.000','2024-12-21 20:14:00.000','Near the window',NULL,1,'2025-03-07 02:14:17.776','2025-03-07 02:14:17.776',NULL),(20,'Usman Nadeem','Test Dev','2025-03-07 07:40:00.000','2025-03-07 12:40:00.000','Near the window',NULL,2,'2025-03-14 02:31:38.771','2025-03-14 02:31:38.771',NULL),(21,'Testing','Test Dev','2025-03-07 03:31:00.000','2025-03-07 04:31:00.000','Karachi, Sindh ',NULL,2,'2025-03-14 02:31:38.771','2025-03-14 02:31:38.771',NULL);
/*!40000 ALTER TABLE `usersec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watermanagement`
--

DROP TABLE IF EXISTS `watermanagement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `watermanagement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `supervisorName` varchar(191) NOT NULL,
  `operatorName` varchar(191) NOT NULL,
  `engineerName` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watermanagement`
--

LOCK TABLES `watermanagement` WRITE;
/*!40000 ALTER TABLE `watermanagement` DISABLE KEYS */;
/*!40000 ALTER TABLE `watermanagement` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-23 18:00:06
