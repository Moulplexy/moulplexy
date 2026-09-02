const DEFAULT_CONFIG={
  GMAIL:"moulplexy@gmail.com",
  WHATSAPP:"+212627709956",
  INSTAGRAM:"https://www.instagram.com/moulplexy/",
  TIKTOK:"https://www.tiktok.com/@moulplexy",
  FACEBOOK:"https://www.facebook.com/moulplexy",
  YOUTUBE:"https://www.youtube.com/@moulplexy"
};
let siteConfig={...DEFAULT_CONFIG};
const state={lang:"ar",category:"plexi",items:[],selected:null};

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
  $("#modalImg").src=encodeURI(item.url);
  $("#modalImg").alt=categoryMeta[state.category][state.lang==="ar"?"ar":"fr"];
  $("#productModal").classList.add("open");
  $("#productModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  updateModalText();
}
function closeModal(){
  $("#productModal").classList.remove("open");
  $("#productModal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
$("#modalClose").addEventListener("click",closeModal);
$(".modal-backdrop").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

function updateModalText(){
  if(!state.selected)return;
  const meta=categoryMeta[state.category];
  $("#modalCategory").textContent=meta[state.lang==="ar"?"ar":"fr"].toUpperCase();
  $("#modalTitle").textContent=state.lang==="ar"?"اختيارك جاهز للتخصيص":"Votre sélection est prête à être personnalisée";
  $("#modalDescription").textContent=state.lang==="ar"?meta.descAr:meta.descFr;
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
function directVideo(url){return /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i.test(url);}
function setReelAspect(ratio){
  const frame=$("#reelFrame");
  if(frame)frame.style.aspectRatio=ratio;
}
async function loadReel(){
  try{
    const r=await fetch("link%20video%20reel.txt",{cache:"no-store"});
    const raw=await r.text();
    const url=raw.split(/\r?\n/).map(x=>x.trim()).find(x=>x && !x.startsWith("#"))||"";
    if(!url)return;
    const clean=url.replace(/[<>]/g,"").trim();
    $("#reelLink").href=clean; $("#reelLink").hidden=false;
    const frame=$("#reelFrame");
    const yt=youtubeId(clean), ig=instagramId(clean);
    if(directVideo(clean)){
      frame.innerHTML=`<video id="reelVideo" controls playsinline preload="metadata" src="${clean}" title="MOULE PLEXY video"></video>`;
      setReelAspect("16/9");
      const v=$("#reelVideo");
      v.addEventListener("loadedmetadata",()=>{if(v.videoWidth&&v.videoHeight)setReelAspect(`${v.videoWidth}/${v.videoHeight}`)});
    }else if(ig){
      setReelAspect("9/16");
      frame.innerHTML=`<iframe src="https://www.instagram.com/reel/${ig}/embed" loading="lazy" allowtransparency="true" allowfullscreen title="MOULE PLEXY Reel"></iframe>`;
    }else if(yt){
      setReelAspect("16/9");
      frame.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="MOULE PLEXY video"></iframe>`;
    }else if(tiktokId(clean)){
      setReelAspect("9/16");
      frame.innerHTML=`<iframe src="https://www.tiktok.com/player/v1/${tiktokId(clean)}?description=0&music_info=0" loading="lazy" allow="autoplay; fullscreen" allowfullscreen title="MOULE PLEXY video"></iframe>`;
    }else{
      setReelAspect("16/9");
      frame.innerHTML=`<a class="reel-placeholder" href="${clean}" target="_blank" rel="noopener"><div class="play-ring">▶</div><h3>${t("مشاهدة الفيديو","Voir la vidéo")}</h3><p>${clean}</p></a>`;
    }
  }catch(e){}
}
loadSiteConfig();
loadCatalog();
loadReel();
setLanguage("ar");
