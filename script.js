const DEFAULT_CONFIG={
  GMAIL:"moulplexy@gmail.com",
  WHATSAPP:"+212627709956",
  INSTAGRAM:"https://www.instagram.com/moulplexy/",
  TIKTOK:"https://www.tiktok.com/@moulplexy",
  FACEBOOK:"https://www.facebook.com/moulplexy",
  YOUTUBE:"https://www.youtube.com/@moulplexy"
};
let siteConfig={...DEFAULT_CONFIG};
const state={lang:"ar",category:"plexi",items:[],selected:null,customIdea:false,videos:[],videoIndex:0,colorSelections:{plexi:"",wood:"",comboPlexi:"",comboWood:"",comboUniform:""},comboMode:"separate"};

const categoryMeta={
  plexi:{ar:"Plexy",fr:"Plexy",titleAr:"اختيارات Plexy",titleFr:"Sélection Plexy",descAr:"تصاميم عصرية من Plexy للمناسبات والديكور والتخصيص.",descFr:"Créations modernes en plexy pour événements, décoration et personnalisation."},
  wood:{ar:"العود",fr:"Bois",titleAr:"اختيارات العود",titleFr:"Sélection Bois",descAr:"نماذج خشبية بدفء طبيعي ولمسة مميزة.",descFr:"Modèles en bois avec une chaleur naturelle et une finition distinctive."},
  combo:{ar:"العود + Plexy",fr:"Bois + Plexy",titleAr:"اختيارات العود + Plexy",titleFr:"Sélection Bois + Plexy",descAr:"تركيبات تجمع أناقة Plexy مع جمال الخشب.",descFr:"Des compositions qui réunissent l’élégance du plexy et le charme du bois."}
};

const materialOptions={
  plexi:[
    {group:"بليكسي miroir",items:["الغوز miroir","Argenté miroir","Doré miroir","Bronze miroir"]},
    {group:"بليكسي مصبوغ",items:["الأبيض","الأسود","الغوز / الوردي","الأحمر","الأخضر","الأزرق","الأصفر","البرتقالي","البنفسجي","الوردي","البني","البيج","الرمادي","الكحلي","الفيروزي","السماوي","الذهبي","الفضي"]}
  ],
  wood:[
    {group:"العود الطبيعي",items:["الباج","الأبيض"]},
    {group:"عود مصبوغ",items:["الأبيض","الأسود","الغوز / الوردي","الأحمر","الأخضر","الأزرق","الأصفر","البرتقالي","البنفسجي","الوردي","البني","البيج","الرمادي","الكحلي","الفيروزي","السماوي","الذهبي","الفضي"]}
  ],
  uniform:[
    {group:"ألوان العود + البليكسي",items:["الغوز miroir","Argenté miroir","Doré miroir","Bronze miroir","الأبيض","الأسود","الغوز / الوردي","الأحمر","الأخضر","الأزرق","الأصفر","البرتقالي","البنفسجي","الوردي","البني","البيج","الرمادي","الكحلي","الفيروزي","السماوي","الذهبي","الفضي"]}
  ]
};

const colorLabels={
  search:"البحث عن اللون...",
  choose:"اختر اللون",
  selected:"اللون المختار",
  separateTitle:"لون خاص لكل مادة",
  plexiTitle:"بليكسي",
  woodTitle:"العود",
  uniformTitle:"لون موحد للعود + البليكسي"
};

const standardColorHex={
  "الأبيض":"#f2f2f2","الأسود":"#111111","الغوز / الوردي":"#67c8c1","الأحمر":"#bd2525","الأخضر":"#248345","الأزرق":"#2f6fca","الأصفر":"#e0c52b","البرتقالي":"#e47b24","البنفسجي":"#7b45a4","الوردي":"#e58bab","البني":"#70462f","البيج":"#d8c29d","الرمادي":"#858585","الكحلي":"#24355f","الفيروزي":"#2bb9ad","السماوي":"#69cde4","الذهبي":"#d6ab43","الفضي":"#b9b9b9","الباج":"#cdbb96"
};
const colorBaseAssets={
  plexy:'colors/plexy/background.png',
  wood:'colors/3od/background.png',
  'combo-different':'colors/plexy_3od/background.png',
  'combo-uniform':'colors/plexy_3od/background.png'
};

