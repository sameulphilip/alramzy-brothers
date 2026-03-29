(function() {
    var products = [];
    var categories = [];
    var brands = [];
    var contact = [];
    var currentUser = getCurrentUser();
    var contactTypeLabels = { phone: 'هاتف', email: 'بريد إلكتروني', address: 'عنوان', link: 'رابط' };

    function load() {
        products = getStoredProducts() || DEFAULT_PRODUCTS;
        categories = getStoredCategories() || DEFAULT_CATEGORIES;
        brands = getStoredBrands() || (typeof DEFAULT_BRANDS !== 'undefined' ? DEFAULT_BRANDS.slice() : []);
        contact = getStoredContact() || (typeof DEFAULT_CONTACT !== 'undefined' ? DEFAULT_CONTACT.slice() : []);
        categories.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
    }

    function persistToServer() {
        var payload = {
            action: 'save',
            products: products,
            categories: categories,
            brands: brands,
            contact: contact,
            audit: getAuditLog()
        };
        saveToServer(payload).catch(function() {
            console.warn('تعذّر الحفظ على السيرفر. البيانات محفوظة محلياً.');
        });
    }

    function persistProducts() {
        saveProducts(products);
        persistToServer();
    }

    function persistCategories() {
        saveCategories(categories);
        persistToServer();
    }

    function persistBrands() {
        saveBrands(brands);
        persistToServer();
    }

    function persistContact() {
        saveContact(contact);
        persistToServer();
    }

    function getNextContactId() {
        if (!contact.length) return 1;
        return Math.max.apply(null, contact.map(function(c) { return c.id || 0; })) + 1;
    }

    function renderProductsTable() {
        var tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        var catMap = {};
        categories.forEach(function(c) { catMap[c.id] = c.name.ar + ' / ' + c.name.en; });
        tbody.innerHTML = products.map(function(p) {
            var catLabel = catMap[p.category] || p.category;
            var iconCell = isIconImage(p.icon)
                ? '<img src="' + p.icon + '" alt="" class="cell-icon-img">'
                : '<span class="cell-emoji">' + (p.icon || '📦') + '</span>';
            var newBadge = p.featured ? '<span class="badge badge-new" title="يظهر في المنتجات الجديدة">✓</span>' : '<span class="badge badge-none">—</span>';
            return '<tr>' +
                '<td>' + p.id + '</td>' +
                '<td>' + iconCell + '</td>' +
                '<td>' + (p.name.ar || '') + '</td>' +
                '<td>' + (p.name.en || '') + '</td>' +
                '<td>' + catLabel + '</td>' +
                '<td>' + (p.price && p.price.ar ? p.price.ar : '-') + '</td>' +
                '<td class="cell-new">' + newBadge + '</td>' +
                '<td class="cell-actions">' +
                '<button type="button" class="btn btn-sm btn-edit" data-product-id="' + p.id + '">تعديل</button> ' +
                '<button type="button" class="btn btn-sm btn-danger" data-product-delete="' + p.id + '">حذف</button>' +
                '</td></tr>';
        }).join('');
    }

    function renderCategoriesTable() {
        var tbody = document.getElementById('categoriesTableBody');
        if (!tbody) return;
        tbody.innerHTML = categories.map(function(c) {
            var count = products.filter(function(p) { return p.category === c.id; }).length;
            var iconCell = isIconImage(c.icon)
                ? '<img src="' + c.icon + '" alt="" class="cell-icon-img">'
                : '<span class="cell-emoji">' + (c.icon || '📦') + '</span>';
            return '<tr>' +
                '<td><code>' + c.id + '</code></td>' +
                '<td>' + iconCell + '</td>' +
                '<td>' + (c.name.ar || '') + '</td>' +
                '<td>' + (c.name.en || '') + '</td>' +
                '<td>' + (c.order || 0) + '</td>' +
                '<td class="cell-actions">' +
                '<button type="button" class="btn btn-sm btn-edit" data-category-id="' + c.id + '">تعديل</button> ' +
                '<button type="button" class="btn btn-sm btn-danger" data-category-delete="' + c.id + '"' + (count > 0 ? ' title="يوجد ' + count + ' منتج بهذه الفئة"' : '') + '>حذف</button>' +
                '</td></tr>';
        }).join('');
    }

    function fillCategorySelect() {
        var sel = document.getElementById('productCategory');
        if (!sel) return;
        sel.innerHTML = categories.map(function(c) {
            return '<option value="' + c.id + '">' + c.name.ar + ' / ' + c.name.en + '</option>';
        }).join('');
    }

    function fillBrandSelect() {
        var sel = document.getElementById('productBrand');
        if (!sel) return;
        sel.innerHTML = '<option value="">— بدون ماركة —</option>' + brands.map(function(b) {
            return '<option value="' + b.id + '">' + (b.name.ar || b.id) + ' / ' + (b.name.en || b.id) + '</option>';
        }).join('');
    }

    function renderBrandsTable() {
        var tbody = document.getElementById('brandsTableBody');
        if (!tbody) return;
        tbody.innerHTML = brands.map(function(b) {
            var count = products.filter(function(p) { return p.brand === b.id; }).length;
            var imgCell = b.image && (b.image.indexOf('http') === 0 || b.image.indexOf('/') === 0 || b.image.indexOf('brands/') === 0)
                ? '<img src="' + b.image + '" alt="" class="cell-icon-img" onerror="this.style.display=\'none\'">'
                : '<span class="cell-emoji">—</span>';
            return '<tr>' +
                '<td><code>' + b.id + '</code></td>' +
                '<td>' + imgCell + '</td>' +
                '<td>' + (b.name.ar || '') + '</td>' +
                '<td>' + (b.name.en || '') + '</td>' +
                '<td>' + count + '</td>' +
                '<td class="cell-actions">' +
                '<button type="button" class="btn btn-sm btn-edit" data-brand-id="' + b.id + '">تعديل</button> ' +
                '<button type="button" class="btn btn-sm btn-danger" data-brand-delete="' + b.id + '"' + (count > 0 ? ' title="يوجد ' + count + ' منتج بهذه الماركة"' : '') + '>حذف</button>' +
                '</td></tr>';
        }).join('');
    }

    function openBrandModal(brand) {
        var title = document.getElementById('modalBrandTitle');
        document.getElementById('brandIdOriginal').value = brand ? brand.id : '';
        document.getElementById('brandKey').value = brand ? brand.id : '';
        document.getElementById('brandKey').readOnly = !!brand;
        document.getElementById('brandNameAr').value = brand ? (brand.name.ar || '') : '';
        document.getElementById('brandNameEn').value = brand ? (brand.name.en || '') : '';
        document.getElementById('brandImage').value = brand ? (brand.image || '') : '';
        title.textContent = brand ? 'تعديل ماركة' : 'إضافة ماركة';
        document.getElementById('modalBrand').classList.add('open');
    }

    function renderContactTable() {
        var tbody = document.getElementById('contactTableBody');
        if (!tbody) return;
        tbody.innerHTML = contact.map(function(c) {
            var valuePreview = (c.value && c.value.ar) || (c.value && c.value.en) || '';
            if (c.link) valuePreview = (valuePreview ? valuePreview + ' | ' : '') + (c.link.substring(0, 40) + (c.link.length > 40 ? '...' : ''));
            return '<tr>' +
                '<td>' + (contactTypeLabels[c.type] || c.type) + '</td>' +
                '<td>' + (c.title && c.title.ar || '') + '</td>' +
                '<td>' + (c.title && c.title.en || '') + '</td>' +
                '<td class="cell-contact-preview">' + valuePreview + '</td>' +
                '<td class="cell-actions">' +
                '<button type="button" class="btn btn-sm btn-edit" data-contact-id="' + c.id + '">تعديل</button> ' +
                '<button type="button" class="btn btn-sm btn-danger" data-contact-delete="' + c.id + '">حذف</button>' +
                '</td></tr>';
        }).join('');
    }

    function openContactModal(item) {
        var title = document.getElementById('modalContactTitle');
        document.getElementById('contactItemId').value = item ? item.id : '';
        document.getElementById('contactType').value = item ? (item.type || 'phone') : 'phone';
        document.getElementById('contactTitleAr').value = item && item.title ? (item.title.ar || '') : '';
        document.getElementById('contactTitleEn').value = item && item.title ? (item.title.en || '') : '';
        document.getElementById('contactValueAr').value = item && item.value ? (item.value.ar || '') : '';
        document.getElementById('contactValueEn').value = item && item.value ? (item.value.en || '') : '';
        document.getElementById('contactLink').value = item && item.link ? item.link : '';
        title.textContent = item ? 'تعديل عنصر اتصل بنا' : 'إضافة عنصر اتصل بنا';
        document.getElementById('modalContact').classList.add('open');
    }

    function isIconImage(val) {
        if (!val) return false;
        var s = String(val);
        return s.indexOf('data:image') === 0 || s.indexOf('http://') === 0 || s.indexOf('https://') === 0;
    }

    /** تصغير صورة الأيقونة مع الإبقاء على PNG والشفافية */
    function compressIconDataUrl(dataUrl, maxPx) {
        maxPx = maxPx || 256;
        return new Promise(function(resolve) {
            if (!dataUrl || String(dataUrl).indexOf('data:image') !== 0) {
                resolve(dataUrl);
                return;
            }
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                var w = img.naturalWidth || img.width;
                var h = img.naturalHeight || img.height;
                if (w <= maxPx && h <= maxPx && dataUrl.length < 120000) {
                    resolve(dataUrl);
                    return;
                }
                var scale = Math.min(maxPx / w, maxPx / h, 1);
                var cw = Math.round(w * scale);
                var ch = Math.round(h * scale);
                var canvas = document.createElement('canvas');
                canvas.width = cw;
                canvas.height = ch;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, cw, ch);
                try {
                    var out = canvas.toDataURL('image/png');
                    resolve(out);
                } catch (e) {
                    resolve(dataUrl);
                }
            };
            img.onerror = function() { resolve(dataUrl); };
            img.src = dataUrl;
        });
    }

    /** ضغط كل أيقونات المنتجات والفئات قبل الحفظ لتجنب امتلاء localStorage */
    function compressAllIcons() {
        var promises = [];
        products.forEach(function(p, i) {
            if (isIconImage(p.icon)) {
                promises.push(compressIconDataUrl(p.icon).then(function(r) {
                    products[i].icon = r;
                }));
            }
        });
        categories.forEach(function(c, i) {
            if (isIconImage(c.icon)) {
                promises.push(compressIconDataUrl(c.icon).then(function(r) {
                    categories[i].icon = r;
                }));
            }
        });
        return Promise.all(promises);
    }

    function setIconPreview(previewId, value, emojiInputId, fileInputId) {
        var el = document.getElementById(previewId);
        if (!el) return;
        if (isIconImage(value)) {
            el.innerHTML = '<img src="' + value + '" alt="">';
        } else {
            el.innerHTML = value ? '<span class="icon-emoji">' + value + '</span>' : '<span class="icon-empty">بدون أيقونة</span>';
        }
        if (emojiInputId) {
            var emojiEl = document.getElementById(emojiInputId);
            if (emojiEl) emojiEl.value = (value && !isIconImage(value)) ? value : '';
        }
        if (fileInputId) {
            var fileEl = document.getElementById(fileInputId);
            if (fileEl) fileEl.value = '';
        }
    }

    function openProductModal(product) {
        var title = document.getElementById('modalProductTitle');
        document.getElementById('productId').value = product ? product.id : '';
        document.getElementById('productNameAr').value = product ? (product.name.ar || '') : '';
        document.getElementById('productNameEn').value = product ? (product.name.en || '') : '';
        document.getElementById('productDescAr').value = product ? (product.description && product.description.ar || '') : '';
        document.getElementById('productDescEn').value = product ? (product.description && product.description.en || '') : '';
        document.getElementById('productCategory').value = product ? (product.category || '') : (categories[0] ? categories[0].id : '');
        document.getElementById('productBrand').value = product && product.brand ? product.brand : '';
        document.getElementById('productPriceAr').value = product && product.price ? (product.price.ar || '') : '';
        document.getElementById('productPriceEn').value = product && product.price ? (product.price.en || '') : '';
        var icon = product ? (product.icon || '') : '';
        document.getElementById('productIconValue').value = icon;
        setIconPreview('productIconPreview', icon, 'productIconEmoji', 'productIconFile');
        document.getElementById('productFeatured').checked = !!(product && product.featured);
        title.textContent = product ? 'تعديل منتج' : 'إضافة منتج';
        document.getElementById('modalProduct').classList.add('open');
    }

    function openCategoryModal(cat) {
        var title = document.getElementById('modalCategoryTitle');
        document.getElementById('categoryId').value = cat ? cat.id : '';
        document.getElementById('categoryKey').value = cat ? cat.id : '';
        document.getElementById('categoryKey').readOnly = !!cat;
        document.getElementById('categoryNameAr').value = cat ? (cat.name.ar || '') : '';
        document.getElementById('categoryNameEn').value = cat ? (cat.name.en || '') : '';
        var icon = cat ? (cat.icon || '') : '';
        document.getElementById('categoryIconValue').value = icon;
        setIconPreview('categoryIconPreview', icon, 'categoryIconEmoji', 'categoryIconFile');
        document.getElementById('categoryOrder').value = cat ? (cat.order || 0) : categories.length;
        title.textContent = cat ? 'تعديل فئة' : 'إضافة فئة';
        document.getElementById('modalCategory').classList.add('open');
    }

    function closeModal(id) {
        var modal = document.getElementById(id);
        if (modal) modal.classList.remove('open');
    }

    var pendingConfirmCallback = null;

    function showConfirm(message, onConfirm, confirmOnly) {
        pendingConfirmCallback = onConfirm || null;
        var msgEl = document.getElementById('confirmMessage');
        var modal = document.getElementById('modalConfirm');
        var cancelBtn = document.getElementById('confirmCancel');
        var okBtn = document.getElementById('confirmOk');
        if (msgEl) msgEl.textContent = message;
        if (cancelBtn) cancelBtn.style.display = confirmOnly ? 'none' : '';
        if (okBtn) okBtn.textContent = confirmOnly ? 'موافق' : 'تأكيد';
        if (modal) modal.classList.add('open');
    }

    function closeConfirmModal() {
        document.getElementById('modalConfirm').classList.remove('open');
        pendingConfirmCallback = null;
    }

    document.getElementById('confirmOk').addEventListener('click', function() {
        if (typeof pendingConfirmCallback === 'function') pendingConfirmCallback();
        closeConfirmModal();
    });
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmClose').addEventListener('click', closeConfirmModal);
    document.getElementById('modalConfirm').addEventListener('click', function(e) {
        if (e.target === this) closeConfirmModal();
    });

    function renderAuditTable() {
        var tbody = document.getElementById('auditTableBody');
        if (!tbody) return;
        var log = getAuditLog();
        var actionLabels = { add: 'إضافة', edit: 'تعديل', delete: 'حذف', import_csv: 'استيراد CSV' };
        var typeLabels = { product: 'منتج', category: 'فئة', brand: 'ماركة', contact: 'اتصل بنا' };
        tbody.innerHTML = log.map(function(entry) {
            var d = new Date(entry.timestamp);
            var timeStr = d.toLocaleDateString('ar-EG') + ' ' + d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            return '<tr><td>' + timeStr + '</td><td>' + (actionLabels[entry.action] || entry.action) + '</td><td>' + (typeLabels[entry.entityType] || entry.entityType) + '</td><td>' + (entry.entityName || entry.entityId || '-') + '</td><td>' + (entry.username || '-') + '</td></tr>';
        }).join('');
    }

    if (currentUser) {
        var nameEl = document.getElementById('adminUserName');
        if (nameEl) nameEl.textContent = 'مرحباً، ' + (currentUser.displayName || currentUser.username);
        var logoutEl = document.getElementById('adminLogout');
        if (logoutEl) {
            logoutEl.addEventListener('click', function(e) {
                e.preventDefault();
                clearCurrentUser();
                window.location.href = 'login.html';
            });
        }
    }

    function exportBackup() {
        var data = {
            exportDate: new Date().toISOString(),
            products: products,
            categories: categories,
            brands: brands,
            contact: contact,
            audit: getAuditLog()
        };
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'alramzy-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function restoreBackup(file) {
        var reader = new FileReader();
        reader.onload = function() {
            try {
                var data = JSON.parse(reader.result);
                if (!data) throw new Error('ملف فارغ');
                if (Array.isArray(data.products)) saveProducts(data.products);
                if (Array.isArray(data.categories)) saveCategories(data.categories);
                if (Array.isArray(data.brands)) saveBrands(data.brands);
                if (Array.isArray(data.contact)) saveContact(data.contact);
                if (Array.isArray(data.audit)) saveAuditLog(data.audit);
                var payload = { action: 'save', products: data.products || [], categories: data.categories || [], brands: data.brands || [], contact: data.contact || [], audit: data.audit || [] };
                if (typeof saveToServer === 'function') {
                    saveToServer(payload).then(function() {
                        alert('تمت استعادة النسخة الاحتياطية على السيرفر. جاري إعادة تحميل الصفحة.');
                        window.location.reload();
                    }).catch(function() {
                        alert('تمت الاستعادة محلياً. تعذّر الحفظ على السيرفر.');
                        window.location.reload();
                    });
                } else {
                    alert('تمت استعادة النسخة الاحتياطية. جاري إعادة تحميل الصفحة.');
                    window.location.reload();
                }
            } catch (err) {
                alert('فشلت الاستعادة: ' + (err.message || 'ملف غير صالح'));
            }
        };
        reader.readAsText(file, 'UTF-8');
    }

    var btnExport = document.getElementById('btnExportBackup');
    if (btnExport) btnExport.addEventListener('click', exportBackup);
    var importBackup = document.getElementById('importBackupInput');
    if (importBackup) importBackup.addEventListener('change', function() {
        var file = this.files && this.files[0];
        this.value = '';
        if (file) restoreBackup(file);
    });

    document.getElementById('btnAddProduct').addEventListener('click', function() {
        fillCategorySelect();
        fillBrandSelect();
        openProductModal(null);
    });

    var btnDeleteAll = document.getElementById('btnDeleteAllProducts');
    if (btnDeleteAll) btnDeleteAll.addEventListener('click', function() {
        if (!products.length) {
            alert('لا توجد منتجات للحذف.');
            return;
        }
        showConfirm('سيتم حذف جميع المنتجات (' + products.length + ') نهائياً من السيرفر. هل أنت متأكد؟', function() {
            var username = currentUser ? currentUser.username : '';
            addAuditEntry('delete', 'product', 'all', 'حذف جميع المنتجات', username);
            products = [];
            persistProducts();
            renderProductsTable();
        });
    });

    /** فك ترميز CSV: UTF-8 أو Windows-1256 (Excel العربي) */
    function decodeCsvFileBytes(buffer) {
        var u8 = new Uint8Array(buffer);
        var arabicCount = function(str) {
            if (!str) return 0;
            var m = str.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\ufb50-\ufdff\ufe70-\ufefc]/g);
            return m ? m.length : 0;
        };
        var start = 0;
        if (u8.length >= 3 && u8[0] === 0xEF && u8[1] === 0xBB && u8[2] === 0xBF) start = 3;
        var body = u8.subarray(start);
        var utf8 = new TextDecoder('utf-8', { fatal: false }).decode(body);
        var nUtf = arabicCount(utf8);
        var n1256 = 0;
        var cp1256Text = '';
        try {
            cp1256Text = new TextDecoder('windows-1256').decode(body);
            n1256 = arabicCount(cp1256Text);
        } catch (e) {
            try {
                cp1256Text = new TextDecoder('windows-1256').decode(u8);
                n1256 = arabicCount(cp1256Text);
            } catch (e2) {}
        }
        try {
            var alt = new TextDecoder('windows-1256').decode(u8);
            var nAlt = arabicCount(alt);
            if (nAlt > n1256) {
                n1256 = nAlt;
                cp1256Text = alt;
            }
        } catch (e3) {}
        if (n1256 > nUtf) return cp1256Text;
        return utf8;
    }

    function parseCSVLine(line) {
        var out = [];
        var i = 0;
        while (i < line.length) {
            if (line.charAt(i) === '"') {
                i++;
                var s = '';
                while (i < line.length && line.charAt(i) !== '"') {
                    if (line.charAt(i) === '\\') i++;
                    s += line.charAt(i++);
                }
                if (line.charAt(i) === '"') i++;
                out.push(s);
                if (line.charAt(i) === ',') i++;
            } else {
                var j = line.indexOf(',', i);
                if (j === -1) j = line.length;
                out.push(line.substring(i, j).trim());
                i = j + 1;
            }
        }
        return out;
    }

    function parseCSV(text) {
        var t = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
        return t.split('\n').filter(function(line) { return line.length; }).map(parseCSVLine);
    }

    function indexOfHeader(headers, name) {
        var n = name.toLowerCase();
        for (var i = 0; i < headers.length; i++) {
            if (String(headers[i]).trim().toLowerCase() === n) return i;
        }
        return -1;
    }

    function simpleHashStr(str) {
        var h = 5381;
        for (var i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
        return (h >>> 0);
    }

    /** يطابق فئة موجودة أو ينشئ فئة جديدة من قيمة عمود category في CSV */
    function resolveOrCreateCategoryFromCsv(raw) {
        var t = String(raw || '').trim();
        if (!t) return categories[0] ? categories[0].id : 'misc';
        var key = t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (key.length > 0) {
            var existing = categories.find(function(c) { return c.id === key; });
            if (existing) return key;
            var ord = categories.reduce(function(m, c) { return Math.max(m, c.order || 0); }, 0) + 1;
            categories.push({ id: key, name: { ar: t, en: t }, icon: '📦', order: ord });
            categories.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
            return key;
        }
        var byName = categories.find(function(c) {
            var ar = c.name && c.name.ar ? c.name.ar.trim() : '';
            var en = c.name && c.name.en ? c.name.en.trim() : '';
            return ar === t || (en && en.toLowerCase() === t.toLowerCase());
        });
        if (byName) return byName.id;
        var newId = 'cat_' + simpleHashStr(t).toString(36);
        var tries = 0;
        while (categories.some(function(c) { return c.id === newId; }) && tries < 20) {
            newId = 'cat_' + simpleHashStr(t + String(tries++)).toString(36);
        }
        var ord2 = categories.reduce(function(m, c) { return Math.max(m, c.order || 0); }, 0) + 1;
        categories.push({ id: newId, name: { ar: t, en: t }, icon: '📦', order: ord2 });
        categories.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
        return newId;
    }

    /** يطابق ماركة موجودة أو ينشئ ماركة جديدة من قيمة عمود brand في CSV */
    function resolveOrCreateBrandFromCsv(raw) {
        var t = String(raw || '').trim();
        if (!t) return undefined;
        var key = t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (key.length > 0) {
            var existing = brands.find(function(b) { return b.id === key; });
            if (existing) return key;
            brands.push({ id: key, name: { ar: t, en: t } });
            return key;
        }
        var byName = brands.find(function(b) {
            var ar = b.name && b.name.ar ? b.name.ar.trim() : '';
            var en = b.name && b.name.en ? b.name.en.trim() : '';
            return ar === t || (en && en.toLowerCase() === t.toLowerCase());
        });
        if (byName) return byName.id;
        var newId = 'brand_' + simpleHashStr(t).toString(36);
        var tries = 0;
        while (brands.some(function(b) { return b.id === newId; }) && tries < 20) {
            newId = 'brand_' + simpleHashStr(t + String(tries++)).toString(36);
        }
        brands.push({ id: newId, name: { ar: t, en: t } });
        return newId;
    }

    function importProductsFromCSV(csvText) {
        var rows = parseCSV(csvText);
        if (!rows.length) return { products: [], errors: ['الملف فارغ'] };
        var headers = rows[0].map(function(h) { return String(h).trim(); });
        var nameArIdx = indexOfHeader(headers, 'name_ar');
        var nameEnIdx = indexOfHeader(headers, 'name_en');
        if (nameArIdx < 0 && nameEnIdx < 0) return { products: [], errors: ['لم يتم العثور على أعمدة name_ar أو name_en'] };
        var descArIdx = indexOfHeader(headers, 'desc_ar');
        var descEnIdx = indexOfHeader(headers, 'desc_en');
        var categoryIdx = indexOfHeader(headers, 'category');
        var brandIdx = indexOfHeader(headers, 'brand');
        var priceArIdx = indexOfHeader(headers, 'price_ar');
        var priceEnIdx = indexOfHeader(headers, 'price_en');
        var iconIdx = indexOfHeader(headers, 'icon');
        var list = [];
        var errors = [];
        for (var r = 1; r < rows.length; r++) {
            var row = rows[r];
            var nameAr = nameArIdx >= 0 && row[nameArIdx] !== undefined ? String(row[nameArIdx]).trim() : '';
            var nameEn = nameEnIdx >= 0 && row[nameEnIdx] !== undefined ? String(row[nameEnIdx]).trim() : '';
            if (!nameAr && !nameEn) continue;
            var catRaw = categoryIdx >= 0 && row[categoryIdx] !== undefined ? String(row[categoryIdx]).trim() : '';
            var cat = resolveOrCreateCategoryFromCsv(catRaw || (categories[0] ? categories[0].id : ''));
            var brandRaw = brandIdx >= 0 && row[brandIdx] !== undefined ? String(row[brandIdx]).trim() : '';
            var brand = brandRaw ? resolveOrCreateBrandFromCsv(brandRaw) : undefined;
            var icon = iconIdx >= 0 && row[iconIdx] !== undefined ? String(row[iconIdx]).trim() : '📦';
            if (!icon) icon = '📦';
            var isImg = icon.indexOf('data:image') === 0 || icon.indexOf('http://') === 0 || icon.indexOf('https://') === 0;
            if (!isImg && icon.length > 4) icon = icon.slice(0, 4);
            list.push({
                name: { ar: nameAr || nameEn, en: nameEn || nameAr },
                description: { ar: (descArIdx >= 0 && row[descArIdx] !== undefined ? String(row[descArIdx]).trim() : '') || '', en: (descEnIdx >= 0 && row[descEnIdx] !== undefined ? String(row[descEnIdx]).trim() : '') || '' },
                category: cat,
                brand: brand || undefined,
                price: { ar: (priceArIdx >= 0 && row[priceArIdx] !== undefined ? String(row[priceArIdx]).trim() : '') || '', en: (priceEnIdx >= 0 && row[priceEnIdx] !== undefined ? String(row[priceEnIdx]).trim() : '') || '' },
                icon: icon
            });
        }
        return { products: list, errors: errors };
    }

    var importCsvEl = document.getElementById('importCsvInput');
    if (importCsvEl) importCsvEl.addEventListener('change', function() {
        var file = this.files && this.files[0];
        this.value = '';
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function() {
            var csvText = decodeCsvFileBytes(reader.result);
            var result = importProductsFromCSV(csvText);
            if (result.errors.length) {
                alert('أخطاء: ' + result.errors.join('\n'));
                return;
            }
            if (!result.products.length) {
                alert('لم يتم العثور على صفوف منتجات صالحة في الملف.');
                return;
            }
            var nextId = getNextProductId(products);
            result.products.forEach(function(p) {
                p.id = nextId++;
                products.push(p);
            });
            var username = currentUser ? currentUser.username : '';
            addAuditEntry('import_csv', 'product', '', 'استيراد ' + result.products.length + ' منتج', username);
            compressAllIcons().then(function() {
                try {
                    saveCategories(categories);
                    saveBrands(brands);
                    persistProducts();
                    renderProductsTable();
                    renderCategoriesTable();
                    renderBrandsTable();
                    fillCategorySelect();
                    fillBrandSelect();
                    alert('تم استيراد ' + result.products.length + ' منتج بنجاح. تم إنشاء أي فئات أو ماركات جديدة من الملف تلقائياً.');
                } catch (err) {
                    if (err && err.name === 'QuotaExceededError') {
                        alert('مساحة التخزين ممتلئة. قلّل عدد المنتجات أو أحجام الصور في الملف.');
                    } else throw err;
                }
            });
        };
        reader.readAsArrayBuffer(file);
    });

    document.getElementById('downloadCsvTemplate').addEventListener('click', function(e) {
        e.preventDefault();
        var header = 'name_ar,name_en,desc_ar,desc_en,category,brand,price_ar,price_en,icon';
        var row1 = 'فلتر زيت محرك,Engine Oil Filter,فلتر زيت عالي الجودة,High-quality oil filter,engine,mercedes,450 ج.م,450 EGP,🚛';
        var row2 = 'منتج مثال مع صورة,Product with image URL,وصف,Description,engine,volvo,500 ج.م,500 EGP,https://example.com/product-icon.png';
        var csv = '\uFEFF' + header + '\n' + row1 + '\n' + row2 + '\n';
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'products-template.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    });

    document.getElementById('btnAddCategory').addEventListener('click', function() {
        openCategoryModal(null);
    });

    document.getElementById('btnAddBrand').addEventListener('click', function() {
        openBrandModal(null);
    });

    document.getElementById('btnAddContact').addEventListener('click', function() {
        openContactModal(null);
    });

    document.getElementById('productIconEmoji').addEventListener('input', function() {
        var v = this.value.trim();
        document.getElementById('productIconValue').value = v;
        setIconPreview('productIconPreview', v, null, 'productIconFile');
    });
    document.getElementById('productIconFile').addEventListener('change', function() {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function() {
            compressIconDataUrl(r.result).then(function(compressed) {
                document.getElementById('productIconValue').value = compressed;
                setIconPreview('productIconPreview', compressed, 'productIconEmoji', 'productIconFile');
            });
        };
        r.readAsDataURL(f);
    });

    document.getElementById('categoryIconEmoji').addEventListener('input', function() {
        var v = this.value.trim();
        document.getElementById('categoryIconValue').value = v;
        setIconPreview('categoryIconPreview', v, null, 'categoryIconFile');
    });
    document.getElementById('categoryIconFile').addEventListener('change', function() {
        var f = this.files && this.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function() {
            compressIconDataUrl(r.result).then(function(compressed) {
                document.getElementById('categoryIconValue').value = compressed;
                setIconPreview('categoryIconPreview', compressed, 'categoryIconEmoji', 'categoryIconFile');
            });
        };
        r.readAsDataURL(f);
    });

    document.getElementById('formProduct').addEventListener('submit', function(e) {
        e.preventDefault();
        var id = document.getElementById('productId').value;
        var nameAr = document.getElementById('productNameAr').value.trim();
        var nameEn = document.getElementById('productNameEn').value.trim();
        var descAr = document.getElementById('productDescAr').value.trim();
        var descEn = document.getElementById('productDescEn').value.trim();
        var category = document.getElementById('productCategory').value;
        var brandVal = document.getElementById('productBrand').value;
        var brand = brandVal || undefined;
        var priceAr = document.getElementById('productPriceAr').value.trim();
        var priceEn = document.getElementById('productPriceEn').value.trim();
        var iconVal = document.getElementById('productIconValue').value.trim();
        var icon = iconVal || '📦';
        if (!isIconImage(icon) && icon.length > 4) icon = icon.slice(0, 4);
        var featured = document.getElementById('productFeatured').checked;

        var username = currentUser ? currentUser.username : '';
        if (id) {
            var idx = products.findIndex(function(p) { return String(p.id) === id; });
            if (idx !== -1) {
                products[idx] = {
                    id: products[idx].id,
                    name: { ar: nameAr, en: nameEn },
                    description: { ar: descAr, en: descEn },
                    category: category,
                    brand: brand,
                    price: { ar: priceAr, en: priceEn },
                    icon: icon,
                    featured: featured
                };
                addAuditEntry('edit', 'product', id, nameAr, username);
            }
        } else {
            var newId = getNextProductId(products);
            products.push({
                id: newId,
                name: { ar: nameAr, en: nameEn },
                description: { ar: descAr, en: descEn },
                category: category,
                brand: brand,
                price: { ar: priceAr, en: priceEn },
                icon: icon,
                featured: featured
            });
            addAuditEntry('add', 'product', newId, nameAr, username);
        }
        compressAllIcons().then(function() {
            try {
                persistProducts();
                renderProductsTable();
                closeModal('modalProduct');
            } catch (err) {
                if (err && err.name === 'QuotaExceededError') {
                    alert('مساحة التخزين ممتلئة. جرّب حذف صور من بعض المنتجات أو استخدام صور أصغر.');
                } else {
                    throw err;
                }
            }
        });
    });

    document.getElementById('formCategory').addEventListener('submit', function(e) {
        e.preventDefault();
        var existingId = document.getElementById('categoryId').value;
        var key = document.getElementById('categoryKey').value.trim().toLowerCase().replace(/\s+/g, '_');
        var nameAr = document.getElementById('categoryNameAr').value.trim();
        var nameEn = document.getElementById('categoryNameEn').value.trim();
        var iconVal = document.getElementById('categoryIconValue').value.trim();
        var icon = iconVal || '📦';
        if (!isIconImage(icon)) icon = icon.slice(0, 4);
        var order = parseInt(document.getElementById('categoryOrder').value, 10) || 0;

        var username = currentUser ? currentUser.username : '';
        if (existingId) {
            var idx = categories.findIndex(function(c) { return c.id === existingId; });
            if (idx !== -1) {
                var oldId = categories[idx].id;
                categories[idx] = { id: oldId, name: { ar: nameAr, en: nameEn }, icon: icon, order: order };
                addAuditEntry('edit', 'category', oldId, nameAr, username);
            }
        } else {
            if (categories.some(function(c) { return c.id === key; })) {
                alert('المعرف موجود مسبقاً. اختر معرفاً آخر.');
                return;
            }
            categories.push({ id: key, name: { ar: nameAr, en: nameEn }, icon: icon, order: order });
            categories.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
            addAuditEntry('add', 'category', key, nameAr, username);
        }
        compressAllIcons().then(function() {
            try {
                persistProducts();
                persistCategories();
                renderCategoriesTable();
                fillCategorySelect();
                fillBrandSelect();
                closeModal('modalCategory');
            } catch (err) {
                if (err && err.name === 'QuotaExceededError') {
                    alert('مساحة التخزين ممتلئة. جرّب حذف صور من بعض المنتجات أو الفئات أو استخدام صور أصغر.');
                } else {
                    throw err;
                }
            }
        });
    });

    document.getElementById('formBrand').addEventListener('submit', function(e) {
        e.preventDefault();
        var existingId = document.getElementById('brandIdOriginal').value;
        var key = document.getElementById('brandKey').value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        var nameAr = document.getElementById('brandNameAr').value.trim();
        var nameEn = document.getElementById('brandNameEn').value.trim();
        var image = document.getElementById('brandImage').value.trim();
        var username = currentUser ? currentUser.username : '';
        if (existingId) {
            var idx = brands.findIndex(function(b) { return b.id === existingId; });
            if (idx !== -1) {
                brands[idx] = { id: existingId, name: { ar: nameAr, en: nameEn }, image: image || undefined };
                addAuditEntry('edit', 'brand', existingId, nameAr, username);
            }
        } else {
            if (brands.some(function(b) { return b.id === key; })) {
                alert('المعرف موجود مسبقاً. اختر معرفاً آخر.');
                return;
            }
            brands.push({ id: key, name: { ar: nameAr, en: nameEn }, image: image || undefined });
            addAuditEntry('add', 'brand', key, nameAr, username);
        }
        persistBrands();
        renderBrandsTable();
        fillBrandSelect();
        closeModal('modalBrand');
    });

    document.getElementById('formContact').addEventListener('submit', function(e) {
        e.preventDefault();
        var id = document.getElementById('contactItemId').value;
        var type = document.getElementById('contactType').value;
        var titleAr = document.getElementById('contactTitleAr').value.trim();
        var titleEn = document.getElementById('contactTitleEn').value.trim();
        var valueAr = document.getElementById('contactValueAr').value.trim();
        var valueEn = document.getElementById('contactValueEn').value.trim();
        var link = document.getElementById('contactLink').value.trim();
        var username = currentUser ? currentUser.username : '';
        var item = {
            type: type,
            title: { ar: titleAr, en: titleEn },
            value: { ar: valueAr, en: valueEn },
            link: type === 'link' ? link : undefined
        };
        if (id) {
            var idx = contact.findIndex(function(c) { return String(c.id) === id; });
            if (idx !== -1) {
                item.id = contact[idx].id;
                contact[idx] = item;
                addAuditEntry('edit', 'contact', item.id, titleAr, username);
            }
        } else {
            item.id = getNextContactId();
            contact.push(item);
            addAuditEntry('add', 'contact', item.id, titleAr, username);
        }
        persistContact();
        renderContactTable();
        closeModal('modalContact');
    });

    document.querySelectorAll('[data-close]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            closeModal(btn.getAttribute('data-close'));
        });
    });

    document.getElementById('productsTableBody').addEventListener('click', function(e) {
        var id = e.target.getAttribute('data-product-id');
        var del = e.target.getAttribute('data-product-delete');
        if (id) {
            var p = products.find(function(x) { return String(x.id) === id; });
            if (p) { fillCategorySelect(); fillBrandSelect(); openProductModal(p); }
        } else if (del) {
            showConfirm('حذف هذا المنتج؟', function() {
                var prod = products.find(function(p) { return String(p.id) === del; });
                var name = prod && prod.name ? prod.name.ar : del;
                products = products.filter(function(p) { return String(p.id) !== del; });
                addAuditEntry('delete', 'product', del, name, currentUser ? currentUser.username : '');
                persistProducts();
                renderProductsTable();
            });
        }
    });

    document.getElementById('categoriesTableBody').addEventListener('click', function(e) {
        var id = e.target.getAttribute('data-category-id');
        var del = e.target.getAttribute('data-category-delete');
        if (id) {
            var c = categories.find(function(x) { return x.id === id; });
            if (c) openCategoryModal(c);
        } else if (del) {
            var count = products.filter(function(p) { return p.category === del; }).length;
            if (count > 0) {
                showConfirm('لا يمكن حذف الفئة: يوجد ' + count + ' منتج مرتبط. غيّر منتجاتهم لفئة أخرى أولاً.', function() {}, true);
                return;
            }
            showConfirm('حذف هذه الفئة؟', function() {
                var cat = categories.find(function(c) { return c.id === del; });
                var catName = cat && cat.name ? cat.name.ar : del;
                categories = categories.filter(function(c) { return c.id !== del; });
                addAuditEntry('delete', 'category', del, catName, currentUser ? currentUser.username : '');
                persistCategories();
                renderCategoriesTable();
                fillCategorySelect();
            });
        }
    });

    document.getElementById('brandsTableBody').addEventListener('click', function(e) {
        var id = e.target.getAttribute('data-brand-id');
        var del = e.target.getAttribute('data-brand-delete');
        if (id) {
            var b = brands.find(function(x) { return x.id === id; });
            if (b) openBrandModal(b);
        } else if (del) {
            var count = products.filter(function(p) { return p.brand === del; }).length;
            showConfirm(count > 0 ? 'هذه الماركة مرتبطة بـ ' + count + ' منتج. حذفها سيُبقي المنتجات بدون ماركة. متابعة؟' : 'حذف هذه الماركة؟', function() {
                var brand = brands.find(function(b) { return b.id === del; });
                var name = brand && brand.name ? brand.name.ar : del;
                brands = brands.filter(function(b) { return b.id !== del; });
                addAuditEntry('delete', 'brand', del, name, currentUser ? currentUser.username : '');
                persistBrands();
                renderBrandsTable();
                fillBrandSelect();
            });
        }
    });

    document.getElementById('contactTableBody').addEventListener('click', function(e) {
        var id = e.target.getAttribute('data-contact-id');
        var del = e.target.getAttribute('data-contact-delete');
        if (id) {
            var c = contact.find(function(x) { return String(x.id) === id; });
            if (c) openContactModal(c);
        } else if (del) {
            showConfirm('حذف هذا العنصر؟', function() {
                var item = contact.find(function(c) { return String(c.id) === del; });
                var name = item && item.title ? item.title.ar : del;
                contact = contact.filter(function(c) { return String(c.id) !== del; });
                addAuditEntry('delete', 'contact', del, name, currentUser ? currentUser.username : '');
                persistContact();
                renderContactTable();
            });
        }
    });

    document.querySelectorAll('.admin-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var t = this.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab').forEach(function(x) { x.classList.remove('active'); });
            document.querySelectorAll('.admin-tab-panel').forEach(function(x) { x.classList.remove('active'); });
            this.classList.add('active');
            var panel = document.getElementById('tab-' + t);
            if (panel) panel.classList.add('active');
            if (t === 'audit') renderAuditTable();
            if (t === 'brands') renderBrandsTable();
            if (t === 'contact') renderContactTable();
        });
    });

    document.getElementById('modalProduct').addEventListener('click', function(e) {
        if (e.target === this) closeModal('modalProduct');
    });
    document.getElementById('modalCategory').addEventListener('click', function(e) {
        if (e.target === this) closeModal('modalCategory');
    });
    document.getElementById('modalBrand').addEventListener('click', function(e) {
        if (e.target === this) closeModal('modalBrand');
    });
    document.getElementById('modalContact').addEventListener('click', function(e) {
        if (e.target === this) closeModal('modalContact');
    });

    function initAfterLoad() {
        load();
        fillCategorySelect();
        fillBrandSelect();
        renderProductsTable();
        renderCategoriesTable();
    }

    if (typeof loadFromServer === 'function') {
        loadFromServer().then(function(data) {
            if (data) {
                if (Array.isArray(data.products)) saveProducts(data.products);
                if (Array.isArray(data.categories)) saveCategories(data.categories);
                if (Array.isArray(data.brands)) saveBrands(data.brands);
                if (Array.isArray(data.contact)) saveContact(data.contact);
                if (Array.isArray(data.audit)) saveAuditLog(data.audit);
            }
            initAfterLoad();
        }).catch(function() {
            initAfterLoad();
        });
    } else {
        initAfterLoad();
    }
})();
