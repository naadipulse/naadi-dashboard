# நாடி Election Dashboard - Setup Guide

## Total time: ~45 minutes

---

## STEP 1: Supabase Setup (15 mins)

1. Go to supabase.com
2. Create account + New Project
3. Name: "naadi-election-2026"
4. Save your password!
5. Go to SQL Editor
6. Run the SQL from setup.sql file
7. Go to Settings → API
8. Copy: Project URL + anon public key

---

## STEP 2: GitHub Setup (10 mins)

1. Go to github.com
2. Create new repository: "naadi-dashboard"
3. Upload all files from this folder
4. OR use GitHub Desktop app

---

## STEP 3: Vercel Deploy (10 mins)

1. Go to vercel.com
2. Import your GitHub repo
3. Add Environment Variables:
   - REACT_APP_SUPABASE_URL = your supabase URL
   - REACT_APP_SUPABASE_ANON_KEY = your anon key
   - REACT_APP_ADMIN_PASSWORD = naadi2026 (change this!)
   - REACT_APP_ANTHROPIC_KEY = your Claude API key
4. Deploy!

---

## STEP 4: May 4 Usage

### Dashboard URL (show on stream):
https://your-app.vercel.app

### Admin URL (your phone):
https://your-app.vercel.app/admin

---

## How to Update on May 4:

### Option A - LLM Mode:
1. Open ECI website on one tab
2. Copy results text
3. Paste in Admin → LLM Mode
4. Click "Parse & Update"
5. Dashboard auto-updates! 🎉

### Option B - Manual Mode:
1. Open Admin → Manual Mode
2. Enter Won + Leading for each party
3. Click Save
4. Dashboard auto-updates!

---

## YouTube Live Setup:

### Phone:
- Open dashboard URL
- Screen record + YouTube Live

### Laptop (Professional):
1. Download OBS Studio (free)
2. Add "Window Capture" → Browser
3. Open dashboard full screen
4. Start YouTube Live stream!

---

## Dashboard URLs:
- Display: yourdomain.vercel.app
- Admin: yourdomain.vercel.app/admin

## Support: @naadipulse
