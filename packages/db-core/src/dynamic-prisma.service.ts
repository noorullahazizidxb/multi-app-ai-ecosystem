import { PrismaClient } from '@prisma/client';

export interface PrismaServiceLifecycle {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export type SupportedDialect = 'postgres' | 'neon' | 'sqlite' | 'turso' | 'mysql';

export class DynamicPrismaService extends PrismaClient implements PrismaServiceLifecycle {
  public readonly dialect: SupportedDialect;

  constructor() {
    const rawDialect = (process.env.DB_DIALECT || 'postgres').toLowerCase() as SupportedDialect;
    const dialect: SupportedDialect = ['postgres', 'neon', 'sqlite', 'turso', 'mysql'].includes(rawDialect)
      ? rawDialect
      : 'postgres';

    if (dialect === 'neon') {
      try {
        // Neon Serverless Connection Pooling Adapter
        // @ts-expect-error - dynamic adapter resolution
        const { Pool } = require('@neondatabase/serverless');
        // @ts-expect-error - dynamic adapter resolution
        const { PrismaNeon } = require('@prisma/adapter-neon');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        super({ adapter: new PrismaNeon(pool) });
      } catch {
        // Fallback to standard connection string
        super({ datasources: { db: { url: process.env.DATABASE_URL } } });
      }
    } else if (dialect === 'turso') {
        try {
          // Turso libSQL Edge SQLite Adapter
          // @ts-expect-error - dynamic adapter resolution
          const { createClient } = require('@libsql/client');
          // @ts-expect-error - dynamic adapter resolution
          const { PrismaLibSQL } = require('@prisma/adapter-libsql');
          const libsql = createClient({
            url: process.env.TURSO_DATABASE_URL || 'file:local.db',
            authToken: process.env.TURSO_AUTH_TOKEN,
          });
          super({ adapter: new PrismaLibSQL(libsql)
      });
    } catch {
      super({ datasources: { db: { url: process.env.DATABASE_URL || 'file:./dev.db' } } });
    }
  } else if(dialect === 'mysql') {
  super({
    datasources: {
      db: { url: process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL },
    },
  });
} else {
  // Standard PostgreSQL or SQLite
  super({
    datasources: {
      db: { url: process.env.DATABASE_URL || 'file:./dev.db' },
    },
  });
}

this.dialect = dialect;
  }

  async connect(): Promise < void> {
  try {
    await this.$connect();
  } catch {
    // Allow boot in disconnected / offline mode for local test runs
  }
}

  async disconnect(): Promise < void> {
  try {
    await this.$disconnect();
  } catch {
    // Disconnect cleanly
  }
}
}
