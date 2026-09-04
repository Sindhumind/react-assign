import { useCallback, useEffect, useState } from "react";
import type { User } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Get users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/users", {
          headers: getAuthHeaders(),
        });

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

  // Add user
  const addUser = useCallback(
    async (user: User, profilePhoto: File | null): Promise<void> => {
      try {
        const formData = new FormData();

        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("phone", user.phone);
        formData.append("gender", user.gender);

        if (profilePhoto) {
          formData.append("profile_photo", profilePhoto);
        }

        const response = await fetch("http://localhost:3002/api/users", {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const createdUser: User = await response.json();

        setUsers((prevUsers) => [...prevUsers, createdUser]);
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
    [],
  );

  // Update user
  const updateUser = useCallback(
    async (updatedUser: User, profilePhoto: File | null): Promise<void> => {
      try {
        const formData = new FormData();

        formData.append("name", updatedUser.name);
        formData.append("email", updatedUser.email);
        formData.append("phone", updatedUser.phone);
        formData.append("gender", updatedUser.gender);

        if (profilePhoto) {
          formData.append("profile_photo", profilePhoto);
        }

        const response = await fetch(
          `http://localhost:3002/api/users/${updatedUser.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const savedUser: User = await response.json();

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === savedUser.id ? savedUser : user,
          ),
        );
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    [],
  );

  // Delete user
  const deleteUser = useCallback(async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }, []);

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
}
