/**
 * Seed Script: Pre-create leagues and rounds for all UK boroughs
 *
 * This script creates:
 * - 1 league per borough × sport × category
 * - 4 rounds per year per league (quarterly)
 *
 * Run with: npx ts-node src/scripts/seed-leagues.ts
 */

import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

// Tables
const LEAGUES_TABLE = process.env.LEAGUES_TABLE || 'sport-leagues-dev-leagues';
const ROUNDS_TABLE = process.env.ROUNDS_TABLE || 'sport-leagues-dev-rounds';

// Sports and their configs
const SPORTS = [
  {
    type: 'GOLF',
    minPlayersPerRound: 8,
    maxPlayersPerRound: 32,
    entryFee: 1500, // £15.00
    roundsPerYear: 4,
  },
  {
    type: 'FOOTBALL',
    minPlayersPerRound: 10,
    maxPlayersPerRound: 20,
    entryFee: 800, // £8.00
    roundsPerYear: 4,
  },
  {
    type: 'BASKETBALL',
    minPlayersPerRound: 6,
    maxPlayersPerRound: 12,
    entryFee: 600, // £6.00
    roundsPerYear: 4,
  },
  {
    type: 'CRICKET',
    minPlayersPerRound: 16,
    maxPlayersPerRound: 24,
    entryFee: 1000, // £10.00
    roundsPerYear: 3, // Cricket is seasonal (summer only)
  },
];

const CATEGORIES = ['OPEN', 'WOMEN', 'BEGINNERS', 'SENIORS'];

