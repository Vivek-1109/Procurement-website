import 'dotenv/config';
import connectDB from './config/db';
import { getPool } from './config/db';
import { createAdmin } from './models/Admin';

const seed = async (): Promise<void> => {
  console.log('🌱 Initializing PostgreSQL Database (Admin Only Setup for Client Handover)...');
  await connectDB();

  const pool = getPool();

  // ── Admin Setup ─────────────────────────────────────────────
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@aprsvs.com').toLowerCase().trim();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'aprsvs123';

  const { rows: existingAdmins } = await pool.query(
    'SELECT id FROM admins WHERE email = $1 LIMIT 1',
    [adminEmail]
  );

  if (existingAdmins.length === 0) {
    await createAdmin({ email: adminEmail, plainPassword: adminPassword, role: 'super_admin' });
    console.log(`✅ Created Admin: ${adminEmail}`);
  } else {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(adminPassword, salt);
    await pool.query(
      'UPDATE admins SET password_hash = $1, role = $2 WHERE email = $3',
      [hash, 'super_admin', adminEmail]
    );
    console.log(`✅ Updated Admin credentials for: ${adminEmail}`);
  }

  // ── Clear all test/sample data for clean client handover ─────
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM certifications');
  await pool.query('DELETE FROM clients');
  console.log('✅ Cleared products, categories, certifications, and clients tables (Clean state for client handover).');

  await pool.end();
  console.log('✅ Database setup complete (Admin account configured).');
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});



