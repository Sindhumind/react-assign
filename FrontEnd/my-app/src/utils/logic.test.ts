
import { describe, it, expect } from 'vitest';
import { validateEmail, isDuplicate } from './logic';
import type { User } from '../types';

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('sindhu@example.com')).toBe(true);
  });

  it('rejects an email without @', () => {
    expect(validateEmail('sindhuexample.com')).toBe(false);
  });

  it('rejects an email without a domain extension', () => {
    expect(validateEmail('sindhu@example')).toBe(false);
  });

  it('rejects an email containing spaces', () => {
    expect(validateEmail('sindhu @example.com')).toBe(false);
  });
});

describe('isDuplicate', () => {
  const users = [
    { id: 1, email: 'one@example.com' },
    { id: 2, email: 'two@example.com' },
  ] as User[];

  it('returns true when another user has the email', () => {
    expect(isDuplicate(users, 'one@example.com', null)).toBe(true);
  });

  it('returns false when the email is not used', () => {
    expect(isDuplicate(users, 'three@example.com', null)).toBe(false);
  });

  it('does not flag the edited user’s own email', () => {
    expect(isDuplicate(users, 'one@example.com', 1)).toBe(false);
  });

  it('flags an email belonging to a different user while editing', () => {
    expect(isDuplicate(users, 'two@example.com', 1)).toBe(true);
  });
});