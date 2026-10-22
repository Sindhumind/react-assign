import { useCallback, useEffect, useState } from "react";
import { checkSession, logout } from "./services/authService";
import Header from "./components/Header";
import Login from "./components/Login";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import ConfirmModal from "./components/ConfirmModalDelete";
import { useUsers } from "./hooks/useUsers";
import type { User } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    let active = true;

    checkSession()
      .then((authenticated) => {
        if (active) {
          setIsLoggedIn(authenticated);
        }
      })
      .catch(() => {
        if (active) {
          setIsLoggedIn(false);
        }
      })
      .finally(() => {
        if (active) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const { users, isLoading, error, addUser, updateUser, deleteUser } =
    useUsers(isLoggedIn);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUserToEdit(null);
      setUserToDelete(null);
    }
  }, []);

  const editUser = useCallback((user: User) => {
    setUserToEdit(user);
  }, []);

  const cancelEdit = useCallback(() => {
    setUserToEdit(null);
  }, []);

  const handleDeleteUser = useCallback((id: number) => {
    setUserToDelete(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (userToDelete === null) {
      return;
    }

    try {
      const deletedId = userToDelete;
      await deleteUser(deletedId);

      if (userToEdit?.id === deletedId) {
        setUserToEdit(null);
        setFormResetKey((previousKey) => previousKey + 1);
      }

      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, [userToDelete, userToEdit, deleteUser]);

  const cancelDelete = useCallback(() => {
    setUserToDelete(null);
  }, []);

  if (isCheckingSession) {
    return <div role="status">Checking session...</div>;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Header onLogout={handleLogout} />

      <main className="app-content">
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-message" role="status">
            Loading users...
          </div>
        ) : (
          <div className="user-management-grid">
            <UserForm
              key={`${userToEdit?.id ?? "new"}-${formResetKey}`}
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
        )}
      </main>

      {userToDelete !== null && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </>
  );
}