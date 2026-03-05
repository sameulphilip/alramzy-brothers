// Language Management
var currentLang = 'ar';

// Products & Categories — تُحمّل من admin-data.js + localStorage
var products = [];
var categories = [];
var categoryNames = {};
var brands = typeof DEFAULT_BRANDS !== 'undefined' ? DEFAULT_BRANDS : [];
var currentBrand = 'all';
var contactItems = [];

function loadDataFromStorage() {
    products = getStoredProducts() || DEFAULT_PRODUCTS;
    categories = getStoredCategories() || DEFAULT_CATEGORIES;
    brands = (typeof getStoredBrands === 'function' ? getStoredBrands() : null) || (typeof DEFAULT_BRANDS !== 'undefined' ? DEFAULT_BRANDS : []);
    contactItems = (typeof getStoredContact === 'function' ? getStoredContact() : null) || (typeof DEFAULT_CONTACT !== 'undefined' ? DEFAULT_CONTACT : []);
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    categoryNames = categories.reduce(function(acc, c) {
        acc[c.id] = c.name;
        return acc;
    }, {});
}

function renderCategoryCards() {
    var container = document.getElementById('categoryCards');
    if (!container) return;
    var lang = currentLang;
    container.innerHTML = categories.map(function(cat) {
        var count = products.filter(function(p) { return p.category === cat.id; }).length;
        var iconHtml = (cat.icon && cat.icon.indexOf('data:image') === 0)
            ? '<img src="' + cat.icon + '" alt="" class="category-card-icon-img">'
            : '<span class="category-card-icon">' + (cat.icon || '📦') + '</span>';
        return '<a href="#products" class="category-card" data-category="' + cat.id + '">' +
            iconHtml +
            '<span class="category-card-name" data-ar="' + (cat.name.ar || '') + '" data-en="' + (cat.name.en || '') + '">' + (cat.name[lang] || cat.name.ar) + '</span>' +
            '<span class="category-card-count"><span class="category-count-num">' + count + '</span> <span data-ar="منتج" data-en="Products">' + (lang === 'ar' ? 'منتج' : 'Products') + '</span></span>' +
            '</a>';
    }).join('');
}

function renderFilterButtons() {
    var container = document.getElementById('productsFilter');
    if (!container) return;
    var lang = currentLang;
    var allBtn = '<button type="button" class="filter-btn active" data-category="all" data-ar="الكل" data-en="All">' + (lang === 'ar' ? 'الكل' : 'All') + '</button>';
    var catBtns = categories.map(function(cat) {
        return '<button type="button" class="filter-btn" data-category="' + cat.id + '" data-ar="' + (cat.name.ar || '') + '" data-en="' + (cat.name.en || '') + '">' + (cat.name[lang] || cat.name.ar) + '</button>';
    }).join('');
    container.innerHTML = allBtn + catBtns;
}

function getNewProducts(limit) {
    limit = limit || 8;
    var featured = products.filter(function(p) { return p.featured === true; });
    if (featured.length > 0) return featured.slice(0, limit);
    if (products.length <= limit) return products.slice();
    return products.slice(-limit);
}

