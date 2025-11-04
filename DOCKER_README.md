# Docker Deployment Setup

This project includes Docker configuration for easy deployment to web servers like Render, Railway, or any Docker-compatible platform.

## Files Created

### 1. `Dockerfile`
Multi-stage Docker build that:
- Builds the React frontend (Stage 1)
- Sets up Python backend with Flask (Stage 2)
- Serves the built frontend from Flask
- Uses Gunicorn for production-ready WSGI server

### 2. `.dockerignore`
Excludes unnecessary files from Docker build:
- node_modules
- Python cache files
- Environment files
- Development artifacts

### 3. `render.yaml`
Render-specific configuration for one-click deployment

### 4. `DEPLOYMENT.md`
Complete deployment guide with step-by-step instructions

## Quick Start

### Local Testing

```bash
# Build the Docker image
docker build -t ai-placement-predictor .

# Run the container
docker run -p 8080:8080 \
  -e VITE_GEMINI_API_KEY=your_api_key_here \
  ai-placement-predictor

# Access at http://localhost:8080
```

### Deploy to Render

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Add Docker deployment"
   git push origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com)

3. Create New Web Service → Connect GitHub repository

4. Configure:
   - Runtime: **Docker**
   - Instance Type: **Free**
   - Add Environment Variable: `VITE_GEMINI_API_KEY`

5. Click "Create Web Service" and wait for deployment

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Container            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   React Frontend (Built)    │   │
│  │   → /static/*               │   │
│  └─────────────────────────────┘   │
│               ↓                     │
│  ┌─────────────────────────────┐   │
│  │   Flask Backend (Gunicorn)  │   │
│  │   → /predict                │   │
│  │   → /re-predict             │   │
│  │   → /health                 │   │
│  │   → /* (serves React)       │   │
│  └─────────────────────────────┘   │
│                                     │
│         Port 8080                   │
└─────────────────────────────────────┘
```

## Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API Key | Yes |
| `PORT` | Server port (default: 8080) | No |
| `FLASK_ENV` | Flask environment (production) | No |

## Production Features

✅ **Optimized Build**: Multi-stage build reduces image size
✅ **Production Server**: Gunicorn with multiple workers
✅ **Health Checks**: `/health` endpoint for monitoring
✅ **Static Serving**: Efficient React app serving
✅ **CORS Enabled**: Handles cross-origin requests
✅ **Auto Restart**: Health checks trigger restarts if needed

## Troubleshooting

### Build fails
- Verify `package.json` and `requirements.txt` are complete
- Check Docker daemon is running
- Review build logs for specific errors

### App won't start
- Verify `VITE_GEMINI_API_KEY` is set
- Check port 8080 is available
- Review application logs

### Frontend doesn't load
- Ensure `npm run build` completes successfully
- Verify `frontend/dist` directory is created
- Check Flask static folder configuration

## Additional Deployment Options

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create ai-placement-predictor
git push heroku main
```

### DigitalOcean App Platform
- Connect GitHub repository
- Select "Dockerfile" as build source
- Configure environment variables
- Deploy

## Support

For deployment issues:
- Check `DEPLOYMENT.md` for detailed guide
- Review platform-specific documentation
- Check application logs for errors
