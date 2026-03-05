// Product Details Page Script
// Use currentLang from script.js if available, otherwise declare it
var currentLang = (typeof currentLang !== 'undefined') ? currentLang : 'ar';

// Products Data - Always define it here to ensure it's available
// First check if window.products exists (from script.js), otherwise use local data
var products;
if (typeof window !== 'undefined' && typeof window.products !== 'undefined' && window.products.length > 0) {
    products = window.products;
} else {
    products = [
        {
            id: 1,
            name: { ar: 'فلتر زيت محرك', en: 'Engine Oil Filter' },
            description: { ar: 'فلتر زيت عالي الجودة مناسب لجميع أنواع السيارات', en: 'High-quality oil filter suitable for all car types' },
            category: 'engine',
            price: { ar: '150 ج.م', en: '150 EGP' },
            icon: '🔧'
        },
        {
            id: 2,
            name: { ar: 'بوجيهات', en: 'Spark Plugs' },
            description: { ar: 'بوجيهات أصلية لضمان أداء أفضل للمحرك', en: 'Original spark plugs for better engine performance' },
            category: 'engine',
            price: { ar: '200 ج.م', en: '200 EGP' },
            icon: '⚡'
        },
        {
            id: 3,
            name: { ar: 'فلتر هواء', en: 'Air Filter' },
            description: { ar: 'فلتر هواء يحافظ على نظافة المحرك', en: 'Air filter to keep the engine clean' },
            category: 'engine',
            price: { ar: '120 ج.م', en: '120 EGP' },
            icon: '💨'
        },
        {
            id: 4,
            name: { ar: 'بطاريات فرامل أمامية', en: 'Front Brake Pads' },
            description: { ar: 'بطاريات فرامل عالية الجودة لسلامتك', en: 'High-quality brake pads for your safety' },
            category: 'brakes',
            price: { ar: '350 ج.م', en: '350 EGP' },
            icon: '🛑'
        },
        {
            id: 5,
            name: { ar: 'بطاريات فرامل خلفية', en: 'Rear Brake Pads' },
            description: { ar: 'بطاريات فرامل خلفية أصلية', en: 'Original rear brake pads' },
            category: 'brakes',
            price: { ar: '300 ج.م', en: '300 EGP' },
            icon: '🛑'
        },
        {
            id: 6,
            name: { ar: 'أسطوانة فرامل رئيسية', en: 'Brake Master Cylinder' },
            description: { ar: 'أسطوانة فرامل رئيسية لجميع الموديلات', en: 'Brake master cylinder for all models' },
            category: 'brakes',
            price: { ar: '450 ج.م', en: '450 EGP' },
            icon: '🛑'
        },
        {
            id: 7,
            name: { ar: 'أذرع تعليق', en: 'Suspension Arms' },
            description: { ar: 'أذرع تعليق قوية ومقاومة للاهتزاز', en: 'Strong suspension arms resistant to vibration' },
            category: 'suspension',
            price: { ar: '600 ج.م', en: '600 EGP' },
            icon: '🔩'
        },
        {
            id: 8,
            name: { ar: 'صدمات أمامية', en: 'Front Shock Absorbers' },
            description: { ar: 'صدمات أمامية لرحلة مريحة', en: 'Front shock absorbers for a comfortable ride' },
            category: 'suspension',
            price: { ar: '800 ج.م', en: '800 EGP' },
            icon: '🔩'
        },
        {
            id: 9,
            name: { ar: 'صدمات خلفية', en: 'Rear Shock Absorbers' },
            description: { ar: 'صدمات خلفية عالية الجودة', en: 'High-quality rear shock absorbers' },
            category: 'suspension',
            price: { ar: '750 ج.م', en: '750 EGP' },
            icon: '🔩'
        },
        {
            id: 10,
            name: { ar: 'دينامو', en: 'Alternator' },
            description: { ar: 'دينامو لشحن البطارية وتشغيل الأنظمة الكهربائية', en: 'Alternator for battery charging and electrical systems' },
            category: 'electrical',
            price: { ar: '1200 ج.م', en: '1200 EGP' },
            icon: '🔋'
        },
        {
            id: 11,
            name: { ar: 'ستارتر', en: 'Starter Motor' },
            description: { ar: 'ستارتر قوي لبدء تشغيل المحرك', en: 'Strong starter motor for engine ignition' },
            category: 'electrical',
            price: { ar: '900 ج.م', en: '900 EGP' },
            icon: '🔋'
        },
        {
            id: 12,
            name: { ar: 'بطارية سيارة', en: 'Car Battery' },
            description: { ar: 'بطارية سيارة عالية الأداء', en: 'High-performance car battery' },
            category: 'electrical',
            price: { ar: '1500 ج.م', en: '1500 EGP' },
            icon: '🔋'
        },
        {
            id: 13,
            name: { ar: 'مصابيح أمامية', en: 'Headlights' },
            description: { ar: 'مصابيح أمامية LED عالية الإضاءة', en: 'High-brightness LED headlights' },
            category: 'body',
            price: { ar: '500 ج.م', en: '500 EGP' },
            icon: '💡'
        },
        {
            id: 14,
            name: { ar: 'مصابيح خلفية', en: 'Taillights' },
            description: { ar: 'مصابيح خلفية أصلية', en: 'Original taillights' },
            category: 'body',
            price: { ar: '400 ج.م', en: '400 EGP' },
            icon: '💡'
        },
        {
            id: 15,
            name: { ar: 'مرايا جانبية', en: 'Side Mirrors' },
            description: { ar: 'مرايا جانبية كهربائية', en: 'Electric side mirrors' },
            category: 'body',
            price: { ar: '350 ج.م', en: '350 EGP' },
            icon: '🪞'
        },
        {
            id: 16,
            name: { ar: 'مبرد مياه', en: 'Radiator' },
            description: { ar: 'مبرد مياه للمحرك', en: 'Engine radiator' },
            category: 'engine',
            price: { ar: '700 ج.م', en: '700 EGP' },
            icon: '🌡️'
        },
        {
            id: 17,
            name: { ar: 'سير التوقيت', en: 'Timing Belt' },
            description: { ar: 'سير توقيت عالي الجودة', en: 'High-quality timing belt' },
            category: 'engine',
            price: { ar: '550 ج.م', en: '550 EGP' },
            icon: '⚙️'
        },
        {
            id: 18,
            name: { ar: 'مضخة مياه', en: 'Water Pump' },
            description: { ar: 'مضخة مياه للمحرك', en: 'Engine water pump' },
            category: 'engine',
            price: { ar: '450 ج.م', en: '450 EGP' },
            icon: '💧'
        }
    ];
}

