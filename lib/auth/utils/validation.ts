import { passwordSchema, phoneSchema } from '../schemas/validation';

export const validatePassword = (password: string): boolean => {
  const result = passwordSchema.safeParse(password);
  return result.success;
};

export const validatePhone = (phone: string): boolean => {
  const result = phoneSchema.safeParse(phone);
  return result.success;
};
