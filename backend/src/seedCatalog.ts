import 'dotenv/config';
import connectDB, { getPool } from './config/db';
import * as fs from 'fs';
import * as path from 'path';

const CATEGORY_IMAGES: Record<string, string> = {
  'Adhesives': 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
  'Coatings': 'https://divyanshiaviation.com/assets/img/products/Coating.jpg',
  'Film Adhesives': 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
  'Mechanical Items': 'https://divyanshiaviation.com/assets/img/products/Mechancial%20Items.jpg',
  'Lubricants': 'https://divyanshiaviation.com/assets/img/products/Lubricants.jpg',
  'Mechanical Consumables': 'https://divyanshiaviation.com/assets/img/products/Mechancial%20Consumables.jpg',
  'Conductive Adhesives': 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
  'NDT Chemicals': 'https://divyanshiaviation.com/assets/img/products/NDT%20Chemicals.jpg',
  'Oils': 'https://divyanshiaviation.com/assets/img/products/Oils.jpg',
  'Paints': 'https://divyanshiaviation.com/assets/img/products/Paints.jpg',
  'Sealants': 'https://divyanshiaviation.com/assets/img/products/Sealants.jpg',
  'Tapes': 'https://divyanshiaviation.com/assets/img/products/Tapes.jpg',
  'Cleaners': 'https://divyanshiaviation.com/assets/img/products/Cleaners.jpg',
  'Greases': 'https://divyanshiaviation.com/assets/img/products/Grease.jpg',
};

async function seedCatalog() {
  console.log('Connecting to PostgreSQL database...');
  await connectDB();
  const pool = getPool();

  const dataDir = path.resolve(__dirname, '../../src/data');
  const catPath = path.join(dataDir, 'categories.json');
  const prodPath = path.join(dataDir, 'scraped_products.json');

  if (!fs.existsSync(catPath) || !fs.existsSync(prodPath)) {
    console.error('Data files not found in:', dataDir);
    process.exit(1);
  }

  const categories = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  const products = JSON.parse(fs.readFileSync(prodPath, 'utf8'));

  console.log(`Found ${categories.length} categories and ${products.length} products to seed.`);

  // Clear existing
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM categories');

  // Insert categories
  console.log('Seeding categories...');
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const imgUrl = CATEGORY_IMAGES[cat.name] || 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg';
    await pool.query(
      `INSERT INTO categories (name, description, image_url, "order", is_active)
       VALUES ($1, $2, $3, $4, true)`,
      [
        cat.name,
        `Specialized ${cat.name.toLowerCase()} supplied for aviation and aerospace applications.`,
        imgUrl,
        i + 1
      ]
    );
  }
  console.log('✅ Categories seeded successfully.');

  // Insert products in batches
  console.log('Seeding products in batches of 200...');
  const batchSize = 200;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const valueClauses: string[] = [];
    const params: unknown[] = [];

    batch.forEach((p: any, idx: number) => {
      const offset = idx * 4;
      valueClauses.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
      params.push(
        p.name,
        p.category,
        p.description || `${p.name} for aviation & aerospace application`,
        p.image || p.imageUrl || ''
      );
    });

    const query = `
      INSERT INTO products (name, category, description, image_url)
      VALUES ${valueClauses.join(', ')}
    `;
    await pool.query(query, params);
    console.log(`Inserted ${Math.min(i + batchSize, products.length)} / ${products.length} products...`);
  }

  console.log('✅ All products seeded into PostgreSQL successfully!');
  await pool.end();
}

seedCatalog().catch((err) => {
  console.error('❌ Failed to seed catalog:', err);
  process.exit(1);
});
