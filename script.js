const $ = (s) => document.querySelector(s);
const screens = [...document.querySelectorAll(".screen")];
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W, H, particles = [], fireworks = [], running = true;
let personName = "";
let personAge = 0;

function resize(){
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+"px";
  canvas.style.height = innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize",resize); resize();

function show(id){
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
}
function rand(a,b){return Math.random()*(b-a)+a}

function burst(x,y,count=110,colors=["#ff63d8","#8e67ff","#62e9ff","#ffd866","#ffffff"]){
  for(let i=0;i<count;i++){
    const a=rand(0,Math.PI*2), speed=rand(2,10);
    particles.push({
      x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-rand(1,4),
      g:.16,life:rand(55,110),size:rand(2,5),
      color:colors[(Math.random()*colors.length)|0],rot:rand(0,6.28),vr:rand(-.15,.15),
      shape:Math.random()>.45?"rect":"dot"
    });
  }
}
function firework(x=rand(60,innerWidth-60),y=rand(60,innerHeight*.65)){
  const colors=["#ff6bdc","#9b72ff","#63e9ff","#ffd86b"];
  for(let i=0;i<80;i++){
    const a=Math.PI*2*i/80+rand(-.05,.05), s=rand(2,7);
    fireworks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:70,color:colors[(Math.random()*colors.length)|0]});
  }
}
function animate(){
  if(!running)return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.vy*=.99;p.rot+=p.vr;p.life--;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.life/100);
    ctx.fillStyle=p.color;
    if(p.shape==="rect")ctx.fillRect(-p.size,-p.size/2,p.size*2,p.size);
    else{ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  });
  particles=particles.filter(p=>p.life>0);
  fireworks.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.055;p.vx*=.985;p.vy*=.985;p.life--;
    ctx.globalAlpha=Math.max(0,p.life/70);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,2,0,7);ctx.fill();
  });
  fireworks=fireworks.filter(p=>p.life>0);ctx.globalAlpha=1;
  requestAnimationFrame(animate);
}
animate();

function explosion(){
  document.body.classList.add("shake","flash");
  setTimeout(()=>document.body.classList.remove("shake","flash"),700);
  burst(innerWidth/2,innerHeight*.54,280);
  setTimeout(()=>burst(rand(20,innerWidth-20),rand(80,innerHeight*.65),120),220);
  setTimeout(()=>burst(rand(20,innerWidth-20),rand(80,innerHeight*.65),120),450);
  setTimeout(()=>show("nameScreen"),850);
}

function cleanName(value){
  return value.trim().replace(/\s+/g," ").slice(0,40);
}

function updatePersonalization(){
  $("#personalGreeting").textContent = `Untuk ${personName} ✦`;
  $("#letterTitle").innerHTML = `Untuk ${escapeHtml(personName)}<br>yang istimewa.`;
  $("#finalName").textContent = `${personName}!`;
  $("#finalText").textContent =
    `${personName}, semoga usia ${personAge} ini menjadi awal dari banyak cerita indah yang akan kamu banggakan nanti.`;
}

function escapeHtml(text){
  const div=document.createElement("div");
  div.textContent=text;
  return div.innerHTML;
}

function typeLetter(){
  const text =
`Hai ${personName}.

Selamat ulang tahun yang ke-${personAge}. ♡

Hari ini mungkin terlihat seperti satu tanggal biasa, tapi sebenarnya hari ini adalah pengingat bahwa kamu sudah sampai sejauh ini. Ada banyak hal yang sudah kamu lewati, banyak cerita yang mungkin tidak semua orang tahu, dan banyak versi dirimu yang sudah tumbuh sedikit demi sedikit sampai menjadi dirimu yang sekarang.

Di usia ${personAge} ini, aku berharap kamu tidak terlalu keras kepada dirimu sendiri. Kalau ada hari ketika semuanya terasa berantakan, semoga kamu tetap ingat bahwa tidak apa-apa untuk berhenti sebentar, menarik napas, lalu mencoba lagi. Kamu tidak harus selalu punya semua jawaban sekarang.

Semoga hal-hal yang kamu inginkan perlahan menemukan jalan menuju kamu. Semoga kamu bertemu lebih banyak orang yang tulus, mendapatkan lebih banyak alasan untuk tertawa, dan punya keberanian untuk mengejar hal-hal yang benar-benar kamu inginkan.

Kalau suatu hari kamu merasa kecil atau tidak berarti, ingatlah satu hal: perjalananmu belum selesai. Masih ada banyak tempat yang belum kamu datangi, banyak kenangan yang belum kamu buat, banyak kesempatan yang belum datang, dan banyak versi bahagia dari dirimu yang masih menunggu untuk ditemukan.

Jadi untuk hari ini, jangan pikirkan terlalu banyak hal. Nikmati harimu. Rayakan dirimu. Tersenyumlah sebanyak yang kamu bisa.

Selamat ulang tahun, ${personName}. Semoga ${personAge} menjadi halaman baru yang jauh lebih indah dari halaman-halaman sebelumnya.

Dan semoga, ketika kamu melihat kembali surat kecil ini suatu hari nanti, kamu masih bisa tersenyum karena pernah ada seseorang yang berharap kamu baik-baik saja. ♡`;

  const el=$("#letterText");
  el.textContent="";
  let i=0;
  const tick=()=>{
    if(i<text.length){
      el.textContent+=text[i++];
      setTimeout(tick,text[i-1]==="\n"?260:13);
    }
  };
  tick();
}

