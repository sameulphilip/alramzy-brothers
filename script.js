// Language Management
var currentLang = 'ar';

// Products & Categories — تُحمّل من admin-data.js + localStorage
var products = [];
var categories = [];
var categoryNames = {};
var brands = typeof DEFAULT_BRANDS !== 'undefined' ? DEFAULT_BRANDS : [];
var currentBrand = 'all';
var contactItems = [];

function isTailwindSite() {
    var s = document.documentElement.getAttribute('data-site');
    return s === 'tailwind' || s === 'alramzy';
}

function updateStatsFromData() {
    var p = products.length;
    var el = document.getElementById('statProducts');
    if (el && !el.classList.contains('stat-number--text')) {
        el.textContent = (p > 0 ? p : 20) + '+';
    }
    var b = document.getElementById('statBrands');
    if (b && typeof brands !== 'undefined' && brands.length) {
        b.textContent = brands.length + '+';
    }
}

function loadDataFromStorage() {
    products = getStoredProducts() || DEFAULT_PRODUCTS;
    categories = getStoredCategories() || DEFAULT_CATEGORIES;
    brands = (typeof getStoredBrands === 'function' ? getStoredBrands() : null) || (typeof DEFAULT_BRANDS !== 'undefined' ? DEFAULT_BRANDS : []);
    contactItems = (typeof getStoredContact === 'function' ? getStoredContact() : null) || (typeof DEFAULT_CONTACT !== 'undefined' ? DEFAULT_CONTACT : []);
    var suezWhatsappUsed = false;
    contactItems = contactItems.map(function(item) {
        if (item.type !== 'phone') return item;
        var isSuez = item.title && (item.title.ar === 'فرع السويس' || item.title.en === 'Suez Branch');
        if (!isSuez) return item;
        if (!suezWhatsappUsed) {
            suezWhatsappUsed = true;
            var primary = Object.assign({}, item);
            delete primary.whatsapp;
            return primary;
        }
        return Object.assign({}, item, { whatsapp: false });
    });
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
    var btnClass = isTailwindSite() ? 'tw-filter-btn' : 'filter-btn';
    var allBtn = '<button type="button" class="' + btnClass + ' active" data-category="all" data-ar="الكل" data-en="All">' + (lang === 'ar' ? 'الكل' : 'All') + '</button>';
    var catBtns = categories.map(function(cat) {
        return '<button type="button" class="' + btnClass + '" data-category="' + cat.id + '" data-ar="' + (cat.name.ar || '') + '" data-en="' + (cat.name.en || '') + '">' + (cat.name[lang] || cat.name.ar) + '</button>';
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
    var tw = isTailwindSite();
    container.innerHTML = list.map(function(product) {
        var iconSrc = product.icon;
        var isIconImg = iconSrc && (iconSrc.indexOf('data:image') === 0 || iconSrc.indexOf('http://') === 0 || iconSrc.indexOf('https://') === 0);
        var iconHtml = isIconImg
            ? '<img src="' + iconSrc + '" alt="">'
            : '<span class="tw-product-card__emoji">' + (product.icon || '📦') + '</span>';
        var price = product.price && product.price[lang] ? product.price[lang] : '';
        var catLabel = (categoryNames[product.category] && categoryNames[product.category][lang]) || product.category;
        if (tw) {
            var badgeMod = product.featured ? 'tw-product-card__badge--new' : 'tw-product-card__badge--genuine';
            var badgeText = product.featured ? (lang === 'ar' ? 'جديد' : 'New') : (lang === 'ar' ? 'أصلي' : 'Genuine');
            var rowPrice = price || (lang === 'ar' ? 'متوفر' : 'In Stock');
            return '<a href="product.html?id=' + product.id + '" class="tw-product-card">' +
                '<div class="tw-product-card__media">' +
                iconHtml +
                '<span class="tw-product-card__badge ' + badgeMod + '">' + badgeText + '</span>' +
                '</div>' +
                '<div class="tw-product-card__body">' +
                '<span class="tw-product-card__cat">' + catLabel + '</span>' +
                '<h3 class="tw-product-card__title">' + (product.name[lang] || product.name.ar) + '</h3>' +
                '<div class="tw-product-card__row">' +
                '<span class="tw-product-card__price">' + rowPrice + '</span>' +
                '<span class="tw-product-card__link">' + (lang === 'ar' ? 'عرض التفاصيل' : 'View Details') + '</span>' +
                '</div></div></a>';
        }
        iconHtml = isIconImg
            ? '<img src="' + iconSrc + '" alt="" class="product-icon-img">'
            : '<span style="font-size: 4rem; z-index: 1; position: relative;">' + (product.icon || '📦') + '</span>';
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
var CONTACT_MAT_ICONS = { phone: 'phone_in_talk', email: 'alternate_email', address: 'location_on', link: 'link' };

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function contactField(item, field, lang) {
    var obj = item[field];
    return (obj && obj[lang]) || (obj && obj.ar) || '';
}

function phoneTelHref(raw) {
    var digits = String(raw || '').replace(/[^\d+]/g, '');
    if (digits.charAt(0) === '0' && digits.length >= 10) {
        digits = '+20' + digits.slice(1);
    }
    return digits ? 'tel:' + digits : '#';
}

function whatsappPrefillMessage(lang) {
    return lang === 'ar'
        ? 'السلام عليكم، عايز استفسار عن قطعة غيار.'
        : 'Hello, I would like to inquire about a spare part.';
}

function phoneWhatsappHref(raw, lang) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (digits.charAt(0) === '0' && digits.length >= 10) {
        digits = '20' + digits.slice(1);
    } else if (digits.charAt(0) !== '2' && digits.length >= 10) {
        digits = '20' + digits;
    }
    if (!digits) return '#';
    var href = 'https://wa.me/' + digits;
    var message = whatsappPrefillMessage(lang || currentLang);
    return href + '?text=' + encodeURIComponent(message);
}

var WHATSAPP_ICON_SVG = '<svg class="whatsapp-btn__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

function whatsappBranchLabel(item, lang) {
    return contactField(item, 'title', lang) || contactField(item, 'value', lang);
}

function renderWhatsappFloat() {
    var container = document.getElementById('whatsappFloat');
    if (!container) return;
    var phones = contactItems.filter(function(item) { return item.type === 'phone' && item.whatsapp !== false; });
    if (!phones.length) {
        container.innerHTML = '';
        container.hidden = true;
        return;
    }
    var lang = currentLang;
    var waWord = lang === 'ar' ? 'واتساب' : 'WhatsApp';
    container.hidden = false;
    container.innerHTML = phones.map(function(item) {
        var value = contactField(item, 'value', lang);
        var branchLabel = whatsappBranchLabel(item, lang);
        var href = phoneWhatsappHref(value, lang);
        return '<a href="' + escapeHtml(href) + '" class="whatsapp-float__btn" target="_blank" rel="noopener noreferrer" ' +
            'aria-label="' + escapeHtml(waWord + ' — ' + branchLabel) + '" title="' + escapeHtml(branchLabel + ' (' + value + ')') + '">' +
            WHATSAPP_ICON_SVG.replace('width="20" height="20"', 'width="28" height="28"') +
            '<span class="whatsapp-float__num">' + escapeHtml(branchLabel) + '</span></a>';
    }).join('');
}

function renderFooter() {
    var contactEl = document.getElementById('footerContact');
    var branchesEl = document.getElementById('footerBranches');
    if (!contactEl && !branchesEl) return;
    if (!contactItems.length) {
        if (contactEl) contactEl.innerHTML = '';
        if (branchesEl) branchesEl.innerHTML = '';
        return;
    }
    var lang = currentLang;

    if (contactEl) {
        var contactParts = [];
        contactItems.forEach(function(item) {
            if (item.type !== 'phone' && item.type !== 'email') return;
            var title = contactField(item, 'title', lang);
            var value = contactField(item, 'value', lang);
            var icon = item.type === 'phone' ? 'phone_in_talk' : 'alternate_email';
            var href = item.type === 'phone' ? phoneTelHref(value) : 'mailto:' + encodeURIComponent(value);
            var bodyHtml;
            if (item.type === 'phone') {
                var waBtnHtml = '';
                if (item.whatsapp !== false) {
                    var waHref = phoneWhatsappHref(value, lang);
                    var waLabel = whatsappBranchLabel(item, lang);
                    waBtnHtml = '<a class="btn-whatsapp" href="' + escapeHtml(waHref) + '" target="_blank" rel="noopener noreferrer">' +
                        WHATSAPP_ICON_SVG + '<span>' + escapeHtml(waLabel) + '</span></a>';
                }
                bodyHtml =
                    '<div class="footer-contact__body">' +
                    '<span class="footer-contact__label">' + escapeHtml(title) + '</span>' +
                    '<div class="footer-contact__actions">' +
                    '<a class="footer-contact__phone" href="' + escapeHtml(href) + '">' + escapeHtml(value) + '</a>' +
                    waBtnHtml +
                    '</div></div>';
            } else {
                bodyHtml =
                    '<div class="footer-contact__body">' +
                    '<span class="footer-contact__label">' + escapeHtml(title) + '</span>' +
                    '<a href="' + escapeHtml(href) + '">' + escapeHtml(value) + '</a></div>';
            }
            contactParts.push(
                '<li class="footer-contact__item">' +
                '<span class="material-symbols-outlined" aria-hidden="true">' + icon + '</span>' +
                bodyHtml + '</li>'
            );
        });
        contactEl.innerHTML = contactParts.length
            ? '<ul class="footer-contact">' + contactParts.join('') + '</ul>'
            : '';
    }

    if (branchesEl) {
        var branchItems = contactItems.filter(function(item) {
            return item.type === 'address' || item.type === 'link';
        });
        branchesEl.innerHTML = branchItems.map(function(item) {
            var title = contactField(item, 'title', lang);
            var value = contactField(item, 'value', lang);
            var inner =
                '<article class="footer-branch">' +
                '<h5>' + escapeHtml(title) + '</h5>' +
                '<p>' + escapeHtml(value) + '</p></article>';
            if (item.link) {
                return '<a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener noreferrer" class="footer-branch-link">' + inner + '</a>';
            }
            return '<div class="footer-branch-wrap">' + inner + '</div>';
        }).join('');
    }
}

function renderContactSection() {
    var container = document.getElementById('contactInfo');
    if (!container || !contactItems.length) return;
    var lang = currentLang;
    var tw = isTailwindSite();
    container.innerHTML = contactItems.map(function(item) {
        var title = (item.title && item.title[lang]) || (item.title && item.title.ar) || '';
        var value = (item.value && item.value[lang]) || (item.value && item.value.ar) || '';
        var waBtn = '';
        if (item.type === 'phone' && item.whatsapp !== false) {
            var waLabel = whatsappBranchLabel(item, lang);
            waBtn = '<a class="btn-whatsapp btn-whatsapp--inline" href="' + escapeHtml(phoneWhatsappHref(value, lang)) + '" target="_blank" rel="noopener noreferrer">' +
                WHATSAPP_ICON_SVG + '<span>' + escapeHtml(waLabel) + '</span></a>';
        }
        if (tw) {
            var matIcon = CONTACT_MAT_ICONS[item.type] || 'link';
            var blockInner =
                '<div class="tw-contact-block__icon"><span class="material-symbols-outlined" style="color:#2563eb;font-size:1.35rem">' + matIcon + '</span></div>' +
                '<div><h4>' + title + '</h4><p>' + value + '</p>' + waBtn + '</div>';
            if (item.link) {
                return '<a href="' + item.link + '" target="_blank" rel="noopener noreferrer" class="tw-contact-block contact-item-link">' + blockInner + '</a>';
            }
            return '<div class="tw-contact-block">' + blockInner + '</div>';
        }
        var icon = CONTACT_ICONS[item.type] || '📍';
        var content = '<div class="contact-icon">' + icon + '</div><div class="contact-details"><h3>' + title + '</h3><p>' + value + '</p>' + waBtn + '</div>';
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
    var tw = isTailwindSite();
    var brandCards = brands.map(function(b) {
        var count = products.filter(function(p) { return p.brand === b.id; }).length;
        var imgHtml = b.image
            ? '<img src="' + b.image + '" alt="' + (b.name[lang] || b.name.ar) + '" onerror="this.style.display=\'none\'; this.nextElementSibling && (this.nextElementSibling.style.display=\'block\');">' +
              '<span class="tw-brand-card__fallback" style="display:none">' + (b.name[lang] || b.name.ar) + '</span>'
            : '<span class="tw-brand-card__fallback">' + (b.name[lang] || b.name.ar) + '</span>';
        if (tw) {
            return '<button type="button" class="brand-card tw-brand-card' + (currentBrand === b.id ? ' active' : '') + '" data-brand="' + b.id + '" title="' + (b.name[lang] || b.name.ar) + ' (' + count + ')" aria-label="' + (b.name[lang] || b.name.ar) + '">' +
                imgHtml + '</button>';
        }
        imgHtml = b.image
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

function initializeTrustedBrandsCarousel() {
    var timerKey = '__trustedBrandsTimer';
    if (window[timerKey]) {
        clearInterval(window[timerKey]);
        window[timerKey] = null;
    }
}

// Initialize — تحميل البيانات من السيرفر أولاً إن وُجدت
document.addEventListener('DOMContentLoaded', function() {
    initializeSiteSplash();

    function doInit() {
        loadDataFromStorage();
        updateStatsFromData();
        initializeLanguage();
        initializeMobileMenu();
        renderCategoryCards();
        renderFilterButtons();
        renderBrandCards();
        renderNewProducts();
        renderContactSection();
        renderFooter();
        renderWhatsappFloat();
        initializeTrustedBrandsCarousel();
        initializeProducts();
        initializeFilters();
        initializeCategoryCards();
        initializeBrandCards();
        initializeSmoothScroll();
        initializeInquiryForm();
    }
    if (typeof loadFromServer === 'function') {
        loadFromServer().then(function(data) {
            if (data) {
                if (Array.isArray(data.products)) saveProducts(data.products);
                if (Array.isArray(data.categories)) saveCategories(data.categories);
                if (Array.isArray(data.brands)) saveBrands(data.brands);
                if (Array.isArray(data.contact)) saveContact(data.contact);
            }
            doInit();
        }).catch(function() { doInit(); });
    } else {
        doInit();
    }
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
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(function(el) {
        var p = lang === 'ar' ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
        if (p) el.setAttribute('placeholder', p);
    });
    
    // Re-render products, category cards and filter buttons with new language
    renderCategoryCards();
    renderFilterButtons();
    renderBrandCards();
    renderNewProducts();
    renderContactSection();
    renderFooter();
    renderWhatsappFloat();
    renderProducts(currentCategory);
    initializeFilters();
    initializeCategoryCards();
    initializeBrandCards();
}

// Mobile Menu
function getHeaderOffset() {
    var header = document.querySelector('.site-header');
    return header ? header.offsetHeight : 80;
}

function setMobileMenuOpen(open) {
    var navMenu = document.getElementById('navMenu');
    var toggle = document.getElementById('mobileMenuToggle');
    var overlay = document.getElementById('navOverlay');
    if (!navMenu) return;
    navMenu.classList.toggle('active', open);
    document.body.classList.toggle('nav-open', open);
    navMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (overlay) {
        overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
}

function initializeMobileMenu() {
    var mobileMenuToggle = document.getElementById('mobileMenuToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');

    if (mobileMenuToggle && navMenu) {
        setMobileMenuOpen(false);
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            setMobileMenuOpen(!navMenu.classList.contains('active'));
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                setMobileMenuOpen(false);
            });
        }

        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                setMobileMenuOpen(false);
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        });

        function syncNavForViewport() {
            if (window.matchMedia('(min-width: 992px)').matches) {
                setMobileMenuOpen(false);
                navMenu.setAttribute('aria-hidden', 'false');
            } else if (!navMenu.classList.contains('active')) {
                navMenu.setAttribute('aria-hidden', 'true');
            }
        }
        syncNavForViewport();
        window.addEventListener('resize', syncNavForViewport);
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
    
    var tw = isTailwindSite();
    productsGrid.innerHTML = filteredProducts.map(function(product) {
        var iconSrc = product.icon;
        var isIconImg = iconSrc && (iconSrc.indexOf('data:image') === 0 || iconSrc.indexOf('http://') === 0 || iconSrc.indexOf('https://') === 0);
        var catLabel = (categoryNames[product.category] && categoryNames[product.category][currentLang]) || product.category;
        var price = product.price && product.price[currentLang] ? product.price[currentLang] : '';
        var desc = (product.description && product.description[currentLang]) ? product.description[currentLang] : '';
        var name = (product.name && product.name[currentLang]) || (product.name && product.name.ar) || '';
        if (tw) {
            var iconHtmlTw = isIconImg
                ? '<img src="' + iconSrc + '" alt="">'
                : '<span class="tw-product-card__emoji">' + (product.icon || '📦') + '</span>';
            var badgeMod = product.featured ? 'tw-product-card__badge--new' : 'tw-product-card__badge--genuine';
            var badgeText = product.featured ? (currentLang === 'ar' ? 'جديد' : 'New') : (currentLang === 'ar' ? 'أصلي' : 'Genuine');
            var rowPrice = price || (currentLang === 'ar' ? 'متوفر' : 'In Stock');
            return '<a href="product.html?id=' + product.id + '" class="tw-product-card">' +
                '<div class="tw-product-card__media">' + iconHtmlTw +
                '<span class="tw-product-card__badge ' + badgeMod + '">' + badgeText + '</span></div>' +
                '<div class="tw-product-card__body">' +
                '<span class="tw-product-card__cat">' + catLabel + '</span>' +
                '<h3 class="tw-product-card__title">' + name + '</h3>' +
                '<div class="tw-product-card__row">' +
                '<span class="tw-product-card__price">' + rowPrice + '</span>' +
                '<span class="tw-product-card__link">' + (currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details') + '</span>' +
                '</div></div></a>';
        }
        var iconHtml = isIconImg
            ? '<img src="' + iconSrc + '" alt="" class="product-icon-img">'
            : '<span style="font-size: 4rem; z-index: 1; position: relative;">' + (product.icon || '📦') + '</span>';
        return '<a href="product.html?id=' + product.id + '" class="product-card">' +
            '<div class="product-card__image">' + iconHtml +
            '<span class="product-card__badge">' + catLabel + '</span></div>' +
            '<div class="product-card__body">' +
            '<h3 class="product-card__title">' + name + '</h3>' +
            '<p class="product-card__desc">' + desc + '</p>' +
            '<div class="product-card__footer">' +
            (price ? '<span class="product-card__price">' + price + '</span>' : '') +
            '<span class="product-card__link" data-ar="عرض التفاصيل" data-en="View Details">' + (currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details') + '</span>' +
            '</div></div></a>';
    }).join('');
}

// Filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('#productsFilter button[data-category]');
    
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
    var filterButtons = document.querySelectorAll('#productsFilter button[data-category]');
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

function initializeInquiryForm() {
    var form = document.getElementById('inquiryForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var fd = new FormData(form);
        var first = (fd.get('first') || '').toString().trim();
        var last = (fd.get('last') || '').toString().trim();
        var email = (fd.get('email') || '').toString().trim();
        var message = (fd.get('message') || '').toString().trim();
        var body = 'Name: ' + first + ' ' + last + '\nEmail: ' + email + '\n\n' + message;
        window.location.href = 'mailto:info@alramzybrothers.com?subject=' + encodeURIComponent('Website inquiry — Al Ramzy Brothers') + '&body=' + encodeURIComponent(body);
    });
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var offsetTop = target.offsetTop - getHeaderOffset();
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Splash — يختفي أول ما فيديو الـ Hero (والموقع) يجهز للعرض
function initializeSiteSplash() {
    var splash = document.getElementById('siteSplash');
    var splashBar = document.getElementById('siteSplashBar');
    var splashVideo = document.getElementById('splashVideo');
    var heroVideo = document.getElementById('heroVideo');
    var heroBg = document.getElementById('heroBg');
    if (!splash) return;

    var maxWaitMs = 10000;
    var heroReady = false;
    var dismissed = false;

    function setLoadProgress(pct) {
        var n = Math.min(100, Math.max(0, pct));
        document.documentElement.style.setProperty('--site-load', n + '%');
        if (splashBar) {
            splashBar.setAttribute('aria-valuenow', String(Math.round(n)));
        }
    }

    function dismissSplash() {
        if (dismissed) return;
        dismissed = true;
        setLoadProgress(100);
        if (splashVideo) {
            splashVideo.pause();
        }
        splash.classList.add('is-done');
        splash.setAttribute('aria-busy', 'false');
        document.body.classList.remove('is-splash-active');
        if (heroBg) {
            heroBg.classList.add('is-ready');
        }
        if (heroVideo) {
            var playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        }
    }

    function tryDismiss() {
        if (dismissed || !heroReady) return;
        dismissSplash();
    }

    setLoadProgress(10);

    if (splashVideo) {
        splashVideo.play().catch(function() {});
    }

    if (heroVideo && heroBg) {
        function onHeroReady() {
            if (heroReady) return;
            heroReady = true;
            setLoadProgress(100);
            tryDismiss();
        }

        heroVideo.addEventListener('loadeddata', onHeroReady, { once: true });
        heroVideo.addEventListener('canplay', onHeroReady, { once: true });
        heroVideo.addEventListener('error', onHeroReady, { once: true });

        heroVideo.addEventListener('progress', function() {
            if (!heroVideo.buffered.length || !heroVideo.duration) return;
            var end = heroVideo.buffered.end(heroVideo.buffered.length - 1);
            setLoadProgress(15 + (end / heroVideo.duration) * 80);
        });

        if (heroVideo.readyState >= 2) {
            onHeroReady();
        } else if (heroVideo.readyState === 0) {
            heroVideo.load();
        }
    } else {
        heroReady = true;
        tryDismiss();
    }

    if (document.readyState === 'complete') {
        setTimeout(function() {
            if (!heroReady) {
                heroReady = true;
                tryDismiss();
            }
        }, 800);
    } else {
        window.addEventListener('load', function() {
            setTimeout(function() {
                if (!heroReady) {
                    heroReady = true;
                    tryDismiss();
                }
            }, 600);
        }, { once: true });
    }

    setTimeout(function() {
        heroReady = true;
        dismissSplash();
    }, maxWaitMs);
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