// FINAL LAYERED COLOR SYSTEM:
// Every category has its own fixed background + fixed decoration + ready-made material images.
// script.js NEVER recolours the complete product image. It only stacks the selected material
// PNGs over the two fixed layers. This keeps the writing/flower/engraving and background intact.
const layeredColorAssets={
  plexy:{
    background:'colors/plexy/background.png',
    decoration:'colors/plexy/decoration.png',
    root:'colors/plexy/plexy_colors/'
  },
  wood:{
    background:'colors/3od/background.png',
    decoration:'colors/3od/decoration.png',
    root:'colors/3od/wood_colors/'
  },
  combo:{
    background:'colors/plexy_3od/background.png',
    decoration:'colors/plexy_3od/decoration.png',
    woodRoot:'colors/plexy_3od/wood_colors/',
    plexyRoot:'colors/plexy_3od/plexy_colors/'
  }
};

const colorFileNames={
  'الغوز miroir':'ghoz_miroir.png','Argenté miroir':'argente_miroir.png','Doré miroir':'dore_miroir.png','Bronze miroir':'bronze_miroir.png',
  'الأبيض':'white.png','الأسود':'black.png','الغوز / الوردي':'pink-grey.png','الأحمر':'red.png','الأخضر':'green.png','الأزرق':'blue.png','الأصفر':'yellow.png','البرتقالي':'orange.png','البنفسجي':'purple.png','الوردي':'pink.png','البني':'brown.png','البيج':'beige.png','الرمادي':'gray.png','الكحلي':'navy.png','الفيروزي':'turquoise.png','السماوي':'sky.png','الذهبي':'gold.png','الفضي':'silver.png','الباج':'baj.png'
};

function colorAssetPath(root,color){
  const file=colorFileNames[color];
  if(!file)return '';
  if(color==='الباج')return `${root}natural/${file}`;
  if(color && color.toLocaleLowerCase().includes('miroir'))return `${root}miroir/${file}`;
  return `${root}painted/${file}`;
}

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error(`Impossible de charger: ${src}`));
    img.src=encodeURI(src);
  });
}

async function composeLayeredPreview(kind,plexiColor='',woodColor=''){
  const canvas=$('#colorPreviewCanvas');
  if(!canvas)return;
  const assets=layeredColorAssets[kind];
  if(!assets)return;
  try{
    const [background,decoration]=await Promise.all([loadImage(assets.background),loadImage(assets.decoration)]);
    const canvasWidth=background.naturalWidth, canvasHeight=background.naturalHeight;
    canvas.width=canvasWidth; canvas.height=canvasHeight;
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.drawImage(background,0,0);
    ctx.drawImage(decoration,0,0);

    const images=[];
    if(kind==='plexy' && plexiColor)images.push(colorAssetPath(assets.root,plexiColor));
    if(kind==='wood' && woodColor)images.push(colorAssetPath(assets.root,woodColor));
    if(kind==='combo'){
      if(plexiColor)images.push(colorAssetPath(assets.plexyRoot,plexiColor));
      if(woodColor)images.push(colorAssetPath(assets.woodRoot,woodColor));
    }
    for(const src of images.filter(Boolean)){
      const img=await loadImage(src);
      ctx.drawImage(img,0,0);
    }
    canvas.classList.add('visible');
    $('#modalImg').style.visibility='hidden';
    $('#previewBadge').hidden=false;
  }catch(err){
    console.error(err);
    canvas.classList.remove('visible');
    $('#modalImg').style.visibility='visible';
    $('#previewBadge').hidden=true;
  }
}

function showPreviewImage(src){
  const canvas=$('#colorPreviewCanvas');
  if(canvas){canvas.classList.remove('visible');canvas.width=1;canvas.height=1;}
  $('#modalImg').style.visibility='visible';
  $('#previewBadge').hidden=true;
  $('#modalImg').src=encodeURI(src);
}

