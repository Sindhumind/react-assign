import { useState } from "react";
import type { User } from "../types";
import { validateEmail, isDuplicate } from "../utils/logic";

type UserFormProps = {
  users: User[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User) => void;
  userToEdit: User | null;
};

export default function UserForm({
  users,
  onAddUser,
  onEditUser,
  userToEdit,
}: UserFormProps) {
  const [name, setName] = useState(userToEdit?.name ?? "");
  const [email, setEmail] = useState(userToEdit?.email ?? "");
  const [phone, setPhone] = useState(userToEdit?.phone ?? "");
  const [gender, setGender] = useState(userToEdit?.gender ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("Fill all fields");
      return;
    }

    if (!gender) {
      alert("Select gender");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email");
      return;
    }

    if (isDuplicate(users, email, userToEdit ? userToEdit.id : null)) {
      alert("Duplicate email");
      return;
    }

    const newUser: User = {
      id: userToEdit ? userToEdit.id : Date.now(),
      name,
      email,
      phone,
      gender,
    };

    if (userToEdit) {
      onEditUser(newUser);
    } else {
      onAddUser(newUser);
    }

    setName("");
    setEmail("");
    setPhone("");
    setGender("");
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h2>{userToEdit ? "Edit User" : "Add User"}</h2>

        <input
          className="input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setPhone(value);
            }
          }}
        />

        <div className="radio-group">
          {["Male", "Female", "Other"].map((item) => (
            <label key={item}>
              <input
                type="radio"
                value={item}
                checked={gender === item}
                onChange={(e) => setGender(e.target.value)}
              />
              {item}
            </label>
          ))}
        </div>

        <button className="btn" type="submit">
          {userToEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
