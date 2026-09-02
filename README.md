# MOULE PLEXY — Static Website

موقع ثنائي اللغة (العربية / الفرنسية) لمول البليكسي، مصمم ليعمل كـ static website بدون قاعدة بيانات أو مفاتيح API.

## الملفات المهمة
- `index.html` — الواجهة.
- `style.css` — التصميم الأسود والذهبي والمتجاوب.
- `script.js` — اللغات، الكتالوج، النافذة المكبرة، WhatsApp وReel.
- `catalog.json` — فهرس الصور.
- `link video reel.txt` — ضع داخله رابط Instagram Reel واحد فقط.
- `assets/plexi/` — صور كتالوج Plexy.
- `assets/wood/` — صور كتالوج العود.
- `assets/combo/` — صور كتالوج العود + Plexy.
- `assets/*-icon.*` — صور الأيقونات الثلاثة.
- `update_catalog.py` — يعيد بناء `catalog.json` بعد إضافة/حذف الصور.

## WhatsApp
الرقم المدمج: `+212627709956`.

الموقع لا يرسل البيانات إلى خادم خاص ولا يخزن طلبات الزبناء. عند الضغط على الإرسال، يتم فتح WhatsApp برسالة مجهزة محلياً في المتصفح.

## إضافة الصور مستقبلاً
1. ضع الصور الجديدة في المجلد المناسب داخل `assets/`.
2. شغّل:
   `python update_catalog.py`
3. ارفع الملفات إلى GitLab.

## إضافة Reel
افتح `link video reel.txt` واكتب رابط Instagram Reel، مثلاً:
`https://www.instagram.com/reel/XXXXXXXXXXX/`
ثم ارفع التغيير. الموقع يقرأ الملف تلقائياً.

## GitHub Pages
المشروع مهيأ للنشر على GitHub Pages عبر GitHub Actions. بعد رفع الملفات إلى repository على GitHub، تأكد أن الفرع الرئيسي اسمه `main`، ثم اذهب إلى Settings > Pages واختر **GitHub Actions** إذا طلب منك ذلك. كل تغيير يتم دفعه إلى `main` يمكن أن يعيد نشر الموقع تلقائياً.

### الدومين `www.mouleplexy.site`
بعد نشر الموقع:
1. من GitHub افتح Settings > Pages.
2. في Custom domain أضف `www.mouleplexy.site`.
3. في DNS عند مزود الدومين، أضف سجلات DNS التي يعرضها GitHub.
4. فعّل HTTPS بعد اكتمال الربط.

