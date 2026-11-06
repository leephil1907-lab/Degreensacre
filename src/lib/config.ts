// Centralized configuration for De-Greenacres Properties

import { getSiteUrl } from './site';

export const config = {
  // Company Information
  company: {
    name: 'De-Greenacres Properties Limited',
    rcNumber: 'RC: 1856064',
    email: 'degreenacrespropertieslimited@gmail.com',
    supportEmail: 'degreenacrespropertieslimited@gmail.com',
    phone: '+2348065019971',
    address: 'Lagos, Nigeria',
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'degreenacrespropertieslimited@gmail.com',
  },

  // WhatsApp Configuration
  whatsapp: {
    number: '2347041754800',
    defaultMessage: 'Hello, I am interested in your property listing on De-Greenacres.',
  },

  // Application Settings
  app: {
    name: 'De-Greenacres Properties',
    url: getSiteUrl(),
    defaultLocale: 'en-NG',
    currency: 'NGN',
    currencySymbol: '₦',
    domain: 'degreenacres.org',
  },

  // Pagination
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },

  // File Upload Limits
  upload: {
    maxImages: 10,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // Property Settings
  property: {
    statuses: ['available', 'sold', 'rented', 'pending', 'archived'] as const,
    types: ['sale', 'rent', 'lease', 'short-let'] as const,
    verificationStatuses: ['verified', 'pending', 'unverified'] as const,
  },

  // API Endpoints
  api: {
    properties: '/api/properties',
    enquiries: '/api/enquiries',
    messages: '/api/messages',
    admin: '/api/admin',
  },
};

export default config;
