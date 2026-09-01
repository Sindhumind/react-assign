import { useCallback, useState } from "react";
import Header from "./components/header";
import Login from "./components/login";
import UserForm from "./components/userForm";
import UserTable from "./components/userTable";
import ConfirmModal from "./components/confirmModalDelete";
import { useUsers } from "./hooks/useUsers";
import type { User } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token"),
  );

  const { users, addUser, updateUser, deleteUser } = useUsers();

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }, []);

  const editUser = useCallback((user: User) => {
    setUserToEdit(user);
  }, []);

  // Clear edit mode
  const cancelEdit = useCallback(() => {
    setUserToEdit(null);
  }, []);

  const handleDeleteUser = useCallback((id: number) => {
    setUserToDelete(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete === null) {
      return;
    }

    deleteUser(userToDelete);
    setUserToDelete(null);
  }, [userToDelete, deleteUser]);

  const cancelDelete = useCallback(() => {
    setUserToDelete(null);
  }, []);

  // Show login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Header onLogout={handleLogout} />

      <div className="app-content">
        <UserForm
          key={userToEdit?.id ?? "new"}
          users={users}
          onAddUser={addUser}
          onEditUser={updateUser}
          userToEdit={userToEdit}
          onCancelEdit={cancelEdit}
        />

        <UserTable
          users={users}
          onDeleteUser={handleDeleteUser}
          onEditUser={editUser}
          userToEdit={userToEdit}
        />
      </div>

      {userToDelete !== null && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </>
  );
}
