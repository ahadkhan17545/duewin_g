#!/bin/bash

# Frontend Deployment Script for AWS Ubuntu Server
# Run this script from your home directory on the AWS server

# Configuration
PROJECT_NAME="duewin_g"
FRONTEND_DIR="/home/ubuntu/$PROJECT_NAME"
BUILD_DIR="$FRONTEND_DIR/build"
NGINX_SITE_DIR="/var/www/html"
NGINX_SITE_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_SITE_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"
BACKUP_DIR="/home/ubuntu/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create backup
create_backup() {
    if [ -d "$NGINX_SITE_DIR" ]; then
        print_status "Creating backup of current deployment..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$NGINX_SITE_DIR" "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)_frontend_backup"
        print_status "Backup created successfully"
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command_exists nginx; then
        print_error "Nginx is not installed. Please install Nginx first."
        exit 1
    fi
    
    print_status "All prerequisites are satisfied"
}

# Function to pull latest changes
pull_latest_changes() {
    print_status "Pulling latest changes from git..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found at $FRONTEND_DIR"
        print_status "Please clone your repository first or update the FRONTEND_DIR path"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Stash any local changes
    git stash
    
    # Pull latest changes
    git pull origin main
    
    if [ $? -ne 0 ]; then
        print_error "Failed to pull latest changes"
        exit 1
    fi
    
    print_status "Latest changes pulled successfully"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    cd "$FRONTEND_DIR"
    
    # Remove node_modules and package-lock.json for clean install
    rm -rf node_modules package-lock.json
    
    # Install dependencies
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    print_status "Dependencies installed successfully"
}

# Function to build the project
build_project() {
    print_status "Building the project..."
    
    cd "$FRONTEND_DIR"
    
    # Create production build
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Build failed"
        exit 1
    fi
    
    print_status "Build completed successfully"
}

# Function to deploy to nginx
deploy_to_nginx() {
    print_status "Deploying to Nginx..."
    
    # Create backup
    create_backup
    
    # Remove existing deployment
    if [ -d "$NGINX_SITE_DIR" ]; then
        sudo rm -rf "$NGINX_SITE_DIR"/*
    fi
    
    # Copy build files to nginx directory
    sudo cp -r "$BUILD_DIR"/* "$NGINX_SITE_DIR/"
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$NGINX_SITE_DIR"
    sudo chmod -R 755 "$NGINX_SITE_DIR"
    
    print_status "Files deployed to Nginx successfully"
}

# Function to configure nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    # Create nginx configuration
    sudo tee "$NGINX_SITE_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your actual domain
    
    root $NGINX_SITE_DIR;
    index index.html index.htm;
    
    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Content Security Policy - More restrictive for better security
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" always;
    
    # Permissions Policy - Control browser features and APIs
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=(), clipboard-read=(), clipboard-write=(), web-share=(), xr-spatial-tracking=()" always;
}
EOF
    
    # Enable the site
    sudo ln -sf "$NGINX_SITE_CONFIG" "$NGINX_SITE_ENABLED"
    
    # Test nginx configuration
    sudo nginx -t
    
    if [ $? -ne 0 ]; then
        print_error "Nginx configuration test failed"
        exit 1
    fi
    
    # Reload nginx
    sudo systemctl reload nginx
    
    print_status "Nginx configured and reloaded successfully"
}

# Function to setup SSL (optional)
setup_ssl() {
    print_warning "SSL setup is optional. Do you want to set up SSL with Let's Encrypt? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Setting up SSL with Let's Encrypt..."
        
        if ! command_exists certbot; then
            print_status "Installing certbot..."
            sudo apt update
            sudo apt install -y certbot python3-certbot-nginx
        fi
        
        print_warning "Please enter your domain name (e.g., example.com):"
        read -r domain_name
        
        if [ -n "$domain_name" ]; then
            sudo certbot --nginx -d "$domain_name"
            print_status "SSL certificate installed successfully"
        else
            print_warning "No domain provided, skipping SSL setup"
        fi
    fi
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Remove old backups (keep only last 5)
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
    fi
    
    print_status "Cleanup completed"
}

# Function to show deployment status
show_status() {
    print_status "Deployment completed successfully!"
    print_status "Your React app should now be accessible at:"
    print_status "http://your-server-ip"
    print_status "or"
    print_status "http://your-domain.com (if configured)"
    
    # Check if nginx is running
    if sudo systemctl is-active --quiet nginx; then
        print_status "Nginx is running"
    else
        print_warning "Nginx is not running. Starting nginx..."
        sudo systemctl start nginx
    fi
}

# Main deployment function
main() {
    print_status "Starting frontend deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Pull latest changes
    pull_latest_changes
    
    # Install dependencies
    install_dependencies
    
    # Build project
    build_project
    
    # Deploy to nginx
    deploy_to_nginx
    
    # Configure nginx
    configure_nginx
    
    # Optional SSL setup
    setup_ssl
    
    # Cleanup
    cleanup
    
    # Show status
    show_status
}

# Check if script is run with sudo
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Run it as a regular user."
    exit 1
fi

# Run main function
main "$@" 