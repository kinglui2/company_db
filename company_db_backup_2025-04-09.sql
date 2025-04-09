-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: company_db
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `business_type` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `responsible_person` varchar(255) DEFAULT NULL,
  `responsible_phone` varchar(20) DEFAULT NULL COMMENT 'Phone number of responsible person',
  `responsible_email` varchar(255) DEFAULT NULL COMMENT 'Email of the responsible person',
  `phone_number` varchar(50) DEFAULT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `presence_in_kenya` tinyint(1) DEFAULT '0',
  `presence_in_uganda` tinyint(1) DEFAULT '0',
  `presence_in_tanzania` tinyint(1) DEFAULT '0',
  `presence_in_rwanda` tinyint(1) DEFAULT '0' COMMENT 'Company presence in Rwanda',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Denri Africa','Private Limited Company','Bag ware / Retail','denriafricastores.com','Dennis Mwaura',NULL,NULL,'+254740322691','dennismwaura.dm@gmail.com',1,1,1,0),(2,'Beach Walk Grill & Restaurant','Restaurant','Hospitality and Food Service','beachwalkgrill.com','Kihara Ruthuku',NULL,NULL,'+254762511091','beachwalkgrill@gmail.com',1,0,0,0),(3,'Betran International Limited T/A Jazabet','Online Betting Platform','Gambling and Betting','www.bettinglegit.com','Watiri Melvin',NULL,NULL,'+254 740 700000','betransms@gmail.com',1,0,0,0),(6,'Etica Capital Ltd','Fund Manager','tech','https://eticacap.com/','Maurice Oduor','+254111632017','trial@gmail.com','+254111632014','test@gmail.com',1,1,1,1);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-09 16:18:50
