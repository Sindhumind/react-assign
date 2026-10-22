
import type { User } from '../types';
import { getCsrfToken } from './authService';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users/', {
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const createUser = async (
  user: User,
  profilePhoto: File | null,
): Promise<User> => {
  const formData = new FormData();

  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('phone', user.phone);
  formData.append('gender', user.gender);
  formData.append('address', user.address);

  if (profilePhoto) {
    formData.append('profile_photo', profilePhoto);
  }

  const csrfToken = await getCsrfToken();

  const response = await fetch('/api/users/', {
    method: 'POST',
    headers: { 'x-csrf-token': csrfToken },
    credentials: 'same-origin',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

export const updateUser = async (
  user: User,
  profilePhoto: File | null,
): Promise<User> => {
  const formData = new FormData();

  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('phone', user.phone);
  formData.append('gender', user.gender);
  formData.append('address', user.address);

  if (profilePhoto) {
    formData.append('profile_photo', profilePhoto);
  }

  const csrfToken = await getCsrfToken();

  const response = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: { 'x-csrf-token': csrfToken },
    credentials: 'same-origin',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'x-csrf-token': csrfToken },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};
