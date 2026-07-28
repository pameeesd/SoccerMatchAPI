# SoccerMatch API Backend ⚽ REST API & PostgreSQL Engine

Backend de servicio REST en TypeScript con Prisma ORM y PostgreSQL en Docker para la plataforma **SoccerMatch**.

---

## 1. Badges
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-v0.1.0-blue)
![Database](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![ORM](https://img.shields.io/badge/Prisma-5.17-black?logo=prisma)
![PEP Standard](https://img.shields.io/badge/PEP-Level%204%20Compliant-success)

---

## 2. Definición del problema
SoccerMatch requiere un servicio backend centralizado, seguro y fuertemente tipado en TypeScript capaz de procesar partidos en vivo, reservas de canchas y tablas de posiciones para 5 perfiles de usuario concurrentes.

---

## 3. Arquitectura
- **Backend Core**: Express / NestJS + TypeScript.
- **ORM**: Prisma ORM v5.
- **Base de Datos Relacional**: PostgreSQL 16.
- **Seguridad**: Hashing con Bcrypt + Autenticación JWT.

---

## 4. Requisitos previos
- Node.js (v20 o superior)
- Docker Desktop (para la base de datos PostgreSQL)
- npm v10+

---

## 5. Instalación paso a paso

1. **Clonar e instalar dependencias:**
   ```bash
   cd SoccerMatchAPI
   npm install
   ```

2. **Levantar la base de datos PostgreSQL con Docker:**
   ```bash
   docker compose up -d
   ```

3. **Ejecutar migraciones y sembrar datos iniciales:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Iniciar el servidor backend en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 6. Variables de entorno (`.env`)
```ini
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://soccermatch:secretpass@localhost:5432/soccermatch_db?schema=public"
JWT_SECRET="soccermatch_jwt_secret_key_2026"
```

---

## 7. Pruebas
```bash
npm run lint
```

---

## 8. Contribución
Siga el **Persevera Engineering Playbook (PEP)**:
- Ramas: `feature/*`, `bugfix/*` hacia `develop`.
- Commits convencionales: `feat(api): description`, `fix(db): description`.

---

## 9. Licencia
Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.
