import { memo, useMemo, useState } from "react";
import type { User, UserTableProps } from "../types";
import Button from "./common/Button";
import InputField from "./common/InputField";

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
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

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

  function getSortLabel(field: string, label: string) {
    if (sortBy !== field) {
      return `Sort by ${label}`;
    }

    return `Sort by ${label} ${
      sortOrder === "asc" ? "descending" : "ascending"
    }`;
  }

  return (
    <div className="card">
      <h2>Registered Users</h2>

      <div className="table-filters">
        <InputField
          name="search"
          type="text"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          aria-label="Filter users by gender"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <Button onClick={clearFilters}>
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          Clear
        </Button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <div className="table-heading">
                  <span>Name</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("name")}
                    aria-label={getSortLabel("name", "Name")}
                  >
                    {sortBy === "name"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th scope="col">
                <div className="table-heading">
                  <span>Email</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("email")}
                    aria-label={getSortLabel("email", "Email")}
                  >
                    {sortBy === "email"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th scope="col">
                <div className="table-heading">
                  <span>Phone</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("phone")}
                    aria-label={getSortLabel("phone", "Phone")}
                  >
                    {sortBy === "phone"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th scope="col">
                <div className="table-heading">
                  <span>Gender</span>

                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSortChange("gender")}
                    aria-label={getSortLabel("gender", "Gender")}
                  >
                    {sortBy === "gender"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </div>
              </th>

              <th scope="col">Address</th>

              <th scope="col" className="profile-photo-column">
                Profile Photo
              </th>

              <th scope="col" className="action-column">
                Actions
              </th>
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
                  <td>{user.address}</td>

                  <td className="profile-photo-column">
                    {user.profile_photo && (
                      <img
                        src={`/uploads/${encodeURIComponent(
                          user.profile_photo,
                        )}`}
                        alt={`${user.name}'s profile`}
                        className="profile-photo"
                      />
                    )}
                  </td>

                  <td>
                    <div className="actions">
                      <Button onClick={() => onEditUser(user)}>
                        <i
                          className="fa-solid fa-pen-to-square"
                          aria-hidden="true"
                        ></i>
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true"></i>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-users">
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
