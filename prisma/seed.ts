import { PrismaClient, Role, Rarity, MatchStatus, OfficialResultStatus, SuspensionReason } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos v4 oficiales de prueba para SoccerMatch API...');

  const passwordHash = await bcrypt.hash('secret123', 10);

  // 1. Usuarios para los 5 roles
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

  const orgUser = await prisma.user.upsert({
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

  // 2. Organización B2B
  const org = await prisma.organization.create({
    data: {
      name: 'Asociación de Fútbol Biobío (ANFA)',
      description: 'Ente rector del fútbol amateur en la VIII Región del Biobío',
      orgType: 'amateur_league',
      legalId: '65.123.456-7',
      staff: {
        create: {
          userId: orgUser.id,
          role: 'owner',
        },
      },
    },
  });

  // 3. Sede & Canchas
  const venue = await prisma.venue.create({
    data: {
      name: 'Complejo Deportivo Biobío',
      address: 'Av. Paicaví 2450, Concepción',
      ownerId: venueOwner.id,
      courts: {
        create: [
          { name: 'Cancha 1 - Pasto Sintético FIFA', surfaceType: 'Pasto Sintético', hourlyRate: 35000 },
          { name: 'Cancha 2 - Techada LED', surfaceType: 'Parquet Multicancha', hourlyRate: 28000 },
        ],
      },
      orgVenues: {
        create: {
          organizationId: org.id,
          status: 'active',
        },
      },
    },
    include: { courts: true },
  });

  // 4. Equipos
  const teamA = await prisma.team.create({
    data: {
      name: 'Real Biobío FC',
      badgeUrl: 'https://soccermatch.cl/badges/real_biobio.png',
      coachId: coach.id,
    },
  });

  const teamB = await prisma.team.create({
    data: {
      name: 'Deportes Concepción Amateur',
      badgeUrl: 'https://soccermatch.cl/badges/dep_concepcion.png',
    },
  });

  // 5. Torneo Biobío 50 Años
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Copa Apertura Biobío 2026',
      category: 'Primera Infantil & 50 Años',
      organizationId: org.id,
    },
  });

  // 6. Jornada / Fixture Round 1
  const round1 = await prisma.fixtureRound.create({
    data: {
      tournamentId: tournament.id,
      roundNumber: 1,
      name: 'Fecha 1 - Fase Regular',
    },
  });

  // 7. Partido Normal & Partido Suspendido
  const normalMatch = await prisma.match.create({
    data: {
      title: 'Real Biobío vs Dep. Concepción (Fecha 1)',
      courtId: venue.courts[0].id,
      creatorId: orgUser.id,
      date: '2026-07-28',
      startTime: '20:00',
      endTime: '21:30',
      status: MatchStatus.FINISHED,
      officialResult: {
        create: {
          tournamentId: tournament.id,
          homeScore: 3,
          awayScore: 1,
          status: OfficialResultStatus.PROVISIONAL,
          refereeName: 'Roberto Tobar',
          refereeNotes: 'Partido sin mayores incidencias.',
        },
      },
    },
  });

  const suspendedMatch = await prisma.match.create({
    data: {
      title: 'Atletico Sur vs Universitario (Fecha 1)',
      courtId: venue.courts[1].id,
      creatorId: orgUser.id,
      date: '2026-07-28',
      startTime: '21:30',
      endTime: '23:00',
      status: MatchStatus.SUSPENDED,
      suspension: {
        create: {
          suspendedById: orgUser.id,
          reason: SuspensionReason.WEATHER,
          notes: 'Suspendido por intensa lluvia en Concepción.',
        },
      },
    },
  });

  // 8. Fixtures
  await prisma.fixture.create({
    data: {
      tournamentId: tournament.id,
      fixtureRoundId: round1.id,
      homeTeamId: teamA.id,
      awayTeamId: teamB.id,
      venueId: venue.id,
      matchId: normalMatch.id,
      scheduledDate: '2026-07-28',
      status: 'completed',
    },
  });

  // 9. Estadísticas Oficiales Acumuladas
  await prisma.officialTeamStats.create({
    data: {
      teamId: teamA.id,
      tournamentId: tournament.id,
      matchesPlayed: 1,
      wins: 1,
      goalsFor: 3,
      goalsAgainst: 1,
      points: 3,
    },
  });

  console.log('✅ Semilla v4 completada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
