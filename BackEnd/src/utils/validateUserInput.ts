
export interface UserInput {
  name: unknown;
  email: unknown;
  phone?: unknown;
  gender?: unknown;
  address?: unknown;
}

export interface ValidatedUserInput {
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
}

interface ValidationResult {
  data?: ValidatedUserInput;
  error?: string;
}

export const validateUserInput = (
  input: UserInput,
): ValidationResult => {
  const { name, email, phone, gender, address } = input;

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required.' };
  }

  const normalizedName = name.trim();

  if (normalizedName.length > 100) {
    return { error: 'Name must not exceed 100 characters.' };
  }

  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Email is required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length > 150) {
    return { error: 'Email must not exceed 150 characters.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return { error: 'Please provide a valid email address.' };
  }

  if (
    phone !== undefined &&
    phone !== null &&
    typeof phone !== 'string'
  ) {
    return { error: 'Phone must be a string.' };
  }

  const normalizedPhone =
    typeof phone === 'string' ? phone.trim() : '';

  if (normalizedPhone.length > 20) {
    return { error: 'Phone must not exceed 20 characters.' };
  }

  if (
    gender !== undefined &&
    gender !== null &&
    typeof gender !== 'string'
  ) {
    return { error: 'Gender must be a string.' };
  }

  if (
    address !== undefined &&
    address !== null &&
    typeof address !== 'string'
  ) {
    return { error: 'Address must be a string.' };
  }

  return {
    data: {
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      gender:
        typeof gender === 'string' ? gender.trim() : '',
      address:
        typeof address === 'string' ? address.trim() : '',
    },
  };
};