async function updateColorPreview(){
  if(!state.selected)return;
  if(state.category==='plexi'){
    const color=state.colorSelections.plexi;
    if(!color){showPreviewImage(colorBaseAssets.plexy);return;}
    await composeLayeredPreview('plexy',color,'');
    return;
  }
  if(state.category==='wood'){
    const color=state.colorSelections.wood;
    if(!color){showPreviewImage(colorBaseAssets.wood);return;}
    await composeLayeredPreview('wood','',color);
    return;
  }
  if(state.comboMode==='uniform'){
    const color=state.colorSelections.comboUniform;
    if(!color){showPreviewImage(colorBaseAssets['combo-uniform']);return;}
    await composeLayeredPreview('combo',color,color);
    return;
  }
  const plexiColor=state.colorSelections.comboPlexi;
  const woodColor=state.colorSelections.comboWood;
  if(!plexiColor && !woodColor){showPreviewImage(colorBaseAssets['combo-different']);return;}
  await composeLayeredPreview('combo',plexiColor,woodColor);
}

function renderMaterialChoices(){
  const section=$('#materialChoice'); if(!section)return;
  section.hidden=false;
  const single=$('#singleMaterialPicker'), separate=$('#separateMaterialPickers'), uniform=$('#uniformMaterialPicker'), mode=$('#comboMode');
  // IMPORTANT: some site CSS can override the native [hidden] attribute (for example with
  // display:flex !important). We therefore control visibility in two ways: hidden + an
  // inline !important display rule. This guarantees that only the active picker exists
  // visually in the combo mode.
  const setPanelVisible=(el,visible)=>{
    if(!el)return;
    el.hidden=!visible;
    el.style.setProperty('display',visible?'':'none','important');
    el.setAttribute('aria-hidden',visible?'false':'true');
  };

  // Always start by hiding ALL picker panels.
  setPanelVisible(single,false);
  setPanelVisible(separate,false);
  setPanelVisible(uniform,false);
  setPanelVisible(mode,false);
  if(state.category==='plexi'){
    setPanelVisible(single,true);
    $('#materialChoiceTitle').textContent='لون Plexy';
    $('#materialChoiceDescription').textContent='اختر لون Plexy من القائمة المتوفرة فقط.';
    renderMaterialPicker(single,'plexi','بليكسي',materialOptions.plexi);
  }else if(state.category==='wood'){
    setPanelVisible(single,true);
    $('#materialChoiceTitle').textContent='لون العود';
    $('#materialChoiceDescription').textContent='اختر لون العود من القائمة المتوفرة فقط.';
    renderMaterialPicker(single,'wood','العود',materialOptions.wood);
  }else{
    setPanelVisible(mode,true);
    $('#materialChoiceTitle').textContent='اختيار ألوان العود + Plexy';
    $('#materialChoiceDescription').textContent=state.comboMode==='separate'?'اختر لوناً مستقلاً لكل مادة.':'اختر لوناً واحداً مشتركاً للعود + Plexy.';
    if(state.comboMode==='separate'){
      setPanelVisible(separate,true);
      setPanelVisible(uniform,false);
      renderMaterialPicker($('#plexiPicker'),'comboPlexi','بليكسي',materialOptions.plexi);
      renderMaterialPicker($('#woodPicker'),'comboWood','العود',materialOptions.wood);
    }else{
      // Uniform mode: hide the complete separate-color section and clear its old values
      // so they can never affect the preview or the WhatsApp order.
      setPanelVisible(separate,false);
      setPanelVisible(uniform,true);
      state.colorSelections.comboPlexi='';
      state.colorSelections.comboWood='';
      renderMaterialPicker(uniform,'comboUniform','ألوان العود + البليكسي',materialOptions.uniform);
    }
  }
  updateColorPreview();
}
function colorSummary(){
  if(state.category==='plexi')return state.colorSelections.plexi||'غير محدد';
  if(state.category==='wood')return state.colorSelections.wood||'غير محدد';
  if(state.comboMode==='uniform')return `لون موحد: ${state.colorSelections.comboUniform||'غير محدد'}`;
  return `بليكسي: ${state.colorSelections.comboPlexi||'غير محدد'} | العود: ${state.colorSelections.comboWood||'غير محدد'}`;
}
$$('input[name="comboMode"]').forEach(r=>r.addEventListener('change',()=>{
  if(!r.checked)return;
  state.comboMode=r.value==='uniform'?'uniform':'separate';
  if(state.comboMode==='uniform'){
    state.colorSelections.comboPlexi='';
    state.colorSelections.comboWood='';
  }else{
    state.colorSelections.comboUniform='';
  }
  renderMaterialChoices();
  updateColorPreview();
}));

