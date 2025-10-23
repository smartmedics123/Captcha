// Script to generate product routes for prerendering
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Your product slug utility
function createProductSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Sample function to generate routes (you can modify this)
async function generateRoutes() {
  try {
    console.log('🔄 Generating routes for popular products...');
    
    // Popular products list (manually curated for better performance)
    // You can update this list with your most popular/important products
    const popularProducts = [
      // Pain Relief & Anti-inflammatory
      'Panadol Extra Tablets',
      'Brufen Tablets 400mg',
      'Voltral Emulgel 1% 50G',
      'Disprin Tablets',
      'Ponstan Tablets 500mg',
      
      // Antibiotics  
      'Augmentin Tablets 625mg',
      'Flagyl Tablets 400mg',
      'Zithromax Tablets 250mg',
      'Cipro Tablets 500mg',
      'Klacid Tablets 250mg',
      
      // Heart & Blood Pressure
      'Concor Tablets 2.5mg',
      'Concor Tablets 5mg',
      'Norvasc Tablets 5mg',
      'Cardace Tablets 5mg',
      'Lipitor Tablets 20mg',
      
      // Neurological
      'Serc Tablets 24mg',
      'Sinemet Tablet 25mg / 250mg',
      'Exelon Capsules 4.5mg',
      'Ronirol Tablets 0.25mg',
      'Tegral Tablets 200mg',
      
      // Pediatric
      'Calpol Syrup 120ml',
      'Brufen Syrup 100ml',
      'Ventolin Syrup 2mg',
      'Augmentin Syrup 228.5mg',
      'Klacid Syrup 125mg',
      
      // Respiratory
      'Ventolin Inhaler 100mcg',
      'Symbicort Inhaler',
      'Mucolator Syrup 100ml',
      'Actifed Syrup 100ml',
      
      // Digestive
      'Motilium Tablets 10mg',
      'Nexium Tablets 40mg',
      'Risek Capsules 20mg',
      'Librax Capsules'
    ];

    console.log('🔄 Fetching products from production API...');
    
    const API_URL = process.env.VITE_API_BASE_URL || 'https://api.smartmedics.pk/api';
    const API_KEY = process.env.VITE_API_SECURITY_KEY;
    
    if (!API_KEY) {
      console.warn('⚠️ VITE_API_SECURITY_KEY not found in .env, using popular products list');
      const productRoutes = popularProducts.map(title => `/product/${createProductSlug(title)}`);
      
      const allRoutes = [
        '/',
        '/medicines',
        '/self-medication',
        '/about-us',
        '/nutrition-supplements',
        '/medical-supplies',
        '/contact-us',
        '/track-order',
        '/cart',
        ...productRoutes
      ];
      
      const routesContent = `// Auto-generated routes for prerendering\nexport const prerenderRoutes = ${JSON.stringify(allRoutes, null, 2)};\n`;
      fs.writeFileSync(path.join(__dirname, '../src/prerenderRoutes.js'), routesContent);
      console.log('\n✅ Routes saved to src/prerenderRoutes.js (using popular products)');
      return allRoutes;
    }

    try {
      const url = `${API_URL}/products?limit=1000`;
      const response = await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      const apiData = response.data;
      console.log(`✅ Fetched ${apiData.data?.length || 0} products from API`);
      
      const products = apiData.data || [];
      const productRoutes = products.map(product => `/product/${createProductSlug(product.title)}`);
      
      console.log(`📋 Generated ${productRoutes.length} product routes from API`);
      
      const allRoutes = [
        '/',
        '/medicines',
        '/self-medication',
        '/about-us',
        '/nutrition-supplements',
        '/medical-supplies',
        '/contact-us',
        '/track-order',
        '/cart',
        ...productRoutes
      ];
      
      console.log('Generated routes:');
      console.log(`📄 Main pages: ${allRoutes.filter(r => !r.startsWith('/product')).length}`);
      console.log(`🛒 Product pages: ${productRoutes.length}`);
      console.log(`📊 Total routes: ${allRoutes.length}`);
      
      if (productRoutes.length > 0) {
        console.log('\n📝 Sample product routes:');
        productRoutes.slice(0, 10).forEach((route, index) => {
          console.log(`${index + 1}. ${route}`);
        });
        
        if (productRoutes.length > 10) {
          console.log(`... and ${productRoutes.length - 10} more product routes`);
        }
      }
      
      const routesContent = `// Auto-generated routes for prerendering\nexport const prerenderRoutes = ${JSON.stringify(allRoutes, null, 2)};\n`;
      fs.writeFileSync(path.join(__dirname, '../src/prerenderRoutes.js'), routesContent);
      console.log('\n✅ Routes saved to src/prerenderRoutes.js');
      
      return allRoutes;
      
    } catch (error) {
      console.error('❌ API Error:', error.message);
      console.log('🔄 Falling back to popular products list...');
      
      const productRoutes = popularProducts.map(title => `/product/${createProductSlug(title)}`);
      
      const allRoutes = [
        '/',
        '/medicines',
        '/self-medication',
        '/about-us',
        '/nutrition-supplements',
        '/medical-supplies',
        '/contact-us',
        '/track-order',
        '/cart',
        ...productRoutes
      ];
      
      const routesContent = `// Auto-generated routes for prerendering\nexport const prerenderRoutes = ${JSON.stringify(allRoutes, null, 2)};\n`;
      fs.writeFileSync(path.join(__dirname, '../src/prerenderRoutes.js'), routesContent);
      console.log('\n✅ Routes saved to src/prerenderRoutes.js (fallback to popular products)');
      
      return allRoutes;
    }
  } catch (error) {
    console.error('Error generating routes:', error);
    return [];
  }
}

if (require.main === module) {
  generateRoutes();
}

module.exports = { generateRoutes, createProductSlug };