import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple JSON-file user store - perfect for a demo/internship project.
// Swap these four functions for a real database (Mongo/Postgres) later
// without touching the controllers.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'users.json');

export async function ensureUserStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, '[]');
  }
}

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}

async function writeAll(users) {
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

export async function findByEmail(email) {
  const users = await readAll();
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

export async function findById(id) {
  const users = await readAll();
  return users.find((u) => u.id === id);
}

export async function createUser(user) {
  const users = await readAll();
  users.push(user);
  await writeAll(users);
  return user;
}
