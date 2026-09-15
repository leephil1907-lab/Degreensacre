# De-Greenacres Properties - Production Nigerian Real Estate Platform

A production-grade real estate marketplace for Nigerian properties, built with Next.js 16, Supabase, and TypeScript.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Email:** Resend
- **Maps:** Leaflet / OpenStreetMap
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Resend account (for transactional emails)

### Installation

1. Clone the repository
```bash
git clone https://github.com/leephil1907-lab/Degreensacre.git
cd Degreensacre
```

2. Install dependencies
```bash
npm install
```

3. Copy environment variables
```bash
cp .env.example .env.local
```

4. Fill in the environment variables in `.env.local`:
   - Create a [Supabase project](https://supabase.com) and get your URL and keys
   - Create a [Resend account](https://resend.com) and get your API key

5. Run the database schema:
   - Go to your Supabase SQL Editor
   - Run the contents of `supabase-schema-v2.sql`
   - Create storage buckets: `property-images`, `property-documents`, `verification-documents`, `profile-avatars`

6. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes (properties, enquiries, admin, etc.)
│   ├── auth/         # Authentication pages (login, register, forgot-password)
│   ├── admin/        # Admin portal pages
│   ├── dashboard/    # Customer dashboard
│   ├── properties/   # Property listing and detail pages
│   ├── developments/ # Development projects
│   ├── insights/     # Blog/articles
│   └── contact/      # Contact page
├── components/       # Reusable UI components
├── contexts/         # React contexts (Auth)
├── data/             # Static data (for development)
├── emails/           # Email templates
└── lib/              # Utility libraries
    ├── supabase.ts         # Supabase client (browser)
    ├── supabase-server.ts  # Supabase client (server)
    ├── db-helpers.ts       # Database helper functions
    ├── middleware.ts       # API middleware (auth, admin)
    ├── validation.ts       # Input validation
    └── storage.ts          # File upload helpers
```

## Key Features

### Authentication & Authorization
- Email/password authentication with Supabase Auth
- Email verification flow
- Password reset with secure tokens
- Role-based access (buyer, seller, agent, admin)
- Protected routes with middleware

### Property Marketplace
- Advanced filtering (type, state, area, price range, bedrooms)
- URL-based filter persistence
- Multiple sorting options
- Grid and list view modes
- Property save/bookmark functionality
- Property comparison (up to 4)

### Property Submission
- 9-step wizard with autosave
- Image and document upload to Supabase Storage
- Draft/submitted/published workflow
- Nigerian property verification standards

### Admin Portal
- Dashboard with real-time analytics
- Property moderation (approve/reject/verify/suspend)
- User management
- CRM for enquiries
- Viewing request management
- Activity and audit logs

### Nigerian Real Estate Focus
- C of O, Governor's Consent, Deed of Assignment support
- Honest verification status labels (verified, pending, unverified)
- Nigerian state-based location filtering
- Naira pricing with proper formatting
- WhatsApp integration for communication

## Environment Variables

See `.env.example` for all required and optional environment variables.

## Database Schema

The complete database schema is in `supabase-schema-v2.sql` with 20+ tables:
- `profiles` - User profiles extending Supabase auth
- `properties` - Property listings with full metadata
- `property_images` - Property photo gallery
- `property_documents` - Property documentation files
- `enquiries` - CRM-tracked enquiries
- `viewing_requests` - Scheduled property viewings
- `saved_properties` - User bookmarks
- `saved_searches` - Saved search criteria with alerts
- `notifications` - In-app notifications
- `conversations` / `messages` - Real-time messaging
- `agents` / `agencies` - Agent profiles
- `verification_records` / `verification_documents` - Property verification
- `admin_activity` / `audit_logs` - Audit trail
- `developments` / `development_images` - New developments
- `contact_requests` - Contact form submissions
- `reports` - User reports

## Security

- Row Level Security (RLS) on all tables
- Server-side authorization for admin routes
- Input validation on all API endpoints
- File upload validation (type, size)
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization

## License

Proprietary - De-Greenacres Properties Limited (RC: 1856064)
