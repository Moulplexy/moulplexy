const DEFAULT_CONFIG={
  GMAIL:"moulplexy@gmail.com",
  WHATSAPP:"+212627709956",
  INSTAGRAM:"https://www.instagram.com/moulplexy/",
  TIKTOK:"https://www.tiktok.com/@moulplexy",
  FACEBOOK:"https://www.facebook.com/moulplexy",
  YOUTUBE:"https://www.youtube.com/@moulplexy"
};
let siteConfig={...DEFAULT_CONFIG};
const state={lang:"ar",category:"plexi",items:[],selected:null,customIdea:false,videos:[],videoIndex:0,colorSelections:{plexi:"",wood:"",comboPlexi:"",comboWood:""}};

const categoryMeta={
  plexi:{ar:"Plexy",fr:"Plexy",titleAr:"اختيارات Plexy",titleFr:"Sélection Plexy",descAr:"تصاميم عصرية من Plexy للمناسبات والديكور والتخصيص.",descFr:"Créations modernes en plexy pour événements, décoration et personnalisation."},
  wood:{ar:"العود",fr:"Bois",titleAr:"اختيارات العود",titleFr:"Sélection Bois",descAr:"نماذج خشبية بدفء طبيعي ولمسة مميزة.",descFr:"Modèles en bois avec une chaleur naturelle et une finition distinctive."},
  combo:{ar:"العود + Plexy",fr:"Bois + Plexy",titleAr:"اختيارات العود + Plexy",titleFr:"Sélection Bois + Plexy",descAr:"تركيبات تجمع أناقة Plexy مع جمال الخشب.",descFr:"Des compositions qui réunissent l’élégance du plexy et le charme du bois."}
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function t(ar,fr){return state.lang==="ar"?ar:fr}
function setLanguage(lang){
  state.lang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.body.dir=lang==="ar"?"rtl":"ltr";
  $$(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  $$("[data-ar]").forEach(el=>{
    const val=el.dataset[lang==="ar"?"ar":"fr"];
    if(val!==undefined)el.textContent=val;
  });
  $$("#occasion option, #profile option").forEach(el=>{
    const val=el.dataset[lang==="ar"?"ar":"fr"];
    if(val!==undefined)el.textContent=val;
  });
  if($("#galleryTitle"))$("#galleryTitle").textContent=t(categoryMeta[state.category].titleAr,categoryMeta[state.category].titleFr);
  if(state.items && Object.keys(state.items).length)renderGallery();
  if($("#productModal"))updateModalText();
}
$$(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));

async function loadSiteConfig(){
  try{
    const r=await fetch("site-links.txt",{cache:"no-store"});
    const text=await r.text();
    text.split(/\r?\n/).forEach(line=>{
      const clean=line.trim();
      if(!clean || clean.startsWith("#") || !clean.includes("="))return;
      const [key,...rest]=clean.split("=");
      const value=rest.join("=").trim();
      if(key.trim() && value)siteConfig[key.trim()]=value;
    });
  }catch(e){}
  applySiteConfig();
}
function normalizePhone(v){return String(v||"").replace(/[^0-9]/g,"")}
function applySiteConfig(){
  const wa=normalizePhone(siteConfig.WHATSAPP);
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>a.href=`https://wa.me/${wa}`);
  const email=$("#emailLink"); if(email){email.href=`mailto:${siteConfig.GMAIL}`;email.textContent=siteConfig.GMAIL}
  const waFooter=$("#waFooter"); if(waFooter){waFooter.href=`https://wa.me/${wa}`;waFooter.textContent=siteConfig.WHATSAPP}
  ["instagram","tiktok","facebook","youtube"].forEach(k=>{
    const el=$(`#${k}Link`); if(el)el.href=siteConfig[k.toUpperCase()]||DEFAULT_CONFIG[k.toUpperCase()];
  });
  const year=$("#year"); if(year)year.textContent=new Date().getFullYear();
}

async function loadCatalog(){
  try{
    const res=await fetch("catalog.json",{cache:"no-store"});
    const data=await res.json();
    state.items=data;
    switchCategory("plexi");
    renderReelDecor();
  }catch(e){
    $("#gallery").innerHTML=`<div class="gallery-empty">${t("تعذر تحميل الكتالوج. تأكد من وجود catalog.json.","Impossible de charger le catalogue.")}</div>`;
  }
}

