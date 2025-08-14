import { createUser, findUserByEmail } from '../src/db.js';
import bcrypt from 'bcryptjs';

const email = 'test@example.com';
const name = 'Test User';
const password = 'Password123!';

const existing = findUserByEmail(email);
if (existing) {
  console.log('Seed user already exists:', email);
  process.exit(0);
}

const password_hash = bcrypt.hashSync(password, 10);
const user = createUser({ name, email, password_hash });
console.log('Seeded user:', { ...user, password });
