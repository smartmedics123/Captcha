// Static pre-rendering script for shared hosting
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Helper function
function createProductSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate static HTML pages for products
async function generateStaticPages() {
  try {
    console.log('🏗️ Generating static HTML pages for products...');
    
    // Create product pages directory
    const productDir = path.join(__dirname, '../dist/product');
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    // Fetch products from API
    const API_URL = process.env.VITE_API_BASE_URL || 'https://api.smartmedics.pk/api';
    const API_KEY = process.env.VITE_API_SECURITY_KEY;
    
    if (!API_KEY) {
      console.error('❌ API key not found');
      return;
    }
    
    console.log('📡 Fetching products...');
    const response = await axios.get(`${API_URL}/products?limit=1000`, { // Increase limit to get all products
      headers: { 'x-api-key': API_KEY }
    });
    
    const products = response.data.data || [];
    console.log(`✅ Fetched ${products.length} products`);
    
    // Read base HTML template
    const templatePath = path.join(__dirname, '../dist/index.html');
    const baseHtml = fs.readFileSync(templatePath, 'utf8');
    
    let generated = 0;
    
    // Generate static HTML for each product
    for (const product of products) {
      try {
        const slug = createProductSlug(product.title);
        const productPath = path.join(productDir, `${slug}.html`);
        
        // Skip if already exists
        if (fs.existsSync(productPath)) {
          continue;
        }
        
        // Create product-specific HTML
        let productHtml = baseHtml;
        
        // Ensure Google Analytics is present
        if (!productHtml.includes('gtag.js?id=G-PTCTVL6J0B')) {
          const googleAnalytics = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PTCTVL6J0B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-PTCTVL6J0B');
    </script>`;
          
          productHtml = productHtml.replace('<head>', `<head>${googleAnalytics}`);
        }
        
        // Meta title
        const metaTitle = product.metaTitle || `${product.title} - Buy Online | SmartMedics Pakistan`;
        productHtml = productHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${metaTitle}</title>`
        );
        
        // Meta description - find and replace more accurately
        const metaDescription = product.metaDescription || 
          `Buy ${product.title} online at SmartMedics Pakistan. ${product.description || 'Quality medicines delivered to your door.'} Order now!`.substring(0, 160);
        
        // Replace all description meta tags
        productHtml = productHtml.replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi,
          `<meta name="description" content="${metaDescription}"/>`
        );
        
        // Update Open Graph tags
        productHtml = productHtml.replace(
          /<meta property="og:title" content=".*?"\/>/,
          `<meta property="og:title" content="${metaTitle}"/>`
        );
        productHtml = productHtml.replace(
          /<meta property="og:description" content=".*?"\/>/,
          `<meta property="og:description" content="${metaDescription}"/>`
        );
        productHtml = productHtml.replace(
          /<meta property="og:url" content=".*?"\/>/,
          `<meta property="og:url" content="https://smartmedics.pk/product/${slug}"/>`
        );
        
        // Add product image if available
        if (product.thumbnail && product.thumbnail !== 'NULL') {
          productHtml = productHtml.replace(
            /<meta property="og:image" content=".*?"\/>/,
            `<meta property="og:image" content="${product.thumbnail}"/>`
          );
        }
        
        // Update Twitter cards
        productHtml = productHtml.replace(
          /<meta name="twitter:title" content=".*?"\/>/,
          `<meta name="twitter:title" content="${metaTitle}"/>`
        );
        productHtml = productHtml.replace(
          /<meta name="twitter:description" content=".*?"\/>/,
          `<meta name="twitter:description" content="${metaDescription}"/>`
        );
        
        // Add product structured data
        const productSchema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.title,
          "description": product.description || `${product.title} available at SmartMedics`,
          "brand": {
            "@type": "Brand",
            "name": product.manufacturer || "SmartMedics"
          },
          "offers": {
            "@type": "Offer",
            "price": product.stripPrice || product.boxPrice || "0",
            "priceCurrency": "PKR",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "SmartMedics"
            }
          }
        };
        
        // Inject product schema before closing head
        const schemaScript = `\n<script type="application/ld+json">\n${JSON.stringify(productSchema, null, 2)}\n</script>`;
        productHtml = productHtml.replace('</head>', `${schemaScript}\n</head>`);
        
        // Save the file
        fs.writeFileSync(productPath, productHtml);
        generated++;
        
        if (generated % 10 === 0) {
          console.log(`📄 Generated ${generated}/${products.length} pages...`);
        }
        
      } catch (error) {
        console.error(`❌ Error generating page for ${product.title}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully generated ${generated} static product pages!`);
    console.log(`📁 Pages saved in: dist/product/`);
    
    // Generate .htaccess for URL rewriting
    const htaccessContent = `RewriteEngine On

# Handle product pages
RewriteRule ^product/([a-zA-Z0-9-]+)/?$ /product/$1.html [L]

# Handle main routes
RewriteRule ^medicines/?$ /index.html [L]
RewriteRule ^self-medication/?$ /index.html [L]
RewriteRule ^nutrition-supplements/?$ /index.html [L]
RewriteRule ^medical-supplies/?$ /index.html [L]
RewriteRule ^about-us/?$ /index.html [L]
RewriteRule ^contact-us/?$ /index.html [L]
RewriteRule ^track-order/?$ /index.html [L]
RewriteRule ^cart/?$ /index.html [L]

# Fallback to index.html for SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;
    
    fs.writeFileSync(path.join(__dirname, '../dist/.htaccess'), htaccessContent);
    console.log('✅ .htaccess file generated for URL rewriting');
    
    return {
      generated,
      total: products.length
    };
    
  } catch (error) {
    console.error('❌ Error generating static pages:', error);
    return null;
  }
}

if (require.main === module) {
  generateStaticPages().then(result => {
    if (result) {
      console.log('\n🎉 Static page generation completed!');
      console.log(`📊 Generated: ${result.generated}/${result.total} pages`);
      console.log('🚀 Ready to deploy to shared hosting!');
      console.log('\n📋 Deployment steps:');
      console.log('1. Upload dist/ folder contents to public_html/');
      console.log('2. Ensure .htaccess is uploaded');
      console.log('3. Check product pages: yoursite.com/product/product-name');
    }
  });
}

module.exports = { generateStaticPages };