function renderNewProducts() {
    var container = document.getElementById('newProductsGrid');
    if (!container) return;
    var list = getNewProducts(8);
    var lang = currentLang;
    container.innerHTML = list.map(function(product) {
        var iconSrc = product.icon;
        var isIconImg = iconSrc && (iconSrc.indexOf('data:image') === 0 || iconSrc.indexOf('http://') === 0 || iconSrc.indexOf('https://') === 0);
        var iconHtml = isIconImg
            ? '<img src="' + iconSrc + '" alt="" class="product-icon-img">'
            : '<span style="font-size: 4rem; z-index: 1; position: relative;">' + (product.icon || '📦') + '</span>';
        var price = product.price && product.price[lang] ? product.price[lang] : '';
        var catLabel = (categoryNames[product.category] && categoryNames[product.category][lang]) || product.category;
        return '<a href="product.html?id=' + product.id + '" class="product-card">' +
            '<div class="product-card__image">' +
            iconHtml +
            '<span class="product-card__badge">' + catLabel + '</span>' +
            '</div>' +
            '<div class="product-card__body">' +
            '<h3 class="product-card__title">' + (product.name[lang] || product.name.ar) + '</h3>' +
            '<p class="product-card__desc">' + (product.description && product.description[lang] ? product.description[lang] : '') + '</p>' +
            '<div class="product-card__footer">' +
            (price ? '<span class="product-card__price">' + price + '</span>' : '') +
            '<span class="product-card__link" data-ar="عرض التفاصيل" data-en="View Details">' + (lang === 'ar' ? 'عرض التفاصيل' : 'View Details') + '</span>' +
            '</div></div></a>';
    }).join('');
}

var CONTACT_ICONS = { phone: '📞', email: '📧', address: '📍', link: '📍' };

function renderContactSection() {
    var container = document.getElementById('contactInfo');
    if (!container || !contactItems.length) return;
    var lang = currentLang;
    container.innerHTML = contactItems.map(function(item) {
        var icon = CONTACT_ICONS[item.type] || '📍';
        var title = (item.title && item.title[lang]) || (item.title && item.title.ar) || '';
        var value = (item.value && item.value[lang]) || (item.value && item.value.ar) || '';
        var content = '<div class="contact-icon">' + icon + '</div><div class="contact-details"><h3>' + title + '</h3><p>' + value + '</p></div>';
        if (item.link) {
            return '<a href="' + item.link + '" target="_blank" rel="noopener noreferrer" class="contact-item contact-item-link">' + content + '</a>';
        }
        return '<div class="contact-item">' + content + '</div>';
    }).join('');
}

function renderBrandCards() {
    var container = document.getElementById('brandCards');
    if (!container || !brands.length) return;
    var lang = currentLang;
    var brandCards = brands.map(function(b) {
        var count = products.filter(function(p) { return p.brand === b.id; }).length;
        var imgHtml = b.image
            ? '<img class="brand-card__logo" src="' + b.image + '" alt="' + (b.name[lang] || b.name.ar) + '" onerror="this.style.display=\'none\'; this.nextElementSibling && (this.nextElementSibling.style.display=\'inline\');">' +
              '<span class="brand-card__name-fallback" style="display:none">' + (b.name[lang] || b.name.ar) + '</span>'
            : '<span class="brand-card__name-fallback">' + (b.name[lang] || b.name.ar) + '</span>';
        return '<button type="button" class="brand-card' + (currentBrand === b.id ? ' active' : '') + '" data-brand="' + b.id + '">' +
            '<span class="brand-card__logo-wrap">' + imgHtml + '</span>' +
            '<span class="brand-card__count">' + count + '</span>' +
            '<span class="brand-card__name" data-ar="' + (b.name.ar || '') + '" data-en="' + (b.name.en || '') + '">' + (b.name[lang] || b.name.ar) + '</span>' +
            '</button>';
    }).join('');
    container.innerHTML = brandCards;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initializeLanguage();
    initializeMobileMenu();
    renderCategoryCards();
    renderFilterButtons();
    renderBrandCards();
    renderNewProducts();
    renderContactSection();
    initializeProducts();
    initializeFilters();
    initializeCategoryCards();
    initializeBrandCards();
    initializeSmoothScroll();
    /* Hero slider: FNC slider init in fnc-slider.js */
});

