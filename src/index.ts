import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint de Salud
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'SoccerMatch API',
    version: 'v0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint de Autenticación / Login
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { playerProfile: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.json({
    message: 'Autenticación exitosa',
    token: 'jwt_mock_token_soccermatch_2026',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      profile: user.playerProfile,
    },
  });
});

// Endpoint de Partidos
app.get('/api/v1/matches', async (req: Request, res: Response) => {
  const matches = await prisma.match.findMany({
    include: { court: true, creator: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ count: matches.length, data: matches });
});

// Endpoint de Sedes & Canchas
app.get('/api/v1/venues', async (req: Request, res: Response) => {
  const venues = await prisma.venue.findMany({
    include: { courts: true },
  });
  res.json({ count: venues.length, data: venues });
});

// Endpoint de Torneos
app.get('/api/v1/tournaments', async (req: Request, res: Response) => {
  const tournaments = await prisma.tournament.findMany({
    include: { org: true },
  });
  res.json({ count: tournaments.length, data: tournaments });
});

app.listen(PORT, () => {
  console.log(`🚀 SoccerMatch API backend corriendo en http://localhost:${PORT}`);
});
