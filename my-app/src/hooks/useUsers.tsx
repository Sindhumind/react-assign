import { useCallback, useEffect, useState } from "react";
import type { User } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  // Get users from Node.js + Express backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const addUser = useCallback(async (user: User) => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const createdUser: User = await response.json();

      setUsers((prevUsers) => [...prevUsers, createdUser]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }, []);

  // Update user 
  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const savedUser: User = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === savedUser.id ? savedUser : user)),
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }, []);

  // Delete user 
  const deleteUser = useCallback(async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, []);

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
}