function openProduct(item){
  state.selected=item;
  state.customIdea=false;
  // Each product starts with a clean color choice so a previous item never carries its colors over.
  state.colorSelections={plexi:"",wood:"",comboPlexi:"",comboWood:"",comboUniform:""};
  state.comboMode="separate";
  $$('input[name="comboMode"]').forEach(r=>r.checked=r.value==='separate');
  $("#productModal").classList.remove("custom-mode");
  // Every gallery item opens the same dedicated color-customization model for its service.
  // The original selected item is still kept in state and its real image URL is sent to WhatsApp.
  const modelSrc = state.category==='plexi' ? colorBaseAssets.plexy : state.category==='wood' ? colorBaseAssets.wood : colorBaseAssets['combo-different'];
  $("#modalImg").src=encodeURI(modelSrc);
  $("#modalImg").alt=categoryMeta[state.category][state.lang==="ar"?"ar":"fr"];
  $("#productModal").classList.add("open");
  $("#productModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  updateModalText();
  renderMaterialChoices();
  updateColorPreview();
}
function openCustomIdea(){
  state.selected=null;
  state.customIdea=true;
  $("#productModal").classList.add("custom-mode","open");
  $("#productModal").setAttribute("aria-hidden","false");
  $("#modalImg").removeAttribute("src");
  $("#modalImg").alt="";
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
  const imgUrl=state.selected?new URL(state.selected.url,location.href).href:"";
  const modelUrl=state.category==='plexi'?new URL(colorBaseAssets.plexy,location.href).href:state.category==='wood'?new URL(colorBaseAssets.wood,location.href).href:new URL(colorBaseAssets['combo-different'],location.href).href;
  if(state.lang==="ar"){
    return `السلام عليكم، أريد طلب نموذج من MOULE PLEXY.
الفئة: ${cat}
اختيار اللون: ${colorSummary()}
${imgUrl?`رابط صورة النموذج المختار: ${imgUrl}`:"بدون نموذج محدد"}
رابط نموذج التخصيص: ${modelUrl}
الكمية: ${$("#qty").value}
المناسبة: ${occ}
المدينة: ${$("#city").value}
الصفة: ${prof}
الفكرة/التفاصيل: ${$("#idea").value||"لا توجد تفاصيل إضافية"}
شكراً.`;
  }
  return `Bonjour, je souhaite demander un modèle MOULE PLEXY.
Catégorie : ${cat}
Couleur choisie : ${colorSummary()}
${imgUrl?`Lien de l’image du modèle choisi : ${imgUrl}`:"Sans modèle précis"}
Lien du modèle de personnalisation : ${modelUrl}
Quantité : ${$("#qty").value}
Occasion : ${occ}
Ville : ${$("#city").value}
Profil : ${prof}
Idée / détails : ${$("#idea").value||"Aucun détail supplémentaire"}
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
  const pool=[];
  ["plexi","wood","combo"].forEach(cat=>{
    (state.items[cat]||[])
      .filter(x=>!x.url.toLowerCase().endsWith(".mp4"))
      .forEach(x=>pool.push(x.url));
  });

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
    `<img src="${encodeURI(urls[i])}" alt="" loading="lazy" data-slot="${i}" style="--r:${[ -5, 4, -3, 4, -4, 3 ][i]}deg">`
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
    imgs[incoming].src=encodeURI(nextUrl);

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
    <img src="assets/logo.png" alt="MOULE PLEXY">
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