// Major UK boroughs/areas (representative sample - expand as needed)
const UK_AREAS = [
  // London Boroughs
  {
    name: 'Westminster',
    city: 'London',
    region: 'London',
    lat: 51.4975,
    lng: -0.1357,
  },
  {
    name: 'Camden',
    city: 'London',
    region: 'London',
    lat: 51.529,
    lng: -0.1255,
  },
  {
    name: 'Islington',
    city: 'London',
    region: 'London',
    lat: 51.5416,
    lng: -0.1022,
  },
  {
    name: 'Hackney',
    city: 'London',
    region: 'London',
    lat: 51.545,
    lng: -0.0553,
  },
  {
    name: 'Tower Hamlets',
    city: 'London',
    region: 'London',
    lat: 51.5099,
    lng: -0.0059,
  },
  {
    name: 'Greenwich',
    city: 'London',
    region: 'London',
    lat: 51.4892,
    lng: 0.0648,
  },
  {
    name: 'Lewisham',
    city: 'London',
    region: 'London',
    lat: 51.4415,
    lng: -0.0117,
  },
  {
    name: 'Southwark',
    city: 'London',
    region: 'London',
    lat: 51.5035,
    lng: -0.0804,
  },
  {
    name: 'Lambeth',
    city: 'London',
    region: 'London',
    lat: 51.4571,
    lng: -0.1231,
  },
  {
    name: 'Wandsworth',
    city: 'London',
    region: 'London',
    lat: 51.4567,
    lng: -0.191,
  },
  {
    name: 'Richmond',
    city: 'London',
    region: 'London',
    lat: 51.4613,
    lng: -0.3037,
  },
  {
    name: 'Kingston',
    city: 'London',
    region: 'London',
    lat: 51.4085,
    lng: -0.3064,
  },
  {
    name: 'Croydon',
    city: 'London',
    region: 'London',
    lat: 51.3762,
    lng: -0.0982,
  },
  {
    name: 'Bromley',
    city: 'London',
    region: 'London',
    lat: 51.4039,
    lng: 0.0198,
  },
  {
    name: 'Barnet',
    city: 'London',
    region: 'London',
    lat: 51.6252,
    lng: -0.1517,
  },
  {
    name: 'Ealing',
    city: 'London',
    region: 'London',
    lat: 51.513,
    lng: -0.3089,
  },
  // Major UK Cities
  {
    name: 'Manchester City Centre',
    city: 'Manchester',
    region: 'North West',
    lat: 53.4808,
    lng: -2.2426,
  },
  {
    name: 'Salford',
    city: 'Manchester',
    region: 'North West',
    lat: 53.4875,
    lng: -2.2901,
  },
  {
    name: 'Trafford',
    city: 'Manchester',
    region: 'North West',
    lat: 53.4227,
    lng: -2.351,
  },
  {
    name: 'Birmingham City Centre',
    city: 'Birmingham',
    region: 'West Midlands',
    lat: 52.4862,
    lng: -1.8904,
  },
  {
    name: 'Solihull',
    city: 'Birmingham',
    region: 'West Midlands',
    lat: 52.413,
    lng: -1.7743,
  },
  {
    name: 'Leeds City Centre',
    city: 'Leeds',
    region: 'Yorkshire',
    lat: 53.8008,
    lng: -1.5491,
  },
  {
    name: 'Sheffield City Centre',
    city: 'Sheffield',
    region: 'Yorkshire',
    lat: 53.3811,
    lng: -1.4701,
  },
  {
    name: 'Liverpool City Centre',
    city: 'Liverpool',
    region: 'North West',
    lat: 53.4084,
    lng: -2.9916,
  },
  {
    name: 'Bristol City Centre',
    city: 'Bristol',
    region: 'South West',
    lat: 51.4545,
    lng: -2.5879,
  },
  {
    name: 'Edinburgh City Centre',
    city: 'Edinburgh',
    region: 'Scotland',
    lat: 55.9533,
    lng: -3.1883,
  },
  {
    name: 'Glasgow City Centre',
    city: 'Glasgow',
    region: 'Scotland',
    lat: 55.8642,
    lng: -4.2518,
  },
  {
    name: 'Cardiff City Centre',
    city: 'Cardiff',
    region: 'Wales',
    lat: 51.4816,
    lng: -3.1791,
  },
  {
    name: 'Belfast City Centre',
    city: 'Belfast',
    region: 'Northern Ireland',
    lat: 54.5973,
    lng: -5.9301,
  },
  {
    name: 'Newcastle City Centre',
    city: 'Newcastle',
    region: 'North East',
    lat: 54.9783,
    lng: -1.6178,
  },
  {
    name: 'Nottingham City Centre',
    city: 'Nottingham',
    region: 'East Midlands',
    lat: 52.9548,
    lng: -1.1581,
  },
  {
    name: 'Southampton City Centre',
    city: 'Southampton',
    region: 'South East',
    lat: 50.9097,
    lng: -1.4044,
  },
  {
    name: 'Brighton City Centre',
    city: 'Brighton',
    region: 'South East',
    lat: 50.8225,
    lng: -0.1372,
  },
  {
    name: 'Cambridge City Centre',
    city: 'Cambridge',
    region: 'East',
    lat: 52.2053,
    lng: 0.1218,
  },
  {
    name: 'Oxford City Centre',
    city: 'Oxford',
    region: 'South East',
    lat: 51.752,
    lng: -1.2577,
  },
  {
    name: 'Bath City Centre',
    city: 'Bath',
    region: 'South West',
    lat: 51.3811,
    lng: -2.359,
  },
  {
    name: 'York City Centre',
    city: 'York',
    region: 'Yorkshire',
    lat: 53.9591,
    lng: -1.0815,
  },
];

// Round dates for 2026 (quarterly)
const ROUND_DATES_2026 = [
  {
    scheduledDate: '2026-03-15',
    registrationDeadline: '2026-03-08',
    label: 'Spring Round',
  },
  {
    scheduledDate: '2026-06-14',
    registrationDeadline: '2026-06-07',
    label: 'Summer Round',
  },
  {
    scheduledDate: '2026-09-13',
    registrationDeadline: '2026-09-06',
    label: 'Autumn Round',
  },
  {
    scheduledDate: '2026-12-06',
    registrationDeadline: '2026-11-29',
    label: 'Winter Round',
  },
];

// Cricket only plays in summer months
const CRICKET_ROUND_DATES_2026 = [
  {
    scheduledDate: '2026-05-17',
    registrationDeadline: '2026-05-10',
    label: 'Early Summer Round',
  },
  {
    scheduledDate: '2026-07-12',
    registrationDeadline: '2026-07-05',
    label: 'Mid Summer Round',
  },
  {
    scheduledDate: '2026-08-30',
    registrationDeadline: '2026-08-23',
    label: 'Late Summer Round',
  },
];