function switchCategory(cat,shouldScroll=false){
  if(!categoryMeta[cat])return;
  state.category=cat;
  state.colorSelections={plexi:"",wood:"",comboPlexi:"",comboWood:""};
  $$(".category-card").forEach(c=>c.classList.toggle("active",c.dataset.category===cat));
  const meta=categoryMeta[cat];
  $("#galleryKicker").textContent=meta[state.lang==="ar"?"ar":"fr"].toUpperCase();
  $("#galleryTitle").textContent=t(meta.titleAr,meta.titleFr);
  renderGallery();
  if(shouldScroll){
    const galleryWrap=$("#galleryWrap");
    if(galleryWrap)requestAnimationFrame(()=>galleryWrap.scrollIntoView({behavior:"smooth",block:"start"}));
  }
}

$$(".category-card").forEach(c=>c.addEventListener("click",()=>switchCategory(c.dataset.category,true)));

function renderGallery(){
  const items=(state.items[state.category]||[]).filter(x=>{
    const url=String(x.url||"").toLowerCase();
    return /\.(jpe?g|png|webp|gif|jfif)(?:[?#].*)?$/.test(url);
  });
  $("#galleryCount").textContent=`${items.length} ${t("نموذج","modèles")}`;
  $("#gallery").innerHTML="";
  items.forEach((item,i)=>{
    const b=document.createElement("button");
    b.className="gallery-item";
    b.type="button";
    b.innerHTML=`<img loading="lazy" src="${assetUrl(item.url)}" alt="${escapeHtml(categoryMeta[state.category][state.lang==="ar"?"ar":"fr"])} ${i+1}">`;
    b.addEventListener("click",()=>openProduct(item));
    $("#gallery").appendChild(b);
  });
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch]));
}

const materialOptions={
  plexi:[
    {group:"ألوان البليكسي",items:["الأبيض","شيبي","الغوز","الذهبي"]}
  ],
  wood:[
    {group:"ألوان العود",items:["بيض","شيبي","البني الفاتح"]}
  ]
};

const colorLabels={
  search:"البحث عن اللون...",
  choose:"اختر اللون",
  selected:"اللون المختار"
};

const colorDisplayNames={
  "الأبيض":"أبيض",
  "شيبي":"فضي / مرايا",
  "الغوز":"وردي",
  "الذهبي":"ذهبي",
  "بيض":"أبيض",
  "البني الفاتح":"بني فاتح"
};
function displayColorName(color){return colorDisplayNames[color]||color;}

const colorBaseAssets={
  plexi:'colors/plexy/photo plexy ra2isiya.png',
  wood:'colors/3od/photo 3od ra2isiya.png',
  combo:'colors/3od+plexy/photo 3od+plexy ra2isiya.png'
};

const colorPhotoAssets={
  plexy:{
    "الأبيض":"colors/plexy/byed.png",
    "شيبي":"colors/plexy/chibi.png",
    "الغوز":"colors/plexy/ghoz.png",
    "الذهبي":"colors/plexy/dahabi.png"
  },
  wood:{
    "بيض":"colors/3od/byed.png",
    "شيبي":"colors/3od/chibi.png",
    "البني الفاتح":"colors/3od/boni-fate7.png"
  }
};

const comboPhotoAssets={
  "بيض|الأبيض":"colors/3od+plexy/byed-byed.png",
  "بيض|شيبي":"colors/3od+plexy/byed-chibi.png",
  "بيض|الغوز":"colors/3od+plexy/byed-ghoz.png",
  "بيض|الذهبي":"colors/3od+plexy/byed-dahabi.png",
  "شيبي|الأبيض":"colors/3od+plexy/chibi-byed.png",
  "شيبي|شيبي":"colors/3od+plexy/chibi-chibi.png",
  "شيبي|الغوز":"colors/3od+plexy/chibi-ghoz.png",
  "شيبي|الذهبي":"colors/3od+plexy/chibi-dahabi.png",
  "البني الفاتح|الأبيض":"colors/3od+plexy/boni-fate7-byed.png",
  "البني الفاتح|شيبي":"colors/3od+plexy/boni-fate7-chibi.png",
  "البني الفاتح|الغوز":"colors/3od+plexy/boni-fate7-ghoz.png",
  "البني الفاتح|الذهبي":"colors/3od+plexy/boni-fate7-dahabi.png"
};

