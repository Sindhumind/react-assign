import type { User } from "../types";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDuplicate(
  users: User[],
  email: string,
  editId: number | null
): boolean {
  return users.some(
    (user) =>
      user.email === email &&
      user.id !== editId
  );
}


export { validateEmail, isDuplicate};