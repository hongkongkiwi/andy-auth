import { passwordSchema, phoneSchema, emailSchema } from './schemas';

export const validatePassword = (password: string): boolean => {
  const result = passwordSchema.safeParse(password);
  return result.success;
};

export const validatePhone = (phone: string): boolean => {
  const result = phoneSchema.safeParse(phone);
  return result.success;
};

export const validateEmail = (email: string): boolean => {
  const result = emailSchema.safeParse(email);
  return result.success;
};
