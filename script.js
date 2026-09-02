const DEFAULT_CONFIG={
  GMAIL:"moulplexy@gmail.com",
  WHATSAPP:"+212627709956",
  INSTAGRAM:"https://www.instagram.com/moulplexy/",
  TIKTOK:"https://www.tiktok.com/@moulplexy",
  FACEBOOK:"https://www.facebook.com/moulplexy",
  YOUTUBE:"https://www.youtube.com/@moulplexy"
};
let siteConfig={...DEFAULT_CONFIG};
const state={lang:"ar",category:"plexi",items:[],selected:null,customIdea:false,videos:[],videoIndex:0};

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
    if(val!==undefined) el.textContent=val;
  });
  $$("#occasion option, #profile option").forEach(el=>{
    const val=el.dataset[lang==="ar"?"ar":"fr"];
    if(val!==undefined) el.textContent=val;
  });
  $("#galleryTitle").textContent=t(categoryMeta[state.category].titleAr,categoryMeta[state.category].titleFr);
  renderGallery();
  updateModalText();
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
  ["instagram","tiktok","facebook","youtube"].forEach(k=>{const el=$(`#${k}Link`);if(el)el.href=siteConfig[k.toUpperCase()]||DEFAULT_CONFIG[k.toUpperCase()]})
  $("#year").textContent=new Date().getFullYear();
}

async function loadCatalog(){
  try{
    const res=await fetch("catalog.json",{cache:"no-store"});
    const data=await res.json();
    state.items=data;
    switchCategory("plexi");
    renderReelDecor();
  }catch(e){
    $("#gallery").innerHTML=`<div class="gallery-empty">${t("تعذر تحميل الكتالوج. تأكد من وجود catalog.json.","Impossible de charger le catalogue. Vérifiez que catalog.json est présent.")}</div>`;
  }
}

function switchCategory(cat){
  state.category=cat;
  $$(".category-card").forEach(c=>c.classList.toggle("active",c.dataset.category===cat));
  const meta=categoryMeta[cat];
  $("#galleryKicker").textContent=meta[state.lang==="ar"?"ar":"fr"].toUpperCase();
  $("#galleryTitle").textContent=t(meta.titleAr,meta.titleFr);
  renderGallery();
}

$$(".category-card").forEach(c=>c.addEventListener("click",()=>switchCategory(c.dataset.category)));

function renderGallery(){
  const items=(state.items[state.category]||[]).filter(x=>!x.url.toLowerCase().endsWith(".mp4"));
  $("#galleryCount").textContent=`${items.length} ${t("نموذج","modèles")}`;
  $("#gallery").innerHTML="";
  items.forEach((item,i)=>{
    const b=document.createElement("button");
    b.className="gallery-item";
    b.type="button";
    b.innerHTML=`<img loading="lazy" src="${encodeURI(item.url)}" alt="${categoryMeta[state.category][state.lang==="ar"?"ar":"fr"]} ${i+1}">`;
    b.addEventListener("click",()=>openProduct(item));
    $("#gallery").appendChild(b);
  });
}

function openProduct(item){
  state.selected=item;
  state.customIdea=false;
  $("#productModal").classList.remove("custom-mode");
  $("#modalImg").src=encodeURI(item.url);
  $("#modalImg").alt=categoryMeta[state.category][state.lang==="ar"?"ar":"fr"];
  $("#productModal").classList.add("open");
  $("#productModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  updateModalText();
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
  if(state.lang==="ar"){
    return `السلام عليكم، أريد طلب نموذج من MOULE PLEXY.
الفئة: ${cat}
${imgUrl?`رابط الصورة: ${imgUrl}`:"بدون نموذج محدد"}
الكمية: ${$("#qty").value}
المناسبة: ${occ}
المدينة: ${$("#city").value}
الصفة: ${prof}
الفكرة/التفاصيل: ${$("#idea").value||"لا توجد تفاصيل إضافية"}
شكراً.`;
  }
  return `Bonjour, je souhaite demander un modèle MOULE PLEXY.
Catégorie : ${cat}
${imgUrl?`Lien de l’image : ${imgUrl}`:"Sans modèle précis"}
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
    (state.items[cat]||[]).filter(x=>!x.url.toLowerCase().endsWith(".mp4")).slice(0,2).forEach(x=>pool.push(x.url));
  });
  $("#reelDecor").innerHTML=pool.map((u,i)=>`<img src="${encodeURI(u)}" alt="" loading="lazy" style="--r:${i%2?3:-4}deg">`).join("");
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
  if(frame)frame.style.aspectRatio=ratio;
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
  setReelAspect("16/9");
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
    setReelAspect("16/9");
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
    player.innerHTML=`<iframe src="https://www.tiktok.com/player/v1/${tiktokId(item.url)}?description=0&music_info=0" loading="lazy" allow="autoplay; fullscreen" allowfullscreen title="MOULE PLEXY TikTok video"></iframe>`;
  }else if(item.type==="facebook"){
    setReelAspect("9/16");
    player.innerHTML=`<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.url)}&show_text=false&autoplay=${autoPlay?1:0}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen title="MOULE PLEXY Facebook video"></iframe>`;
  }else{
    setReelAspect("16/9");
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
