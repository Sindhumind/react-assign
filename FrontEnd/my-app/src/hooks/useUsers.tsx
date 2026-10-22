import { useCallback, useEffect, useState } from "react";
import type { User } from "../types";
import * as userService from "../services/userService";

export function useUsers(isLoggedIn: boolean) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get users
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await userService.getUsers();

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Unable to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isLoggedIn]);

  // Add user
  const addUser = useCallback(
    async (user: User, profilePhoto: File | null): Promise<void> => {
      setError("");

      try {
        const createdUser = await userService.createUser(user, profilePhoto);

        setUsers((previousUsers) => [...previousUsers, createdUser]);
      } catch (error) {
        console.error("Error creating user:", error);
        setError("Unable to create user. Please try again.");
        throw error;
      }
    },
    [],
  );

  // Update user
  const updateUser = useCallback(
    async (updatedUser: User, profilePhoto: File | null): Promise<void> => {
      setError("");

      try {
        const savedUser = await userService.updateUser(
          updatedUser,
          profilePhoto,
        );

        setUsers((previousUsers) =>
          previousUsers.map((user) =>
            user.id === savedUser.id ? savedUser : user,
          ),
        );
      } catch (error) {
        console.error("Error updating user:", error);
        setError("Unable to update user. Please try again.");
        throw error;
      }
    },
    [],
  );

  // Delete user
  const deleteUser = useCallback(async (id: number): Promise<void> => {
    setError("");

    try {
      await userService.deleteUser(id);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id),
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Unable to delete user. Please try again.");
      throw error;
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
  };
}
