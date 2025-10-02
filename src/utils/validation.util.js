// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 8 characters long and include at least one uppercase, lowercase, and number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = [];
  for (const field of requiredFields) {
    if (!obj[field] && obj[field] !== 0) {
      missingFields.push(field);
    }
  }
  return missingFields;
};

export const isValidString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
};