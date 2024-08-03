export const validateUsername = (username) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};
