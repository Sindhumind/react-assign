import * as userRepository from '../repositories/userRepository';

// Get all users
export const getUsers = async () => {
  return userRepository.getUsers();
};

// Get user by ID
export const getUserById = async (id: number) => {
  return userRepository.getUserById(id);
};

// Create user
export const createUser = async (
  name: string,
  email: string,
  phone: string,
  gender: string,
  address: string,
  profilePhoto: string | null,
) => {
  return userRepository.createUser(
    name,
    email,
    phone,
    gender,
    address,
    profilePhoto,
  );
};

// Update user
export const updateUser = async (
  id: number,
  name: string,
  email: string,
  phone: string,
  gender: string,
  address: string,
  profilePhoto: string | null,
) => {
  return userRepository.updateUser(
    id,
    name,
    email,
    phone,
    gender,
    address,
    profilePhoto,
  );
};

// Delete user
export const deleteUser = async (id: number) => {
  return userRepository.deleteUser(id);
};