// Make sure products is available globally
if (typeof window !== 'undefined') {
    window.products = products;
    console.log('Products array initialized with', products.length, 'items');
}

// Get product ID from URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('Product ID from URL:', id);
    return id ? parseInt(id) : null;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Products available:', typeof products !== 'undefined' && products.length > 0);
    console.log('Window products available:', typeof window.products !== 'undefined' && window.products.length > 0);
    
    initializeLanguage();
    initializeMobileMenu();
    
    // Load product details immediately (products should be available)
    setTimeout(function() {
        loadProductDetails();
    }, 10);
});

// Language Functions
function initializeLanguage() {
    // في صفحة المنتج نقرأ اللغة المحفوظة لمواصلة نفس لغة المستخدم، وإلا نستخدم العربي كافتراضي
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'ar' || savedLang === 'en') {
        currentLang = savedLang;
    } else {
        currentLang = 'ar';
    }
    setLanguage(currentLang);
    
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', toggleLanguage);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(currentLang);
    localStorage.setItem('language', currentLang);
    loadProductDetails(); // Reload product details with new language
}

function setLanguage(lang) {
    currentLang = lang;
    const html = document.documentElement;
    const body = document.body;
    
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        body.setAttribute('dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('dir', 'ltr');
    }
    
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load Product Details
function loadProductDetails() {
    console.log('loadProductDetails called');
    const productId = getProductId();
    console.log('Product ID:', productId);
    
    // Use products array (should always be available now)
    const productsArray = products || window.products;
    console.log('Products array:', productsArray);
    console.log('Products array length:', productsArray ? productsArray.length : 0);
    
    // Check if products array is available
    if (!productsArray || productsArray.length === 0) {
        console.error('Products array is not available');
        showError();
        return;
    }
    
    if (!productId || isNaN(productId)) {
        console.error('Invalid product ID:', productId);
        showError();
        return;
    }
    
    // Find product from products array
    const product = productsArray.find(p => p.id === productId);
    console.log('Found product:', product);
    
    if (!product) {
        console.error('Product not found with ID:', productId, 'Available IDs:', productsArray.map(p => p.id));
        showError();
        return;
    }
    
    console.log('Displaying product details...');
    displayProductDetails(product);
}

function displayProductDetails(product) {
    console.log('displayProductDetails called with:', product);
    const productDetails = document.getElementById('productDetails');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!productDetails) {
        console.error('productDetails element not found!');
        return;
    }
    
    console.log('productDetails element found, updating content...');
    
    // Update page title
    if (pageTitle) {
        pageTitle.textContent = `${product.name[currentLang]} - Al Ramzy Brothers`;
    }
    
    const categoryNames = {
        engine: { ar: 'محرك', en: 'Engine' },
        brakes: { ar: 'فرامل', en: 'Brakes' },
        suspension: { ar: 'تعليق', en: 'Suspension' },
        electrical: { ar: 'كهرباء', en: 'Electrical' },
        body: { ar: 'هيكل', en: 'Body Parts' }
    };
    
    // Additional product details (you can expand this)
    const productDetailsData = {
        specifications: {
            ar: 'مواصفات المنتج:',
            en: 'Product Specifications:'
        },
        compatibility: {
            ar: 'متوافق مع جميع أنواع السيارات',
            en: 'Compatible with all car types'
        },
        warranty: {
            ar: 'ضمان الجودة',
            en: 'Quality Guarantee'
        },
        availability: {
            ar: 'متوفر',
            en: 'In Stock'
        }
    };
    
    var iconSrc = product.icon;
    var isIconImg = iconSrc && (iconSrc.indexOf('data:image') === 0 || iconSrc.indexOf('http://') === 0 || iconSrc.indexOf('https://') === 0);
    var productIconHtml = isIconImg
        ? '<img src="' + iconSrc + '" alt="" class="product-icon-large-img">'
        : '<span>' + (product.icon || '') + '</span>';
    productDetails.innerHTML = `
        <div class="product-details-grid">
            <div class="product-image-large">
                <div class="product-icon-large">
                    ${productIconHtml}
                </div>
            </div>
            
            <div class="product-info-large">
                <div class="product-category-badge">${categoryNames[product.category][currentLang]}</div>
                <h1 class="product-title">${product.name[currentLang]}</h1>
                <p class="product-description-large">${product.description[currentLang]}</p>
                
                <div class="product-specs">
                    <h3 data-ar="مواصفات المنتج" data-en="Product Specifications">${productDetailsData.specifications[currentLang]}</h3>
                    <ul class="specs-list">
                        <li>
                            <span class="spec-label" data-ar="الفئة:" data-en="Category:">${currentLang === 'ar' ? 'الفئة:' : 'Category:'}</span>
                            <span class="spec-value">${categoryNames[product.category][currentLang]}</span>
                        </li>
                        <li>
                            <span class="spec-label" data-ar="التوافق:" data-en="Compatibility:">${currentLang === 'ar' ? 'التوافق:' : 'Compatibility:'}</span>
                            <span class="spec-value">${productDetailsData.compatibility[currentLang]}</span>
                        </li>
                        <li>
                            <span class="spec-label" data-ar="الضمان:" data-en="Warranty:">${currentLang === 'ar' ? 'الضمان:' : 'Warranty:'}</span>
                            <span class="spec-value">${productDetailsData.warranty[currentLang]}</span>
                        </li>
                        <li>
                            <span class="spec-label" data-ar="التوفر:" data-en="Availability:">${currentLang === 'ar' ? 'التوفر:' : 'Availability:'}</span>
                            <span class="spec-value available">${productDetailsData.availability[currentLang]}</span>
                        </li>
                    </ul>
                </div>
                
                <div class="product-actions">
                    <a href="index.html#contact" class="btn btn-primary" data-ar="اتصل بنا للاستفسار" data-en="Contact Us for Inquiry">اتصل بنا للاستفسار</a>
                </div>
            </div>
        </div>
    `;
    
    // Update language for new elements
    setLanguage(currentLang);
}

function showError() {
    const productDetails = document.getElementById('productDetails');
    if (productDetails) {
        productDetails.innerHTML = `
            <div class="error-message">
                <h2 data-ar="المنتج غير موجود" data-en="Product Not Found">المنتج غير موجود</h2>
                <p data-ar="عذراً، المنتج المطلوب غير موجود." data-en="Sorry, the requested product was not found.">عذراً، المنتج المطلوب غير موجود.</p>
                <a href="index.html#products" class="btn btn-primary" data-ar="العودة للمنتجات" data-en="Back to Products">العودة للمنتجات</a>
            </div>
        `;
        setLanguage(currentLang);
    }
}