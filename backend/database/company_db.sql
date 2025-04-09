-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: company_db
-- ------------------------------------------------------
-- Server version	8.0.37

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
  `presence_in_kenya` tinyint(1) DEFAULT '0',
  `presence_in_uganda` tinyint(1) DEFAULT '0',
  `presence_in_tanzania` tinyint(1) DEFAULT '0',
  `presence_in_rwanda` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country_contacts`
--

DROP TABLE IF EXISTS `country_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `country` enum('kenya', 'uganda', 'tanzania', 'rwanda') NOT NULL,
  `responsible_person` varchar(255) DEFAULT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `company_phone` varchar(50) DEFAULT NULL,
  `responsible_phone` varchar(50) DEFAULT NULL,
  `responsible_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_company_country` (`company_id`, `country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES 
(1,'Denri Africa','Private Limited Company','Bag ware / Retail','denriafricastores.com',1,1,1,0),
(2,'Beach Walk Grill & Restaurant','Restaurant','Hospitality and Food Service','beachwalkgrill.com',1,0,0,0),
(3,'Betran International Limited T/A Jazabet','Online Betting Platform','Gambling and Betting','www.bettinglegit.com',1,0,0,0);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `country_contacts`
--

LOCK TABLES `country_contacts` WRITE;
/*!40000 ALTER TABLE `country_contacts` DISABLE KEYS */;
INSERT INTO `country_contacts` VALUES 
(1,1,'kenya','Dennis Mwaura','dennismwaura.dm@gmail.com','+254740322691','+254740322691','dennismwaura.dm@gmail.com'),
(2,1,'uganda','Dennis Mwaura','uganda@denriafrica.com','+256740322691','+256740322691','dennis.ug@denriafrica.com'),
(3,1,'tanzania','Dennis Mwaura','tanzania@denriafrica.com','+255740322691','+255740322691','dennis.tz@denriafrica.com'),
(4,2,'kenya','N/A','beachwalkgrill@gmail.com','+254207906600','+254207906600','beachwalkgrill@gmail.com'),
(5,3,'kenya','Watiri Melvin','betransms@gmail.com','+254740700000','+254740700000','betransms@gmail.com');
/*!40000 ALTER TABLE `country_contacts` ENABLE KEYS */;
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
