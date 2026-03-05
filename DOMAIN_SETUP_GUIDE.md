# دليل ربط الموقع بالدومين على Hostinger

## 📋 نظرة عامة

هذا الدليل يشرح كيفية ربط موقعك (Al Ramzy Brothers) بدومين على Hostinger خطوة بخطوة.

---

## ⚡ **إجابة سريعة: أنا في صفحة DNS / Nameservers، ماذا أفعل؟**

### ✅ **إذا كان الدومين من Hostinger (مثل `alramzybrothers.com`):**
**لا تفعل شيء في هذه الصفحة!** كل شيء مضبوط بشكل صحيح.

**الخطوة التالية المهمة:**
1. اذهب إلى **"Domains"** من القائمة الجانبية
2. اضغط على اسم الدومين `alramzybrothers.com`
3. ابحث عن **"Document Root"** أو **"Website Root"**
4. غيّره إلى: `/var/www/ALRamzyBrothers` أو `public_html`
5. احفظ التغييرات
6. ارفع ملفات الموقع في المجلد المحدد

**هذه هي الخطوة الأهم!** بدون تغيير Document Root، لن يعمل الموقع.

---

## 🚀 **إجابة سريعة: كيف أغير Document Root في Hostinger؟**

### **الطريقة الأسهل (موصى بها):** ⭐

**لا تحتاج لتغيير Document Root!** فقط:

1. في hPanel، اذهب إلى **"File Manager"**
2. افتح مجلد **`public_html`**
3. **ارفع جميع ملفات الموقع** هناك مباشرة:
   - `index.html`
   - `product.html`
   - `styles.css`
   - `script.js`
   - `product.js`
   - `logo.png`
   - `hero-slide-1.jpg`
   - `hero-slide-2.jpg`
4. **انتهى!** الموقع سيعمل تلقائياً من `public_html`

---

### **الطريقة الثانية: تغيير Document Root**

إذا أردت استخدام مجلد آخر (مثل `/var/www/ALRamzyBrothers`):

1. في hPanel، اذهب إلى **"Domains"** من القائمة الجانبية
2. **اضغط على اسم الدومين** `alramzybrothers.com`
3. في صفحة إعدادات الدومين، ابحث عن:
   - **"Document Root"** أو
   - **"Website Root"** أو
   - **"Document Directory"**
   - (قد يكون في تبويب "Advanced" أو "Settings")
4. **غيّر المسار** من `public_html` إلى:
   ```
   /var/www/ALRamzyBrothers
   ```
5. **احفظ التغييرات**
6. **ارفع الملفات** في المجلد الجديد

**⚠️ إذا لم تجد خيار Document Root:** استخدم الطريقة الأولى (ارفع الملفات في `public_html`)

---

### **الطريقة الثالثة: عبر PuTTY/SSH (بدون hPanel)** 🖥️

إذا لم يكن لديك hPanel أو تريد إعداد Document Root مباشرة من السيرفر:

1. **اتصل بالسيرفر عبر PuTTY** (SSH)
2. **حدد نوع السيرفر** (Apache أو Nginx)
3. **ابحث عن ملف Virtual Host** أو **أنشئ ملف جديد**:
   - Apache: `/etc/apache2/sites-available/alramzybrothers.com.conf`
   - Nginx: `/etc/nginx/sites-available/alramzybrothers.com`
4. **إذا لم يكن الملف موجوداً:** أنشئ ملف جديد (انظر التفاصيل أدناه)
5. **غيّر DocumentRoot** إلى `/var/www/ALRamzyBrothers`
6. **أعد تشغيل الخدمة** (`sudo systemctl restart apache2` أو `nginx`)

**📖 للتفاصيل الكاملة:** انظر قسم "إعداد Document Root عبر PuTTY/SSH" أدناه

**⚠️ إذا كان الملف غير موجود أو فارغ:** انظر قسم "إنشاء ملف Virtual Host جديد" أدناه

---

## ⚡ **حل سريع: `systemctl restart apache2` لا يعمل**

إذا كان الأمر `sudo systemctl restart apache2` لا يعمل، جرب:

```bash
# جرب هذه الأوامر بالترتيب:
sudo service apache2 restart
sudo /etc/init.d/apache2 restart
sudo apache2ctl restart

# إذا كان CentOS/RHEL:
sudo systemctl restart httpd
sudo service httpd restart

# أو إعادة التحميل بدلاً من إعادة التشغيل:
sudo systemctl reload apache2
sudo service apache2 reload
```

**📖 للتفاصيل الكاملة:** انظر قسم "حل مشكلة: systemctl restart apache2 لا يعمل" أدناه

---

## 🚀 **إذا كنت تستخدم Nginx (وليس Apache):**

### **إعداد Document Root في Nginx - خطوات سريعة:**

1. **ابحث عن ملف Configuration:**
   ```bash
   ls -la /etc/nginx/sites-available/
   ls -la /etc/nginx/conf.d/
   grep -r "alramzybrothers.com" /etc/nginx/
   ```

2. **إذا لم تجد الملف، أنشئ ملف جديد:**
   ```bash
   sudo nano /etc/nginx/sites-available/alramzybrothers.com
   ```

3. **الصق هذا المحتوى:**
   ```nginx
   server {
       listen 80;
       server_name alramzybrothers.com www.alramzybrothers.com;
       
       root /var/www/ALRamzyBrothers;
       index index.html index.htm;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       error_log /var/log/nginx/alramzybrothers_error.log;
       access_log /var/log/nginx/alramzybrothers_access.log;
   }
   ```

4. **فعّل الموقع (إذا كان في sites-available):**
   ```bash
   sudo ln -s /etc/nginx/sites-available/alramzybrothers.com /etc/nginx/sites-enabled/alramzybrothers.com
   ```

5. **تحقق من صحة الإعدادات:**
   ```bash
   sudo nginx -t
   ```

6. **أعد تشغيل Nginx:**
   ```bash
   sudo systemctl restart nginx
   # أو
   sudo service nginx restart
   # أو (أفضل - إعادة تحميل)
   sudo systemctl reload nginx
   ```

**📖 للتفاصيل الكاملة:** انظر قسم "إذا كان السيرفر يستخدم Nginx" أدناه

---

## 🔒 **إعداد SSL Certificate (HTTPS) للدومين**

### **الطريقة 1: استخدام SSL من Hostinger (الأسهل)** ⭐

1. في **hPanel**، اذهب إلى **"SSL"** أو **"Security"**
2. ابحث عن الدومين `alramzybrothers.com`
3. اضغط **"Install SSL"** أو **"Auto SSL"**
4. إذا كان متاح **"Auto SSL"**، فعّله (عادة مجاني)
5. انتظر 5-10 دقائق حتى يتم التفعيل

**📖 للتفاصيل الكاملة:** انظر قسم "إعداد SSL Certificate" أدناه

---

## 🔒 **إعداد SSL Certificate - خطوات سريعة:**

### **لـ Nginx:**