/* CAKE -> NAME */
$("#cake").addEventListener("click",()=>{
  if($("#intro").classList.contains("active")){
    burst(innerWidth/2,innerHeight*.62,100);
    setTimeout(explosion,280);
  }
});
$("#cake").addEventListener("keydown",e=>{
  if(e.key==="Enter"||e.key===" "){e.preventDefault();$("#cake").click()}
});

/* NAME */
$("#nameBtn").addEventListener("click",()=>{
  const value=cleanName($("#nameInput").value);
  if(!value){
    $("#nameInput").focus();
    burst(innerWidth/2,innerHeight*.5,20,["#ff668f","#ffb36b","#ffffff"]);
    return;
  }
  personName=value;
  burst(innerWidth/2,innerHeight*.48,70,["#ffffff","#a979ff","#ff7de2","#65eaff"]);
  show("ageScreen");
});

$("#nameInput").addEventListener("keydown",e=>{
  if(e.key==="Enter")$("#nameBtn").click();
});

/* AGE */
function setAge(next){
  personAge=Math.max(0,Math.min(100,next));
  const el=$("#ageValue");
  el.animate(
    [{transform:"scale(.75)",opacity:.35},{transform:"scale(1.12)",opacity:1},{transform:"scale(1)",opacity:1}],
    {duration:240,easing:"cubic-bezier(.22,1,.36,1)"}
  );
  el.textContent=personAge;
  burst(innerWidth/2,innerHeight*.47,8,["#ffffff","#9b72ff"]);
}
$("#ageUp").addEventListener("click",()=>setAge(personAge+1));
$("#ageDown").addEventListener("click",()=>setAge(personAge-1));

$("#ageBtn").addEventListener("click",()=>{
  updatePersonalization();
  burst(innerWidth/2,innerHeight*.45,150);
  setTimeout(()=>show("envelopeScreen"),250);
});

/* ENVELOPE */
$("#openBtn").addEventListener("click",()=>{
  burst(innerWidth/2,innerHeight*.45,150);
  $("#envelope").animate(
    [
      {transform:"scale(1) rotate(0)",opacity:1},
      {transform:"scale(1.12) rotate(-2deg)",opacity:1},
      {transform:"scale(.05) rotate(12deg)",opacity:0}
    ],
    {duration:900,easing:"cubic-bezier(.22,1,.36,1)"}
  );
  setTimeout(()=>{show("letterScreen");typeLetter()},760);
});

/* FINAL */
$("#finishBtn").addEventListener("click",()=>{
  show("finalScreen");
  for(let i=0;i<6;i++)setTimeout(()=>firework(rand(70,innerWidth-70),rand(70,innerHeight*.58)),i*390);
  for(let i=0;i<5;i++)setTimeout(()=>burst(rand(30,innerWidth-30),rand(70,innerHeight*.7),90),i*480);
});

$("#replayBtn").addEventListener("click",()=>{
  $("#envelope").style.opacity="1";
  $("#envelope").style.transform="";
  $("#nameInput").value="";
  personName="";
  personAge=0;
  $("#ageValue").textContent="0";
  show("intro");
});

setInterval(()=>{
  if($("#finalScreen").classList.contains("active") && Math.random()<.7) firework();
},1000);

document.addEventListener("pointerdown",e=>{
  if(e.target.closest("button")||e.target.closest("#cake")||e.target.closest("input"))return;
  if($("#intro").classList.contains("active")) burst(e.clientX,e.clientY,18,["#ffffff","#a979ff","#ff7de2"]);
});
                              
