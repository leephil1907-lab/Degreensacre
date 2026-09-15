import Link from 'next/link';

export interface Development {
  id: string;
  slug: string;
  name: string;
  developer: string;
  location: string;
  state: string;
  description: string;
  masterplan?: string;
  status: 'planning' | 'under-construction' | 'completed' | 'sold-out';
  completionDate?: string;
  totalUnits: number;
  availableUnits: number;
  unitTypes: {
    type: string;
    bedrooms?: number;
    size: number;
    price: number;
    available: number;
  }[];
  amenities: string[];
  paymentPlans?: {
    name: string;
    description: string;
    duration: string;
  }[];
  gallery: string[];
  features: string[];
  documentation?: string;
  siteInspection?: boolean;
  featured: boolean;
  dateAdded: string;
}

export const developments: Development[] = [
  {
    id: 'dev-001',
    slug: 'greenacres-estate-uyo',
    name: 'Greenacres Estate Uyo',
    developer: 'De-Greenacres Properties',
    location: 'Shelter Afrique Extension',
    state: 'Akwa Ibom',
    description: 'Premium residential estate featuring 50 luxury plots with modern infrastructure, 24/7 security, and excellent road networks. Located in the prestigious Shelter Afrique Extension area of Uyo.',
    status: 'under-construction',
    completionDate: '2027-06',
    totalUnits: 50,
    availableUnits: 32,
    unitTypes: [
      {
        type: 'Standard Plot',
        size: 600,
        price: 15000000,
        available: 20
      },
      {
        type: 'Premium Plot',
        size: 800,
        price: 22000000,
        available: 8
      },
      {
        type: 'Corner Plot',
        size: 1000,
        price: 30000000,
        available: 4
      }
    ],
    amenities: [
      'Perimeter Fence',
      'Gate House',
      '24/7 Security',
      'Tarred Roads',
      'Street Lights',
      'Drainage System',
      'Water Treatment',
      'Recreational Park',
      'Commercial Area'
    ],
    paymentPlans: [
      {
        name: 'Outright Payment',
        description: 'Full payment with 5% discount',
        duration: 'Immediate'
      },
      {
        name: '6-Month Plan',
        description: '30% initial deposit, balance over 6 months',
        duration: '6 months'
      },
      {
        name: '12-Month Plan',
        description: '20% initial deposit, balance over 12 months',
        duration: '12 months'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'
    ],
    features: [
      'C of O Documentation',
      'Government Approved',
      'Dry Land',
      'Excellent Topography',
      'Close to Main Road',
      'Growing Area'
    ],
    documentation: 'C of O',
    siteInspection: true,
    featured: true,
    dateAdded: '2026-09-01'
  },
  {
    id: 'dev-002',
    slug: 'luxury-court-lekki',
    name: 'Luxury Court Lekki',
    developer: 'De-Greenacres Properties',
    location: 'Chevron Drive',
    state: 'Lagos',
    description: 'Exclusive gated community featuring 24 luxury 4 & 5 bedroom duplexes with modern amenities, smart home features, and premium finishes.',
    status: 'under-construction',
    completionDate: '2027-12',
    totalUnits: 24,
    availableUnits: 16,
    unitTypes: [
      {
        type: '4 Bedroom Semi-Detached',
        bedrooms: 4,
        size: 320,
        price: 120000000,
        available: 10
      },
      {
        type: '5 Bedroom Fully Detached',
        bedrooms: 5,
        size: 450,
        price: 180000000,
        available: 6
      }
    ],
    amenities: [
      'Swimming Pool',
      'Gym',
      'Tennis Court',
      'Children\'s Playground',
      'Clubhouse',
      '24/7 Security',
      'CCTV Surveillance',
      'Backup Power',
      'Water Treatment',
      'Estate Management'
    ],
    paymentPlans: [
      {
        name: 'Outright Payment',
        description: 'Full payment with 10% discount',
        duration: 'Immediate'
      },
      {
        name: 'Construction Milestone Plan',
        description: 'Payments tied to construction milestones',
        duration: '24 months'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'
    ],
    features: [
      'Smart Home Automation',
      'Premium Finishes',
      'All Rooms Ensuite',
      'Boys Quarter',
      'Ample Parking',
      'Modern Kitchen'
    ],
    documentation: 'Governor\'s Consent',
    siteInspection: true,
    featured: true,
    dateAdded: '2026-08-15'
  }
];
