import type { ChangeEvent } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  profile_photo: string;
};

export type InputFieldProps = {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  id?: string;
};

export type LoginProps = {
  onLogin: () => void;
};

export type UserFormProps = {
  users: User[];
  onAddUser: (user: User, profilePhoto: File | null) => Promise<void>;
  onEditUser: (user: User, profilePhoto: File | null) => Promise<void>;
  userToEdit: User | null;
  onCancelEdit: () => void;
};

export type UserTableProps = {
  users: User[];
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
  userToEdit: User | null;
};

export type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};