import { PrismaClient, Role, Rarity } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos de prueba para SoccerMatch API...');

  const passwordHash = await bcrypt.hash('secret123', 10);

  // 1. Crear usuarios de prueba para los 5 roles
  const player = await prisma.user.upsert({
    where: { email: 'jugador@soccermatch.cl' },
    update: {},
    create: {
      email: 'jugador@soccermatch.cl',
      username: 'AlexisCrack',
      fullName: 'Alexis Sánchez',
      passwordHash,
      role: Role.PLAYER,
      playerProfile: {
        create: {
          rating: 88,
          position: 'DC',
          pac: 92,
          sho: 89,
          pas: 84,
          dri: 90,
          def: 45,
          phy: 82,
          rarity: Rarity.LEGENDARY,
        },
      },
    },
  });

  const coach = await prisma.user.upsert({
    where: { email: 'entrenador@soccermatch.cl' },
    update: {},
    create: {
      email: 'entrenador@soccermatch.cl',
      username: 'ProfeGareca',
      fullName: 'Ricardo Gareca',
      passwordHash,
      role: Role.COACH,
    },
  });

  const venueOwner = await prisma.user.upsert({
    where: { email: 'sede@soccermatch.cl' },
    update: {},
    create: {
      email: 'sede@soccermatch.cl',
      username: 'SedeBiobio',
      fullName: 'Don Bosco Complejo',
      passwordHash,
      role: Role.VENUE,
    },
  });

  const org = await prisma.user.upsert({
    where: { email: 'organizacion@soccermatch.cl' },
    update: {},
    create: {
      email: 'organizacion@soccermatch.cl',
      username: 'AsociacionBiobio',
      fullName: 'Asociación de Fútbol Biobío',
      passwordHash,
      role: Role.ORGANIZATION,
    },
  });

  // 2. Crear Sede y Cancha
  const venue = await prisma.venue.create({
    data: {
      name: 'Complejo Deportivo Biobío',
      address: 'Av. Paicaví 2450, Concepción',
      ownerId: venueOwner.id,
      courts: {
        create: [
          { name: 'Cancha 1 - Pasto Sintético', surfaceType: 'Pasto Sintético FIFA', hourlyRate: 35000 },
          { name: 'Cancha 2 - Techada LED', surfaceType: 'Parquet Multicancha', hourlyRate: 28000 },
        ],
      },
    },
    include: { courts: true },
  });

  // 3. Crear Partido
  await prisma.match.create({
    data: {
      title: 'Pichanga Nocturna 7v7',
      courtId: venue.courts[0].id,
      creatorId: player.id,
      date: '2026-07-28',
      startTime: '21:00',
      endTime: '22:00',
      pricePlayer: 3500,
      maxPlayers: 14,
    },
  });

  // 4. Crear Torneo Biobío
  await prisma.tournament.create({
    data: {
      name: 'Copa Apertura Biobío 50 Años',
      category: 'Primera Infantil & Honor',
      orgId: org.id,
    },
  });

  console.log('✅ Semilla completada con exito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
