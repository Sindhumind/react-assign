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

  // Add user with profile photo
  const addUser = useCallback(async (user: User, profilePhoto: File | null) => {
    try {
      const formData = new FormData();

      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("gender", user.gender);

      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        body: formData,
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
 const updateUser = useCallback(
   async (updatedUser: User, profilePhoto: File | null) => {
     try {
       const formData = new FormData();

       formData.append("name", updatedUser.name);
       formData.append("email", updatedUser.email);
       formData.append("phone", updatedUser.phone);
       formData.append("gender", updatedUser.gender);

       if (profilePhoto) {
         formData.append("profile_photo", profilePhoto);
       }

       // DEBUG
       console.log("Updating user ID:", updatedUser.id);
       console.log("Profile photo:", profilePhoto);

       for (const pair of formData.entries()) {
         console.log(pair[0], pair[1]);
       }

       const response = await fetch(
         `http://localhost:3000/api/users/${updatedUser.id}`,
         {
           method: "PUT",
           body: formData,
         },
       );

       console.log("Update response status:", response.status);

       if (!response.ok) {
         const errorText = await response.text();
         console.log("Backend error:", errorText);

         throw new Error("Failed to update user");
       }

       const savedUser: User = await response.json();

       console.log("Updated user from backend:", savedUser);

       setUsers((prevUsers) =>
         prevUsers.map((user) => (user.id === savedUser.id ? savedUser : user)),
       );
     } catch (error) {
       console.error("Error updating user:", error);
     }
   },
   [],
 );

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
