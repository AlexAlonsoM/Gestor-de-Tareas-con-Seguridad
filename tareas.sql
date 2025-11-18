-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2025 a las 14:18:16
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
-- Estructura de tabla para la tabla `etiquetas`
--

CREATE TABLE `etiquetas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `color` varchar(20) DEFAULT '#667eea',
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `etiquetas`
--

INSERT INTO `etiquetas` (`id`, `nombre`, `color`, `usuario_id`) VALUES
(1, 'Frontend', '#3b82f6', 2),
(2, 'Backend', '#10b981', 2),
(3, 'Bug', '#ef4444', 2),
(4, 'Feature', '#8b5cf6', 2),
(5, 'Documentación', '#f59e0b', 2),
(6, 'html', '#667eea', 6),
(7, 'css', '#3b82f6', 6),
(8, 'react', '#10b981', 6);

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
(18, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-06 20:57:10'),
(19, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-11 23:38:03'),
(20, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 00:23:25'),
(21, 5, 'tarea_creada', 'Tarea creada: prueba 1', 'bajo', '::1', '2025-11-12 00:25:05'),
(22, 5, 'tarea_creada', 'Tarea creada: prueba2', 'bajo', '::1', '2025-11-12 00:25:31'),
(23, 5, 'tarea_eliminada', 'Tarea eliminada: prueba 1 cambio', 'medio', '::1', '2025-11-12 00:26:24'),
(24, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 00:27:27'),
(25, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 17:42:29'),
(26, 2, 'cambio_password', 'Cambio de contraseña de Alex', 'medio', '0.0.0.0', '2025-11-12 17:43:14'),
(27, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-12 17:43:19'),
(28, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 17:43:25'),
(29, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 18:07:30'),
(30, 2, 'cambio_nombre', 'Cambio de nombre a: pepe', 'bajo', '0.0.0.0', '2025-11-12 18:07:38'),
(31, 2, 'login_exitoso', 'Inicio de sesión exitoso de pepe', 'bajo', '::1', '2025-11-12 18:07:44'),
(32, 2, 'cambio_nombre', 'Cambio de nombre a: Alex', 'bajo', '0.0.0.0', '2025-11-12 18:09:11'),
(33, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 18:09:16'),
(34, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-12 19:17:41'),
(35, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 17:37:03'),
(36, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:08:54'),
(37, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:09:08'),
(38, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:05'),
(39, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(40, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(41, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(42, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(43, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(44, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:06'),
(45, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:10:12'),
(46, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 18:11:48'),
(47, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 18:12:18'),
(48, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 18:12:43'),
(49, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 18:13:16'),
(50, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 18:13:50'),
(51, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 18:17:25'),
(52, 2, 'login_fallido', 'Intento de login fallido para a@a', 'medio', '::1', '2025-11-14 19:27:50'),
(53, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 19:27:55'),
(54, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 22:54:02'),
(55, 2, 'tarea_creada', 'Tarea creada: toast', 'bajo', '::1', '2025-11-14 22:55:33'),
(56, 2, 'tarea_eliminada', 'Tarea eliminada: toast', 'medio', '::1', '2025-11-14 22:56:06'),
(57, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-14 23:04:25'),
(58, 2, 'tarea_eliminada', 'Tarea eliminada: ol', 'medio', '::1', '2025-11-14 23:05:32'),
(59, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 16:42:34'),
(60, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 17:06:21'),
(61, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 17:09:39'),
(62, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 17:27:23'),
(63, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 17:38:30'),
(64, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 17:44:20'),
(65, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 18:43:00'),
(66, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-17 18:59:42'),
(67, 6, 'cambio_nombre', 'Cambio de nombre a: prueba2', 'bajo', '0.0.0.0', '2025-11-18 14:11:17'),
(68, 6, 'login_exitoso', 'Inicio de sesión exitoso de prueba2', 'bajo', '::1', '2025-11-18 14:11:29'),
(69, 6, 'tarea_creada', 'Tarea creada: prueba1', 'bajo', '::1', '2025-11-18 14:12:30'),
(70, 6, 'tarea_eliminada', 'Tarea eliminada: prueba1', 'medio', '::1', '2025-11-18 14:13:46'),
(71, 6, 'tarea_creada', 'Tarea creada: nueva', 'bajo', '::1', '2025-11-18 14:14:04'),
(72, 2, 'login_exitoso', 'Inicio de sesión exitoso de Alex', 'bajo', '::1', '2025-11-18 14:15:24');

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
(2, 2, 'q', 'q', 'Trabajo', 'baja', 'en_progreso', '2025-11-05 17:29:31', '2025-11-15', NULL),
(3, 2, 'z', 'z', 'Urgente', 'alta', 'pendiente', '2025-11-05 17:29:42', '0000-00-00', NULL),
(4, 2, 'c', 'c', 'Trabajo', 'media', 'pendiente', '2025-11-05 17:29:58', '0000-00-00', NULL),
(6, 5, 'prueba2', 'prueba2', 'Seguridad', 'alta', 'pendiente', '2025-11-12 00:25:31', '2025-11-19', NULL),
(7, 2, 'Revisar informe de seguridad', 'Revisar el informe mensual de incidentes de seguridad', 'Trabajo', 'alta', 'pendiente', '2025-11-10 09:30:00', '2025-11-14', NULL),
(8, 2, 'Actualizar contraseñas del sistema', 'Cambiar contraseñas de administrador que vencieron', 'Seguridad', 'alta', 'pendiente', '2025-11-03 14:20:00', '2025-11-10', NULL),
(9, 2, 'Presentar análisis de vulnerabilidades', 'Preparar y presentar el análisis de vulnerabilidades del trimestre', 'Trabajo', 'media', 'en_progreso', '2025-11-12 11:00:00', '2025-11-16', NULL),
(10, 2, 'Parche de seguridad urgente', 'Aplicar parche crítico de seguridad detectado en el firewall principal', 'Urgente', 'critica', 'pendiente', '2025-11-14 08:00:00', '2020-02-25', NULL),
(11, 6, 'nueva', 'a', 'Trabajo', 'baja', 'completada', '2025-11-18 14:14:04', '2025-11-19', '2025-11-18 14:14:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_etiqueta`
--

CREATE TABLE `tarea_etiqueta` (
  `id` int(11) NOT NULL,
  `tarea_id` int(11) NOT NULL,
  `etiqueta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea_etiqueta`
--

INSERT INTO `tarea_etiqueta` (`id`, `tarea_id`, `etiqueta_id`) VALUES
(1, 7, 3),
(2, 7, 1),
(3, 8, 2),
(5, 10, 3),
(6, 10, 4),
(7, 2, 2),
(8, 2, 5),
(9, 2, 4),
(10, 2, 3),
(11, 2, 1),
(12, 9, 3),
(13, 9, 1);

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
(4, 'z', 'a@z', '1qaZ-----'),
(5, 'prueba', 'prueba@a', '123QWEasd_'),
(6, 'prueba2', 'prueba@1', '123QWEasd');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `etiquetas`
--
ALTER TABLE `etiquetas`
  ADD PRIMARY KEY (`id`);

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
-- Indices de la tabla `tarea_etiqueta`
--
ALTER TABLE `tarea_etiqueta`
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
