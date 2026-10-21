import { Pool } from 'pg';
import { SCHEMA_SQL } from '../db/schema';
import bcrypt from 'bcryptjs';

// ── Singleton pool ──────────────────────────────────────────
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      // Neon requires SSL; the connection string already carries ?sslmode=require
      // but we also set it explicitly as a fallback.
      ssl: { rejectUnauthorized: false },
      // Connection pool tuning — safe for Neon serverless
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on('error', (err) => {
      console.error('❌ PostgreSQL pool error:', err);
    });
  }
  return pool;
}

// ── Schema initialisation ───────────────────────────────────
export async function initSchema(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('✅ PostgreSQL schema initialised');
  } finally {
    client.release();
  }
}

// ── Default Admin Initialisation (Automatic for Cloud Deployments) ──
export async function initDefaultAdmin(): Promise<void> {
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@divyanshiaviation.com').toLowerCase().trim();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'divyanshi123';
  const poolRef = getPool();
  try {
    const { rows } = await poolRef.query('SELECT id FROM admins WHERE email = $1 LIMIT 1', [adminEmail]);
    if (rows.length === 0) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(adminPassword, salt);
      await poolRef.query(
        `INSERT INTO admins (email, password_hash, role) VALUES ($1, $2, $3)`,
        [adminEmail, hash, 'super_admin']
      );
      console.log(`✅ Default admin created automatically on startup: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin account active: ${adminEmail}`);
    }
  } catch (err) {
    console.error('⚠️  Failed to ensure default admin on startup:', err);
  }
}

// ── Connectivity check (replaces connectDB) ─────────────────
const connectDB = async (): Promise<void> => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  try {
    const client = await getPool().connect();
    const result = await client.query('SELECT current_database(), inet_server_addr()');
    const { current_database } = result.rows[0];
    client.release();
    console.log(`✅ PostgreSQL connected: ${current_database}`);

    // Apply schema & ensure default admin account exists on every startup
    await initSchema();
    await initDefaultAdmin();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