async function seedLeaguesAndRounds() {
  const now = dayjs().toISOString();
  let leagueCount = 0;
  let roundCount = 0;

  for (const sport of SPORTS) {
    for (const category of CATEGORIES) {
      for (const area of UK_AREAS) {
        const leagueId = uuidv4();
        const leagueName = `${area.name} ${category.charAt(0) + category.slice(1).toLowerCase()} ${sport.type.charAt(0) + sport.type.slice(1).toLowerCase()} League`;

        // Create league
        const league = {
          pk: `LEAGUE#${sport.type}`,
          sk: `LEAGUE#${leagueId}`,
          gsi1pk: `LEAGUE#${area.region}`,
          gsi1sk: `LEAGUE#${leagueId}`,
          leagueId,
          name: leagueName,
          description: `${category.charAt(0) + category.slice(1).toLowerCase()} ${sport.type.toLowerCase()} league for players in ${area.name}, ${area.city}. Join to play in quarterly rounds and get matched with players at your level.`,
          sportType: sport.type,
          category,
          region: area.region,
          location: {
            lat: area.lat,
            lng: area.lng,
            city: area.city,
            country: 'UK',
            address: `${area.name}, ${area.city}`,
          },
          maxMembers: 200,
          memberCount: 0,
          entryFee: sport.entryFee,
          minPlayersPerRound: sport.minPlayersPerRound,
          maxPlayersPerRound: sport.maxPlayersPerRound,
          rules: `Official Sport Leagues ${sport.type.toLowerCase()} rules apply. See sportleagues.com/scoring-rules/${sport.type.toLowerCase()} for details.`,
          isActive: true,
          createdBy: 'SYSTEM',
          createdAt: now,
          updatedAt: now,
        };

        try {
          await dynamodb.send(
            new PutCommand({ TableName: LEAGUES_TABLE, Item: league }),
          );
          leagueCount++;

          // Create rounds for this league
          const roundDates =
            sport.type === 'CRICKET'
              ? CRICKET_ROUND_DATES_2026
              : ROUND_DATES_2026;

          for (const rd of roundDates) {
            const roundId = uuidv4();
            const round = {
              pk: `ROUND#${sport.type}`,
              sk: `ROUND#${roundId}`,
              gsi1pk: `LEAGUE#${leagueId}`,
              gsi1sk: `ROUND#${rd.scheduledDate}`,
              roundId,
              leagueId,
              sportType: sport.type,
              scheduledDate: rd.scheduledDate,
              scheduledTime: '10:00',
              venue: {
                name: `${area.name} Sports Venue`,
                address: `${area.name}, ${area.city}`,
                lat: area.lat,
                lng: area.lng,
              },
              status: 'OPEN',
              minPlayers: sport.minPlayersPerRound,
              maxPlayers: sport.maxPlayersPerRound,
              currentPlayers: 0,
              entryFee: sport.entryFee,
              registrationDeadline: rd.registrationDeadline,
              createdBy: 'SYSTEM',
              createdAt: now,
              updatedAt: now,
            };

            await dynamodb.send(
              new PutCommand({ TableName: ROUNDS_TABLE, Item: round }),
            );
            roundCount++;
          }

          if (leagueCount % 50 === 0) {
            console.log(
              `Created ${leagueCount} leagues, ${roundCount} rounds...`,
            );
          }
        } catch (error) {
          console.error(`Error creating league ${leagueName}:`, error);
        }
      }
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Leagues created: ${leagueCount}`);
  console.log(`   Rounds created: ${roundCount}`);
  console.log(`   Areas: ${UK_AREAS.length}`);
  console.log(`   Sports: ${SPORTS.length}`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(
    `   Expected: ${UK_AREAS.length * SPORTS.length * CATEGORIES.length} leagues`,
  );
}

seedLeaguesAndRounds().catch(console.error);
