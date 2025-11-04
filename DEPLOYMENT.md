# Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Your code pushed to GitHub

## Quick Deploy Steps

### Option 1: Using Render Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Docker deployment configuration"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `ai-placement-predictor`

3. **Configure the Service**
   - **Name**: `ai-placement-predictor` (or your choice)
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Instance Type**: Free

4. **Set Environment Variables**
   In the "Environment" section, add:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
   - `PORT`: 8080 (usually auto-set by Render)
   - `FLASK_ENV`: production

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy using the Dockerfile
   - Wait for the build to complete (5-10 minutes for first deployment)

### Option 2: Using render.yaml (Blueprint)

1. **Push code to GitHub** (same as above)

2. **Create New Blueprint**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Set Environment Variables**
   - In the Render Dashboard, go to your service
   - Navigate to "Environment" tab
   - Add `VITE_GEMINI_API_KEY` with your API key

## Local Testing with Docker

Before deploying, you can test the Docker build locally:

```bash
# Build the Docker image
docker build -t ai-placement-predictor .

# Run the container
docker run -p 8080:8080 \
  -e VITE_GEMINI_API_KEY=your_api_key_here \
  ai-placement-predictor

# Access the app
# Open browser to: http://localhost:8080
```

## Deployment Features

✅ **Multi-stage Build**: Optimized for smaller image size
✅ **Frontend & Backend Combined**: Single deployment
✅ **Health Checks**: Automatic monitoring
✅ **Production Ready**: Uses Gunicorn WSGI server
✅ **Auto-scaling**: Render handles scaling automatically

## Post-Deployment

1. **Access your app**
   - Render will provide a URL like: `https://ai-placement-predictor.onrender.com`

2. **Monitor Logs**
   - View real-time logs in Render Dashboard
   - Check "Logs" tab in your service

3. **Custom Domain (Optional)**
   - Go to service "Settings"
   - Add custom domain under "Custom Domains"

## Troubleshooting

### Build Fails
- Check logs in Render Dashboard
- Verify Dockerfile syntax
- Ensure all dependencies are in package.json and requirements.txt

### App Doesn't Load
- Check environment variables are set correctly
- Verify health check endpoint: `/health`
- Review logs for errors

### API Calls Fail
- Verify `VITE_GEMINI_API_KEY` is set in environment variables
- Check API key is valid
- Review browser console for errors

## Updating Your App

After making changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy!

## Cost

- **Free Tier**: Includes 750 hours/month
- **Limitations**: 
  - Spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - 512 MB RAM

For production with no spin-down, upgrade to paid plan ($7/month).

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Create issue in your repository
