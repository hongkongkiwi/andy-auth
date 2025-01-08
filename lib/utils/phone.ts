export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(normalizePhoneNumber(phone));
};
