import { useCallback, useEffect, useState } from "react";
import type { User } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");

    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = useCallback((user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  }, []);
  
  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
}
