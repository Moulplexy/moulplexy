حزمة نماذج الألوان - Brand / Moul Plexy

colors/
├── plexy_colors/
├── 3od_colors/
├── 3od_plexy_colors_different/
└── 3od_plexy_colors_uniform/

المبدأ:
- الصور العادية تعتمد على model.png + mask.png لتغيير اللون داخل الموقع.
- في العود + Plexy (different) توجد plexy_mask.png و wood_mask.png منفصلتان.
- في العود + Plexy (uniform) توجد mask.png موحدة لإعطاء نفس اللون للجزأين.
- مجلد miroir يحتوي معاينات جاهزة لألوان: ghoz / Argente / Dore / Bronze.

مهم:
هذه الحزمة هي حزمة النماذج التي جهزناها بصرياً للتطبيق. قبل اعتمادها كنسخة إنتاج نهائية، يجب ضبط أقنعة (masks) التلوين على نفس إحداثيات model.png بدقة 1:1، لأن الصور المولدة ليست ملفات تصميم أصلية بطبقات منفصلة.
