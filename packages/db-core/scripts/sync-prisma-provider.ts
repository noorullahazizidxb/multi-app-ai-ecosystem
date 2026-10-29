import * as fs from 'fs';
import * as path from 'path';

const VALID_DIALECTS = ['postgres', 'neon', 'sqlite', 'turso', 'mysql'] as const;
type Dialect = (typeof VALID_DIALECTS)[number];

function getProvider(dialect: Dialect): string {
  switch (dialect) {
    case 'postgres':
    case 'neon':
      return 'postgresql';
    case 'sqlite':
    case 'turso':
      return 'sqlite';
    case 'mysql':
      return 'mysql';
  }
}

function getUrl(dialect: Dialect): string {
  switch (dialect) {
    case 'turso':
      return 'env("TURSO_DATABASE_URL")';
    case 'mysql':
      return 'env("MYSQL_DATABASE_URL")';
    default:
      return 'env("DATABASE_URL")';
  }
}

const dialect = (process.env.DB_DIALECT || 'postgres') as Dialect;
if (!VALID_DIALECTS.includes(dialect)) {
  console.error(`Invalid DB_DIALECT: ${dialect}. Must be one of: ${VALID_DIALECTS.join(', ')}`);
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

schema = schema.replace(
  /provider\s*=\s*"(postgresql|sqlite|mysql)"/,
  `provider = "${getProvider(dialect)}"`,
);

schema = schema.replace(
  /url\s*=\s*env\("[^"]+"\)/,
  `url      = ${getUrl(dialect)}`,
);

fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`[db-core] Synced Prisma provider to "${getProvider(dialect)}" for dialect "${dialect}"`);

