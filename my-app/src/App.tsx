import { useCallback, useState } from "react";
import Header from "./components/header";
import UserForm from "./components/userForm";
import UserTable from "./components/userTable";
import ConfirmModal from "./components/ConfirmModal";
import { useUsers } from "./hooks/useUsers";
import type { User } from "./types";

export default function App() {
  const { users, addUser, updateUser, deleteUser } = useUsers();

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const editUser = useCallback((user: User) => {
    setUserToEdit(user);
  }, []);

  const handleUpdateUser = useCallback(
    (updatedUser: User) => {
      updateUser(updatedUser);
      setUserToEdit(null);
    },
    [updateUser],
  );

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

  return (
    <>
      <Header />

      <div className="app-content">
        <UserForm
          key={userToEdit?.id ?? "new"}
          users={users}
          onAddUser={addUser}
          onEditUser={handleUpdateUser}
          userToEdit={userToEdit}
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
