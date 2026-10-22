import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Toast from "./ToastAlerts.tsx";
import InputField from "./common/InputField";
import type { User, UserFormProps } from "../types/index.ts";
import { validateEmail, isDuplicate } from "../utils/logic.ts";
import Button from "./common/Button";

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
    address: userToEdit?.address ?? "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  /*
   * Clean up the temporary object URL.
   *
   * The URL itself is created in handlePhotoChange.
   * This effect is only responsible for cleanup.
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setFormData((previousData) => ({
        ...previousData,
        phone: value,
      }));
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setProfilePhoto(null);
      setPreviewUrl("");
      return;
    }

    /*
     * Validate file type.
     */
    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image file");
      event.target.value = "";
      return;
    }

    /*
     * Limit file size to 5 MB.
     */
    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setToast("Profile photo must be less than 5 MB");
      event.target.value = "";
      return;
    }

    /*
     * Create the preview URL here instead of inside useEffect.
     */
    const objectUrl = URL.createObjectURL(file);

    setProfilePhoto(file);
    setPreviewUrl(objectUrl);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
    });

    setProfilePhoto(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, email, phone, gender, address } = formData;

    /*
     * Required field validation.
     */
    if (!name.trim()) {
      setToast("Name is required");
      return;
    }

    if (!email.trim()) {
      setToast("Email is required");
      return;
    }

    if (!phone.trim()) {
      setToast("Phone is required");
      return;
    }

    if (!address.trim()) {
      setToast("Address is required");
      return;
    }

    if (!gender) {
      setToast("Select gender");
      return;
    }

    /*
     * Email validation.
     */
    if (!validateEmail(email)) {
      setToast("Invalid email");
      return;
    }

    /*
     * Phone must contain exactly 10 digits.
     */
    if (!/^\d{10}$/.test(phone)) {
      setToast("Phone number must contain exactly 10 digits");
      return;
    }

    /*
     * Prevent duplicate email addresses.
     */
    if (isDuplicate(users, email, userToEdit?.id ?? null)) {
      setToast("Duplicate email");
      return;
    }

    const newUser: User = {
      id: userToEdit ? userToEdit.id : Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone,
      gender,
      address: address.trim(),
      profile_photo: userToEdit?.profile_photo ?? "",
    };

    try {
      if (userToEdit) {
        await onEditUser(newUser, profilePhoto);
        onCancelEdit();
      } else {
        await onAddUser(newUser, profilePhoto);
      }

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

        <InputField
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <InputField
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <InputField
          name="phone"
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          maxLength={10}
          required
        />

        {/* Address */}
        <div className="form-field">
          <label htmlFor="address">Address</label>

          <textarea
            id="address"
            name="address"
            className="input"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* Gender */}
        <fieldset className="radio-group">
          <legend>Gender</legend>

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
        </fieldset>

        {/* Profile Photo */}
        <div className="form-field">
          <label htmlFor="profile-photo">Profile Photo</label>

          <input
            id="profile-photo"
            ref={fileInputRef}
            className="input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Selected image preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Selected profile preview"
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
            src={`/uploads/${encodeURIComponent(userToEdit.profile_photo)}`}
            alt={`${userToEdit.name}'s current profile`}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "50%",
              marginTop: "10px",
            }}
          />
        )}

        <div className="form-actions">
          <Button type="submit">{userToEdit ? "Update" : "Submit"}</Button>

          {userToEdit && (
            <Button type="button" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