// Language Functions
function initializeLanguage() {
    // الافتراضي: الموقع بالعربي (لا نقرأ اللغة المحفوظة في الصفحة الرئيسية)
    currentLang = 'ar';
    setLanguage(currentLang);
    
    // Language switcher button
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', toggleLanguage);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(currentLang);
    localStorage.setItem('language', currentLang);
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
    
    // Update all elements with data-ar and data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = text;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Re-render products, category cards and filter buttons with new language
    renderCategoryCards();
    renderFilterButtons();
    renderBrandCards();
    renderNewProducts();
    renderContactSection();
    renderProducts(currentCategory);
    initializeFilters();
    initializeCategoryCards();
    initializeBrandCards();
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Products
let currentCategory = 'all';

function initializeProducts() {
    renderProducts('all');
}

function renderProducts(category) {
    var productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    currentCategory = category;
    
    var byCategory = category === 'all' ? products : products.filter(function(p) { return p.category === category; });
    var filteredProducts = currentBrand === 'all' ? byCategory : byCategory.filter(function(p) { return p.brand === currentBrand; });
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        var iconSrc = product.icon;
        var isIconImg = iconSrc && (iconSrc.indexOf('data:image') === 0 || iconSrc.indexOf('http://') === 0 || iconSrc.indexOf('https://') === 0);
        var iconHtml = isIconImg
            ? '<img src="' + iconSrc + '" alt="" class="product-icon-img">'
            : '<span style="font-size: 4rem; z-index: 1; position: relative;">' + (product.icon || '📦') + '</span>';
        var price = product.price && product.price[currentLang] ? product.price[currentLang] : '';
        return `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-card__image">
                ${iconHtml}
                <span class="product-card__badge">${(categoryNames[product.category] && categoryNames[product.category][currentLang]) || product.category}</span>
            </div>
            <div class="product-card__body">
                <h3 class="product-card__title">${product.name[currentLang]}</h3>
                <p class="product-card__desc">${product.description[currentLang]}</p>
                <div class="product-card__footer">
                    ${price ? '<span class="product-card__price">' + price + '</span>' : ''}
                    <span class="product-card__link" data-ar="عرض التفاصيل" data-en="View Details">${currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                </div>
            </div>
        </a>
    `;
    }).join('');
}

// Filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get category and filter products
            const category = btn.getAttribute('data-category');
            renderProducts(category);
        });
    });
}

// Category cards (click to filter products - inspired by Sampa)
function initializeCategoryCards() {
    var categoryCards = document.querySelectorAll('.category-card');
    var filterButtons = document.querySelectorAll('.filter-btn');
    var productsSection = document.getElementById('products');
    
    categoryCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            var category = this.getAttribute('data-category');
            if (!category) return;
            filterButtons.forEach(function(b) {
                b.classList.toggle('active', b.getAttribute('data-category') === category);
            });
            renderProducts(category);
            if (productsSection) {
                var offsetTop = productsSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// Brand cards (click to filter by brand)
function initializeBrandCards() {
    var brandCards = document.querySelectorAll('.brand-card');
    var productsSection = document.getElementById('products');
    brandCards.forEach(function(card) {
        card.addEventListener('click', function() {
            currentBrand = this.getAttribute('data-brand') || 'all';
            renderBrandCards();
            renderProducts(currentCategory);
            initializeBrandCards();
            if (productsSection) {
                var offsetTop = productsSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Slider
let currentSlide = 0;
let slideInterval;

function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!slides.length || !dotsContainer) return;
    
    // Create dots (pill style)
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Slide ' + (index + 1));
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    
    // Update counter
    updateSliderCounter();
    
    // Auto slide
    startAutoSlide();
    
    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopAutoSlide);
        hero.addEventListener('mouseleave', startAutoSlide);
    }
}

function updateSliderCounter() {
    const currentEl = document.getElementById('sliderCurrent');
    const totalEl = document.getElementById('sliderTotal');
    const slides = document.querySelectorAll('.hero-slide');
    if (currentEl) currentEl.textContent = currentSlide + 1;
    if (totalEl && slides.length) totalEl.textContent = slides.length;
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slides.length) return;
    
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    
    goToSlide(currentSlide);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slides.length) return;
    
    currentSlide = index;
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    updateSliderCounter();
    
    // Restart auto slide
    stopAutoSlide();
    startAutoSlide();
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}
