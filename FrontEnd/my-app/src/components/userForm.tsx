import { useRef, useState } from "react";
import Toast from "./toastAlerts.tsx";
import type { User } from "../types";
import { validateEmail, isDuplicate } from "../utils/logic";

type UserFormProps = {
  users: User[];
  onAddUser: (user: User, profilePhoto: File | null) => Promise<void>;
  onEditUser: (user: User, profilePhoto: File | null) => Promise<void>;
  userToEdit: User | null;
  onCancelEdit: () => void;
};

export default function UserForm({
  users,
  onAddUser,
  onEditUser,
  userToEdit,
  onCancelEdit,
}: UserFormProps) {
  const [toast, setToast] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: userToEdit?.name ?? "",
    email: userToEdit?.email ?? "",
    phone: userToEdit?.phone ?? "",
    gender: userToEdit?.gender ?? "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setProfilePhoto(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
    });

    setProfilePhoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, gender } = formData;

    if (!name || !email || !phone) {
      setToast("Fill all fields");
      return;
    }

    if (!gender) {
      setToast("Select gender");
      return;
    }

    if (!validateEmail(email)) {
      setToast("Invalid email");
      return;
    }

    if (isDuplicate(users, email, userToEdit?.id ?? null)) {
      setToast("Duplicate email");
      return;
    }

    const newUser: User = {
      id: userToEdit ? userToEdit.id : Date.now(),
      name,
      email,
      phone,
      gender,
      profile_photo: userToEdit?.profile_photo ?? "",
    };

    try {
      if (userToEdit) {
        await onEditUser(newUser, profilePhoto);

        // Exit edit mode
        onCancelEdit();
      } else {
        await onAddUser(newUser, profilePhoto);
      }

      // Clear all form fields
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast("Something went wrong");
    }
  };

  return (
    <div className="card">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <form onSubmit={handleSubmit}>
        <h2>{userToEdit ? "Edit User" : "Add User"}</h2>

        {/* Name */}
        <input
          className="input"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email */}
        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Phone */}
        <input
          className="input"
          name="phone"
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={handlePhoneChange}
        />

        {/* Gender */}
        <div className="radio-group">
          {["Male", "Female", "Other"].map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="gender"
                value={item}
                checked={formData.gender === item}
                onChange={handleChange}
              />
              {item}
            </label>
          ))}
        </div>

        {/* Profile Photo */}
        <input
          ref={fileInputRef}
          className="input"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        {/* Preview selected image */}
        {profilePhoto && (
          <img
            src={URL.createObjectURL(profilePhoto)}
            alt="Profile preview"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "50%",
              marginTop: "10px",
            }}
          />
        )}

        {/* Existing image while editing */}
        {!profilePhoto && userToEdit?.profile_photo && (
          <img
            src={`http://localhost:3002/uploads/${userToEdit.profile_photo}`}
            alt="Current profile"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "50%",
              marginTop: "10px",
            }}
          />
        )}

        <button className="btn" type="submit">
          {userToEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
