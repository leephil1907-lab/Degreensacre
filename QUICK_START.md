# 🚀 Quick Start Guide - De-Greenacres Properties

## What Was Built

A **production-grade Nigerian real estate marketplace** with:
- ✅ 20+ database tables with Row Level Security
- ✅ 17+ API endpoints with validation
- ✅ Full authentication system (login, register, password reset)
- ✅ Customer dashboard with saved properties, enquiries, viewings
- ✅ Advanced property filtering with URL-based search
- ✅ Property detail pages with enquiry forms and viewing scheduler
- ✅ Admin portal infrastructure (dashboard, moderation, analytics)
- ✅ Real-time messaging foundation
- ✅ Complete security (RLS, input validation, XSS prevention)
- ✅ Production build passing all checks

## Quick Deployment (5 Minutes)

### Step 1: Set Up Supabase (2 min)

1. Go to https://supabase.com and create a new project
2. Go to SQL Editor
3. Copy and paste the entire contents of `supabase-schema-v2.sql`
4. Click "Run" to create all tables
5. Go to Storage and create these buckets:
   - `property-images` (public)
   - `property-documents` (private)
   - `verification-documents` (private)
   - `profile-avatars` (public)
6. Copy your project URL and keys from Settings → API

### Step 2: Configure Environment (1 min)

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_your_key (get from resend.com)
NEXT_PUBLIC_WHATSAPP_NUMBER=2348065019971
```

### Step 3: Install & Run (2 min)

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Step 4: Create Admin User

1. Register at http://localhost:3000/auth/register
2. In Supabase dashboard, run:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
```

## Deploy to Production

### Option A: Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Then add environment variables in Vercel dashboard.

### Option B: Railway

```bash
railway init
railway up
```

### Option C: Self-hosted

```bash
npm run build
npm start
```

## Testing the Platform

### Test Authentication
1. Visit `/auth/register` and create an account
2. Check email for verification link
3. Login at `/auth/login`
4. Visit `/dashboard` (should be protected)

### Test Property Features
1. Browse `/properties` and test filters
2. Click a property to view details
3. Submit an enquiry
4. Schedule a viewing
5. Save/bookmark properties

### Test Admin Portal
1. Login as admin user
2. Visit `/admin/dashboard`
3. View statistics and recent activity
4. Moderate properties at `/admin/properties`

## What's Working Now

### ✅ Fully Functional
- User registration and login
- Email verification flow
- Password reset
- Customer dashboard
- Property browsing with filters
- Property detail pages
- Enquiry submission
- Viewing requests
- Saved properties
- Notifications
- Admin authentication
- API endpoints

### 🔧 Needs Database Setup
- Property submission (needs Supabase Storage buckets)
- Image uploads (needs Storage policies)
- Real-time features (needs Supabase Realtime enabled)

### 📝 Needs Configuration
- Email sending (needs Resend API key)
- WhatsApp integration (needs WhatsApp number)
- Production deployment (needs domain and SSL)

## Common Issues

### "Unauthorized" errors
- Make sure you're logged in
- Check that Supabase URL and keys are correct in `.env.local`

### "Failed to fetch" errors
- Verify Supabase project is active
- Check that RLS policies are created
- Ensure API routes can reach Supabase

### Images not loading
- Create Storage buckets in Supabase
- Set buckets to public (for property-images, profile-avatars)
- Configure Storage policies

### Admin access denied
- Update user profile in Supabase: `UPDATE profiles SET is_admin = true WHERE email = 'your-email';`

## Next Steps

1. **Deploy to production** using Vercel/Railway
2. **Create sample properties** in the database
3. **Customize email templates** with your branding
4. **Set up WhatsApp Business** for notifications
5. **Add Google Analytics** for tracking

## Documentation

- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `PRODUCTION_UPGRADE_SUMMARY.md` - Full feature list
- `.env.example` - Environment variables reference

## Support

- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Check Vercel/Supabase dashboards for error logs

---

**De-Greenacres Properties Limited**  
RC: 1856064 | CAC Registered  
info@degreenacresproperties.com | +234 806 501 9971
