# Vercel API Proxy Issue - Diagnosis & Fix

## 🔍 **What's the Issue?**

Your frontend is correctly configured to use `/api` in production, but Vercel is returning **404 errors** because the serverless functions in the `api/` folder aren't being recognized or deployed.

## 📋 **Root Cause**

The serverless functions (`api/*.ts`) exist but Vercel isn't recognizing them. This could be because:
1. Vercel might not be detecting TypeScript serverless functions in a Vite project
2. The functions need to be explicitly configured
3. There might be a build/deployment issue

## ✅ **Solution Options**

### **Option 1: Fix Backend CORS (RECOMMENDED - Simplest)**

**What to do:**
1. Update your backend at `https://api-surveys.banza.xyz` to allow CORS from `https://mas-fe.vercel.app`
2. Update the frontend to call the backend directly (no proxy needed)

**Backend changes needed:**
```python
# Example for FastAPI/Python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mas-fe.vercel.app",
        "http://localhost:5173",  # for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Frontend changes:**
- Set `VITE_API_BASE=https://api-surveys.banza.xyz` in Vercel environment variables
- The frontend will use this directly (no `/api` proxy needed)

### **Option 2: Keep Serverless Functions (Current Approach)**

If you want to keep the proxy approach, ensure Vercel recognizes the functions:

1. **Check Vercel Deployment Logs:**
   - Go to your Vercel project → Deployments → Latest deployment
   - Check the "Functions" tab
   - Verify if `api/ping.ts`, `api/agents.ts`, etc. are listed

2. **If functions aren't listed:**
   - The `api/` folder might need to be at the project root (it is)
   - Try renaming files to `.js` instead of `.ts` (Vercel should handle TS, but worth testing)
   - Check if there are any build errors

3. **Test the functions:**
   - After deployment, visit: `https://mas-fe.vercel.app/api/test`
   - Should return JSON if working

## 🛠 **What Needs to be Fixed in Frontend**

**Actually, your frontend code is CORRECT!** The issue is with the Vercel deployment, not your code.

Your frontend:
- ✅ Correctly uses `getApiBase()` which returns `/api` in production
- ✅ Makes requests to `/api/ping`, `/api/agents`, etc.
- ✅ Has proper error handling

**No frontend code changes needed** - the issue is purely deployment/configuration.

## 📝 **Action Items**

1. **Check Vercel Function Logs:**
   ```
   Vercel Dashboard → Your Project → Deployments → Latest → Functions Tab
   ```
   - Do you see `api/ping.ts`, `api/agents.ts`, `api/[...path].ts` listed?
   - If NO → Functions aren't being deployed
   - If YES → Check for runtime errors

2. **Test the endpoints:**
   - Visit: `https://mas-fe.vercel.app/api/test`
   - Visit: `https://mas-fe.vercel.app/api/ping`
   - Do they return JSON or 404?

3. **Choose a solution:**
   - **Option A:** Fix backend CORS (easiest, recommended)
   - **Option B:** Debug why Vercel functions aren't working

## 🎯 **Recommended Next Steps**

1. **First, test if functions are deployed:**
   - Visit `https://mas-fe.vercel.app/api/test` in your browser
   - If it works → functions are deployed, check for other issues
   - If 404 → functions aren't being recognized

2. **If functions aren't working, use Option 1 (Fix Backend CORS):**
   - This is simpler and more reliable
   - Update backend to allow `https://mas-fe.vercel.app`
   - Set `VITE_API_BASE` in Vercel to point directly to backend
   - Remove the `/api` proxy approach

3. **If you must use proxy:**
   - Check Vercel documentation for Vite + serverless functions
   - Consider using Vercel's rewrites feature instead
   - Or convert TypeScript functions to JavaScript

## 🔗 **Quick Test Commands**

After deployment, test these URLs:
- `https://mas-fe.vercel.app/api/test` → Should return JSON
- `https://mas-fe.vercel.app/api/ping` → Should proxy to backend
- `https://mas-fe.vercel.app/api/agents` → Should proxy to backend

If all return 404, the functions aren't being deployed.
