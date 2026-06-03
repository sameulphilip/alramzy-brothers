/**
 * بيانات افتراضية ووظائف التخزين — مشتركة بين الموقع ولوحة التحكم
 * التخزين الرئيسي على السيرفر عبر api.php مع fallback على localStorage
 */
var API_ENDPOINT = 'api.php';

function loadFromServer() {
    return fetch(API_ENDPOINT + '?action=load')
        .then(function(r) { return r.json(); })
        .catch(function() { return null; });
}

function saveToServer(data) {
    return fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function(r) { return r.json(); });
}

const ADMIN_STORAGE_KEYS = {
    products: 'alramzy_products',
    categories: 'alramzy_categories',
    brands: 'alramzy_brands',
    contact: 'alramzy_contact',
    users: 'alramzy_admin_users',
    audit: 'alramzy_audit'
};

const SESSION_KEY = 'alramzy_admin_user';

function getCurrentUser() {
    try {
        var raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
}

function setCurrentUser(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    sessionStorage.removeItem(SESSION_KEY);
}

function getStoredUsers() {
    try {
        var raw = localStorage.getItem(ADMIN_STORAGE_KEYS.users);
        if (raw) {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {}
    return [];
}

function saveUsers(list) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.users, JSON.stringify(list));
}

function hashPassword(pwd) {
    return btoa(unescape(encodeURIComponent(pwd || '')));
}

function verifyPassword(pwd, storedHash) {
    return hashPassword(pwd) === storedHash;
}

function getAuditLog() {
    try {
        var raw = localStorage.getItem(ADMIN_STORAGE_KEYS.audit);
        if (raw) {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {}
    return [];
}

function addAuditEntry(action, entityType, entityId, entityName, username) {
    var log = getAuditLog();
    var id = log.length ? Math.max.apply(null, log.map(function(x) { return x.id || 0; })) + 1 : 1;
    log.unshift({
        id: id,
        action: action,
        entityType: entityType,
        entityId: entityId,
        entityName: entityName || '',
        username: username || '',
        timestamp: new Date().toISOString()
    });
    if (log.length > 500) log = log.slice(0, 500);
    localStorage.setItem(ADMIN_STORAGE_KEYS.audit, JSON.stringify(log));
}

function saveAuditLog(log) {
    var list = Array.isArray(log) ? log : [];
    if (list.length > 500) list = list.slice(0, 500);
    localStorage.setItem(ADMIN_STORAGE_KEYS.audit, JSON.stringify(list));
}

const DEFAULT_CATEGORIES = [
    { id: 'engine', name: { ar: 'محرك', en: 'Engine' }, icon: '🚛', order: 1 },
    { id: 'brakes', name: { ar: 'فرامل', en: 'Brakes' }, icon: '🛑', order: 2 },
    { id: 'suspension', name: { ar: 'تعليق', en: 'Suspension' }, icon: '🚚', order: 3 },
    { id: 'electrical', name: { ar: 'كهرباء', en: 'Electrical' }, icon: '🔋', order: 4 },
    { id: 'body', name: { ar: 'هيكل', en: 'Body Parts' }, icon: '💡', order: 5 }
];

const DEFAULT_BRANDS = [
    { id: 'mercedes', name: { ar: 'مرسيدس بنز', en: 'Mercedes-Benz' }, image: 'brands/mercedes.png' },
    { id: 'man', name: { ar: 'مان', en: 'MAN' }, image: 'brands/man.png' },
    { id: 'volvo', name: { ar: 'فولفو', en: 'VOLVO' }, image: 'brands/volvo.png' },
    { id: 'scania', name: { ar: 'سكانيا', en: 'SCANIA' }, image: 'brands/scania.png' },
    { id: 'daf', name: { ar: 'داف', en: 'DAF' }, image: 'brands/daf.png' }
];

const DEFAULT_PRODUCTS = [
    { id: 1, name: { ar: 'فلتر زيت محرك شاحنة', en: 'Truck Engine Oil Filter' }, description: { ar: 'فلتر زيت عالي الجودة مناسب لمحركات الشاحنات الثقيلة', en: 'High-quality oil filter suitable for heavy truck engines' }, category: 'engine', brand: 'mercedes', price: { ar: '450 ج.م', en: '450 EGP' }, icon: '🚛' },
    { id: 2, name: { ar: 'بوجيهات محرك ديزل', en: 'Diesel Engine Glow Plugs' }, description: { ar: 'بوجيهات ديزل أصلية لمحركات الشاحنات الثقيلة', en: 'Original diesel glow plugs for heavy truck engines' }, category: 'engine', brand: 'mercedes', price: { ar: '600 ج.م', en: '600 EGP' }, icon: '⚡' },
    { id: 3, name: { ar: 'فلتر هواء شاحنة', en: 'Truck Air Filter' }, description: { ar: 'فلتر هواء قوي يحافظ على نظافة محرك الشاحنة', en: 'Heavy-duty air filter to keep truck engine clean' }, category: 'engine', brand: 'mercedes', price: { ar: '350 ج.م', en: '350 EGP' }, icon: '💨' },
    { id: 4, name: { ar: 'بطاريات فرامل أمامية شاحنة', en: 'Truck Front Brake Pads' }, description: { ar: 'بطاريات فرامل قوية للشاحنات الثقيلة لسلامتك', en: 'Heavy-duty brake pads for trucks for your safety' }, category: 'brakes', brand: 'man', price: { ar: '850 ج.م', en: '850 EGP' }, icon: '🛑' },
    { id: 5, name: { ar: 'بطاريات فرامل خلفية شاحنة', en: 'Truck Rear Brake Pads' }, description: { ar: 'بطاريات فرامل خلفية أصلية للشاحنات', en: 'Original rear brake pads for trucks' }, category: 'brakes', brand: 'man', price: { ar: '750 ج.م', en: '750 EGP' }, icon: '🛑' },
    { id: 6, name: { ar: 'أسطوانة فرامل رئيسية شاحنة', en: 'Truck Brake Master Cylinder' }, description: { ar: 'أسطوانة فرامل رئيسية لجميع موديلات الشاحنات', en: 'Brake master cylinder for all truck models' }, category: 'brakes', brand: 'man', price: { ar: '1200 ج.م', en: '1200 EGP' }, icon: '🛑' },
    { id: 7, name: { ar: 'أذرع تعليق شاحنة', en: 'Truck Suspension Arms' }, description: { ar: 'أذرع تعليق قوية للشاحنات الثقيلة مقاومة للأحمال الكبيرة', en: 'Heavy-duty suspension arms for trucks resistant to heavy loads' }, category: 'suspension', brand: 'volvo', price: { ar: '1800 ج.م', en: '1800 EGP' }, icon: '🚚' },
    { id: 8, name: { ar: 'صدمات أمامية شاحنة', en: 'Truck Front Shock Absorbers' }, description: { ar: 'صدمات أمامية قوية للشاحنات لرحلة آمنة', en: 'Heavy-duty front shock absorbers for trucks for safe ride' }, category: 'suspension', brand: 'volvo', price: { ar: '2200 ج.م', en: '2200 EGP' }, icon: '🚚' },
    { id: 9, name: { ar: 'صدمات خلفية شاحنة', en: 'Truck Rear Shock Absorbers' }, description: { ar: 'صدمات خلفية عالية الجودة للشاحنات الثقيلة', en: 'High-quality rear shock absorbers for heavy trucks' }, category: 'suspension', brand: 'volvo', price: { ar: '2000 ج.م', en: '2000 EGP' }, icon: '🚚' },
    { id: 10, name: { ar: 'دينامو شاحنة', en: 'Truck Alternator' }, description: { ar: 'دينامو قوي لشحن بطارية الشاحنة وتشغيل الأنظمة الكهربائية', en: 'Heavy-duty alternator for truck battery charging and electrical systems' }, category: 'electrical', brand: 'scania', price: { ar: '3500 ج.م', en: '3500 EGP' }, icon: '🔋' },
    { id: 11, name: { ar: 'ستارتر شاحنة', en: 'Truck Starter Motor' }, description: { ar: 'ستارتر قوي لبدء تشغيل محرك الشاحنة الثقيلة', en: 'Heavy-duty starter motor for truck engine ignition' }, category: 'electrical', brand: 'scania', price: { ar: '2800 ج.م', en: '2800 EGP' }, icon: '🔋' },
    { id: 12, name: { ar: 'بطارية شاحنة', en: 'Truck Battery' }, description: { ar: 'بطارية شاحنة عالية الأداء للشاحنات الثقيلة', en: 'High-performance truck battery for heavy-duty trucks' }, category: 'electrical', brand: 'scania', price: { ar: '4500 ج.م', en: '4500 EGP' }, icon: '🔋' },
    { id: 13, name: { ar: 'مصابيح أمامية شاحنة', en: 'Truck Headlights' }, description: { ar: 'مصابيح أمامية LED قوية للشاحنات عالية الإضاءة', en: 'High-brightness heavy-duty LED headlights for trucks' }, category: 'body', brand: 'daf', price: { ar: '1200 ج.م', en: '1200 EGP' }, icon: '💡' },
    { id: 14, name: { ar: 'مصابيح خلفية شاحنة', en: 'Truck Taillights' }, description: { ar: 'مصابيح خلفية أصلية للشاحنات', en: 'Original taillights for trucks' }, category: 'body', brand: 'daf', price: { ar: '800 ج.م', en: '800 EGP' }, icon: '💡' },
    { id: 15, name: { ar: 'مرايا جانبية شاحنة', en: 'Truck Side Mirrors' }, description: { ar: 'مرايا جانبية كهربائية للشاحنات الكبيرة', en: 'Electric side mirrors for large trucks' }, category: 'body', brand: 'daf', price: { ar: '1500 ج.م', en: '1500 EGP' }, icon: '🪞' },
    { id: 16, name: { ar: 'مبرد مياه شاحنة', en: 'Truck Radiator' }, description: { ar: 'مبرد مياه قوي لمحرك الشاحنة الثقيلة', en: 'Heavy-duty radiator for truck engine' }, category: 'engine', brand: 'mercedes', price: { ar: '2800 ج.م', en: '2800 EGP' }, icon: '🌡️' },
    { id: 17, name: { ar: 'سير التوقيت شاحنة', en: 'Truck Timing Belt' }, description: { ar: 'سير توقيت عالي الجودة للشاحنات الثقيلة', en: 'High-quality timing belt for heavy trucks' }, category: 'engine', brand: 'man', price: { ar: '1800 ج.م', en: '1800 EGP' }, icon: '⚙️' },
    { id: 18, name: { ar: 'مضخة مياه شاحنة', en: 'Truck Water Pump' }, description: { ar: 'مضخة مياه قوية لمحرك الشاحنة', en: 'Heavy-duty water pump for truck engine' }, category: 'engine', brand: 'volvo', price: { ar: '2200 ج.م', en: '2200 EGP' }, icon: '💧' },
    { id: 19, name: { ar: 'إطارات شاحنة', en: 'Truck Tires' }, description: { ar: 'إطارات شاحنة قوية للأحمال الثقيلة', en: 'Heavy-duty truck tires for heavy loads' }, category: 'body', brand: 'scania', price: { ar: '3500 ج.م', en: '3500 EGP' }, icon: '🛞' },
    { id: 20, name: { ar: 'ديسك فرامل شاحنة', en: 'Truck Brake Disc' }, description: { ar: 'ديسك فرامل قوي للشاحنات الثقيلة', en: 'Heavy-duty brake disc for trucks' }, category: 'brakes', brand: 'daf', price: { ar: '2500 ج.م', en: '2500 EGP' }, icon: '🛑' }
];

function getStoredProducts() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.products);
        if (raw) {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : DEFAULT_PRODUCTS;
        }
    } catch (e) {}
    return null;
}

