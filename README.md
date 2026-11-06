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

- Node.js 22 (see `.nvmrc`)
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
npm ci
```

3. Copy environment variables
```bash
cp .env.example .env.local
```

4. Fill in the environment variables in `.env.local`:
   - Create a [Supabase project](https://supabase.com) and get your URL and keys
   - Create a [Resend account](https://resend.com) and get your API key

5. Install the database schema and production policies:
   - Back up the target database and rehearse on staging first.
   - In the Supabase SQL Editor, run `supabase-schema.sql` on a fresh database.
   - Then run `supabase-production-cms-migration.sql` on both fresh and existing databases.
   - Verify the `property-images` bucket and owner/admin storage policies created by the migration.

   The production migration does not insert listings, reviews, agents, agencies, developments or articles. New properties start at `pending_review`; public reviews start at `pending`; CMS publication switches start off.

6. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment (Render)

The production target is a **Render Node.js web service**, configured by the included `render.yaml` Blueprint.

```bash
# Render runs these commands automatically
npm ci && npm run build
npm run start
```

The service includes an HTTP health check at `/api/health`. Follow **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for Blueprint setup, environment variables, Supabase authentication URLs, smoke tests, and custom-domain cutover.

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
├── data/             # Static location content (no listing/article fixtures)
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
- Available-only Supabase inventory with no static sample-listing fallback
- Coordinate-aware maps and honest address-search results

### Property Submission
- Guided owner/agent submission with server-side account checks
- Address search, explicit coordinate selection and image upload
- Every owner/agent submission enters `pending_review`; owners cannot publish or verify their own listings
- Edits to live owner listings return to moderation

### Admin Portal
- Dashboard with real-time analytics
- Explicit property publication, verification and moderation
- CRUD for developments, agencies, agents, insights/articles and reviews
- User management, enquiry/contact inboxes and global site settings
- Viewing request management and audit records

### Content Integrity
- No demo property, testimonial, article, agency or development seed files
- No hardcoded fallback listings or editorial articles when Supabase is empty
- Test-only browser fixtures are isolated under `frontend-audit/` and never write to Supabase
- Experimental AI, blockchain and academy components are not part of the production site

### Nigerian Real Estate Focus
- C of O, Governor's Consent, Deed of Assignment support
- Honest verification status labels (verified, pending, unverified)
- Nigerian state-based location filtering
- Naira pricing with proper formatting
- WhatsApp integration for communication

## Environment Variables

See `.env.example` for all required and optional environment variables.

## Database Schema

The base schema is in `supabase-schema.sql`; `supabase-production-cms-migration.sql` completes the production CMS, moderation and RLS policies:
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
