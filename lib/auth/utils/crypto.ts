import { hashSync, compareSync } from 'bcrypt-mini';
import { AUTH_ERRORS, handleAuthError } from '../errors';
import { createHash } from 'crypto';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return Promise.resolve(hashSync(password, SALT_ROUNDS));
  } catch (error) {
    throw AUTH_ERRORS.INTERNAL_ERROR({
      context: 'hashPassword',
      error
    });
  }
};

export const verifyPassword = async (data: {
  hash: string;
  password: string;
}): Promise<boolean> => {
  try {
    return Promise.resolve(compareSync(data.password, data.hash));
  } catch (error) {
    throw AUTH_ERRORS.INVALID_CREDENTIALS({
      context: 'verifyPassword',
      error
    });
  }
};

export const generateToken = (length = 32): string => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const generateMFASecret = (): string => {
  return Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const generateBackupCodes = (count = 10): string[] => {
  return Array.from({ length: count }, () =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16))
      .join('')
      .toUpperCase()
  );
};

export const hashToken = (code: string): string => {
  return createHash('sha256').update(code).digest('hex');
};
