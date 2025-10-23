// Script to inject meta tags directly into HTML build
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

async function injectMetaTags() {
  try {
    console.log('🔧 Injecting meta tags into HTML...');
    
    const indexPath = path.join(__dirname, '../dist/index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Add Google Analytics if not already present
    if (!html.includes('gtag.js?id=G-PTCTVL6J0B')) {
      const googleAnalytics = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PTCTVL6J0B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-PTCTVL6J0B');
    </script>`;
      
      // Insert at the beginning of head
      html = html.replace('<head>', `<head>${googleAnalytics}`);
    }
    
    // Add structured data for products
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "name": "SmartMedics",
      "description": "Online Pharmacy & Medical Store in Pakistan",
      "url": "https://smartmedics.pk",
      "sameAs": [
        "https://www.facebook.com/smartmedics.pk",
        "https://www.instagram.com/smartmedics.pk"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+92-329-2252734",
        "contactType": "customer service"
      }
    };
    
    // Add meta tags for better SEO
    const additionalMetas = `
    <!-- Enhanced SEO Meta Tags -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
    <meta name="googlebot" content="index, follow"/>
    <meta name="author" content="SmartMedics"/>
    <meta name="publisher" content="SmartMedics"/>
    <meta name="keywords" content="online pharmacy, medicine delivery, medical store pakistan, prescription medicines, health products"/>
    
    <!-- Open Graph Tags -->
    <meta property="og:locale" content="en_US"/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="Pre sorted medicine & Online Medical Store in Pakistan - SmartMedics"/>
    <meta property="og:description" content="Buy Pre sorted medicine & wellness products from Online Pharmacy & Medical Store Online or Find smartmedics Store near you. Call us to order"/>
    <meta property="og:url" content="https://smartmedics.pk/"/>
    <meta property="og:site_name" content="SmartMedics"/>
    <meta property="og:image" content="https://smartmedics.pk/logo512.png"/>
    <meta property="og:image:width" content="512"/>
    <meta property="og:image:height" content="512"/>
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Pre sorted medicine & Online Medical Store in Pakistan - SmartMedics"/>
    <meta name="twitter:description" content="Buy Pre sorted medicine & wellness products from Online Pharmacy & Medical Store Online"/>
    <meta name="twitter:image" content="https://smartmedics.pk/logo512.png"/>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>`;
    
    // Inject before closing head tag
    html = html.replace('</head>', `${additionalMetas}\n</head>`);
    
    // Write back to file
    fs.writeFileSync(indexPath, html);
    
    console.log('✅ Meta tags injected successfully!');
    
  } catch (error) {
    console.error('❌ Error injecting meta tags:', error);
  }
}

if (require.main === module) {
  injectMetaTags();
}

module.exports = { injectMetaTags };