function selectedColorPhoto(){
  if(state.category==='plexi') return colorPhotoAssets.plexy[state.colorSelections.plexi] || colorBaseAssets.plexi;
  if(state.category==='wood') return colorPhotoAssets.wood[state.colorSelections.wood] || colorBaseAssets.wood;
  const key=`${state.colorSelections.comboWood}|${state.colorSelections.comboPlexi}`;
  return comboPhotoAssets[key] || colorBaseAssets.combo;
}

function assetUrl(src){
  const raw=String(src||"").trim().replace(/\\/g,"/");
  if(!raw)return "";
  return new URL(raw.split("/").map(encodeURIComponent).join("/"),document.baseURI).href;
}

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error(`Impossible de charger: ${src}`));
    img.src=assetUrl(src);
  });
}

let imageRequestId=0;
async function showPreviewImage(src,fallbackSrc){
  const img=$("#modalImg");
  if(!img)return;
  const requestId=++imageRequestId;
  const imageBox=img.parentElement;
  if(imageBox)imageBox.style.setProperty("--preview-ratio","1 / 1");
  const badge=$("#previewBadge");
  if(badge)badge.hidden=false;

  try{
    const loaded=await loadImage(src);
    if(requestId!==imageRequestId)return;
    img.src=loaded.src;
    img.style.visibility="visible";
  }catch(e){
    if(!fallbackSrc || requestId!==imageRequestId)return;
    try{
      const fallback=await loadImage(fallbackSrc);
      if(requestId!==imageRequestId)return;
      img.src=fallback.src;
      img.style.visibility="visible";
    }catch(e2){
      if(requestId===imageRequestId)img.style.visibility="hidden";
    }
  }
}

async function updateColorPreview(){
  if(!state.selected)return;
  const src=selectedColorPhoto();
  const fallback=state.category==='plexi'?colorBaseAssets.plexi:state.category==='wood'?colorBaseAssets.wood:colorBaseAssets.combo;
  showPreviewImage(src,fallback);
}

function renderMaterialPicker(container, materialKey, title, groups){
  if(!container)return;
  const selected=state.colorSelections[materialKey]||"";
  container.dataset.materialKey=materialKey;
  container.innerHTML=`
    <div class="picker-head"><h4>${escapeHtml(title)}</h4><span class="selected-color">${selected?escapeHtml(displayColorName(selected)):colorLabels.choose}</span></div>
    <div class="color-table" role="listbox" aria-label="${escapeHtml(title)}"></div>`;
  const table=container.querySelector('.color-table');
  table.innerHTML=groups.map(group=>`
    <div class="color-group">
      <div class="color-group-title">${escapeHtml(group.group)}</div>
      <div class="color-options">
        ${group.items.map(color=>`
          <button type="button" class="color-option ${selected===color?'active':''}" data-color="${escapeHtml(color)}" aria-selected="${selected===color}">
            <span class="color-dot" aria-hidden="true"></span><span>${escapeHtml(displayColorName(color))}</span>
          </button>`).join('')}
      </div>
    </div>`).join('');
  table.querySelectorAll('.color-option').forEach(btn=>btn.addEventListener('click',()=>{
    state.colorSelections[materialKey]=btn.dataset.color;
    renderMaterialPicker(container,materialKey,title,groups);
    updateColorPreview();
  }));
}


function renderMaterialChoices(){
  const section=$('#materialChoice'); if(!section)return;
  section.hidden=false;
  const single=$('#singleMaterialPicker'), separate=$('#separateMaterialPickers');
  const setPanelVisible=(el,visible)=>{
    if(!el)return;
    el.hidden=!visible;
    el.style.setProperty('display',visible?'':'none','important');
    el.setAttribute('aria-hidden',visible?'false':'true');
  };
  setPanelVisible(single,false);
  setPanelVisible(separate,false);

  if(state.category==='plexi'){
    setPanelVisible(single,true);
    $('#materialChoiceTitle').textContent='ألوان البليكسي';
    $('#materialChoiceDescription').textContent='اختر لون البليكسي من الألوان المتوفرة فقط.';
    renderMaterialPicker(single,'plexi','البليكسي',materialOptions.plexi);
  }else if(state.category==='wood'){
    setPanelVisible(single,true);
    $('#materialChoiceTitle').textContent='ألوان العود';
    $('#materialChoiceDescription').textContent='اختر لون العود من الألوان المتوفرة فقط.';
    renderMaterialPicker(single,'wood','العود',materialOptions.wood);
  }else{
    setPanelVisible(separate,true);
    $('#materialChoiceTitle').textContent='ألوان العود + البليكسي';
    $('#materialChoiceDescription').textContent='اختر لون العود ولون البليكسي، وستظهر المعاينة المطابقة لاختياراتك.';
    renderMaterialPicker($('#plexiPicker'),'comboPlexi','البليكسي',materialOptions.plexi);
    renderMaterialPicker($('#woodPicker'),'comboWood','العود',materialOptions.wood);
  }
  updateColorPreview();
}

