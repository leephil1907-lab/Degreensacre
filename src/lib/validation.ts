// Input validation utilities for security
// No external dependencies - pure TypeScript validation

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationErrors extends Error {
  errors: ValidationError[];
  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationErrors';
    this.errors = errors;
  }
}

// Basic validators
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string): boolean {
  return /^[+]?[\d\s()-]{8,20}$/.test(value);
}

export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

// String sanitizer
export function sanitize(value: string): string {
  return value
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeForDb(value: string): string {
  return value.trim().replace(/\0/g, '');
}

// Length validators
export function validateLength(
  value: string,
  field: string,
  min: number,
  max: number
): ValidationError | null {
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return { field, message: `Must be at least ${min} characters` };
  }
  if (trimmed.length > max) {
    return { field, message: `Must be at most ${max} characters` };
  }
  return null;
}

// Required field validator
export function validateRequired(
  value: any,
  field: string,
  label?: string
): ValidationError | null {
  const name = label || field;
  if (value === null || value === undefined) {
    return { field, message: `${name} is required` };
  }
  if (typeof value === 'string' && value.trim() === '') {
    return { field, message: `${name} is required` };
  }
  if (Array.isArray(value) && value.length === 0) {
    return { field, message: `${name} is required` };
  }
  return null;
}

// Number range validator
export function validateRange(
  value: number,
  field: string,
  min: number,
  max: number,
  label?: string
): ValidationError | null {
  const name = label || field;
  if (typeof value !== 'number' || isNaN(value)) {
    return { field, message: `${name} must be a number` };
  }
  if (value < min || value > max) {
    return { field, message: `${name} must be between ${min} and ${max}` };
  }
  return null;
}

// Enum validator
export function validateEnum<T extends string>(
  value: string,
  field: string,
  allowed: T[],
  label?: string
): ValidationError | null {
  const name = label || field;
  if (!allowed.includes(value as T)) {
    return { field, message: `${name} must be one of: ${allowed.join(', ')}` };
  }
  return null;
}

// Collect errors
export function collectErrors(
  ...errors: (ValidationError | null)[]
): ValidationError[] {
  return errors.filter((e): e is ValidationError => e !== null);
}

// Nigerian state validator
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export function isValidState(state: string): boolean {
  return NIGERIAN_STATES.includes(state);
}

// Property type validator
export const PROPERTY_TYPES = [
  'sale', 'rent', 'lease', 'land', 'commercial', 'short-let'
] as const;

export const BUILDING_TYPES = [
  'Detached Duplex', 'Semi-Detached Duplex', 'Terraced Duplex',
  'Bungalow', 'Flat', 'Apartment', 'Penthouse', 'Mansion',
  'Commercial Building', 'Office Space', 'Shop', 'Warehouse',
  'Land', 'Mixed Use'
] as const;

export const DOCUMENT_TYPES = [
  'C of O',
  "Governor's Consent",
  'Deed of Assignment',
  'Gazette',
  'Excision',
  'Survey Plan',
  'Receipt',
  'Power of Attorney',
  'Other'
] as const;

// File validation
export function validateImageFile(file: File | { type: string; size: number }): ValidationError | null {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { field: 'file', message: 'File must be a JPEG, PNG, or WebP image' };
  }
  if (file.size > maxSize) {
    return { field: 'file', message: 'File must be less than 5MB' };
  }
  return null;
}

export function validateDocumentFile(file: File | { type: string; size: number }): ValidationError | null {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg', 'image/jpg', 'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { field: 'file', message: 'File must be a PDF, image, or Word document' };
  }
  if (file.size > maxSize) {
    return { field: 'file', message: 'File must be less than 10MB' };
  }
  return null;
}

// Password strength validator
export function validatePassword(password: string): ValidationError | null {
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one number' };
  }
  return null;
}
