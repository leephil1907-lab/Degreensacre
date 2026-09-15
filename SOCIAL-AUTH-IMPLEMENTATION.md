# 🔐 GOOGLE & FACEBOOK SIGN-IN IMPLEMENTATION GUIDE
## De-Greenacres Properties Platform

**Date:** September 15, 2026  
**Status:** UI Complete - Backend Integration Required  

---

## 📊 CURRENT STATUS

### ✅ What's Working:
- Sign-in buttons display correctly
- UI is complete and functional
- Forms are structured properly
- Navigation flows work

### ❌ What's NOT Working:
- Google Sign-In (not connected to OAuth)
- Facebook Sign-In (not connected to OAuth)
- Actual authentication (no backend integration)

---

## 🎯 TO MAKE GOOGLE/FACEBOOK SIGN-IN FUNCTIONAL

### **Option 1: Supabase Auth (RECOMMENDED)**

Supabase provides built-in OAuth for Google and Facebook with minimal setup.

#### **Step 1: Configure Google OAuth**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing

2. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in:
     - **App name:** `DEGREENSACRE` (this is what users will see!)
     - **User support email:** info@degreenacresproperties.com
     - **Developer contact:** your-email@example.com
   - Add scopes: `email`, `profile`
   - Add test users (for testing)
   - Submit for verification (for production)

3. **Create OAuth Credentials:**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "De-Greenacres Web App"
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://degreenacres.com` (production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/auth/callback` (development)
     - `https://degreenacres.com/auth/callback` (production)
   - Copy the **Client ID** and **Client Secret**

4. **Add to Supabase:**
   - Go to Supabase Dashboard
   - Authentication → Providers → Google
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

#### **Step 2: Configure Facebook OAuth**

1. **Go to Facebook Developer Portal:**
   - Visit: https://developers.facebook.com/
   - Create a new app or use existing

2. **Configure App:**
   - App name: `De-Greenacres`
   - App type: "Business"
   - Add "Facebook Login" product

3. **Configure Facebook Login:**
   - Settings → Basic
   - Add platform: "Web"
   - Site URL: `https://degreenacres.com`
   - **Valid OAuth Redirect URIs:**
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`

4. **Get Credentials:**
   - Copy **App ID** and **App Secret**

5. **Add to Supabase:**
   - Authentication → Providers → Facebook
   - Enable Facebook provider
   - Paste App ID and App Secret
   - Save

#### **Step 3: Update Sign-In Page Code**

Replace the placeholder buttons with actual Supabase OAuth:

```typescript
// In signin/page.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    console.error('Error:', error.message)
  }
}

const handleFacebookSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    console.error('Error:', error.message)
  }
}
```

---

### **Option 2: NextAuth.js (Alternative)**

If you prefer NextAuth over Supabase:

```bash
npm install next-auth
```

Configure in `pages/api/auth/[...nextauth].ts`:

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
})
```

---

## 🎨 WHAT USERS WILL SEE

### **Google Sign-In Page:**

When a user clicks "Sign in with Google", they'll see:

```
┌─────────────────────────────────┐
│  Sign in to DEGREENSACRE        │  ← Your app name!
│                                 │
│  [Google Logo]                  │
│                                 │
│  Choose an account              │
│  to continue to DEGREENSACRE    │
│                                 │
│  • user@gmail.com               │
│  • Use another account          │
│                                 │
│  To continue, Google will share │
│  your name, email address, and  │
│  profile picture with           │
│  DEGREENSACRE.                  │
└─────────────────────────────────┘
```

**✅ YES, "DEGREENSACRE" will show!** (after you configure OAuth consent screen)

### **Facebook Sign-In Page:**

```
┌─────────────────────────────────┐
│  [Facebook Logo]                │
│                                 │
│  Log in to De-Greenacres        │
│  with your Facebook account     │
│                                 │
│  [Continue with Facebook]       │
│                                 │
│  This app can view your:        │
│  • Public profile               │
│  • Email address                │
└─────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### **Google OAuth:**
- [ ] Create Google Cloud project
- [ ] Configure OAuth consent screen
- [ ] Set app name to "DEGREENSACRE"
- [ ] Add authorized domains
- [ ] Create OAuth credentials
- [ ] Get Client ID and Secret
- [ ] Add to Supabase/NextAuth
- [ ] Test sign-in flow
- [ ] Submit for verification (production)

### **Facebook OAuth:**
- [ ] Create Facebook Developer app
- [ ] Configure app settings
- [ ] Add Facebook Login product
- [ ] Set OAuth redirect URIs
- [ ] Get App ID and Secret
- [ ] Add to Supabase/NextAuth
- [ ] Test sign-in flow
- [ ] Submit for review (production)

### **Code Integration:**
- [ ] Install Supabase or NextAuth
- [ ] Update signin page with OAuth handlers
- [ ] Update signup page with OAuth handlers
- [ ] Create auth callback handler
- [ ] Handle user session
- [ ] Store user data in database
- [ ] Test all flows

---

## 🔧 ENVIRONMENT VARIABLES NEEDED

Add to `.env.local`:

```env
# Supabase (if using Supabase Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (if using NextAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (if using NextAuth)
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# NextAuth (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

---

## 🎯 USER EXPERIENCE FLOW

### **When User Clicks "Sign in with Google":**

1. User clicks button
2. Redirected to Google OAuth page
3. Sees "Sign in to DEGREENSACRE"
4. Chooses Google account
5. Grants permissions
6. Redirected back to your app
7. User is logged in
8. Session created
9. Redirected to dashboard

### **Smooth Login Experience:**

- ✅ No password needed
- ✅ One-click sign-in
- ✅ Auto-fill user data
- ✅ Secure authentication
- ✅ Session persistence
- ✅ Logout available

---

## 🚀 QUICK START (Supabase Method)

### **1. Install Supabase:**
```bash
npm install @supabase/supabase-js
```

### **2. Create Supabase Client:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### **3. Update Sign-In Buttons:**
```typescript
// In signin/page.tsx
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  if (error) console.error(error)
}
```

### **4. Add to .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## ⚠️ IMPORTANT NOTES

### **Google OAuth Verification:**
- Google requires app verification for production use
- Takes 3-7 days for approval
- During testing, only added test users can sign in
- Submit early to avoid delays

### **Facebook App Review:**
- Facebook requires app review for public use
- Only basic profile and email are auto-approved
- Additional permissions need review
- Test with admin accounts first

### **Security:**
- Never commit OAuth secrets to GitHub
- Use environment variables
- Restrict OAuth to your domain
- Enable 2FA for admin accounts

---

## 📞 RECOMMENDATION

**Use Supabase Auth** because:
- ✅ Easier setup
- ✅ Built-in user management
- ✅ Database integration
- ✅ Session handling
- ✅ Multiple providers
- ✅ Free tier available

**Steps:**
1. Create Supabase project (5 min)
2. Configure Google OAuth (15 min)
3. Configure Facebook OAuth (15 min)
4. Update code (10 min)
5. Test (10 min)

**Total time:** ~1 hour to fully functional OAuth

---

## ✅ CONCLUSION

**Current Status:**
- UI is complete ✅
- Backend integration needed ⏳
- Will show "DEGREENSACRE" after OAuth setup ✅
- Will work smoothly after integration ✅

**Next Steps:**
1. Set up Supabase project
2. Configure Google OAuth (set app name to DEGREENSACRE)
3. Configure Facebook OAuth
4. Update sign-in page code
5. Test all flows

**Result:** Fully functional social authentication! 🎉

---

**Need help?** Check Supabase docs: https://supabase.com/docs/guides/auth/social-login
