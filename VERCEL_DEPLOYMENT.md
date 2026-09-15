# 🚀 Vercel Deployment Guide

**De-Greenacres Properties Limited**  
Last Updated: September 15, 2026

---

## 📋 Pre-Deployment Checklist

- [x] Code pushed to GitHub
- [x] Build passing successfully
- [x] Environment variables documented
- [x] Database schema ready
- [x] Admin account created
- [x] Sample data added
- [x] vercel.json configured
- [x] .vercelignore created
- [x] next.config.js optimized

---

## 🎯 Quick Deployment (5 Minutes)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Click **"Add New Project"**
5. Import your repository: **`leephil1907-lab/Degreensacre`**

### Step 2: Configure Project

**Framework Preset:** Next.js (auto-detected)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `.next` (auto-detected)  
**Install Command:** `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rvwirpfclysapqtnrlvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2lycGZjbHlzYXBxdG5ybHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODQ4OTIsImV4cCI6MjEwNTA2MDg5Mn0.ypy92Je_wrb8yC9WbNL0t1PP06UA6N1-8Kb0996lt10
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2lycGZjbHlzYXBxdG5ybHZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ4NDg5MiwiZXhwIjoyMTA1MDYwODkyfQ.0ns-Aqd8rnc7abAUxUVHWTDfIh4LQrjE_of0Bo9QokM

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://degreenacres.com

# Email (Optional - Get from resend.com)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=De-Greenacres <noreply@degreenacresproperties.com>

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=2348065019971
```

**Important:** Set environment variables for **Production**, **Preview**, and **Development** environments.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://degreensacre.vercel.app`

---

## 🌐 Custom Domain Setup

### Option A: Use degreenacres.com

1. Go to **Project Settings** → **Domains**
2. Add domain: `degreenacres.com`
3. Add domain: `www.degreenacres.com`
4. Update DNS records at your domain registrar:

**DNS Records:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Option B: Use degreenacresproperties.com

Same steps as above, but use `degreenacresproperties.com` instead.

---

## 🔧 Post-Deployment Configuration

### 1. Verify Supabase Connection

```bash
# Test API endpoint
curl https://degreensacre.vercel.app/api/properties
```

Expected: JSON response with properties

### 2. Test Admin Login

1. Go to `https://degreensacre.vercel.app/auth/login`
2. Login with:
   - Email: `degreenacrespropertieslimited@gmail.com`
   - Password: `Noble1994@`
3. You should be redirected to `/admin/dashboard`

### 3. Test Property Submission

1. Go to `https://degreensacre.vercel.app/submit-property`
2. Complete the 5-step wizard
3. Upload images
4. Submit property

### 4. Test Messaging

1. Login as admin
2. Go to `/messages`
3. Verify real-time updates work

---

## 📊 Vercel Configuration Details

### Regions (vercel.json)

```json
"regions": ["fra1", "lhr1", "cdg1"]
```

- **fra1** - Frankfurt (closest to Nigeria)
- **lhr1** - London (backup)
- **cdg1** - Paris (backup)

### Security Headers

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### CORS Headers (API Routes)

- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET,OPTIONS,PATCH,DELETE,POST,PUT
- Access-Control-Allow-Headers: Authorization, Content-Type

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Main branch** → Production deployment
- **Other branches** → Preview deployments
- **Pull requests** → Preview deployments with comments

### Workflow

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys in ~2 minutes
```

---

## 📈 Monitoring & Analytics

### Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. View:
   - **Analytics** - Page views, visitors, performance
   - **Logs** - Real-time server logs
   - **Deployments** - Deployment history
   - **Speed Insights** - Core Web Vitals

### Key Metrics to Monitor

- **Response Time** - Should be <500ms
- **Error Rate** - Should be <1%
- **Bandwidth** - Monitor usage
- **Function Invocations** - API route calls

---

## 💰 Cost Breakdown

### Vercel Pro Plan ($20/month)

- ✅ Unlimited deployments
- ✅ 1TB bandwidth
- ✅ Edge functions
- ✅ Analytics
- ✅ Preview deployments
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Team collaboration

### Supabase Free Tier ($0/month)

- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ Unlimited API requests

### Total Monthly Cost

```
Vercel Pro:        $20/month
Supabase Free:     $0/month
Domain:            $10-15/year
Email (Resend):    $0/month (free tier)
────────────────────────────────
TOTAL:             $20/month (~₦32,000/month)
```

---

## 🛠️ Troubleshooting

### Build Fails

**Problem:** Build fails with errors  
**Solution:**
1. Check Vercel deployment logs
2. Run `npm run build` locally
3. Fix errors and push again

### Environment Variables Not Working

**Problem:** API returns errors  
**Solution:**
1. Verify environment variables are set in Vercel
2. Redeploy after adding variables
3. Check variable names match exactly

### Images Not Loading

**Problem:** Property images don't display  
**Solution:**
1. Check Supabase Storage bucket is public
2. Verify image URLs are correct
3. Check next.config.js remotePatterns

### API Routes Return 404

**Problem:** API endpoints not found  
**Solution:**
1. Check vercel.json configuration
2. Verify routes exist in src/app/api/
3. Redeploy the project

---

## 📞 Support Resources

### Vercel Support
- **Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Community:** [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- **Support:** [vercel.com/help](https://vercel.com/help)

### Supabase Support
- **Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Community:** [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

### Next.js Support
- **Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Community:** [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

---

## ✅ Deployment Checklist

### Pre-Deployment
- [x] Code pushed to GitHub
- [x] Build passing locally
- [x] Environment variables documented
- [x] Database ready
- [x] Admin account created

### During Deployment
- [ ] Connected to Vercel
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site accessible

### Post-Deployment
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] API endpoints working
- [ ] Admin login working
- [ ] Property submission working
- [ ] Messaging working
- [ ] Analytics enabled
- [ ] Monitoring configured

---

## 🎉 You're Live!

Once deployment is complete, your De-Greenacres Properties platform is live at:

**Production URL:** `https://degreensacre.vercel.app`  
**Custom Domain:** `https://degreenacres.com` (after DNS setup)

### What's Next?

1. **Share your site** with friends and family
2. **Add more properties** using the submission wizard
3. **Monitor analytics** in Vercel dashboard
4. **Collect feedback** from users
5. **Plan next features** based on user needs

---

## 📞 Need Help?

**Admin Login:**
- Email: `degreenacrespropertieslimited@gmail.com`
- Password: `Noble1994@`

**Support:**
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)

---

**De-Greenacres Properties Limited**  
RC: 1856064 | CAC Registered  
Deployment Guide Version: 1.0  
Last Updated: September 15, 2026

**Status:** ✅ Ready for Deployment
