import { useEffect, useState } from "react";
import Header from "./components/header";
import UserForm from "./components/userForm";
import UserTable from "./components/userTable";
import type { User } from "./types";

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");

    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const deleteUser = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  function addUser(user: User) {
    setUsers((prevUsers) => [...prevUsers, user]);
  }

  function editUser(user: User) {
    setUserToEdit(user);
  }

  function updateUser(updatedUser: User) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );

    setUserToEdit(null);
  }

  return (
    <>
      <Header />

      <div className="app-content">
        <UserForm
          key={userToEdit?.id ?? "new"}
          users={users}
          onAddUser={addUser}
          onEditUser={updateUser}
          userToEdit={userToEdit}
        />

        <UserTable
          users={users}
          onDeleteUser={deleteUser}
          onEditUser={editUser}
          userToEdit={userToEdit}
        />
      </div>
    </>
  );
}
