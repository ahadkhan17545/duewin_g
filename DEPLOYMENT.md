# React Frontend Deployment Guide for AWS Ubuntu Server

This guide will help you deploy your React frontend to an AWS Ubuntu server.

## Prerequisites

- AWS Ubuntu server (18.04 or later)
- SSH access to your server
- Git repository with your React project
- Domain name (optional, for SSL)

## Step 1: Upload Scripts to Your Server

First, upload the deployment scripts to your AWS server:

```bash
# From your local machine, upload the scripts to your server
scp deploy-frontend.sh setup-aws-server.sh ubuntu@your-server-ip:~/
```

## Step 2: Initial Server Setup (First Time Only)

SSH into your AWS server and run the setup script:

```bash
ssh ubuntu@your-server-ip

# Make the setup script executable
chmod +x setup-aws-server.sh

# Run the setup script
./setup-aws-server.sh
```

This script will:
- Update your system
- Install Node.js, npm, Nginx, and Git
- Configure Nginx for React applications
- Set up your project directory
- Create the deployment script in your home directory

## Step 3: Deploy Your Application

After the initial setup, you can deploy your application:

```bash
# Run the deployment script from your home directory
~/deploy-frontend.sh
```

This script will:
- Pull the latest changes from your Git repository
- Install dependencies
- Build the production version
- Deploy to Nginx
- Configure SSL (optional)

## Step 4: Configure Your Domain (Optional)

If you have a domain name:

1. Point your domain's A record to your AWS server's IP address
2. Update the nginx configuration with your domain name
3. Set up SSL certificate using Let's Encrypt

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Clone Your Repository
```bash
cd /home/ubuntu
git clone your-repository-url duewin_g
cd duewin_g
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Project
```bash
npm run build
```

### 4. Deploy to Nginx
```bash
# Copy build files to nginx directory
sudo cp -r build/* /var/www/html/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Reload nginx
sudo systemctl reload nginx
```

## Configuration Files

### Nginx Configuration
The deployment script creates a nginx configuration at `/etc/nginx/sites-available/duewin_g` with:
- React Router support
- Static asset caching
- Security headers
- SSL support

### Environment Variables
If your React app needs environment variables, create a `.env` file in your project root:

```bash
# Example .env file
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_SOCKET_URL=wss://your-websocket-server.com
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check if all dependencies are installed
2. **Nginx not serving files**: Check file permissions and nginx configuration
3. **SSL certificate issues**: Make sure your domain is properly configured
4. **React Router not working**: Ensure nginx configuration has the try_files directive

### Useful Commands

```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx configuration
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if your app is accessible
curl -I http://your-server-ip

# Restart nginx
sudo systemctl restart nginx
```

## Updating Your Application

To update your application with new changes:

1. Push your changes to your Git repository
2. Run the deployment script: `~/deploy-frontend.sh`

The script will automatically:
- Pull the latest changes
- Install any new dependencies
- Build the updated version
- Deploy to nginx

## Security Considerations

1. **Firewall**: Ensure only necessary ports are open
2. **SSL**: Always use HTTPS in production
3. **Updates**: Keep your system and dependencies updated
4. **Backups**: The deployment script creates automatic backups

## Performance Optimization

1. **Gzip Compression**: Already configured in nginx
2. **Caching**: Static assets are cached for 1 year
3. **CDN**: Consider using a CDN for static assets
4. **Monitoring**: Set up monitoring for your application

## Support

If you encounter issues:
1. Check the nginx error logs
2. Verify your nginx configuration
3. Ensure all prerequisites are installed
4. Check file permissions

## Script Customization

You can customize the deployment scripts by editing:
- `deploy-frontend.sh`: Main deployment logic
- `setup-aws-server.sh`: Initial server setup

Key variables you might want to change:
- `PROJECT_NAME`: Your project name
- `FRONTEND_DIR`: Path to your project
- `NGINX_SITE_DIR`: Nginx web root directory 