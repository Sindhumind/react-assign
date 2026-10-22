
import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { validateUserInput } from '../utils/validateUserInput';

const getValidUserId = (
  value: string | string[],
): number | null => {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) ? id : null;
};

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getValidUserId(req.params.id);

    if (id === null) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Create user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validation = validateUserInput(req.body);

    if (!validation.data || validation.error) {
      res.status(400).json({
        message: validation.error ?? 'Invalid user input.',
      });
      return;
    }

    const {
      name,
      email,
      phone,
      gender,
      address,
    } = validation.data;

    const profilePhoto = req.file ? req.file.filename : null;

    const user = await userService.createUser(
      name,
      email,
      phone,
      gender,
      address,
      profilePhoto,
    );

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getValidUserId(req.params.id);

    if (id === null) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    const validation = validateUserInput(req.body);

    if (!validation.data || validation.error) {
      res.status(400).json({
        message: validation.error ?? 'Invalid user input.',
      });
      return;
    }

    const {
      name,
      email,
      phone,
      gender,
      address,
    } = validation.data;

    const profilePhoto = req.file ? req.file.filename : null;

    const user = await userService.updateUser(
      id,
      name,
      email,
      phone,
      gender,
      address,
      profilePhoto,
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getValidUserId(req.params.id);

    if (id === null) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    const user = await userService.deleteUser(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
