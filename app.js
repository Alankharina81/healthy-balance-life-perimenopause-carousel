const sampleSlides = [
  { title: "Perimenopause adalah masa transisi menuju menopause.", body: "Jadi, kamu belum menopause. Tetapi ovarium dan hormon reproduksi mulai mengalami perubahan. Dan perubahan ini bisa terjadi bertahap, bukan tiba-tiba.", emphasis: "Menopause sendiri baru dikatakan terjadi setelah 12 bulan berturut-turut tidak mengalami menstruasi." },
  { title: "Apa yang mulai berubah di dalam tubuh?", body: "Selama masa transisi, kadar hormon seperti estrogen dan progesteron dapat naik turun. Pola perubahan ini berbeda pada setiap perempuan dan dapat memengaruhi siklus menstruasi.", emphasis: "Perubahan hormon tidak selalu berlangsung dengan pola yang sama pada setiap orang." },
  { title: "Tanda-tandanya bisa berbeda.", body: "Sebagian perempuan mengalami perubahan siklus menstruasi, rasa panas mendadak, gangguan tidur, perubahan suasana hati, atau perubahan konsentrasi. Sebagian lainnya hanya merasakan sedikit perubahan.", emphasis: "Tidak semua perempuan mengalami gejala yang sama atau pada waktu yang sama." },
  { title: "Bukan berarti kamu harus menghadapinya sendirian.", body: "Mencatat perubahan siklus dan keluhan dapat membantu kamu memahami pola tubuh. Jika gejala mengganggu aktivitas, konsultasikan dengan tenaga kesehatan untuk mendapatkan penilaian yang sesuai.", emphasis: "Informasi yang tepat membantu kamu mengambil keputusan yang lebih tenang." }
];
const $ = s => document.querySelector(s);
const topic = $("#topic");
const subtitle = $("#subtitle");
const fieldWrap = $("#slideFields");
const canvas = $("#slideCanvas");
const thumbs = $("#thumbs");
let slides = sampleSlides.map(s => ({...s}));
let active = 0;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function highlightTitle(s){
  const terms = ["PERIMENOPAUSE","MENOPAUSE","HORMON","TUBUH","USIA 40-AN"];
  let out = esc(s);
  for(const term of terms){
    const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + ")","ig");
    out = out.replace(re,'<span class="accent">$1</span>');
  }
  return out;
}
function renderFields(){
  fieldWrap.innerHTML = slides.map((s,i)=>'<div class="field"><div class="field-head"><span>SLIDE 0'+(i+2)+'</span><span>EDUCATIONAL CONTENT</span></div><label>Judul penjelasan</label><textarea data-i="'+i+'" data-k="title" maxlength="150">'+esc(s.title)+'</textarea><label>Isi penjelasan</label><textarea data-i="'+i+'" data-k="body" maxlength="420">'+esc(s.body)+'</textarea><label>Kalimat sorotan</label><textarea data-i="'+i+'" data-k="emphasis" maxlength="220">'+esc(s.emphasis)+'</textarea></div>').join("");
}
function renderThumbs(){
  thumbs.innerHTML = Array.from({length:5},(_,i)=>'<button class="thumb'+(i===active?' active':'')+'" data-slide="'+i+'" type="button">Slide '+(i+1)+'</button>').join("");
  thumbs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{active=Number(b.dataset.slide);render();}));
}
function render(){
  const n=String(active+1).padStart(2,"0");
  $("#counter").textContent=n+" / 05";
  thumbs.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===active));
  const top='<div class="slide-top"><span>HEALTHY BALANCE LIFE</span><span>'+n+' / 05</span></div>';
  const bottom='<div class="slide-bottom"><span>WELLNESS EDUCATION · WOMEN 35+</span><span>COACH KHARINA</span></div>';
  if(active===0){
    canvas.innerHTML=top+'<div class="cover-content"><span class="kicker">WOMEN’S HEALTH / WELLNESS NOTES</span><h2>'+highlightTitle(topic.value||"JUDUL UTAMA CAROUSEL")+'</h2><p>'+esc(subtitle.value||"Tambahkan subjudul atau konteks singkat untuk cover.")+'</p><div class="cover-mark">UNDERSTAND YOUR BODY · OWN YOUR BALANCE</div></div>'+bottom;
  }else{
    const s=slides[active-1];
    canvas.innerHTML=top+'<div class="detail-content"><span class="number">INSIGHT / 0'+active+'</span><h2>'+highlightTitle(s.title)+'</h2><p>'+esc(s.body)+'</p><div class="emphasis">'+esc(s.emphasis)+'</div></div>'+bottom;
  }
}
fieldWrap.addEventListener("input",e=>{
  const t=e.target;if(!t.dataset.k)return;
  slides[Number(t.dataset.i)][t.dataset.k]=t.value;render();
});
topic.addEventListener("input",render);
subtitle.addEventListener("input",render);
$("#prevBtn").addEventListener("click",()=>{active=(active+4)%5;render();});
$("#nextBtn").addEventListener("click",()=>{active=(active+1)%5;render();});
$("#resetBtn").addEventListener("click",()=>{
  topic.value="SEBENARNYA PERIMENOPAUSE ITU APA SIH?";
  subtitle.value="Dan kenapa usia 40-an tubuh kita tiba-tiba terasa “kok beda banget?”";
  slides=sampleSlides.map(s=>({...s}));active=0;renderFields();renderThumbs();render();
});
$("#downloadBtn").addEventListener("click",async()=>{
  if(!window.htmlToImage){alert("Library ekspor belum termuat. Periksa koneksi internet lalu muat ulang halaman.");return;}
  const button=$("#downloadBtn"),original=active;button.disabled=true;button.textContent="Menyiapkan...";
  try{
    for(let i=0;i<5;i++){
      active=i;render();
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const data=await htmlToImage.toPng(canvas,{pixelRatio:1080/canvas.offsetWidth,cacheBust:true});
      const link=document.createElement("a");link.download="hbl-dark-carousel-slide-"+String(i+1).padStart(2,"0")+".png";link.href=data;link.click();
      await new Promise(resolve=>setTimeout(resolve,250));
    }
  }catch(error){console.error(error);alert("Ekspor PNG gagal. Coba lagi menggunakan browser desktop.");}
  finally{active=original;render();button.disabled=false;button.textContent="Unduh 5 slide PNG";}
});
renderFields();renderThumbs();render();
