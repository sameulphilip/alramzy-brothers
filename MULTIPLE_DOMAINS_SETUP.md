# إعداد عدة دومينات على نفس السيرفر

## نعم، يمكنك ربط أكثر من دومين بمواقع مختلفة على نفس السيرفر!

### الطريقة الصحيحة: استخدام Document Root مختلف لكل دومين

## الخطوات:

### 1. إضافة دومين جديد في Hostinger:

#### أ. إضافة الدومين:
- في hPanel، اذهب إلى "Domains" أو "Add Domain"
- اضغط "Add Domain" أو "إضافة دومين"
- أدخل اسم الدومين الجديد
- أكمل عملية الإضافة

#### ب. ربط الدومين بالسيرفر:
- بعد إضافة الدومين، سيتم إنشاء مجلد له تلقائياً
- عادة يكون في: `public_html/domain2.com/`
- أو يمكنك تحديد مسار مخصص

---

### 2. إعداد Document Root لكل دومين:

#### للدومين الأول (Al Ramzy Brothers):
- اذهب إلى Domain Settings للدومين الأول
- غيّر Document Root إلى: `/var/www/AL Ramzy Brothers`
- أو: `public_html/al-ramzy-brothers`

#### للدومين الثاني:
- اذهب إلى Domain Settings للدومين الثاني
- غيّر Document Root إلى: `/var/www/Website2`
- أو: `public_html/website2`

#### للدومين الثالث:
- اذهب إلى Domain Settings للدومين الثالث
- غيّر Document Root إلى: `/var/www/Website3`
- أو: `public_html/website3`

---

### 3. هيكل الملفات الموصى به:

```
/var/www/
├── AL Ramzy Brothers/
│   ├── index.html
│   ├── product.html
│   ├── styles.css
│   ├── script.js
│   ├── product.js
│   ├── logo.png
│   ├── hero-slide-1.jpg
│   └── hero-slide-2.jpg
│
├── Website2/
│   ├── index.html
│   └── ...
│
└── Website3/
    ├── index.html
    └── ...
```

**أو:**

```
public_html/
├── al-ramzy-brothers/
│   ├── index.html
│   └── ...
│
├── website2/
│   ├── index.html
│   └── ...
│
└── website3/
    ├── index.html
    └── ...
```

---

## خطوات الإعداد التفصيلية:

### الخطوة 1: إضافة الدومين في hPanel

1. سجل الدخول إلى hPanel
2. اذهب إلى "Domains" → "Add Domain"
3. أدخل اسم الدومين الجديد
4. اختر "Add Domain" أو "إضافة"

### الخطوة 2: تحديد Document Root لكل دومين

#### للدومين الأول (Al Ramzy Brothers):
1. اذهب إلى "Domains" → اختر الدومين الأول
2. ابحث عن "Document Root" أو "Website Root"
3. غيّر إلى: `/var/www/AL Ramzy Brothers`
4. احفظ

#### للدومين الثاني:
1. اذهب إلى "Domains" → اختر الدومين الثاني
2. ابحث عن "Document Root"
3. غيّر إلى: `/var/www/Website2` (أو المسار الذي تريده)
4. احفظ

### الخطوة 3: رفع ملفات كل موقع

- **الموقع الأول**: ارفع الملفات إلى `/var/www/AL Ramzy Brothers`
- **الموقع الثاني**: ارفع الملفات إلى `/var/www/Website2`
- **الموقع الثالث**: ارفع الملفات إلى `/var/www/Website3`

---

## مثال عملي:

### الموقع 1: Al Ramzy Brothers
- **الدومين**: `alramzybrothers.com`
- **Document Root**: `/var/www/AL Ramzy Brothers`
- **الملفات**: موجودة في `/var/www/AL Ramzy Brothers/`

### الموقع 2: موقع آخر
- **الدومين**: `example2.com`
- **Document Root**: `/var/www/Website2`
- **الملفات**: موجودة في `/var/www/Website2/`

### الموقع 3: موقع ثالث
- **الدومين**: `example3.com`
- **Document Root**: `/var/www/Website3`
- **الملفات**: موجودة في `/var/www/Website3/`

---

## ملاحظات مهمة:

### 1. المسافات في أسماء المجلدات:
- ⚠️ **مشكلة**: المسافات في `/var/www/AL Ramzy Brothers` قد تسبب مشاكل
- ✅ **الحل**: استخدم `AL-Ramzy-Brothers` أو `AL_Ramzy_Brothers` بدلاً من المسافات

### 2. الصلاحيات:
- تأكد من أن كل مجلد له صلاحيات 755
- تأكد من أن الملفات لها صلاحيات 644

### 3. SSL Certificate:
- كل دومين يحتاج SSL Certificate منفصل
- في Hostinger، عادة يتم تفعيل SSL تلقائياً لكل دومين

### 4. الاستضافة:
- تأكد من أن خطة الاستضافة تدعم عدة دومينات
- معظم خطط Hostinger تدعم دومينات متعددة

---

## طريقة بديلة: استخدام Subdomains

إذا كان لديك دومين رئيسي واحد، يمكنك استخدام Subdomains:

### مثال:
- الدومين الرئيسي: `yourdomain.com`
- Subdomain 1: `alramzy.yourdomain.com` → يشير إلى `/var/www/AL Ramzy Brothers`
- Subdomain 2: `site2.yourdomain.com` → يشير إلى `/var/www/Website2`

### الخطوات:
1. في hPanel، اذهب إلى "Subdomains"
2. أنشئ Subdomain جديد
3. حدد Document Root له

---

## التحقق من الإعداد:

بعد إعداد كل دومين:

1. ✅ افتح `https://domain1.com` → يجب أن يظهر الموقع الأول
2. ✅ افتح `https://domain2.com` → يجب أن يظهر الموقع الثاني
3. ✅ افتح `https://domain3.com` → يجب أن يظهر الموقع الثالث

---

## حل المشاكل الشائعة:

### المشكلة 1: الدومين الثاني يظهر نفس محتوى الأول
**الحل:**
- تأكد من تغيير Document Root للدومين الثاني
- انتظر 5-10 دقائق بعد التغيير

### المشكلة 2: أخطاء 404 على الدومين الثاني
**الحل:**
- تأكد من وجود `index.html` في مجلد الدومين الثاني
- تحقق من الصلاحيات

### المشكلة 3: SSL لا يعمل على الدومين الثاني
**الحل:**
- في hPanel، اذهب إلى "SSL"
- فعّل SSL للدومين الثاني
- أو استخدم "Auto SSL" إذا كان متاحاً

---

## نصائح:

1. **التنظيم**: استخدم أسماء مجلدات واضحة لكل موقع
2. **النسخ الاحتياطي**: احتفظ بنسخة احتياطية لكل موقع
3. **الاختبار**: اختبر كل موقع بعد الإعداد
4. **الأمان**: تأكد من تفعيل SSL لكل دومين

---

## الخلاصة:

✅ **نعم، يمكنك ربط عدة دومينات بمواقع مختلفة على نفس السيرفر**

**الطريقة:**
1. أضف الدومينات في hPanel
2. غيّر Document Root لكل دومين ليشير إلى مجلد مختلف
3. ارفع ملفات كل موقع في مجلده المخصص

**المكان الموصى به:**
- `/var/www/AL-Ramzy-Brothers/` (بدون مسافات)
- `/var/www/Website2/`
- `/var/www/Website3/`

---

**بالتوفيق! 🚀**
