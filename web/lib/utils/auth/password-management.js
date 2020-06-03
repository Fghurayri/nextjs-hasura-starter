import { hash, compare } from "bcrypt";

export async function hashPassword(password) {
  return hash(password, 10);
}

export async function compareHashedPassword(password, hashedPassword) {
  return compare(password, hashedPassword);
}
