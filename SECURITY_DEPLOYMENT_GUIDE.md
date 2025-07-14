# Security Deployment Guide

## Quick Fix for Missing Security Headers

Based on your security report, your website is missing two critical security headers:
1. **Content-Security-Policy** - Currently too permissive
2. **Permissions-Policy** - Completely missing

## Immediate Actions Required

### Step 1: Deploy the Updated Configuration

1. **SSH into your AWS server**:
   ```bash
   ssh -i your-key.pem ubuntu@your-server-ip
   ```

2. **Navigate to your home directory** (IMPORTANT: deploy.sh must be run from home directory):
   ```bash
   cd ~
   ```

3. **Pull the latest changes** (if using git):
   ```bash
   cd duewin_g
   git pull origin main
   ```

4. **Run the deployment script**:
   ```bash
   ./deploy-frontend.sh
   ```

### Step 2: Verify the Security Headers

After deployment, verify the headers are working:

```bash
curl -I https://strikecolor1.com
```

You should see these headers in the response:
- `Content-Security-Policy`
- `Permissions-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Referrer-Policy`

### Step 3: Test Your Website

1. **Check browser console** for any CSP violations
2. **Test all functionality** to ensure nothing is broken
3. **Verify fonts load correctly** (Google Fonts should still work)

## What Was Fixed

### Before (Insecure):
```nginx
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
# Missing Permissions-Policy header
```

### After (Secure):
```nginx
# Content Security Policy - More restrictive for better security
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" always;

# Permissions Policy - Control browser features and APIs
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=(), clipboard-read=(), clipboard-write=(), web-share=(), xr-spatial-tracking=()" always;
```

## Security Improvements Made

1. **Content-Security-Policy**: Now properly restricts resource loading while allowing necessary functionality
2. **Permissions-Policy**: Added to control browser features and prevent unauthorized access
3. **Strict-Transport-Security**: Added to enforce HTTPS
4. **HTML Meta Tags**: Added client-side security headers as backup

## Testing Your Security

After deployment, test your security using these tools:

1. **Security Headers Check**: https://securityheaders.com
2. **Mozilla Observatory**: https://observatory.mozilla.org
3. **SSL Labs**: https://www.ssllabs.com/ssltest/

## Troubleshooting

### If the deployment fails:
1. Check if you're in the home directory (`cd ~`)
2. Ensure the script has execute permissions (`chmod +x deploy-frontend.sh`)
3. Check Nginx configuration (`sudo nginx -t`)

### If functionality breaks:
1. Check browser console for CSP violations
2. Temporarily relax CSP if needed (see SECURITY_CONFIG.md for details)
3. Test in development environment first

### If headers don't appear:
1. Clear browser cache
2. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Restart Nginx: `sudo systemctl restart nginx`

## Expected Security Score Improvement

After implementing these changes, your security score should improve significantly:

- **Content-Security-Policy**: ✅ Implemented with proper restrictions
- **Permissions-Policy**: ✅ Implemented with comprehensive feature control
- **Overall Security Grade**: Should improve from current grade to A+ or A

## Next Steps

1. **Monitor**: Watch for any CSP violations in browser console
2. **Test**: Ensure all website functionality works correctly
3. **Document**: Keep track of any issues and their resolutions
4. **Regular Updates**: Keep security headers updated as needed

## Support

If you encounter any issues:
1. Check the browser console for specific error messages
2. Review Nginx error logs
3. Test functionality step by step
4. Consider temporarily relaxing CSP if needed for debugging 