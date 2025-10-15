-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-10-2025 a las 19:40:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id` int(11) NOT NULL,
  `Usuario` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `foto_perfil` text DEFAULT NULL,
  `documentos` text DEFAULT NULL,
  `autenticacion` enum('local','google','facebook','apple') DEFAULT 'local'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id`, `Usuario`, `Password`, `Nombre`, `Apellido`, `Email`, `Telefono`, `Direccion`, `foto_perfil`, `documentos`, `autenticacion`) VALUES
(17, 'benjatarta03@gmail.com', '123456', 'TARTAGLIA', 'Benjamín', 'benjatarta03@gmail.com', '2235441125', 'Dorrego ', 'https://lh3.googleusercontent.com/a/ACg8ocLA-qyKj1Hv_Irdu2SR1jKFwH3A_kfDkIMCmXVJmwadwJyvN9tACg=s96-c', NULL, 'google'),
(18, 'benjatarta03@gmail.com', '123456', 'TARTAGLIA', 'Benjamín', 'benjatarta03@gmail.com', '2235441125', 'Dorrego ', 'https://lh3.googleusercontent.com/a/ACg8ocLA-qyKj1Hv_Irdu2SR1jKFwH3A_kfDkIMCmXVJmwadwJyvN9tACg=s96-c', NULL, 'google'),
(20, 'benjatarta03@gmail.com', '', 'TARTAGLIA', 'Benjamín', 'benjatarta03@gmail.com', '2235441125', 'Dorrego ', 'https://lh3.googleusercontent.com/a/ACg8ocLA-qyKj1Hv_Irdu2SR1jKFwH3A_kfDkIMCmXVJmwadwJyvN9tACg=s96-c', NULL, 'google'),
(21, 'juani', '111111', 'adas', 'ssss', 'dwda@a.com', '42412441', 'dwdddwd', NULL, NULL, 'local'),
(22, 'benjatarta03@gmail.com', 'ben123', 'TARTAGLIA', 'Benjamín', 'benjatarta03@gmail.com', '2235441125', 'Dorrego ', 'https://lh3.googleusercontent.com/a/ACg8ocLA-qyKj1Hv_Irdu2SR1jKFwH3A_kfDkIMCmXVJmwadwJyvN9tACg=s96-c', NULL, 'google'),
(23, 'juani', '123456', '', '', '', NULL, NULL, NULL, NULL, 'local'),
(24, 'tarta', '123456', 'benchito', '', '', '', '', 'http://192.168.100.60:3001/uploads/foto_perfil-1760544164149-375501118.jpg', 'http://192.168.100.60:3001/uploads/documento-1760489265427-96758796.png', 'local'),
(25, 'pau', '123456', 'paula', 'zuñiga', 'pauliizuniga@gmail.com', '2234987799', 'Dorrego 3485', 'http://192.168.100.60:3001/uploads/foto_perfil-1760494710355-350276385.jpg', 'http://192.168.100.60:3001/uploads/documento-1760494268503-704111447.png', 'local'),
(26, 'benja', '$2b$10$hdlnokN02kT9ZsSW38761.C2R4NPB286HPuhOyb3RArOBh/Ht7x0a', '', '', '', '', '', 'http://192.168.100.60:3001/uploads/foto_perfil-1760548076879-154067218.png', 'http://192.168.100.60:3001/uploads/documento-1760548069114-310377666.pdf', 'local');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
