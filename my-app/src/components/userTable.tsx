import { memo } from "react";
import type { User } from "../types";

type UserTableProps = {
  users: User[];
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
  userToEdit: User | null;
};

function UserTable({
  users,
  onDeleteUser,
  onEditUser,
  userToEdit,
}: UserTableProps) {
  return (
    <div className="card">
      <h2>Registered Users</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={userToEdit?.id === user.id ? "editing-row" : ""}
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>

                <td>
                  <button className="btn" onClick={() => onEditUser(user)}>
                    Edit
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(UserTable);
