# Deployment Guide - AI Interview Copilot

## 🚀 Free Deployment Options

### Option 1: Vercel (Recommended - Made by Next.js creators)

**Why Vercel?**
- ✅ Free tier with generous limits
- ✅ Zero-config deployment for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables support
- ✅ Automatic deployments from Git

#### Step-by-Step Deployment:

1. **Prepare your code:**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub:**
   - Create a new repository on GitHub (if you haven't already)
   - Push your code:
     ```bash
     git remote add origin https://github.com/yourusername/interview-copilot.git
     git push -u origin main
     ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `NEXT_PUBLIC_OPENAI_API_KEY` = `your-openai-api-key`
   - Click "Save"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `your-project.vercel.app`

6. **Custom Domain (Optional):**
   - In project settings → Domains
   - Add your custom domain (free)

---

### Option 2: Netlify

**Steps:**

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Environment Variables:**
   - Site settings → Environment variables
   - Add: `NEXT_PUBLIC_OPENAI_API_KEY`

5. **Deploy:**
   - Click "Deploy site"
   - Your app will be live at `your-project.netlify.app`

---

### Option 3: Railway

**Steps:**

1. **Push to GitHub**

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Environment Variables:**
   - Variables tab → Add `NEXT_PUBLIC_OPENAI_API_KEY`

4. **Deploy:**
   - Railway auto-detects Next.js and deploys
   - Get your live URL from the project dashboard

---

### Option 4: Render

**Steps:**

1. **Push to GitHub**

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your repository

3. **Settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Environment Variables:**
   - Add: `NEXT_PUBLIC_OPENAI_API_KEY`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Your app will be live at `your-project.onrender.com`

---

## 🔐 Important: Environment Variables

**Before deploying, make sure to set:**
- `NEXT_PUBLIC_OPENAI_API_KEY` - Your OpenAI API key

**How to get OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys section
4. Create a new secret key
5. Copy and paste it in your deployment platform's environment variables

---

## 📝 Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] `.env.local` file is NOT committed (should be in `.gitignore`)
- [ ] OpenAI API key ready
- [ ] Tested locally with `npm run build`

---

## 🎯 Recommended: Vercel

**Vercel is the best choice because:**
- Made by Next.js creators
- Zero configuration needed
- Fastest deployment
- Best performance
- Free tier includes:
  - Unlimited personal projects
  - 100GB bandwidth/month
  - Automatic SSL
  - Preview deployments for every commit

---

## 🚨 Troubleshooting

**Build fails?**
- Check that all dependencies are in `package.json`
- Ensure `NEXT_PUBLIC_OPENAI_API_KEY` is set
- Check build logs in deployment platform

**API not working?**
- Verify environment variable is set correctly
- Check API key is valid
- Review server logs

**PDF parsing not working?**
- `pdf-parse` requires Node.js environment
- Make sure deployment platform supports Node.js
- Check server logs for errors

---

## 📱 Mobile Access

Once deployed, your app will be accessible on:
- Desktop browsers
- Mobile browsers (Android/iOS)
- Any device with internet connection

The responsive design will work perfectly on all devices!

