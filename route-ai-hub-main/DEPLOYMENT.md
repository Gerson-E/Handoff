# Deployment Guide

This guide covers deploying the Handoff Smart Router application to production.

## Architecture

- **Frontend**: Next.js 14 (App Router)
- **Backend**: FastAPI (Python)
- **Database**: SQLite (can be upgraded to PostgreSQL)

## Recommended Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - EASIEST

#### Frontend Deployment to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `route-ai-hub-main` (if applicable)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

4. **Set Environment Variables** in Vercel:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend-url.railway.app
   ```

#### Backend Deployment to Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Choose "route-ai-hub-main/backend" as the root directory

3. **Set Environment Variables** in Railway:
   ```
   API_KEY=your-secure-api-key-here
   DATABASE_URL=sqlite+aiosqlite:///./data.db
   FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
   AI_CLASSIFY=TRUE
   AI_EXPLAIN=TRUE
   LLM_PROVIDER=anthropic
   LLM_MODEL=claude-3-5-haiku
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

4. **Configure deployment**:
   - Railway should auto-detect the Python app
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 2: All-in-One on Railway

Deploy both frontend and backend on Railway:

1. **Backend Service** (same as above)

2. **Frontend Service**:
   - Create a new service in the same Railway project
   - Link to your GitHub repo
   - Set root directory to `route-ai-hub-main`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_BASE=https://your-backend-service.railway.app
     ```
   - Start Command: `npm run start`

### Option 3: Other Platform Options

#### Render.com
- Similar to Railway but with a free tier
- Easy PostgreSQL database setup
- Good for both frontend and backend

#### Heroku
- Classic platform, requires credit card even for free tier
- Good PostgreSQL support
- Uses Procfile (already created)

#### AWS/Google Cloud/Azure
- More complex but more control
- Recommended for production at scale
- Requires more DevOps knowledge

## Environment Variables Reference

### Frontend (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_BASE=http://localhost:8000  # Development
# NEXT_PUBLIC_API_BASE=https://your-backend.railway.app  # Production
```

### Backend (backend/.env)

```env
# Security
API_KEY=your-secure-api-key-here  # REQUIRED - Change this!

# Database
DATABASE_URL=sqlite+aiosqlite:///./data.db  # SQLite for development
# DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname  # PostgreSQL for production

# CORS - Frontend URL
FRONTEND_ORIGIN=http://localhost:3000  # Development
# FRONTEND_ORIGIN=https://your-app.vercel.app  # Production

# AI Configuration
AI_CLASSIFY=TRUE
AI_EXPLAIN=TRUE
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-5-haiku
ANTHROPIC_API_KEY=your-anthropic-api-key-here  # REQUIRED
```

## Pre-Deployment Checklist

- [ ] Update `API_KEY` to a strong random value
- [ ] Verify `ANTHROPIC_API_KEY` is set correctly
- [ ] Update `FRONTEND_ORIGIN` to match your deployed frontend URL
- [ ] Update `NEXT_PUBLIC_API_BASE` to match your deployed backend URL
- [ ] Test the build locally: `npm run build`
- [ ] Ensure `.env` files are in `.gitignore` (already configured)
- [ ] Push all changes to GitHub

## Post-Deployment

1. **Test the deployed application**:
   - Visit your frontend URL
   - Try submitting a request
   - Check the dashboard
   - Monitor the logs

2. **Monitor your application**:
   - Check Railway/Vercel logs for errors
   - Monitor API usage
   - Watch for rate limits on Anthropic API

3. **Set up a custom domain** (optional):
   - Vercel: Project Settings → Domains
   - Railway: Service Settings → Networking

## Database Upgrade (Production)

For production, consider upgrading from SQLite to PostgreSQL:

1. **On Railway**:
   - Add a PostgreSQL plugin to your project
   - Copy the connection string
   - Update `DATABASE_URL` in your backend environment variables

2. **Run migrations** (if needed):
   ```bash
   # SSH into your Railway backend or use Railway CLI
   python -m alembic upgrade head
   ```

## Security Best Practices

1. **Never commit `.env` files** - Already configured in `.gitignore`
2. **Use strong API keys** - Generate random strings
3. **Enable HTTPS** - Handled automatically by Vercel/Railway
4. **Rate limiting** - Consider adding to protect your API
5. **Monitor API costs** - Anthropic API usage can add up

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_ORIGIN` in backend matches your frontend URL exactly
- Check for trailing slashes
- Restart the backend service after changing environment variables

### API Connection Failures
- Verify `NEXT_PUBLIC_API_BASE` is correct
- Check backend logs for errors
- Ensure backend is running and healthy

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

## Cost Estimate

**Free Tier (suitable for demos/testing)**:
- Vercel: Free for personal projects
- Railway: $5/month credit (free for small projects)
- Anthropic API: Pay per use (~$0.001 per request with Haiku)

**Total estimated cost**: $0-10/month for light usage

## Support

If you encounter issues:
1. Check the logs in Vercel/Railway dashboard
2. Review this guide and environment variables
3. Test locally first to isolate the issue