function colorSummary(){
  if(state.category==='plexi')return displayColorName(state.colorSelections.plexi)||'غير محدد';
  if(state.category==='wood')return displayColorName(state.colorSelections.wood)||'غير محدد';
  return `العود: ${displayColorName(state.colorSelections.comboWood)||'غير محدد'} | البليكسي: ${displayColorName(state.colorSelections.comboPlexi)||'غير محدد'}`;
}

function colorImageLinksForMessage(){
  if(state.category==='plexi'){
    return Object.entries(colorPhotoAssets.plexy).map(([color,path])=>`PLEXY ${displayColorName(color)}
${assetUrl(path)}`).join("\n\n");
  }
  if(state.category==='wood'){
    return Object.entries(colorPhotoAssets.wood).map(([color,path])=>`3OD ${displayColorName(color)}
${assetUrl(path)}`).join("\n\n");
  }
  return Object.entries(comboPhotoAssets).map(([key,path])=>{
    const [woodColor,plexiColor]=key.split('|');
    return `3OD ${displayColorName(woodColor)} + PLEXY ${displayColorName(plexiColor)}\n${assetUrl(path)}`;
  }).join("\n\n");
}

function openProduct(item){
  state.selected=item;
  state.customIdea=false;
  state.colorSelections={plexi:"",wood:"",comboPlexi:"",comboWood:""};
  $("#productModal").classList.remove("custom-mode");

  // MAIN IMAGE = prepared product image from colors/.
  // The selected catalog image is NEVER used as the main image.
  const mainImg = $("#modalImg");
  mainImg.alt = categoryMeta[state.category][state.lang==="ar"?"ar":"fr"];
  const fallbackMain = state.category==='plexi'?colorBaseAssets.plexi:state.category==='wood'?colorBaseAssets.wood:colorBaseAssets.combo;
  showPreviewImage(selectedColorPhoto(),fallbackMain);

  // CATALOG IMAGE = small overlay only.
  const catalogOverlay=$("#selectedCatalogOverlay");
  if(catalogOverlay){
    catalogOverlay.src = assetUrl(item.url);
    catalogOverlay.alt = state.lang==="ar" ? "Photo from catalog" : "Photo du catalogue";
    catalogOverlay.hidden=false;
  }

  $("#productModal").classList.add("open");
  $("#productModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  updateModalText();
  renderMaterialChoices();
}
function openCustomIdea(){
  imageRequestId++;
  state.selected=null;
  state.customIdea=true;
  $("#productModal").classList.add("custom-mode","open");
  $("#productModal").setAttribute("aria-hidden","false");
  $("#modalImg").removeAttribute("src");
  $("#modalImg").alt="";
  const catalogOverlay=$("#selectedCatalogOverlay");
  if(catalogOverlay)catalogOverlay.hidden=true;
  document.body.style.overflow="hidden";
  updateModalText();
}
$("#customIdeaBtn").addEventListener("click",openCustomIdea);

function closeModal(){
  $("#productModal").classList.remove("open","custom-mode");
  state.customIdea=false;
  $("#productModal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
$("#modalClose").addEventListener("click",closeModal);
$(".modal-backdrop").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

function updateModalText(){
  const meta=categoryMeta[state.category];
  $("#modalCategory").textContent=meta[state.lang==="ar"?"ar":"fr"].toUpperCase();
  if(state.customIdea){
    $("#modalTitle").textContent=state.lang==="ar"?"خصّص الفكرة":"Personnalisez l’idée";
    $("#modalDescription").textContent=state.lang==="ar"
      ?"لم تجد النموذج الذي تبحث عنه؟ اكتب فكرتك بالتفصيل وسنحوّلها إلى تصميم مخصص حسب طلبك."
      :"Vous n’avez pas trouvé le modèle que vous cherchez ? Décrivez votre idée et nous créerons une pièce personnalisée selon votre demande.";
  }else{
    $("#modalTitle").textContent=state.lang==="ar"?"اختيارك جاهز للتخصيص":"Votre sélection est prête à être personnalisée";
    $("#modalDescription").textContent=state.lang==="ar"?meta.descAr:meta.descFr;
  }
  $("#charCount").textContent=`${$("#idea").value.length}/500`;
}

$("#idea").addEventListener("input",()=>$("#charCount").textContent=`${$("#idea").value.length}/500`);

function buildWhatsAppMessage(){
  const occMap={wedding:["عرس / زفاف","Mariage"],birthday:["عيد ميلاد","Anniversaire"],corporate:["شركة / حدث مهني","Entreprise / événement professionnel"],other:["مناسبة أخرى","Autre"]};
  const profMap={professional:["جمال / منظم / شركة","Professionnel / organisateur / entreprise"],consumer:["مستهلك / فرد","Particulier"]};
  const occ=occMap[$("#occasion").value][state.lang==="ar"?0:1];
  const prof=profMap[$("#profile").value][state.lang==="ar"?0:1];
  const cat=categoryMeta[state.category][state.lang==="ar"?"ar":"fr"];

  const colorUrl=state.selected ? assetUrl(selectedColorPhoto()) : "";
  const catalogUrl=state.selected ? assetUrl(state.selected.url) : "";

  if(state.lang==="ar"){
    return `السلام عليكم، أريد طلب نموذج من MOULE PLEXY.

الفئة: ${cat}
اختيار اللون: ${colorSummary()}

${colorUrl?`PHOTO PRINCIPALE
${colorUrl}`:""}

${catalogUrl?`PHOTO CATALOG
${catalogUrl}`:"بدون نموذج من الكتالوج"}

صور الألوان المتوفرة:
${colorImageLinksForMessage()}

الكمية: ${$("#qty").value}
المناسبة: ${occ}
المدينة: ${$("#city").value}
الصفة: ${prof}
الفكرة/التفاصيل: ${$("#idea").value||"لا توجد تفاصيل إضافية"}

✦ أعلم أن الأداء مطلوب قبل التنفيذ: 50% قبل بداية الإنجاز، والباقي قبل التسليم.

شكراً.`;
  }

  return `Bonjour, je souhaite demander un modèle de MOULE PLEXY.

Catégorie : ${cat}
Couleur choisie : ${colorSummary()}

${colorUrl?`PHOTO PRINCIPALE
${colorUrl}`:""}

${catalogUrl?`PHOTO CATALOGUE
${catalogUrl}`:"Sans modèle du catalogue"}

Photos des couleurs disponibles :
${colorImageLinksForMessage()}

Quantité : ${$("#qty").value}
Occasion : ${occ}
Ville : ${$("#city").value}
Profil : ${prof}
Idée / détails : ${$("#idea").value||"Aucun détail supplémentaire"}

✦ Je reconnais que le paiement est requis avant l’exécution de la commande : 50 % avant le début de la réalisation et le solde avant la livraison.

Merci.`;
}

$("#orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!$("#city").value.trim()){ $("#city").focus(); return; }
  const url=`https://wa.me/${normalizePhone(siteConfig.WHATSAPP)}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  window.open(url,"_blank","noopener");
});

$("#floatingOrder").addEventListener("click",()=>{
  const first=(state.items.plexi||[]).find(x=>!x.url.toLowerCase().endsWith(".mp4"));
  if(first)openProduct(first);
  else { state.selected=null; $("#productModal").classList.add("open"); $("#productModal").setAttribute("aria-hidden","false"); }
});

$("#prevBtn").addEventListener("click",()=>scrollGallery(-1));
$("#nextBtn").addEventListener("click",()=>scrollGallery(1));
function scrollGallery(dir){
  const g=$("#gallery");
  const amount=Math.max(240,g.clientWidth/2);
  g.scrollBy({left:dir*amount,behavior:"smooth"});
}

function renderReelDecor(){
  // Decorative photos are kept separately from the catalog so changing catalog
  // content never changes the visual effect around the video.
  const pool=[
    "assets/video efect/photo pabillon video/photo 01.jpeg",
    "assets/video efect/photo pabillon video/photo 02.jpeg",
    "assets/video efect/photo pabillon video/photo 03.jpeg",
    "assets/video efect/photo pabillon video/photo 04.jpeg",
    "assets/video efect/photo pabillon video/photo 05.jpeg",
    "assets/video efect/photo pabillon video/photo 06.jpeg"
  ];

  const decor=$("#reelDecor");
  if(!decor || !pool.length)return;

  // Six fixed positions around the reel; only three are visible at once.
  const positions=[
    "top-left","mid-left","bottom-left",
    "top-right","mid-right","bottom-right"
  ];
  const shuffled=[...pool].sort(()=>Math.random()-.5);
  const urls=[];
  for(let i=0;i<6;i++) urls.push(shuffled[i%shuffled.length]);

  decor.innerHTML=positions.map((_,i)=>
    `<img src="${assetUrl(urls[i])}" alt="" loading="lazy" data-slot="${i}" style="--r:${[ -5, 4, -3, 4, -4, 3 ][i]}deg">`
  ).join("");

  const imgs=[...decor.querySelectorAll("img")];

  // Start with three photos in different places.
  let visible=[0,3,5];
  visible.forEach(i=>imgs[i].classList.add("is-visible"));

  const pickHidden=()=>imgs
    .map((img,i)=>i)
    .filter(i=>!visible.includes(i));

  const pickVisible=()=>visible[Math.floor(Math.random()*visible.length)];

  const changePhoto=()=>{
    if(imgs.length<4)return;

    const out=pickVisible();
    const hidden=pickHidden();
    const incoming=hidden[Math.floor(Math.random()*hidden.length)];

    imgs[out].classList.remove("is-visible");
    visible=visible.filter(i=>i!==out);

    // Give the incoming slot a fresh random catalog image.
    const visibleUrls=visible.map(i=>imgs[i].getAttribute("src"));
    let nextUrl=pool[Math.floor(Math.random()*pool.length)];
    for(let tries=0;tries<8 && visibleUrls.includes(nextUrl);tries++){
      nextUrl=pool[Math.floor(Math.random()*pool.length)];
    }
    imgs[incoming].src=assetUrl(nextUrl);

    requestAnimationFrame(()=>imgs[incoming].classList.add("is-visible"));
    visible.push(incoming);
  };

  clearInterval(window.__reelDecorTimer);
  window.__reelDecorTimer=setInterval(changePhoto,2400);
}

function youtubeId(url){
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i); return m?m[1]:null;
}
function instagramId(url){const m=url.match(/instagram\.com\/(?:reel|p)\/([^/?#]+)/i);return m?m[1]:null;}
function tiktokId(url){const m=url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);return m?m[1]:null;}
function facebookUrl(url){return /(?:facebook\.com|fb\.watch)/i.test(url)?url:null;}
function directVideo(url){return /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i.test(url);}
function videoType(url){
  if(directVideo(url))return "video";
  if(instagramId(url))return "instagram";
  if(youtubeId(url))return "youtube";
  if(tiktokId(url))return "tiktok";
  if(facebookUrl(url))return "facebook";
  return "link";
}
function platformLabel(type){
  return {instagram:"Instagram",youtube:"YouTube",tiktok:"TikTok",facebook:"Facebook",video:"Video",link:"Video"}[type]||"Video";
}
function setReelAspect(ratio){
  const frame=$("#reelFrame");
  if(!frame)return;
  // Social videos are intentionally kept in a TikTok/Reel 9:16 frame.
  frame.style.aspectRatio="9/16";
}
function renderVideoTabs(){
  const tabs=$("#reelTabs");
  if(!tabs)return;
  tabs.innerHTML="";
  state.videos.forEach((item,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className=`reel-tab ${i===state.videoIndex?"active":""}`;
    b.innerHTML=`<span class="reel-tab-icon">${platformLabel(item.type).slice(0,1)}</span><span>${platformLabel(item.type)}</span>`;
    b.addEventListener("click",()=>showVideo(i,true));
    tabs.appendChild(b);
  });
}
function renderReelClosed(){
  const frame=$("#reelFrame");
  if(!frame)return;
  setReelAspect("9/16");
  frame.innerHTML=`<button class="reel-closed" id="reelOpenBtn" type="button">
    <img src="assets/video%20efect/logo%20video/logo%20video.png" alt="MOULE PLEXY">
    <span class="reel-closed-play">▶</span>
    <strong data-ar="شاهد الفيديوهات" data-fr="Voir les vidéos">شاهد الفيديوهات</strong>
  </button>`;
  $("#reelOpenBtn").addEventListener("click",()=>showVideo(state.videoIndex,true));
  setLanguage(state.lang);
}
function closeReel(){
  state.videoOpen=false;
  renderReelClosed();
}
function nextVideo(){
  if(!state.videos.length)return;
  state.videoIndex=(state.videoIndex+1)%state.videos.length;
  showVideo(state.videoIndex,true);
}
function showVideo(index,autoPlay=true){
  if(!state.videos.length)return;
  state.videoIndex=(index+state.videos.length)%state.videos.length;
  const item=state.videos[state.videoIndex];
  const frame=$("#reelFrame");
  state.videoOpen=true;
  renderVideoTabs();
  const controls=`<div class="reel-controls">
    <button type="button" class="reel-control" id="reelCloseBtn" aria-label="${t("إغلاق الفيديو","Fermer la vidéo")}">×</button>
    <button type="button" class="reel-control" id="reelPrevBtn" aria-label="${t("الفيديو السابق","Vidéo précédente")}">→</button>
    <button type="button" class="reel-control" id="reelNextBtn" aria-label="${t("الفيديو التالي","Vidéo suivante")}">←</button>
  </div>`;
  frame.classList.add("playing");
  frame.innerHTML=controls+`<div class="reel-player" id="reelPlayer"></div>`;
  const player=$("#reelPlayer");
  $("#reelCloseBtn").addEventListener("click",closeReel);
  $("#reelPrevBtn").addEventListener("click",()=>showVideo(state.videoIndex-1,true));
  $("#reelNextBtn").addEventListener("click",()=>showVideo(state.videoIndex+1,true));
  $("#reelLink").href=item.url; $("#reelLink").textContent=platformLabel(item.type)+" ↗"; $("#reelLink").hidden=false;

  if(item.type==="video"){
    setReelAspect("9/16");
    player.innerHTML=`<video id="reelVideo" controls playsinline preload="metadata" src="${item.url}" title="MOULE PLEXY video"></video>`;
    const v=$("#reelVideo");
    v.addEventListener("loadedmetadata",()=>{if(v.videoWidth&&v.videoHeight)setReelAspect(`${v.videoWidth}/${v.videoHeight}`)});
    v.addEventListener("ended",nextVideo);
    if(autoPlay){v.play().catch(()=>{});}
  }else if(item.type==="instagram"){
    setReelAspect("9/16");
    player.innerHTML=`<iframe src="https://www.instagram.com/reel/${instagramId(item.url)}/embed" loading="lazy" allowtransparency="true" allowfullscreen title="MOULE PLEXY Instagram Reel"></iframe>`;
  }else if(item.type==="youtube"){
    setReelAspect("9/16");
    player.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(item.url)}?rel=0&modestbranding=1" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="MOULE PLEXY YouTube video"></iframe>`;
  }else if(item.type==="tiktok"){
    setReelAspect("9/16");
    player.innerHTML=`<iframe src="https://www.tiktok.com/player/v1/${tiktokId(item.url)}?description=0&music_info=0&rel=0" loading="lazy" allow="autoplay; fullscreen" allowfullscreen title="MOULE PLEXY TikTok video"></iframe>`;
  }else if(item.type==="facebook"){
    setReelAspect("9/16");
    player.innerHTML=`<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.url)}&show_text=false&autoplay=${autoPlay?1:0}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen title="MOULE PLEXY Facebook video"></iframe>`;
  }else{
    setReelAspect("9/16");
    player.innerHTML=`<a class="reel-placeholder" href="${item.url}" target="_blank" rel="noopener"><div class="play-ring">▶</div><h3>${t("مشاهدة الفيديو","Voir la vidéo")}</h3></a>`;
  }
}
async function loadReel(){
  try{
    const r=await fetch("link%20video%20reel.txt",{cache:"no-store"});
    const raw=await r.text();
    state.videos=raw.split(/\r?\n/).map(x=>x.trim()).filter(x=>x && !x.startsWith("#")).map(url=>({
      url:url.replace(/[<>]/g,"").trim(),
      type:videoType(url.replace(/[<>]/g,"").trim())
    }));
    state.videoIndex=0;
    renderVideoTabs();
    if(state.videos.length)showVideo(0,false);
    else renderReelClosed();
  }catch(e){renderReelClosed();}
}
loadSiteConfig();
loadCatalog();
loadReel();
setLanguage("ar");
