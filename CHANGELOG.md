# Changelog - SoccerMatch API Backend

Todos los cambios notables en este proyecto serán documentados en este archivo.
El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-28

### Añadido
- Lanzamiento inicial de **SoccerMatch API** alineado al estándar **Persevera Engineering Playbook (PEP)**.
- Soporte para **PostgreSQL 16** desplegado en contenedor con **Docker Compose**.
- Integración de **Prisma ORM** con soporte para 5 roles (`PLAYER`, `COACH`, `VENUE`, `ORGANIZATION`, `GUEST`).
- Script de sembrado de datos (`prisma/seed.ts`) con información oficial de la Asociación de Fútbol Biobío.
- Endpoints REST para Autenticación, Partidos, Sedes y Torneos.
