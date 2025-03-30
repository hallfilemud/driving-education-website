# Driving Education Website

A comprehensive driving education platform designed to help users prepare for their driver's license tests with interactive practice tests, state-specific resources, and helpful driving tips.

## Features

- Interactive USA state map with hover effects and tooltips
- State-specific driving resources and practice tests
- Full practice tests with 10+ questions and comprehensive scoring
- Driving tips and educational resources
- Responsive design for all devices

## Deployment on Render.com

### Prerequisites

- A [Render.com](https://render.com) account (free tier is fine for starting out)
- Your project code uploaded to a GitHub repository

### Deployment Steps

1. **Create a GitHub Repository**
   - Upload all project files to a GitHub repository

2. **Log in to Render.com**
   - Create an account or log in to your existing account

3. **Create a New Web Service**
   - From your Render dashboard, click "New" and select "Web Service"
   - Connect your GitHub repository

4. **Configure Your Web Service**
   - **Name**: Choose a name for your service (e.g., "driving-education-website")
   - **Environment**: Select "Node"
   - **Region**: Choose the region closest to your users
   - **Branch**: main (or your default branch)

5. **Set the Build and Start Commands - IMPORTANT**
   - **Build Command**: `chmod +x ./deploy.sh && ./deploy.sh`
   - **Start Command**: `node dist/index.js`
   - This separation is crucial - the deploy.sh script builds the app, and the start command runs it

6. **Configure Environment Variables**
   - Add `PORT`: `10000` (or any port Render supports)
   - Add `NODE_ENV`: `production`

7. **Create the Web Service**
   - Click "Create Web Service"

8. **Wait for Deployment**
   - Render will build and deploy your application
   - You can view the build logs in real-time

9. **Access Your Website**
   - Once deployment is complete, your site will be available at: `https://your-service-name.onrender.com`

### Troubleshooting

If you encounter any issues during deployment:

1. **Check the Build Logs**
   - Most errors will appear in the Render build logs

2. **Common Issues**
   - **Port configuration**: Make sure your application listens on the port specified by the `PORT` environment variable
   - **Build failures**: Ensure all dependencies are correctly specified in package.json
   - **Runtime errors**: Check the logs after deployment for any runtime errors

3. **Render Free Tier Limitations**
   - Services on the free tier will "sleep" after 15 minutes of inactivity
   - They may take 30-60 seconds to "wake up" when accessed
   - You have 750 free hours per month of usage

## Local Development

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Visit `http://localhost:5000` in your browser

## License

MIT