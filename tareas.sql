-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2025 a las 23:16:12
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
-- Base de datos: `tareas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_seguridad`
--

CREATE TABLE `logs_seguridad` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo_evento` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `nivel_severidad` enum('bajo','medio','alto','critico') DEFAULT 'medio',
  `ip_address` varchar(45) DEFAULT NULL,
  `fecha_evento` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs_seguridad`
--

INSERT INTO `logs_seguridad` (`id`, `usuario_id`, `tipo_evento`, `descripcion`, `nivel_severidad`, `ip_address`, `fecha_evento`) VALUES
(1, 2, 'login_exitoso', 'Inicio de sesión desde Chrome', 'bajo', '192.168.1.100', '2025-11-06 10:15:23'),
(2, 2, 'login_fallido', 'Intento de login con contraseña incorrecta', 'medio', '192.168.1.105', '2025-11-06 11:22:45'),
(3, 2, 'tarea_critica', 'Creación de tarea con prioridad crítica', 'alto', '192.168.1.100', '2025-11-06 12:30:10'),
(4, 2, 'cambio_password', 'Cambio de contraseña detectado', 'medio', '192.168.1.100', '2025-11-06 14:45:33'),
(5, 2, 'login_fallido', 'Múltiples intentos fallidos de acceso', 'critico', '45.33.22.10', '2025-11-06 15:10:50'),
(6, 2, 'acceso_sospechoso', 'Intento de acceso desde nueva ubicación', 'alto', '203.45.67.89', '2025-11-06 16:05:12'),
(7, 2, 'login_exitoso', 'Sesión iniciada correctamente', 'bajo', '192.168.1.100', '2025-11-06 17:20:00'),
(8, 2, 'tarea_eliminada', 'Eliminación de tarea completada', 'medio', '192.168.1.100', '2025-11-06 18:15:30'),
(9, 2, 'login_fallido', 'Contraseña incorrecta - tercer intento', 'critico', '45.33.22.10', '2025-11-06 19:00:00'),
(10, 2, 'sesion_cerrada', 'Cierre de sesión del usuario', 'bajo', '192.168.1.100', '2025-11-06 19:30:00'),
(11, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-06 20:33:09'),
(12, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-06 20:55:57'),
(13, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-06 20:56:31'),
(14, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-06 20:57:02'),
(15, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-06 20:57:06'),
(16, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-06 20:57:07'),
(17, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-06 20:57:08'),
(18, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-06 20:57:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `titulo` varchar(200) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT 'General',
  `prioridad` enum('baja','media','alta','critica') DEFAULT NULL,
  `estado` enum('pendiente','en_progreso','completada') DEFAULT 'pendiente',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_limite` date DEFAULT NULL,
  `fecha_completado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `usuario_id`, `titulo`, `descripcion`, `categoria`, `prioridad`, `estado`, `fecha_creacion`, `fecha_limite`, `fecha_completado`) VALUES
(1, 2, 'ol', 'olololo', 'Personal', 'alta', 'completada', '2025-11-04 21:21:39', '5555-05-05', '2025-11-04 21:22:24'),
(2, 2, 'q', 'q', 'Trabajo', 'baja', 'en_progreso', '2025-11-05 17:29:31', '1222-11-11', NULL),
(3, 2, 'z', 'z', 'Urgente', 'alta', 'pendiente', '2025-11-05 17:29:42', '0000-00-00', NULL),
(4, 2, 'c', 'c', 'Trabajo', 'media', 'pendiente', '2025-11-05 17:29:58', '0000-00-00', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`) VALUES
(0, 'Alex', 'a', 'a'),
(1, 'Alex', 'alex@correo.com', '12345'),
(2, 'Alex', 'a@a', 'a'),
(3, 'a', 'a@aa', 'a'),
(4, 'z', 'a@z', '1qaZ-----');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `logs_seguridad`
--
ALTER TABLE `logs_seguridad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
