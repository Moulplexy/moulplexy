/* =================================================_
   Web Catalog - Plexy & 3od Main Script
   ================================================= */

let catalogData = [];
let currentProduct = null;

// تحميل بيانات الكاتالوج عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    fetch('catalog.json')
        .then(response => response.json())
        .then(data => {
            catalogData = data;
            initCatalog();
        })
        .catch(error => console.error('Error loading catalog.json:', error));
});

function initCatalog() {
    renderCatalogItems(catalogData);
    setupEventListeners();
}

// دالة عرض المنتجات مع ضمان تحميل الصور بشكل سليم وتجنب مشكلة الـ Race Condition
function renderCatalogItems(items) {
    const container = document.getElementById('catalog-container');
    if (!container) return;
    
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        
        // معالجة مسار الصورة المصغرة والتأكد من تطابق 3od.jpeg وغيرها
        let thumbSrc = item.image || item.defaultImage || '';
        thumbSrc = thumbSrc.trim();

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${thumbSrc}" alt="${item.name || 'Product'}" class="product-thumb" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="category-tag">${item.category}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            selectProduct(item);
        });

        container.appendChild(card);
    });
}

// تحديد المنتج وعرض تفاصيله ومعالجة حالة الصورة الافتراضية
function selectProduct(product) {
    currentProduct = product;
    
    const mainImageElement = document.getElementById('main-product-image');
    const thumbnailElement = document.getElementById('selected-thumbnail');
    
    let defaultImg = product.defaultImage || product.image || '';
    defaultImg = defaultImg.trim();

    if (mainImageElement) {
        mainImageElement.src = defaultImg;
    }
    
    if (thumbnailElement) {
        thumbnailElement.src = defaultImg;
    }

    // تحديث تفاصيل الـ Configuration إذا توفرت
    updateConfigurationUI(product);
}

function updateImageState(selectedColor) {
    if (!currentProduct) return;

    let imagePath = currentProduct.defaultImage || currentProduct.image || '';
    
    if (selectedColor && currentProduct.colorImages && currentProduct.colorImages[selectedColor]) {
        imagePath = currentProduct.colorImages[selectedColor];
    }
    
    imagePath = imagePath.trim();

    const mainImageElement = document.getElementById('main-product-image');
    const thumbnailElement = document.getElementById('selected-thumbnail');

    if (mainImageElement && mainImageElement.src !== window.location.origin + '/' + imagePath) {
        mainImageElement.src = imagePath;
    }

    if (thumbnailElement) {
        thumbnailElement.src = imagePath;
    }
}

// منطق الفلترة المرن لـ 3od و Plexy و 3od + Plexy
function filterCatalog(categoryName) {
    const normalizedQuery = categoryName.trim().toLowerCase();
    
    const filteredItems = catalogData.filter(item => {
        const itemCat = item.category ? item.category.trim().toLowerCase() : '';
        
        if (normalizedQuery === '3od + plexy' || normalizedQuery === '3od+plexy') {
            return itemCat.includes('3od') || itemCat.includes('plexy');
        }
        
        return itemCat === normalizedQuery;
    });
    
    renderCatalogItems(filteredItems);
}

function setupEventListeners() {
    // ربط أزرار الفلترة إذا كانت موجودة في الواجهة
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            filterCatalog(category);
        });
    });

    // ربط أزرار تغيير الألوان
    const colorButtons = document.querySelectorAll('.color-option');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            updateImageState(color);
        });
    });
}

function updateConfigurationUI(product) {
    // تحديث عناصر واجهة التخصيص حسب المنتج المختار
    const titleEl = document.getElementById('config-product-title');
    if (titleEl) {
        titleEl.textContent = product.name;
    }
}
