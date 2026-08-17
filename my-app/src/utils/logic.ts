import type { AppTypes } from "../types";
type User = AppTypes["User"];

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

function filterUsers(
  users: User[],
  search: string
): User[] {
  const value = search.toLowerCase();

  return users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(value)
  );
}

function sortUsers(
  users: User[],
  field: keyof User,
  order: "asc" | "desc"
): User[] {
  return [...users].sort((a, b) => {
    const x = String(a[field]).toLowerCase();
    const y = String(b[field]).toLowerCase();

    return order === "asc"
      ? x.localeCompare(y)
      : y.localeCompare(x);
  });
}

export { validateEmail, isDuplicate, filterUsers, sortUsers };