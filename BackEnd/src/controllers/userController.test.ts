import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/userService', () => ({
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './userController';

function createResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
}

describe('User controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns users with status 200', async () => {
    const users = [{ id: 1, name: 'Test User' }];
    vi.mocked(userService.getUsers).mockResolvedValue(users as never);

    const req = {} as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await getUsers(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid user ID', async () => {
    const req = { params: { id: 'abc' } } as unknown as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await getUserById(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid user ID.',
    });
    expect(userService.getUserById).not.toHaveBeenCalled();
  });

  it('returns 404 when a user does not exist', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(null as never);

    const req = { params: { id: '999' } } as unknown as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await getUserById(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });

  it('returns 400 when creating a user with invalid input', async () => {
    const req = {
      body: {
        name: '',
        email: 'invalid-email',
        phone: '123',
        gender: '',
        address: '',
      },
    } as unknown as Request;

    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await createUser(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid delete ID', async () => {
    const req = { params: { id: '0' } } as unknown as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await deleteUser(req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid user ID.',
    });
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it('passes service errors to the error handler', async () => {
    const error = new Error('Database failure');
    vi.mocked(userService.getUsers).mockRejectedValue(error);

    const req = {} as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    await getUsers(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

it('returns 400 for an invalid update ID', async () => {
  const req = {
    params: { id: 'abc' },
    body: {},
  } as unknown as Request;

  const res = createResponse();
  const next = vi.fn() as NextFunction;

  await updateUser(req, res as unknown as Response, next);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Invalid user ID.',
  });
  expect(userService.updateUser).not.toHaveBeenCalled();
});

it('returns 200 when a user is deleted successfully', async () => {
  vi.mocked(userService.deleteUser).mockResolvedValue(
    { id: 1 } as never,
  );

  const req = { params: { id: '1' } } as unknown as Request;
  const res = createResponse();
  const next = vi.fn() as NextFunction;

  await deleteUser(req, res as unknown as Response, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'User deleted successfully',
  });
});

});
