# Arquitectura del Backend SoccerMatch API

## 1. Módulos y Rutas
- `/api/v1/health`: Estado de salud de los servicios API.
- `/api/v1/auth/login`: Autenticación y firma JWT de usuarios.
- `/api/v1/matches`: Gestión de partidos 7v7 / 5v5, cupos y reservas.
- `/api/v1/venues`: Gestión de complejos deportivos y horarios de canchas.
- `/api/v1/tournaments`: Gestión de campeonatos y tablas de posiciones de Biobío.

## 2. Esquema Relacional (Prisma ORM)
- `User` (1) ── (1) `PlayerProfile`
- `User` (1) ── (N) `Venue` (1) ── (N) `Court` (1) ── (N) `Match`
- `User` (1) ── (N) `Tournament`
