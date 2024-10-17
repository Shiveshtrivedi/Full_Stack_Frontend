const passwordValidationRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  return emailValidationRegex.test(email);
};

export const validatePassword = (password: string) => {
  return passwordValidationRegex.test(password);
};
