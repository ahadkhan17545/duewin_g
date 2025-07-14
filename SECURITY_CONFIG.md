# Security Configuration for Strike Color Website

## Overview
This document outlines the security headers and measures implemented to protect the website against common web vulnerabilities.

## Security Headers Implemented

### 1. X-Frame-Options
- **Value**: `SAMEORIGIN`
- **Purpose**: Prevents clickjacking attacks by controlling if a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`.
- **Protection**: Clickjacking attacks

### 2. X-Content-Type-Options
- **Value**: `nosniff`
- **Purpose**: Prevents MIME type sniffing attacks by telling the browser to strictly follow the MIME type specified in the Content-Type header.
- **Protection**: MIME confusion attacks

### 3. X-XSS-Protection
- **Value**: `1; mode=block`
- **Purpose**: Enables the browser's built-in XSS filter and blocks the page if an XSS attack is detected.
- **Protection**: Cross-site scripting (XSS) attacks

### 4. Referrer-Policy
- **Value**: `no-referrer-when-downgrade`
- **Purpose**: Controls how much referrer information should be included with requests.
- **Protection**: Information leakage through referrer headers

### 5. Strict-Transport-Security (HSTS)
- **Value**: `max-age=31536000; includeSubDomains`
- **Purpose**: Forces browsers to use HTTPS for all future requests to the domain.
- **Protection**: Protocol downgrade attacks, cookie hijacking

### 6. Content-Security-Policy (CSP)
- **Value**: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';`
- **Purpose**: Defines which resources can be loaded and from where, preventing XSS and other injection attacks.
- **Protection**: XSS, code injection, unauthorized resource loading

### 7. Permissions-Policy
- **Value**: `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=(), clipboard-read=(), clipboard-write=(), web-share=(), xr-spatial-tracking=()`
- **Purpose**: Controls which browser features and APIs can be used, preventing unauthorized access to sensitive browser capabilities.
- **Protection**: Privacy violations, unauthorized feature access

## Implementation Details

### Server-Side (Nginx Configuration)
The security headers are implemented in the Nginx configuration within the `deploy-frontend.sh` script:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=(), clipboard-read=(), clipboard-write=(), web-share=(), xr-spatial-tracking=()" always;
```

### Client-Side (HTML Meta Tags)
Additional security meta tags are included in the HTML head section:

```html
<!-- Security Meta Tags -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="Referrer-Policy" content="no-referrer-when-downgrade">
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=(), sync-xhr=(), clipboard-read=(), clipboard-write=(), web-share=(), xr-spatial-tracking=()">
```

## Content Security Policy Breakdown

The CSP is configured with the following directives:

- **default-src 'self'**: Only allow resources from the same origin by default
- **script-src**: Allow scripts from same origin, inline scripts, eval (for React), and Google Fonts
- **style-src**: Allow styles from same origin, inline styles, and Google Fonts
- **font-src**: Allow fonts from same origin and Google Fonts
- **img-src**: Allow images from same origin, data URIs, blobs, and HTTPS sources
- **connect-src**: Allow connections to same origin and HTTPS sources
- **frame-src**: Allow frames only from same origin
- **object-src 'none'**: Block all plugins and objects
- **base-uri 'self'**: Restrict base URI to same origin
- **form-action 'self'**: Restrict form submissions to same origin

## Permissions Policy Breakdown

The Permissions Policy restricts the following browser features:

- **geolocation**: Location access
- **microphone**: Microphone access
- **camera**: Camera access
- **payment**: Payment APIs
- **usb**: USB device access
- **magnetometer, gyroscope, accelerometer**: Sensor access
- **ambient-light-sensor**: Light sensor access
- **autoplay**: Media autoplay
- **encrypted-media**: DRM content
- **fullscreen**: Fullscreen mode
- **picture-in-picture**: Picture-in-picture mode
- **sync-xhr**: Synchronous XMLHttpRequest
- **clipboard-read, clipboard-write**: Clipboard access
- **web-share**: Web Share API
- **xr-spatial-tracking**: VR/AR spatial tracking

## Deployment Instructions

1. **Update the deployment script**: The `deploy-frontend.sh` script has been updated with the new security headers.

2. **Deploy to server**: Run the deployment script from your home directory on the AWS server:
   ```bash
   cd ~
   ./deploy-frontend.sh
   ```

3. **Verify headers**: After deployment, verify the headers are working:
   ```bash
   curl -I https://strikecolor1.com
   ```

## Security Testing

After deployment, test your security headers using:

1. **Security Headers Check**: https://securityheaders.com
2. **Mozilla Observatory**: https://observatory.mozilla.org
3. **SSL Labs**: https://www.ssllabs.com/ssltest/

## Additional Security Recommendations

1. **Enable HTTPS**: Ensure SSL/TLS is properly configured
2. **Regular Updates**: Keep all dependencies and server software updated
3. **Monitoring**: Implement security monitoring and logging
4. **Backup Strategy**: Maintain regular backups with encryption
5. **Access Control**: Implement proper access controls and authentication
6. **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Troubleshooting

If you encounter issues after implementing these headers:

1. **Check browser console**: Look for CSP violations
2. **Test functionality**: Ensure all features still work
3. **Review logs**: Check Nginx error logs for issues
4. **Gradual rollout**: Consider implementing headers gradually in development

## Compliance

These security measures help achieve compliance with:
- OWASP Top 10
- GDPR requirements
- PCI DSS (if applicable)
- Industry security best practices 