function getStoredCategories() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.categories);
        if (raw) {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
        }
    } catch (e) {}
    return null;
}

function saveProducts(list) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.products, JSON.stringify(list));
}

function saveCategories(list) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.categories, JSON.stringify(list));
}

function getStoredBrands() {
    try {
        var raw = localStorage.getItem(ADMIN_STORAGE_KEYS.brands);
        if (raw) {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        }
    } catch (e) {}
    return null;
}

function saveBrands(list) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.brands, JSON.stringify(list));
}

function getStoredContact() {
    try {
        var raw = localStorage.getItem(ADMIN_STORAGE_KEYS.contact);
        if (raw) {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        }
    } catch (e) {}
    return null;
}

function saveContact(list) {
    localStorage.setItem(ADMIN_STORAGE_KEYS.contact, JSON.stringify(list));
}

var DEFAULT_CONTACT = [
    { id: 1, type: 'phone', title: { ar: 'للتواصل والاستفسار', en: 'Contact & Inquiries' }, value: { ar: '01018360621', en: '01018360621' } },
    { id: 2, type: 'phone', title: { ar: 'للتواصل والاستفسار', en: 'Contact & Inquiries' }, value: { ar: '01224894973', en: '01224894973' } },
    { id: 3, type: 'link', title: { ar: 'المنطقة الصناعية القديمة – السويس', en: 'Old Industrial Zone – Suez' }, value: { ar: 'اضغط لفتح الموقع على الخريطة', en: 'Open on Google Maps' }, link: 'https://maps.app.goo.gl/kQ3rwFAAf5AJu4DQ9' },
    { id: 4, type: 'link', title: { ar: 'الأربعين أمام قسم الأربعين القديم – السويس', en: 'El-Arbaeen, in front of Old El-Arbaeen Police – Suez' }, value: { ar: 'اضغط لفتح الموقع على الخريطة', en: 'Open on Google Maps' }, link: 'https://maps.app.goo.gl/gJ4ZeBwEwWxtaQaf7' },
    { id: 5, type: 'link', title: { ar: 'شبرا الخلفاوى، ٢٢ شارع الجلاء أمام شركة غاز مصر - القاهرة', en: 'Shobra El-Khalawy, 22 El-Galaa St., in front of Egypt Gas - Cairo' }, value: { ar: 'اضغط لفتح الموقع على الخريطة', en: 'Open on Google Maps' }, link: 'https://maps.app.goo.gl/QPAufbUx3jziVLEHA' }
];

function getNextProductId(productsList) {
    if (!productsList || !productsList.length) return 1;
    return Math.max(...productsList.map(p => p.id), 0) + 1;
}
