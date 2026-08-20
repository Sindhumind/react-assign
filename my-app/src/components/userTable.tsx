import { memo, useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesGender =
        genderFilter === "All" || user.gender === genderFilter;

      return matchesSearch && matchesGender;
    });

    if (sortBy !== "None") {
      result = [...result].sort((a, b) => {
        const valueA = a[sortBy as keyof User];
        const valueB = b[sortBy as keyof User];

        const comparison = String(valueA).localeCompare(
          String(valueB),
          undefined,
          {
            numeric: true,
          },
        );

        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [users, search, genderFilter, sortBy, sortOrder]);

  function handleSortChange(value: string) {
    if (sortBy === value) {
      setSortOrder((previousOrder) =>
        previousOrder === "asc" ? "desc" : "asc",
      );
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
  }

  function clearFilters() {
    setSearch("");
    setGenderFilter("All");
    setSortBy("None");
    setSortOrder("asc");
  }

  return (
    <div className="card">
      <h2>Registered Users</h2>

      <div className="table-filters">
        <input
          className="input"
          type="text"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button className="btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="table-heading">
                  <span>Name</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("name")}
                  >
                    {sortBy === "name"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th>
                <div className="table-heading">
                  <span>Email</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("email")}
                  >
                    {sortBy === "email"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th>
                <div className="table-heading">
                  <span>Phone</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("phone")}
                  >
                    {sortBy === "phone"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th>
                <div className="table-heading">
                  <span>Gender</span>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("gender")}
                  >
                    {sortBy === "gender"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedUsers.length > 0 ? (
              filteredAndSortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={userToEdit?.id === user.id ? "editing-row" : ""}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender}</td>

                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => onEditUser(user)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(UserTable);