1. **احصل على SSL Certificate** (من Hostinger أو Let's Encrypt)
2. **عدّل ملف Nginx** لإضافة إعدادات SSL
3. **أضف إعادة توجيه من HTTP إلى HTTPS**
4. **أعد تحميل Nginx**

**📖 للتفاصيل الكاملة:** انظر قسم "إعداد SSL Certificate" أدناه

---

## ⚠️ **مشكلة: الدومين يفتح موقع آخر من السيرفر**

إذا كان الدومين `alramzybrothers.com` يفتح موقع آخر، هذا يعني أن هناك ملف configuration آخر يأخذ الأولوية. إليك الحل:

### **الحل السريع لـ Nginx:**

```bash
# 1. ابحث عن جميع الملفات التي تحتوي على alramzybrothers.com
grep -r "alramzybrothers.com" /etc/nginx/ 2>/dev/null

# 2. ابحث عن ملفات default
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/

# 3. تعطيل الملفات الافتراضية
sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-enabled/000-default

# 4. تأكد من تفعيل ملفك
sudo ln -sf /etc/nginx/sites-available/alramzybrothers.com /etc/nginx/sites-enabled/alramzybrothers.com

# 5. تحقق من الإعدادات
sudo nginx -t

# 6. أعد تحميل Nginx
sudo systemctl reload nginx
```

**📖 للتفاصيل الكاملة:** انظر قسم "حل مشكلة: الدومين يفتح موقع آخر" أدناه

---

## 🎯 الخطوات الأساسية

### 📍 **ماذا تفعل في صفحة DNS / Nameservers؟**

إذا كنت في صفحة **DNS / Nameservers** (كما في الصورة)، إليك ما يجب فعله:

#### ✅ **الحالة 1: إذا كان الدومين من Hostinger (مثل حالتك)**
**لا تحتاج لتغيير أي شيء في هذه الصفحة!**

- ✅ **Nameservers** (`ns1.dns-parking.com` و `ns2.dns-parking.com`) - صحيحة، لا تغيرها
- ✅ **A Record** (يشير إلى IP السيرفر مثل `84.32.84.32`) - صحيح، لا تغيره
- ✅ **CNAME للـ www** (يشير إلى `alramzybrothers.com`) - صحيح، لا تغيره
- ✅ **سجلات البريد الإلكتروني** (MX, TXT) - صحيحة، لا تغيرها

**الخطوة التالية:** اذهب إلى **"Domains"** → اختر الدومين → غيّر **Document Root** (انظر الخطوة 3)

---

#### ⚠️ **الحالة 2: إذا كان الدومين من خارج Hostinger**
**يجب تغيير Nameservers:**

1. في صفحة **DNS / Nameservers**، انسخ Nameservers الحالية:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
2. اذهب إلى موقع مزود الدومين (GoDaddy, Namecheap, إلخ)
3. غيّر Nameservers هناك إلى القيم التي نسختها
4. انتظر 24-48 ساعة حتى يتم التفعيل

---

#### 🔧 **متى تحتاج لتعديل DNS Records؟**

عادة **لا تحتاج** لتعديل شيء، لكن يمكنك:

- **إضافة A Record جديد:** إذا أردت ربط subdomain (مثل `shop.alramzybrothers.com`)
- **تعديل A Record:** إذا تغير IP السيرفر (نادراً)
- **إضافة CNAME:** إذا أردت ربط subdomain آخر

**⚠️ تحذير:** لا تحذف أو تعدل السجلات الموجودة إلا إذا كنت تعرف ما تفعل!

---

### الخطوة 1: إضافة الدومين في Hostinger

#### أ. إذا كان الدومين مشتري من Hostinger:
1. سجل الدخول إلى **hPanel** على: https://hpanel.hostinger.com/
2. اذهب إلى قسم **"Domains"** من القائمة الجانبية
3. إذا كان الدومين موجود بالفعل، ستجده في القائمة
4. إذا لم يكن موجود، اضغط **"Add Domain"** أو **"إضافة دومين"**

#### ب. إذا كان الدومين مشتري من مكان آخر (مثل GoDaddy, Namecheap):
1. سجل الدخول إلى **hPanel**
2. اذهب إلى **"Domains"** → **"Add Domain"**
3. أدخل اسم الدومين (مثل: `alramzybrothers.com`)
4. اختر **"Connect Existing Domain"** أو **"ربط دومين موجود"**
5. اتبع التعليمات لإضافة الدومين

---

### الخطوة 2: إعداد DNS (إذا كان الدومين من خارج Hostinger)

إذا كان الدومين مشتري من مكان آخر، يجب تغيير DNS:

#### أ. الحصول على DNS من Hostinger:
1. في hPanel، اذهب إلى **"Domains"**
2. اختر الدومين
3. ابحث عن **"Nameservers"** أو **"DNS"**
4. ستجد أسماء مثل:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
   - أو أسماء مشابهة

#### ب. تغيير DNS في مزود الدومين:
1. سجل الدخول إلى موقع مزود الدومين (GoDaddy, Namecheap, إلخ)
2. اذهب إلى إعدادات الدومين
3. ابحث عن **"DNS Settings"** أو **"Nameservers"**
4. غيّر Nameservers إلى القيم التي حصلت عليها من Hostinger
5. احفظ التغييرات
6. **انتظر 24-48 ساعة** حتى يتم التفعيل (عادة يكون أسرع)

---

### الخطوة 3: إعداد Document Root (المجلد الرئيسي) ⭐ **الأهم!**

هذه هي الخطوة الأهم! يجب ربط الدومين بمجلد الملفات:

---

## 📍 **دليل تفصيلي: كيفية تغيير Document Root في Hostinger**

### **الطريقة 1: من صفحة Domains (الأسهل)**

#### الخطوة 1: الوصول إلى إعدادات الدومين
1. في **hPanel**، ابحث في القائمة الجانبية عن **"Domains"** أو **"الدومينات"**
2. اضغط على **"Domains"**
3. ستجد قائمة بجميع الدومينات الخاصة بك
4. **اضغط على اسم الدومين** `alramzybrothers.com` (أو اسم الدومين الخاص بك)

#### الخطوة 2: البحث عن Document Root
بعد الضغط على الدومين، ستفتح صفحة إعدادات الدومين. ابحث عن:

- **"Document Root"** أو
- **"Website Root"** أو
- **"Document Directory"** أو
- **"المجلد الرئيسي"** أو
- **"Website Directory"**

**⚠️ ملاحظة:** قد يكون في:
- تبويب **"Advanced"** أو **"إعدادات متقدمة"**
- تبويب **"Settings"** أو **"الإعدادات"**
- قسم **"Domain Settings"** أو **"إعدادات الدومين"**
- في نفس الصفحة الرئيسية للدومين (اسكرول للأسفل)

**💡 نصيحة:** إذا لم تجده، جرب:
1. **اسكرول للأسفل** في صفحة إعدادات الدومين
2. ابحث عن كلمة **"Root"** أو **"Directory"** أو **"مجلد"**
3. افتح جميع التبويبات المتاحة (Advanced, Settings, إلخ)
4. استخدم البحث في الصفحة (Ctrl+F) وابحث عن "root"

#### الخطوة 3: تغيير المسار
1. ستجد حقل نصي يحتوي على المسار الحالي (عادة `public_html`)
2. **احذف المسار الحالي** واكتب المسار الجديد:

   **الخيار 1: استخدام المجلد المخصص (إذا كانت الملفات في `/var/www/ALRamzyBrothers`):**
   ```
   /var/www/ALRamzyBrothers
   ```
   
   **الخيار 2: استخدام public_html (الأسهل والأكثر موثوقية):**
   ```
   public_html
   ```
   
   **الخيار 3: استخدام مجلد فرعي في public_html:**
   ```
   public_html/al-ramzy-brothers
   ```

3. **احفظ التغييرات** (اضغط زر "Save" أو "حفظ" أو "Update")

---

### **الطريقة 2: من صفحة Websites (إذا كانت متاحة)**

بعض حسابات Hostinger لديها قسم **"Websites"**:

1. في hPanel، اذهب إلى **"Websites"** أو **"المواقع"**
2. اضغط على اسم الموقع أو الدومين
3. ابحث عن **"Document Root"** أو **"Website Root"**
4. غيّر المسار واحفظ

---

### **الطريقة 3: إذا لم تجد Document Root (الحل البديل)**

إذا لم تجد خيار Document Root في hPanel، يمكنك:

#### **الحل البديل: نقل الملفات إلى public_html**

1. في **File Manager**، اذهب إلى `public_html`
2. **ارفع جميع ملفات الموقع** مباشرة في `public_html/`
3. بهذه الطريقة، الموقع سيعمل تلقائياً من `public_html`

**الملفات المطلوبة:**
```
✅ index.html
✅ product.html
✅ styles.css
✅ script.js
✅ product.js
✅ logo.png
✅ hero-slide-1.jpg
✅ hero-slide-2.jpg
```

---

## 🎯 **ما هو المسار الصحيح الذي يجب استخدامه؟**

### **الخيار الأفضل: `public_html`** ⭐

**لماذا؟**
- ✅ يعمل دائماً في Hostinger
- ✅ أسهل في الإدارة
- ✅ لا يحتاج صلاحيات خاصة
- ✅ يعمل مع SSL تلقائياً

**كيف؟**
1. في File Manager، اذهب إلى `public_html`
2. ارفع جميع الملفات هناك
3. لا تحتاج لتغيير Document Root (سيكون `public_html` افتراضياً)

---

### **الخيار الثاني: `/var/www/ALRamzyBrothers`**

**متى تستخدمه؟**
- إذا كانت الملفات موجودة بالفعل في `/var/www/ALRamzyBrothers`
- إذا كنت تريد فصل الملفات عن `public_html`

**⚠️ تحذيرات:**
- قد تحتاج صلاحيات خاصة
- قد لا يعمل في بعض خطط Hostinger
- تأكد من وجود المجلد ورفع الملفات فيه

---

## ✅ **بعد تغيير Document Root:**

1. **انتظر 5-10 دقائق** حتى يتم تطبيق التغييرات
2. **تأكد من رفع الملفات** في المجلد المحدد
3. **اختبر الموقع** بفتح `https://yourdomain.com`
4. إذا لم يعمل، امسح الكاش (Ctrl+F5) وجرب مرة أخرى

---

## 🔍 **إذا لم تجد خيار Document Root:**

### **الحل: ارفع الملفات في public_html**

1. اذهب إلى **File Manager**
2. افتح مجلد `public_html`
3. ارفع جميع ملفات الموقع هناك
4. الموقع سيعمل تلقائياً!

**هذه هي الطريقة الأسهل والأكثر موثوقية!** 🎯

---

## 🖥️ **إعداد Document Root عبر PuTTY/SSH (بدون hPanel)**

إذا لم يكن لديك hPanel أو تريد إعداد Document Root مباشرة من السيرفر:

---

### **الخطوة 1: الاتصال بالسيرفر عبر PuTTY**

#### أ. تحميل PuTTY:
1. حمّل PuTTY من: https://www.putty.org/
2. أو استخدم أي برنامج SSH آخر (MobaXterm, WinSCP, إلخ)

#### ب. الاتصال بالسيرفر:
1. افتح PuTTY
2. أدخل بيانات الاتصال:
   - **Host Name (or IP address):** IP السيرفر أو `yourdomain.com`
   - **Port:** `22` (افتراضي لـ SSH)
   - **Connection type:** SSH
3. اضغط **"Open"**
4. أدخل اسم المستخدم وكلمة المرور عند الطلب

**💡 ملاحظة:** يمكنك الحصول على بيانات SSH من:
- لوحة تحكم Hostinger (إذا كانت متاحة)
- البريد الإلكتروني الذي أرسلته Hostinger عند إنشاء الحساب
- دعم Hostinger

---

### **الخطوة 2: تحديد نوع السيرفر (Apache أو Nginx)**

بعد الاتصال، تحقق من نوع السيرفر:

```bash
# للتحقق من Apache
apache2 -v
# أو
httpd -v

# للتحقق من Nginx
nginx -v

# أو تحقق من الخدمات النشطة
systemctl status apache2
systemctl status nginx
```

---

### **الخطوة 3: تعديل Document Root**

#### **إذا كان السيرفر يستخدم Apache:**

##### أ. البحث عن ملفات Virtual Host الموجودة:
```bash
# ابحث عن جميع ملفات Virtual Host
ls -la /etc/apache2/sites-available/
ls -la /etc/apache2/sites-enabled/
ls -la /etc/httpd/conf.d/
ls -la /etc/httpd/vhosts.d/

# ابحث عن ملف يحتوي على اسم الدومين
grep -r "alramzybrothers.com" /etc/apache2/ 2>/dev/null
grep -r "alramzybrothers.com" /etc/httpd/ 2>/dev/null

# ابحث عن جميع ملفات .conf
find /etc/apache2 -name "*.conf" 2>/dev/null
find /etc/httpd -name "*.conf" 2>/dev/null
```

##### ب. إذا لم تجد الملف - إنشاء ملف Virtual Host جديد:

**الطريقة 1: إنشاء ملف جديد من الصفر**

```bash
# أنشئ ملف جديد
sudo nano /etc/apache2/sites-available/alramzybrothers.com.conf
# أو
sudo nano /etc/httpd/conf.d/alramzybrothers.com.conf
```

**الصق المحتوى التالي في الملف:**

```apache
<VirtualHost *:80>
    ServerName alramzybrothers.com
    ServerAlias www.alramzybrothers.com
    
    DocumentRoot /var/www/ALRamzyBrothers
    
    <Directory /var/www/ALRamzyBrothers>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/alramzybrothers_error.log
    CustomLog ${APACHE_LOG_DIR}/alramzybrothers_access.log combined
</VirtualHost>
```

**الطريقة 2: نسخ ملف افتراضي وتعديله**

```bash
# ابحث عن ملف افتراضي
ls -la /etc/apache2/sites-available/000-default.conf
ls -la /etc/apache2/sites-available/default.conf

# انسخ الملف الافتراضي
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/alramzybrothers.com.conf
# أو
sudo cp /etc/apache2/sites-available/default.conf /etc/apache2/sites-available/alramzybrothers.com.conf

# عدّل الملف
sudo nano /etc/apache2/sites-available/alramzybrothers.com.conf
```

##### ج. تعديل ملف Virtual Host الموجود:
```bash
# إذا وجدت ملف موجود، افتحه للتعديل
sudo nano /etc/apache2/sites-available/alramzybrothers.com.conf
# أو
sudo nano /etc/httpd/conf.d/alramzybrothers.com.conf
# أو أي ملف آخر وجدته في الخطوة أ
```

##### ج. تعديل Document Root في الملف:
ابحث عن السطر الذي يحتوي على `DocumentRoot` وعدّله:

```apache
<VirtualHost *:80>
    ServerName alramzybrothers.com
    ServerAlias www.alramzybrothers.com
    
    # غيّر هذا السطر:
    DocumentRoot /var/www/ALRamzyBrothers
    
    <Directory /var/www/ALRamzyBrothers>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/alramzybrothers_error.log
    CustomLog ${APACHE_LOG_DIR}/alramzybrothers_access.log combined
</VirtualHost>
```

**إذا كان SSL مفعّل (HTTPS):**
```apache
<VirtualHost *:443>
    ServerName alramzybrothers.com
    ServerAlias www.alramzybrothers.com
    
    DocumentRoot /var/www/ALRamzyBrothers
    
    <Directory /var/www/ALRamzyBrothers>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    ErrorLog ${APACHE_LOG_DIR}/alramzybrothers_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/alramzybrothers_ssl_access.log combined
</VirtualHost>
```

##### د. التحقق من إعدادات Apache الرئيسية:

إذا لم تجد ملفات في `/etc/apache2/sites-available/`، قد تكون الإعدادات في ملف Apache الرئيسي:

```bash
# ابحث عن ملف Apache الرئيسي
ls -la /etc/apache2/apache2.conf
ls -la /etc/httpd/conf/httpd.conf

# ابحث عن DocumentRoot في الملف الرئيسي
grep -i "DocumentRoot" /etc/apache2/apache2.conf
grep -i "DocumentRoot" /etc/httpd/conf/httpd.conf

# ابحث عن VirtualHost في الملف الرئيسي
grep -i "VirtualHost" /etc/apache2/apache2.conf
```

**إذا كانت الإعدادات في الملف الرئيسي:**
```bash
# افتح الملف الرئيسي
sudo nano /etc/apache2/apache2.conf
# أو
sudo nano /etc/httpd/conf/httpd.conf
```

ابحث عن `DocumentRoot` وعدّله إلى `/var/www/ALRamzyBrothers`

---

##### هـ. في Hostinger - البحث في المجلدات الشائعة:

Hostinger قد يستخدم هيكل مختلف. جرب البحث في:

```bash
# ابحث في جميع المجلدات الشائعة
find /etc -name "*alramzybrothers*" 2>/dev/null
find /home -name "*alramzybrothers*" 2>/dev/null
find /var/www -name "*alramzybrothers*" 2>/dev/null

# ابحث عن DocumentRoot في جميع الملفات
grep -r "DocumentRoot" /etc/apache2/ 2>/dev/null
grep -r "DocumentRoot" /etc/httpd/ 2>/dev/null

# ابحث عن اسم الدومين في جميع ملفات .conf
grep -r "alramzybrothers" /etc --include="*.conf" 2>/dev/null
```

---

##### و. إنشاء ملف Virtual Host جديد (إذا لم يكن موجوداً):

**1. أنشئ الملف:**
```bash
sudo nano /etc/apache2/sites-available/alramzybrothers.com.conf
```

**2. الصق هذا المحتوى:**

```apache
<VirtualHost *:80>
    ServerName alramzybrothers.com
    ServerAlias www.alramzybrothers.com
    
    DocumentRoot /var/www/ALRamzyBrothers
    
    <Directory /var/www/ALRamzyBrothers>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/alramzybrothers_error.log
    CustomLog ${APACHE_LOG_DIR}/alramzybrothers_access.log combined
</VirtualHost>
```

**3. احفظ الملف:**
- في **nano**: اضغط `Ctrl + X` ثم `Y` ثم `Enter`

**4. فعّل الموقع:**
```bash
# تفعيل الموقع
sudo a2ensite alramzybrothers.com.conf

# أو إنشاء رابط رمزي (إذا لم يعمل a2ensite)
sudo ln -s /etc/apache2/sites-available/alramzybrothers.com.conf /etc/apache2/sites-enabled/alramzybrothers.com.conf
```

**5. تحقق من صحة الإعدادات:**
```bash
# تحقق من صحة إعدادات Apache
sudo apache2ctl configtest
# أو
sudo apachectl configtest
```

**6. أعد تشغيل Apache:**

**⚠️ إذا كان `systemctl restart apache2` لا يعمل، جرب البدائل التالية:**

```bash
# الطريقة 1: استخدام service
sudo service apache2 restart

# الطريقة 2: استخدام init.d
sudo /etc/init.d/apache2 restart

# الطريقة 3: إذا كان اسمه httpd (CentOS/RHEL)
sudo systemctl restart httpd
sudo service httpd restart

# الطريقة 4: استخدام apachectl
sudo apachectl restart
sudo apache2ctl restart

# الطريقة 5: إعادة التحميل بدلاً من إعادة التشغيل
sudo systemctl reload apache2
sudo service apache2 reload
```

**🔍 كيفية معرفة اسم الخدمة الصحيح:**

```bash
# تحقق من الخدمات النشطة
systemctl list-units --type=service | grep -i apache
systemctl list-units --type=service | grep -i http

# أو
service --status-all | grep -i apache
service --status-all | grep -i http

# تحقق من حالة Apache
ps aux | grep apache
ps aux | grep httpd

# تحقق من نوع النظام
cat /etc/os-release
```

---

##### ز. إذا كان Apache يستخدم httpd (CentOS/RHEL):

```bash
# ابحث عن ملفات httpd
ls -la /etc/httpd/conf.d/
ls -la /etc/httpd/conf/httpd.conf

# أنشئ ملف جديد
sudo nano /etc/httpd/conf.d/alramzybrothers.com.conf
```

**الصق نفس المحتوى أعلاه، ثم:**
```bash
# تحقق من الإعدادات
sudo httpd -t

# أعد تشغيل httpd
sudo systemctl restart httpd
```

---

#### **إذا كان السيرفر يستخدم Nginx:**

##### أ. البحث عن ملفات Configuration الموجودة:
```bash
# ابحث عن ملفات Nginx
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/

# ابحث عن ملف يحتوي على اسم الدومين
grep -r "alramzybrothers.com" /etc/nginx/ 2>/dev/null

# ابحث عن جميع ملفات .conf
find /etc/nginx -name "*.conf" 2>/dev/null

# تحقق من الملف الرئيسي
cat /etc/nginx/nginx.conf | grep -i include
```

##### ب. إذا لم تجد الملف - إنشاء ملف Configuration جديد:

**الطريقة 1: إنشاء ملف جديد في sites-available**

```bash
# أنشئ ملف جديد
sudo nano /etc/nginx/sites-available/alramzybrothers.com
```

**الصق هذا المحتوى:**

```nginx
server {
    listen 80;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    # غيّر هذا السطر إلى مسار ملفاتك:
    root /var/www/ALRamzyBrothers;
    index index.html index.htm index.php;
    
    # السماح بقراءة الملفات
    location / {
        try_files $uri $uri/ =404;
    }
    
    # سجلات الأخطاء
    error_log /var/log/nginx/alramzybrothers_error.log;
    access_log /var/log/nginx/alramzybrothers_access.log;
}
```

**ثم فعّل الموقع:**
```bash
# إنشاء رابط رمزي لتفعيل الموقع
sudo ln -s /etc/nginx/sites-available/alramzybrothers.com /etc/nginx/sites-enabled/alramzybrothers.com
```

**الطريقة 2: إنشاء ملف في conf.d**

```bash
# أنشئ ملف جديد
sudo nano /etc/nginx/conf.d/alramzybrothers.com.conf
```

**الصق نفس المحتوى أعلاه** (لا تحتاج لتفعيله، يتم تحميله تلقائياً)

##### ج. إذا كان الملف موجوداً - تعديل ملف Configuration:
```bash
# افتح الملف للتعديل
sudo nano /etc/nginx/sites-available/alramzybrothers.com
# أو
sudo nano /etc/nginx/conf.d/alramzybrothers.com.conf
# أو أي ملف آخر وجدته في الخطوة أ
```

##### ج. تعديل Document Root في الملف:
ابحث عن `root` وعدّله:

```nginx
server {
    listen 80;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    # غيّر هذا السطر:
    root /var/www/ALRamzyBrothers;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    error_log /var/log/nginx/alramzybrothers_error.log;
    access_log /var/log/nginx/alramzybrothers_access.log;
}
```

**إذا كان SSL مفعّل (HTTPS):**
```nginx
server {
    listen 443 ssl;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    root /var/www/ALRamzyBrothers;
    index index.html index.htm;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    error_log /var/log/nginx/alramzybrothers_ssl_error.log;
    access_log /var/log/nginx/alramzybrothers_ssl_access.log;
}
```

##### د. حفظ الملف:
- في **nano**: اضغط `Ctrl + X` ثم `Y` ثم `Enter`
- في **vi**: اضغط `Esc` ثم اكتب `:wq` ثم `Enter`

##### د. حفظ الملف:
- في **nano**: اضغط `Ctrl + X` ثم `Y` ثم `Enter`
- في **vi**: اضغط `Esc` ثم اكتب `:wq` ثم `Enter`

##### هـ. التحقق من صحة الإعدادات (مهم جداً!):

```bash
# التحقق من صحة إعدادات Nginx
sudo nginx -t

# يجب أن ترى: "syntax is ok" و "test is successful"
```

**⚠️ إذا ظهرت أخطاء:** راجع رسالة الخطأ وعدّل الملف قبل إعادة التشغيل

##### و. إعادة تشغيل Nginx:

```bash
# الطريقة 1: استخدام systemctl (الأفضل)
sudo systemctl restart nginx

# الطريقة 2: استخدام service
sudo service nginx restart

# الطريقة 3: إعادة التحميل (أخف من إعادة التشغيل - موصى به)
sudo systemctl reload nginx
sudo service nginx reload

# الطريقة 4: استخدام nginx مباشرة
sudo nginx -s reload
sudo nginx -s restart

# الطريقة 5: إذا لم يعمل systemctl
sudo /etc/init.d/nginx restart
```

**💡 نصيحة:** استخدم `reload` بدلاً من `restart` إذا أمكن (أسرع ولا يقطع الاتصالات النشطة)

##### ز. التحقق من حالة Nginx:

```bash
# تحقق من حالة Nginx
sudo systemctl status nginx

# يجب أن ترى: "active (running)"
```

##### ح. إذا لم يعمل systemctl restart nginx:

```bash
# جرب البدائل:
sudo service nginx restart
sudo nginx -s reload
sudo /etc/init.d/nginx restart

# أو إعادة التحميل فقط:
sudo systemctl reload nginx
sudo service nginx reload
```

---

### **الخطوة 4: التحقق من الصلاحيات**

تأكد من أن المجلد والملفات لها الصلاحيات الصحيحة:

```bash
# تأكد من وجود المجلد
ls -la /var/www/ALRamzyBrothers

# إذا لم يكن موجود، أنشئه
sudo mkdir -p /var/www/ALRamzyBrothers

# غيّر الصلاحيات
sudo chown -R www-data:www-data /var/www/ALRamzyBrothers
# أو
sudo chown -R apache:apache /var/www/ALRamzyBrothers

# غيّر صلاحيات الملفات
sudo chmod -R 755 /var/www/ALRamzyBrothers
sudo find /var/www/ALRamzyBrothers -type f -exec chmod 644 {} \;
```

---

### **الخطوة 5: نقل الملفات (إذا لزم الأمر)**

إذا كانت الملفات في مكان آخر، انقلها:

```bash
# نقل الملفات من مكان إلى آخر
sudo cp -r /path/to/old/location/* /var/www/ALRamzyBrothers/

# أو استخدام mv (نقل بدلاً من نسخ)
sudo mv /path/to/old/location/* /var/www/ALRamzyBrothers/
```

---

### **الخطوة 6: التحقق من عمل الموقع**

```bash
# تحقق من أن Apache/Nginx يعمل
sudo systemctl status apache2
sudo systemctl status nginx

# تحقق من الملفات في المجلد
ls -la /var/www/ALRamzyBrothers/

# تحقق من السجلات للأخطاء
sudo tail -f /var/log/apache2/error.log
# أو
sudo tail -f /var/log/nginx/error.log
```

---

## ⚠️ **ملاحظات مهمة:**

1. **النسخ الاحتياطي:** قبل تعديل أي ملف، احتفظ بنسخة احتياطية:
   ```bash
   sudo cp /etc/apache2/sites-available/alramzybrothers.com.conf /etc/apache2/sites-available/alramzybrothers.com.conf.backup
   ```

2. **المسافات في أسماء المجلدات:** تجنب المسافات، استخدم `-` أو `_`:
   - ❌ `/var/www/AL Ramzy Brothers` (مسافات)
   - ✅ `/var/www/AL-Ramzy-Brothers` (بدون مسافات)

3. **الصلاحيات:** تأكد من أن Apache/Nginx يمكنه قراءة الملفات

4. **الاختبار:** بعد أي تغيير، اختبر الموقع في المتصفح

---

## 🔧 **أوامر مفيدة:**

### **لـ Apache:**
```bash
# البحث عن ملفات Virtual Host
find /etc -name "*alramzybrothers*" 2>/dev/null

# البحث عن DocumentRoot في جميع الملفات
grep -r "DocumentRoot" /etc/apache2/ 2>/dev/null

# عرض آخر 50 سطر من سجلات الأخطاء
sudo tail -n 50 /var/log/apache2/error.log

# التحقق من أن الملف تم إنشاؤه
cat /etc/apache2/sites-available/alramzybrothers.com.conf

# التحقق من الملفات المفعلة
ls -la /etc/apache2/sites-enabled/

# التحقق من صحة إعدادات Apache
sudo apache2ctl configtest
```

### **لـ Nginx:**
```bash
# البحث عن ملفات Configuration
find /etc/nginx -name "*alramzybrothers*" 2>/dev/null

# البحث عن root في جميع الملفات
grep -r "root" /etc/nginx/ 2>/dev/null | grep alramzybrothers

# عرض محتوى مجلد الموقع
ls -lah /var/www/ALRamzyBrothers/

# عرض آخر 50 سطر من سجلات الأخطاء
sudo tail -n 50 /var/log/nginx/alramzybrothers_error.log
sudo tail -n 50 /var/log/nginx/error.log

# التحقق من أن الملف تم إنشاؤه
cat /etc/nginx/sites-available/alramzybrothers.com
cat /etc/nginx/conf.d/alramzybrothers.com.conf

# التحقق من الملفات المفعلة
ls -la /etc/nginx/sites-enabled/

# التحقق من صحة إعدادات Nginx
sudo nginx -t

# عرض إعدادات Nginx
sudo nginx -T

# عرض العمليات النشطة
ps aux | grep nginx
```

---

## ✅ **التحقق من أن كل شيء يعمل:**

بعد إنشاء الملف وتعديله، تحقق من:

### 1. التحقق من وجود الملف:
```bash
# تحقق من وجود الملف
ls -la /etc/apache2/sites-available/alramzybrothers.com.conf

# عرض محتوى الملف
cat /etc/apache2/sites-available/alramzybrothers.com.conf
```

### 2. التحقق من تفعيل الموقع:
```bash
# تحقق من الملفات المفعلة
ls -la /etc/apache2/sites-enabled/ | grep alramzybrothers
```

### 3. التحقق من صحة الإعدادات:
```bash
# تحقق من صحة إعدادات Apache
sudo apache2ctl configtest

# يجب أن ترى: "Syntax OK"
```

### 4. التحقق من حالة Apache/Nginx:
```bash
# تحقق من حالة Apache
sudo systemctl status apache2

# إذا لم يعمل، جرب:
sudo systemctl status httpd
sudo service apache2 status
sudo service httpd status

# إذا كنت تستخدم Nginx:
sudo systemctl status nginx
sudo service nginx status

# يجب أن ترى: "active (running)"
```

---

## ⚠️ **حل مشكلة: `systemctl restart apache2` لا يعمل**

### **الخطوة 1: تحديد اسم الخدمة الصحيح**

```bash
# ابحث عن Apache في الخدمات
systemctl list-units --type=service | grep -i apache
systemctl list-units --type=service | grep -i http

# أو
service --status-all | grep -i apache
service --status-all | grep -i http

# تحقق من العمليات النشطة
ps aux | grep apache
ps aux | grep httpd
```

### **الخطوة 2: جرب البدائل المختلفة**

#### **لـ Ubuntu/Debian (Apache2):**
```bash
# جرب هذه الأوامر بالترتيب:
sudo service apache2 restart
sudo /etc/init.d/apache2 restart
sudo apache2ctl restart
sudo apachectl restart
```

#### **لـ CentOS/RHEL (httpd):**
```bash
# جرب هذه الأوامر بالترتيب:
sudo systemctl restart httpd
sudo service httpd restart
sudo /etc/init.d/httpd restart
sudo apachectl restart
```

### **الخطوة 3: إذا لم يعمل أي أمر - تحقق من التثبيت**

```bash
# تحقق من تثبيت Apache
which apache2
which httpd
which apachectl

# تحقق من الإصدار
apache2 -v
httpd -v

# إذا لم يكن مثبتاً، ثبته:
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install apache2

# CentOS/RHEL:
sudo yum install httpd
# أو
sudo dnf install httpd
```

### **الخطوة 4: إذا كان يستخدم Nginx بدلاً من Apache**

```bash
# تحقق من Nginx
nginx -v
systemctl status nginx

# إذا كان Nginx، استخدم:
sudo systemctl restart nginx
sudo service nginx restart
```

### **الخطوة 5: التحقق من الصلاحيات**

```bash
# تحقق من أنك تستخدم sudo
whoami

# إذا لم تكن root، استخدم sudo:
sudo systemctl restart apache2

# أو سجل دخول كـ root:
sudo su
systemctl restart apache2
```

### **الخطوة 6: إذا كان systemd غير متاح**

بعض السيرفرات القديمة لا تستخدم systemd:

```bash
# استخدم service بدلاً من systemctl
sudo service apache2 restart

# أو استخدم init.d مباشرة
sudo /etc/init.d/apache2 restart

# أو استخدم apachectl
sudo apachectl restart
```

### **الخطوة 7: التحقق من الأخطاء**

```bash
# تحقق من رسالة الخطأ
sudo systemctl restart apache2 2>&1

# تحقق من السجلات
sudo journalctl -u apache2 -n 50
sudo journalctl -u httpd -n 50

# تحقق من سجلات النظام
sudo tail -f /var/log/syslog
sudo tail -f /var/log/messages
```

### **الخطوة 8: إعادة تحميل الإعدادات بدون إعادة تشغيل**

إذا لم تستطع إعادة التشغيل، جرب إعادة التحميل:

```bash
# إعادة تحميل الإعدادات (أخف من إعادة التشغيل)
sudo systemctl reload apache2
sudo service apache2 reload
sudo apachectl graceful

# أو
sudo systemctl reload httpd
sudo service httpd reload
```

**💡 ملاحظة:** `reload` يعيد تحميل الإعدادات فقط، بينما `restart` يعيد تشغيل الخدمة بالكامل.

---

## ⚠️ **حل مشكلة: الدومين يفتح موقع آخر من السيرفر**

إذا كان الدومين `alramzybrothers.com` يفتح موقع آخر بدلاً من موقعك، هذا يعني أن هناك ملف configuration آخر يأخذ الأولوية. إليك الحل التفصيلي:

---

### **لـ Nginx:**

#### **الخطوة 1: البحث عن جميع الملفات التي تحتوي على الدومين**

```bash
# ابحث عن جميع الملفات التي تحتوي على alramzybrothers.com
grep -r "alramzybrothers.com" /etc/nginx/ 2>/dev/null

# ابحث عن جميع ملفات server block
find /etc/nginx -name "*.conf" -o -name "*" | xargs grep -l "server_name" 2>/dev/null

# عرض جميع الملفات المفعلة
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/
```

#### **الخطوة 2: البحث عن ملفات default وتعطيلها**

```bash
# ابحث عن ملفات default
ls -la /etc/nginx/sites-enabled/default
ls -la /etc/nginx/sites-enabled/000-default
ls -la /etc/nginx/conf.d/default.conf

# احذف الروابط الرمزية للملفات الافتراضية
sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-enabled/000-default

# أو إذا كان ملف في conf.d، أعد تسميته
sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
```

#### **الخطوة 3: التأكد من تفعيل ملفك**

```bash
# تحقق من وجود ملفك
ls -la /etc/nginx/sites-available/alramzybrothers.com
cat /etc/nginx/sites-available/alramzybrothers.com

# تأكد من تفعيله (إنشاء رابط رمزي)
sudo ln -sf /etc/nginx/sites-available/alramzybrothers.com /etc/nginx/sites-enabled/alramzybrothers.com

# تحقق من أن الرابط تم إنشاؤه
ls -la /etc/nginx/sites-enabled/ | grep alramzybrothers
```

#### **الخطوة 4: التحقق من server_name في جميع الملفات**

```bash
# ابحث عن جميع server_name في الملفات
grep -r "server_name.*alramzybrothers" /etc/nginx/ 2>/dev/null

# إذا وجدت ملفات أخرى تحتوي على نفس server_name، عدّلها أو احذفها
```

#### **الخطوة 5: التحقق من صحة الإعدادات وإعادة التحميل**

```bash
# تحقق من صحة الإعدادات
sudo nginx -t

# يجب أن ترى: "syntax is ok" و "test is successful"

# أعد تحميل Nginx
sudo systemctl reload nginx
```

---

### **لـ Apache:**

#### **الخطوة 1: البحث عن جميع الملفات**

```bash
# ابحث عن جميع الملفات التي تحتوي على alramzybrothers.com
grep -r "alramzybrothers.com" /etc/apache2/ 2>/dev/null

# عرض جميع الملفات المفعلة
ls -la /etc/apache2/sites-enabled/
```

#### **الخطوة 2: تعطيل الملفات الافتراضية**

```bash
# تعطيل الملفات الافتراضية
sudo a2dissite 000-default.conf
sudo a2dissite default.conf
```

#### **الخطوة 3: التأكد من تفعيل ملفك**

```bash
# فعّل ملفك
sudo a2ensite alramzybrothers.com.conf

# تحقق من الملفات المفعلة
ls -la /etc/apache2/sites-enabled/
```

#### **الخطوة 4: التحقق من صحة الإعدادات وإعادة التشغيل**

```bash
# تحقق من صحة الإعدادات
sudo apache2ctl configtest

# أعد تشغيل Apache
sudo systemctl restart apache2
```

---

### **نصائح مهمة:**

1. **تأكد من أن server_name صحيح:** يجب أن يكون `server_name alramzybrothers.com www.alramzybrothers.com;` في Nginx

2. **تأكد من أن root صحيح:** يجب أن يشير إلى `/var/www/ALRamzyBrothers`

3. **تحقق من وجود الملفات:** تأكد من وجود `index.html` في المجلد

4. **امسح الكاش:** بعد التغييرات، امسح كاش المتصفح (Ctrl+F5)

---

## 🔒 **إعداد SSL Certificate (HTTPS) - دليل شامل**

### **الطريقة 1: استخدام SSL من Hostinger (الأسهل)** ⭐

#### **الخطوات:**

1. **في hPanel:**
   - اذهب إلى **"SSL"** أو **"Security"**
   - ابحث عن الدومين `alramzybrothers.com`
   - اضغط **"Install SSL"** أو **"Auto SSL"**
   - إذا كان متاح **"Auto SSL"**، فعّله (عادة مجاني)
   - انتظر 5-10 دقائق حتى يتم التفعيل

2. **بعد التفعيل، احصل على مسار الشهادات:**
   - عادة تكون في: `/etc/ssl/certs/` أو `/etc/letsencrypt/live/alramzybrothers.com/`
   - أو في لوحة تحكم Hostinger

3. **عدّل ملف Nginx لإضافة SSL**

---

### **الطريقة 2: استخدام Let's Encrypt (مجاني)** 🆓

#### **الخطوة 1: تثبيت Certbot**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
# أو
sudo dnf install certbot python3-certbot-nginx
```

#### **الخطوة 2: الحصول على SSL Certificate**

```bash
# الحصول على شهادة SSL تلقائياً
sudo certbot --nginx -d alramzybrothers.com -d www.alramzybrothers.com

# سيطلب منك:
# - البريد الإلكتروني
# - الموافقة على الشروط
# - اختيار إعادة توجيه HTTP إلى HTTPS (اختر 2)
```

**Certbot سيقوم تلقائياً بـ:**
- الحصول على الشهادة
- تعديل ملف Nginx
- إضافة إعادة توجيه من HTTP إلى HTTPS

#### **الخطوة 3: التحقق من التجديد التلقائي**

```bash
# اختبار التجديد
sudo certbot renew --dry-run

# Certbot يجدد الشهادات تلقائياً كل 90 يوم
```

---

### **الطريقة 3: إعداد SSL يدوياً في Nginx**

#### **الخطوة 1: الحصول على SSL Certificate**

احصل على ملفات SSL:
- `certificate.crt` أو `fullchain.pem` (الشهادة)
- `private.key` (المفتاح الخاص)

#### **الخطوة 2: رفع الملفات إلى السيرفر**

```bash
# أنشئ مجلد للشهادات
sudo mkdir -p /etc/ssl/certs/alramzybrothers.com
sudo mkdir -p /etc/ssl/private/alramzybrothers.com

# ارفع الملفات (استخدم SCP أو File Manager)
# certificate.crt → /etc/ssl/certs/alramzybrothers.com/certificate.crt
# private.key → /etc/ssl/private/alramzybrothers.com/private.key

# غيّر الصلاحيات
sudo chmod 644 /etc/ssl/certs/alramzybrothers.com/certificate.crt
sudo chmod 600 /etc/ssl/private/alramzybrothers.com/private.key
```

#### **الخطوة 3: تعديل ملف Nginx**

```bash
# افتح ملف Nginx
sudo nano /etc/nginx/sites-available/alramzybrothers.com
```

**الصق هذا المحتوى:**

```nginx
# إعادة توجيه HTTP إلى HTTPS
server {
    listen 80;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    # إعادة توجيه جميع الطلبات إلى HTTPS
    return 301 https://$server_name$request_uri;
}

# إعدادات HTTPS
server {
    listen 443 ssl http2;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    # مسار ملفات الموقع
    root /var/www/ALRamzyBrothers;
    index index.html index.htm;
    
    # شهادات SSL
    ssl_certificate /etc/ssl/certs/alramzybrothers.com/certificate.crt;
    ssl_certificate_key /etc/ssl/private/alramzybrothers.com/private.key;
    
    # إعدادات SSL محسّنة
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # إعدادات إضافية للأمان
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # السماح بقراءة الملفات
    location / {
        try_files $uri $uri/ =404;
    }
    
    # سجلات الأخطاء
    error_log /var/log/nginx/alramzybrothers_ssl_error.log;
    access_log /var/log/nginx/alramzybrothers_ssl_access.log;
}
```

#### **الخطوة 4: التحقق من صحة الإعدادات**

```bash
# تحقق من صحة إعدادات Nginx
sudo nginx -t

# يجب أن ترى: "syntax is ok" و "test is successful"
```

#### **الخطوة 5: إعادة تحميل Nginx**

```bash
# أعد تحميل Nginx
sudo systemctl reload nginx

# أو إعادة تشغيل كاملة
sudo systemctl restart nginx
```

---

### **الطريقة 4: استخدام Let's Encrypt يدوياً (بدون Certbot)**

#### **الخطوة 1: تثبيت Certbot (بدون Nginx plugin)**

```bash
# Ubuntu/Debian
sudo apt-get install certbot

# CentOS/RHEL
sudo yum install certbot
```

#### **الخطوة 2: الحصول على الشهادة**

```bash
# الحصول على الشهادة فقط (بدون تثبيت تلقائي)
sudo certbot certonly --standalone -d alramzybrothers.com -d www.alramzybrothers.com

# سيطلب منك:
# - البريد الإلكتروني
# - الموافقة على الشروط
```

**الشهادات ستكون في:**
```
/etc/letsencrypt/live/alramzybrothers.com/fullchain.pem
/etc/letsencrypt/live/alramzybrothers.com/privkey.pem
```

#### **الخطوة 3: تعديل ملف Nginx**

```bash
sudo nano /etc/nginx/sites-available/alramzybrothers.com
```

**الصق هذا المحتوى:**

```nginx
# إعادة توجيه HTTP إلى HTTPS
server {
    listen 80;
    server_name alramzybrothers.com www.alramzybrothers.com;
    return 301 https://$server_name$request_uri;
}

# إعدادات HTTPS
server {
    listen 443 ssl http2;
    server_name alramzybrothers.com www.alramzybrothers.com;
    
    root /var/www/ALRamzyBrothers;
    index index.html index.htm;
    
    # شهادات Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/alramzybrothers.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alramzybrothers.com/privkey.pem;
    
    # إعدادات SSL محسّنة
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    error_log /var/log/nginx/alramzybrothers_ssl_error.log;
    access_log /var/log/nginx/alramzybrothers_ssl_access.log;
}
```

#### **الخطوة 4: إعادة تحميل Nginx**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### **التحقق من عمل SSL:**

#### **1. اختبار من المتصفح:**
- افتح `https://alramzybrothers.com`
- يجب أن ترى قفل 🔒 بجانب العنوان
- يجب أن لا تظهر رسالة "Not Secure"

#### **2. اختبار من السيرفر:**
```bash
# اختبار SSL
openssl s_client -connect alramzybrothers.com:443

# أو
curl -I https://alramzybrothers.com
```

#### **3. استخدام أدوات التحقق:**
- https://www.ssllabs.com/ssltest/
- https://sslchecker.com/

---

### **تجديد شهادة Let's Encrypt:**

```bash
# تجديد الشهادة يدوياً
sudo certbot renew

# إضافة cron job للتجديد التلقائي
sudo crontab -e

# أضف هذا السطر:
0 0 * * * certbot renew --quiet
```

---

### **حل مشاكل SSL:**

#### **المشكلة 1: SSL لا يعمل**

```bash
# تحقق من السجلات
sudo tail -f /var/log/nginx/error.log

# تحقق من مسار الشهادات
ls -la /etc/ssl/certs/alramzybrothers.com/
ls -la /etc/ssl/private/alramzybrothers.com/

# تحقق من الصلاحيات
sudo chmod 644 /etc/ssl/certs/alramzybrothers.com/certificate.crt
sudo chmod 600 /etc/ssl/private/alramzybrothers.com/private.key
```

#### **المشكلة 2: Mixed Content (HTTP و HTTPS)**

تأكد من أن جميع الروابط في HTML تستخدم `https://` أو نسبية

#### **المشكلة 3: الشهادة منتهية الصلاحية**

```bash
# تجديد الشهادة
sudo certbot renew

# أو إعادة الحصول على شهادة جديدة
sudo certbot --nginx -d alramzybrothers.com -d www.alramzybrothers.com --force-renewal
```

---

### 5. التحقق من السجلات:
```bash
# عرض آخر الأخطاء
sudo tail -f /var/log/apache2/error.log

# عرض آخر الطلبات
sudo tail -f /var/log/apache2/access.log
```

### 6. اختبار الموقع:
```bash
# اختبر من السيرفر نفسه
curl http://alramzybrothers.com
curl http://localhost

# أو افتح المتصفح واذهب إلى: http://alramzybrothers.com
```

---

## ✅ **التحقق من Nginx (إذا كنت تستخدم Nginx):**

### 1. التحقق من وجود ملف Configuration:
```bash
# تحقق من وجود الملف
ls -la /etc/nginx/sites-available/alramzybrothers.com
ls -la /etc/nginx/conf.d/alramzybrothers.com.conf

# عرض محتوى الملف
cat /etc/nginx/sites-available/alramzybrothers.com
```

### 2. التحقق من تفعيل الموقع:
```bash
# تحقق من الملفات المفعلة
ls -la /etc/nginx/sites-enabled/ | grep alramzybrothers
```

### 3. التحقق من صحة الإعدادات:
```bash
# تحقق من صحة إعدادات Nginx
sudo nginx -t

# يجب أن ترى: "syntax is ok" و "test is successful"
```

### 4. التحقق من حالة Nginx:
```bash
# تحقق من حالة Nginx
sudo systemctl status nginx

# يجب أن ترى: "active (running)"
```

### 5. التحقق من السجلات:
```bash
# عرض آخر الأخطاء
sudo tail -f /var/log/nginx/alramzybrothers_error.log
sudo tail -f /var/log/nginx/error.log

# عرض آخر الطلبات
sudo tail -f /var/log/nginx/alramzybrothers_access.log
sudo tail -f /var/log/nginx/access.log
```

### 6. اختبار الموقع:
```bash
# اختبر من السيرفر نفسه
curl http://alramzybrothers.com
curl http://localhost

# أو افتح المتصفح واذهب إلى: http://alramzybrothers.com
```

---

## 📞 **إذا واجهت مشاكل:**

1. **تحقق من السجلات:** راجع ملفات السجلات للأخطاء
2. **تحقق من الصلاحيات:** تأكد من أن Apache/Nginx يمكنه الوصول للملفات
3. **تحقق من الإعدادات:** استخدم `apache2ctl configtest` أو `nginx -t`
4. **اتصل بالدعم:** إذا لم تستطع حل المشكلة، اتصل بدعم Hostinger

---

### الخطوة 4: رفع ملفات الموقع

#### أ. تحديد مكان الرفع:
- إذا كان Document Root = `/var/www/ALRamzyBrothers` → ارفع الملفات هناك
- إذا كان Document Root = `public_html` → ارفع الملفات في `public_html/`

#### ب. رفع الملفات:
1. في hPanel، اذهب إلى **"File Manager"**
2. اذهب إلى المجلد المحدد في Document Root
3. اضغط **"Upload"** في الأعلى
4. ارفع جميع الملفات:
   ```
   ✅ index.html
   ✅ product.html
   ✅ styles.css
   ✅ script.js
   ✅ product.js
   ✅ logo.png
   ✅ hero-slide-1.jpg
   ✅ hero-slide-2.jpg
   ```
5. تأكد من وجود جميع الملفات في المجلد

---

### الخطوة 5: تفعيل SSL Certificate (شهادة الأمان)

لجعل الموقع يعمل على `https://`:

1. في hPanel، اذهب إلى **"SSL"** أو **"Security"**
2. ابحث عن الدومين
3. اضغط **"Install SSL"** أو **"Auto SSL"**
4. إذا كان متاح **"Auto SSL"**، فعّله (عادة مجاني)
5. انتظر 5-10 دقائق حتى يتم التفعيل

#### التحقق من SSL:
- افتح `https://yourdomain.com`
- يجب أن ترى قفل 🔒 بجانب العنوان
- إذا ظهرت رسالة "Not Secure"، انتظر قليلاً أو راجع الإعدادات

---

### الخطوة 6: التحقق من عمل الموقع

#### أ. اختبار الدومين:
1. افتح المتصفح
2. اذهب إلى: `https://yourdomain.com`
3. يجب أن تظهر الصفحة الرئيسية

#### ب. اختبار الصفحات:
- ✅ الصفحة الرئيسية: `https://yourdomain.com`
- ✅ صفحة المنتجات: `https://yourdomain.com#products`
- ✅ صفحة منتج: `https://yourdomain.com/product.html?id=1`
- ✅ صفحة من نحن: `https://yourdomain.com#about`
- ✅ صفحة اتصل بنا: `https://yourdomain.com#contact`

#### ج. التحقق من الصور والملفات:
- تأكد من ظهور الشعار
- تأكد من ظهور صور Hero
- تأكد من عمل CSS و JavaScript

---

## 🔧 إعدادات إضافية

### 1. إعادة توجيه من www إلى بدون www (أو العكس)

#### في hPanel:
1. اذهب إلى **"Domains"** → اختر الدومين
2. ابحث عن **"Redirects"** أو **"إعادة التوجيه"**
3. اختر:
   - `www.yourdomain.com` → `yourdomain.com`
   - أو `yourdomain.com` → `www.yourdomain.com`
4. احفظ

### 2. إعداد Email (اختياري)

إذا أردت إنشاء بريد إلكتروني مثل `info@yourdomain.com`:

1. في hPanel، اذهب إلى **"Email"**
2. اضغط **"Create Email Account"**
3. أدخل الاسم (مثل: `info`)
4. اختر الدومين
5. أدخل كلمة المرور
6. احفظ

---

## ⚠️ حل المشاكل الشائعة

### المشكلة 1: الدومين لا يعمل / يظهر صفحة Hostinger الافتراضية

**الحل:**
1. تأكد من تغيير Document Root إلى المجلد الصحيح
2. تأكد من وجود `index.html` في المجلد
3. انتظر 5-10 دقائق بعد التغيير
4. امسح الكاش من المتصفح (Ctrl+F5)

### المشكلة 2: DNS لا يعمل (الدومين لا يفتح)

**الحل:**
1. تحقق من تغيير Nameservers في مزود الدومين
2. استخدم أداة مثل https://dnschecker.org للتحقق من DNS
3. انتظر 24-48 ساعة (عادة يكون أسرع)
4. تأكد من إدخال Nameservers بشكل صحيح

### المشكلة 3: SSL لا يعمل

**الحل:**
1. تأكد من تفعيل SSL في hPanel
2. انتظر 10-15 دقيقة بعد التفعيل
3. جرب فتح `https://yourdomain.com` مباشرة
4. إذا لم يعمل، راجع إعدادات SSL في hPanel

### المشكلة 4: الصور والملفات لا تظهر

**الحل:**
1. تأكد من رفع جميع الملفات
2. تأكد من أن أسماء الملفات صحيحة (حساسة لحالة الأحرف)
3. افتح Console (F12) للتحقق من الأخطاء
4. تحقق من المسارات في HTML (يجب أن تكون نسبية مثل `logo.png` وليس `/var/www/...`)

### المشكلة 5: الموقع يظهر لكن CSS/JS لا يعمل

**الحل:**
1. تأكد من رفع `styles.css` و `script.js`
2. تأكد من أن الملفات في نفس المجلد
3. امسح الكاش (Ctrl+F5)
4. تحقق من Console (F12) للأخطاء

---

## 📝 ملخص الخطوات السريعة

1. ✅ أضف الدومين في Hostinger (أو اربطه إذا كان من خارج Hostinger)
2. ✅ غيّر DNS إذا كان الدومين من خارج Hostinger
3. ✅ غيّر Document Root إلى `/var/www/ALRamzyBrothers` أو `public_html`
4. ✅ ارفع جميع ملفات الموقع في المجلد المحدد
5. ✅ فعّل SSL Certificate
6. ✅ اختبر الموقع على `https://yourdomain.com`

---

## 🔗 روابط مفيدة

- **لوحة تحكم Hostinger**: https://hpanel.hostinger.com/
- **دعم Hostinger**: يمكنك التواصل معهم عبر Live Chat في hPanel
- **التحقق من DNS**: https://dnschecker.org/
- **التحقق من SSL**: https://www.ssllabs.com/ssltest/

---

## 💡 نصائح مهمة

1. **الصبر**: بعد تغيير DNS، قد يستغرق الأمر 24-48 ساعة (عادة أسرع)
2. **النسخ الاحتياطي**: احتفظ بنسخة احتياطية من جميع الملفات
3. **الاختبار**: اختبر الموقع من أجهزة مختلفة (كمبيوتر، موبايل)
4. **الأمان**: تأكد من تفعيل SSL دائماً
5. **التوثيق**: احتفظ بسجل لجميع الإعدادات التي قمت بها

---

## 📞 الحصول على المساعدة

إذا واجهت أي مشاكل:

1. **دعم Hostinger**: استخدم Live Chat في hPanel
2. **التحقق من الأخطاء**: افتح Console في المتصفح (F12)
3. **التحقق من الملفات**: تأكد من وجود جميع الملفات في المكان الصحيح
4. **التحقق من الصلاحيات**: تأكد من أن صلاحيات الملفات 644 والمجلدات 755

---

**بالتوفيق! 🚀**

إذا كان لديك أي أسئلة إضافية، لا تتردد في السؤال!
