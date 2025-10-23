// Script to generate sitemap.xml from API products
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Helper function to create product slug
function createProductSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate sitemap
async function generateSitemap() {
  try {
    console.log('🗺️ Generating sitemap.xml...');
    
    const baseUrl = 'https://smartmedics.pk'; // Your domain
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Static pages with their priorities and change frequencies
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
      { url: '/medicines', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/self-medication', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/nutrition-supplements', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/medical-supplies', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/about-us', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
      { url: '/contact-us', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
      { url: '/track-order', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
      { url: '/cart', priority: '0.5', changefreq: 'never', lastmod: currentDate },
    ];

    let productPages = [];

    // Fetch products from API
    const API_URL = process.env.VITE_API_BASE_URL || 'https://api.smartmedics.pk/api';
    const API_KEY = process.env.VITE_API_SECURITY_KEY;
    
    if (API_KEY) {
      try {
        console.log('📡 Fetching products from API...');
        const response = await axios.get(`${API_URL}/products?limit=1000`, {
          headers: {
            'x-api-key': API_KEY
          }
        });
        
        const products = response.data.data || [];
        console.log(`✅ Fetched ${products.length} products from API`);
        
        productPages = products.map(product => ({
          url: `/product/${createProductSlug(product.title)}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: currentDate
        }));
        
      } catch (error) {
        console.error('❌ API Error:', error.message);
        console.log('🔄 Using fallback product list...');
        
        // Fallback popular products
        const popularProducts = [
          'Panadol Extra Tablets',
          'Brufen Tablets 400mg',
          'Concor Tablets 2.5mg',
          'Serc Tablets 24mg',
          'Augmentin Tablets 625mg',
          'Voltral Emulgel 1% 50G',
          'Calpol Syrup 120ml',
          'Ventolin Inhaler 100mcg',
          'Sinemet Tablet 25mg / 250mg',
          'Exelon Capsules 4.5mg',
        ];
        
        productPages = popularProducts.map(title => ({
          url: `/product/${createProductSlug(title)}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: currentDate
        }));
      }
    } else {
      console.warn('⚠️ API key not found, using fallback products');
    }

    // Combine all pages
    const allPages = [...staticPages, ...productPages];
    
    // Generate XML sitemap
    const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const sitemapFooter = `</urlset>`;
    
    const urlEntries = allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');
    
    const sitemapContent = `${sitemapHeader}
${urlEntries}
${sitemapFooter}`;

    // Save sitemap to public folder
    const publicDir = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(sitemapPath, sitemapContent);
    
    console.log('📊 Sitemap Statistics:');
    console.log(`📄 Static pages: ${staticPages.length}`);
    console.log(`🛒 Product pages: ${productPages.length}`);
    console.log(`📊 Total URLs: ${allPages.length}`);
    console.log(`✅ Sitemap saved to: ${sitemapPath}`);
    
    // Also save to dist folder if it exists (for production)
    const distDir = path.join(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
      const distSitemapPath = path.join(distDir, 'sitemap.xml');
      fs.writeFileSync(distSitemapPath, sitemapContent);
      console.log(`✅ Sitemap also saved to: ${distSitemapPath}`);
    }
    
    // Generate robots.txt
    const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /dashboard/private/

# Allow important pages
Allow: /medicines
Allow: /self-medication
Allow: /nutrition-supplements
Allow: /medical-supplies
Allow: /product/
Allow: /about-us
Allow: /contact-us`;

    // Save robots.txt
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`🤖 Robots.txt saved to: ${robotsPath}`);
    
    if (fs.existsSync(distDir)) {
      const distRobotsPath = path.join(distDir, 'robots.txt');
      fs.writeFileSync(distRobotsPath, robotsContent);
      console.log(`🤖 Robots.txt also saved to: ${distRobotsPath}`);
    }
    
    return {
      totalUrls: allPages.length,
      staticPages: staticPages.length,
      productPages: productPages.length,
      sitemapPath,
      robotsPath
    };
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return null;
  }
}

if (require.main === module) {
  generateSitemap().then(result => {
    if (result) {
      console.log('\n🎉 Sitemap generation completed successfully!');
      console.log(`🔗 Add this to your website: ${result.sitemapPath.replace(path.join(__dirname, '../public'), 'https://smartmedics.pk')}`);
      console.log('📝 Next steps:');
      console.log('1. Deploy your website with sitemap.xml');
      console.log('2. Submit sitemap to Google Search Console');
      console.log('3. Submit to Bing Webmaster Tools');
    } else {
      console.log('❌ Sitemap generation failed');
    }
  });
}

module.exports = { generateSitemap, createProductSlug };