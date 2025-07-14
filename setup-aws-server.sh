#!/bin/bash

# AWS Ubuntu Server Setup Script for React Frontend Deployment
# Run this script once to set up your server for deployment

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

# Function to update system
update_system() {
    print_status "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    print_status "System updated successfully"
}

# Function to install Node.js and npm
install_nodejs() {
    print_status "Installing Node.js and npm..."
    
    if command_exists node; then
        print_warning "Node.js is already installed"
        node --version
        return
    fi
    
    # Install Node.js 18.x (LTS)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    if [ $? -eq 0 ]; then
        print_status "Node.js installed successfully"
        node --version
        npm --version
    else
        print_error "Failed to install Node.js"
        exit 1
    fi
}

# Function to install Nginx
install_nginx() {
    print_status "Installing Nginx..."
    
    if command_exists nginx; then
        print_warning "Nginx is already installed"
        nginx -v
        return
    fi
    
    sudo apt install -y nginx
    
    if [ $? -eq 0 ]; then
        print_status "Nginx installed successfully"
        
        # Start and enable nginx
        sudo systemctl start nginx
        sudo systemctl enable nginx
        
        # Configure firewall
        sudo ufw allow 'Nginx Full'
        print_status "Nginx configured and firewall updated"
    else
        print_error "Failed to install Nginx"
        exit 1
    fi
}

# Function to install Git
install_git() {
    print_status "Installing Git..."
    
    if command_exists git; then
        print_warning "Git is already installed"
        git --version
        return
    fi
    
    sudo apt install -y git
    
    if [ $? -eq 0 ]; then
        print_status "Git installed successfully"
        git --version
    else
        print_error "Failed to install Git"
        exit 1
    fi
}

# Function to configure Nginx for React
configure_nginx_react() {
    print_status "Configuring Nginx for React application..."
    
    # Create nginx configuration for React
    sudo tee /etc/nginx/sites-available/react-app > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    root /var/www/html;
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
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF
    
    # Remove default nginx site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Enable our site
    sudo ln -sf /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        print_status "Nginx configured successfully for React"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Function to setup project directory
setup_project_directory() {
    print_status "Setting up project directory..."
    
    PROJECT_DIR="/home/ubuntu/duewin_g"
    
    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Project directory already exists at $PROJECT_DIR"
        print_warning "Do you want to remove it and clone fresh? (y/n)"
        read -r response
        
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            rm -rf "$PROJECT_DIR"
        else
            print_status "Keeping existing project directory"
            return
        fi
    fi
    
    print_warning "Please enter your Git repository URL:"
    read -r repo_url
    
    if [ -n "$repo_url" ]; then
        git clone "$repo_url" "$PROJECT_DIR"
        
        if [ $? -eq 0 ]; then
            print_status "Project cloned successfully"
        else
            print_error "Failed to clone repository"
            exit 1
        fi
    else
        print_warning "No repository URL provided. Please clone manually later."
    fi
}

# Function to create deployment script
create_deployment_script() {
    print_status "Creating deployment script in home directory..."
    
    # Copy the deployment script to home directory
    if [ -f "deploy-frontend.sh" ]; then
        cp deploy-frontend.sh ~/deploy-frontend.sh
        chmod +x ~/deploy-frontend.sh
        print_status "Deployment script created at ~/deploy-frontend.sh"
    else
        print_warning "deploy-frontend.sh not found in current directory"
    fi
}

# Function to setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Add Node.js to PATH if not already there
    if ! grep -q "export PATH=\$PATH:/usr/bin/node" ~/.bashrc; then
        echo 'export PATH=$PATH:/usr/bin/node' >> ~/.bashrc
        print_status "Added Node.js to PATH"
    fi
    
    # Source bashrc
    source ~/.bashrc
}

# Function to show next steps
show_next_steps() {
    print_status "Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Make sure your React project is cloned at /home/ubuntu/duewin_g"
    echo "2. Run the deployment script: ~/deploy-frontend.sh"
    echo "3. Your app will be available at http://your-server-ip"
    echo ""
    print_status "To deploy updates in the future, just run:"
    echo "~/deploy-frontend.sh"
    echo ""
    print_warning "Don't forget to:"
    echo "- Update the domain name in the nginx configuration"
    echo "- Set up SSL certificate if needed"
    echo "- Configure your firewall properly"
}

# Main setup function
main() {
    print_status "Starting AWS Ubuntu server setup for React frontend..."
    
    # Update system
    update_system
    
    # Install required software
    install_nodejs
    install_nginx
    install_git
    
    # Configure nginx
    configure_nginx_react
    
    # Setup project directory
    setup_project_directory
    
    # Create deployment script
    create_deployment_script
    
    # Setup environment
    setup_environment
    
    # Show next steps
    show_next_steps
}

# Check if script is run with sudo
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Run it as a regular user."
    exit 1
fi

# Run main function
main "$@" 