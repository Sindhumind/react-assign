import { useState } from "react";
import Header from "./components/header";
import UserForm from "./components/userForm";
import UserTable from "./components/userTable";
import type { User } from "./types";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
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
    setUsers([...users, user]);
  }

  function editUser(user: User) {
    setUserToEdit(user);
  }

  function updateUser(updatedUser: User) {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
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
