/* =====================  Compléments : nomenclature des assemblages, filets, table de prépa avec étagère, cotes de pieds en X, montage  ===================== */

/* ----- nomenclature des assemblages : combien de mi-bois, de tenons (et lesquels), de chevilles, de ligatures… ----- */
function asmRows(){const only=nom.only?new Set(nom.only):null,inL=o=>!only||only.has(o.id),J={},R={},
 norm=n=>String(n||'').replace(/ (gauche|droit|droite|avant|arrière|haut|bas)\b/g,'').replace(/ \(.*\)$/,'').replace(/ \d+$/,'').trim(),
 kn=k=>{const e=KINDS.find(x=>x[0]==k);return e?e[1]:k},
 add_=(lab,pcs)=>{const r=R[lab]||(R[lab]={label:lab,qty:0,pcs:new Set()});r.qty++;if(pcs&&r.pcs.size<2)r.pcs.add(pcs)};
 objs.forEach(o=>{if(!inL(o))return;(o.ops||[]).forEach(p=>{if(p.jid&&!J[p.jid])J[p.jid]={op:p,ps:[]};if(p.jid)J[p.jid].ps.push(o)})});
 Object.values(J).forEach(g=>{const rec=g.op.rec||{},o=rec.opt||{},k=rec.k||'';if(!k||k=='coupe'||k=='pointe'||k=='quart')return;let lab;
  if(k=='mibois')lab='Mi-bois'+(o.pc?' '+Math.round(o.pc)+' %':'');
  else if(k=='cheville')lab='Cheville'+(o.d?' Ø '+Math.round(o.d)+' mm':'');
  else{lab=kn(o.style||k);if(o.d)lab+=' Ø '+Math.round(o.d)+' mm';if(o.mort)lab+=o.mort=='blind'?', mortaise borgne':', mortaise débouchante'}
  add_(lab,[...new Set(g.ps.map(p=>norm(p.name)))].slice(0,2).join(' × '))});
 objs.forEach(o=>{if(!inL(o))return;if(o.type=='lash')add_('Brêlage ('+(o.p.turns||'')+' tours)','');else if(o.type=='ph')add_(o.p.kind=='filet'?'Filet de ficelle':'Cordes (PH)','');else if(/^Cheville/.test(o.name)&&o.type=='trav'&&o.p)add_('Cheville Ø '+Math.round(o.p.d)+' mm × '+Math.round(o.p.L)+' mm','')});
 return Object.values(R).sort((a,b)=>b.qty-a.qty).map((r,i)=>({n:i+1,qty:r.qty,label:r.label,pcs:(t=>t.length>46?t.slice(0,45)+'…':t)([...r.pcs].join(' ; '))}))}
function nomAsmBuild(){const rows=asmRows(),f=nom.sz/3,rh=nom.sz*1.5,C=[['n','N°'],['qty','Qté'],['label','Assemblage'],['pcs','Pièces assemblées']],
 W=C.map(([k,l])=>Math.max(l.length,...rows.map(r=>String(r[k]).length))*1.75*f+3),w=Math.max(W.reduce((a,b)=>a+b,0),24*2.1*f);let y=rh,x=0,s='';
 const hdr=`<rect x="0" y="0" width="${fx(w)}" height="${fx(rh)}" fill="#e9edf3" stroke="#111" stroke-width=".35"/><text class="h" x="1.5" y="${fx(rh*.72)}" style="font-size:${fx(nom.sz*1.05)}px">NOMENCLATURE DES ASSEMBLAGES</text>`;
 s+=C.map(([k,l],i)=>{const t=`<text class="h" x="${fx(x+1.2)}" y="${fx(y+rh*.72)}">${esc(l)}</text>`;x+=W[i];return t}).join('')+`<line x1="0" y1="${fx(y+rh)}" x2="${fx(w)}" y2="${fx(y+rh)}" stroke="#111" stroke-width=".3"/>`;y+=rh;
 for(const r of rows){x=0;s+=C.map(([k],i)=>{const t=`<text x="${fx(x+1.2)}" y="${fx(y+rh*.72)}">${esc(r[k])}</text>`;x+=W[i];return t}).join('')+`<line x1="0" y1="${fx(y+rh)}" x2="${fx(w)}" y2="${fx(y+rh)}" stroke="#bbb" stroke-width=".15"/>`;y+=rh}
 if(!rows.length){s+=`<text x="1.5" y="${fx(y+rh*.72)}">Aucun assemblage</text>`;y+=rh}
 x=0;const vl=C.slice(0,-1).map(([k],i)=>{x+=W[i];return`<line x1="${fx(x)}" y1="${fx(rh)}" x2="${fx(x)}" y2="${fx(y)}" stroke="#666" stroke-width=".15"/>`}).join('');
 return{w,h:y,svg:`<rect x="0" y="0" width="${fx(w)}" height="${fx(y)}" fill="#fff"/>`+hdr+vl+s+`<rect class="fr" x="0" y="0" width="${fx(w)}" height="${fx(y)}" fill="none" stroke="#111" stroke-width=".5"/>`}}
function nomAsmSvg(){const b2=nomAsmBuild(),A=nom.anchor,showN=nom.show&&objs.length;let ax,ay;
 if(showN){ax=nom.x;ay=(A=='bl'||A=='br')?nom.y-b2.h-4:nom.y+(nom.bh||0)+4}else if(A=='bl'){ax=14;ay=283-b2.h}else if(A=='br'){ax=408-b2.w;ay=244-b2.h}else if(A=='tl'){ax=14;ay=14}else if(A=='tr'){ax=408-b2.w;ay=14}else{ax=nom.x;ay=nom.y}
 nom.aw=b2.w;nom.ah=b2.h;return`<g class="nm2" transform="translate(${fx(ax)} ${fx(ay)})">${b2.svg}</g>`}

/* ----- filet de ficelle : mailles en losange tendues d'un cadre à l'autre, très légèrement creusées, anneaux autour des barres ----- */
function netDiamond(P,yt,zr,xa,xb,pitch,rr){const segs=[],gap=2*yt,sag=Math.min(24,Math.max(8,gap*.035)),d=2*pitch,NS=8,ring=new Set(),
 cord=(xs,s0,xe,s1)=>{const pts=[];for(let i=0;i<=NS;i++){const t=i/NS;pts.push(P(xs+(xe-xs)*t,s0*(yt-rr)+(s1*(yt-rr)-s0*(yt-rr))*t,zr-sag*4*t*(1-t)))}for(let i=0;i<NS;i++)segs.push([pts[i],pts[i+1]])},
 rg=(x,s)=>{const key=Math.round(x)+','+s;if(ring.has(key))return;ring.add(key);const c=[];for(let i=0;i<=10;i++){const th=2*Math.PI*i/10;c.push(P(x,s*yt+rr*Math.cos(th)*0,zr+0))}
  const pts=[];for(let i=0;i<=10;i++){const th=2*Math.PI*i/10;pts.push(P(x,s*yt+Math.sin(th)*rr,zr+Math.cos(th)*rr))}for(let i=0;i<10;i++)segs.push([pts[i],pts[i+1]])};
 for(let x=xa;x+d<=xb+1e-6;x+=pitch){cord(x,-1,x+d,1);cord(x+d,-1,x,1);[x,x+d].forEach(u=>{rg(u,-1);rg(u,1)})}
 return segs}
function mkNet(par,name,P,yt,zr,xa,xb,railD){const segs=netDiamond(P,yt,zr,xa,xb,60,railD/2+3);if(!segs.length)return null;return mkObj('ph',{segs,d:2.5,kind:'filet'},null,name,'#cfc8b8',[0,0,0],[0,0,0],par)}

/* ----- Table de prépa avec étagère : traverses continues, cadre haut en mi-bois partout, filets haut et bas, contreventement ----- */
EXB.cuisine=function(P,a,q){const Lp=q.long,Wp=q.larg,H=q.h,Wc=q.lc||600,ht=q.ht,dc=q.dc,dr=q.dr||70,ty=q.etage=='filet'?'filet':'claies',mb=q.asm!='tenons';
 if(Lp<800||Wp<400||H<400)throw new Error('Table trop petite.');if(dc<8||dc>20)throw new Error('Diamètre des claies : de 8 à 20 mm.');
 if(ht<H+500)throw new Error('La colonne doit dépasser le plan de travail d’au moins 50 cm.');
 const ep=dr/2,zt=H-ep,x0=60,x1=Lp-60,x2=x1+Wc,yt=(Wp-50)/2,rp=35,ztop=ht-25,zb=Math.round(H/2)-35,e=mb?30:2,pl={};
 /* poteaux : 2 pieds côté gauche, 2 pieds hauts au milieu (table + étagère), 2 montants au bout */
 [[x0,zt+(mb?27:70),'Pied'],[x1,ztop+27,'Pied haut'],[x2,ztop+27,'Montant étagère']].forEach(([x,top,nm])=>[-1,1].forEach(s=>pl[x+','+s]=bar(`${nm} ${x==x0?'gauche':x==x1?'central':'droit'} ${s<0?'avant':'arrière'}`,P(x,s*yt,0),P(x,s*yt,top),70,a.id)));
 const post=(x,s)=>pl[x+','+s],td=p=>Math.min(30,Math.round(crossMin(p)/3));
 /* traverses continues d'un bout à l'autre : mi-bois avec le premier poteau rencontré, tenon dans le dernier */
 const through=(name,z,d,ee)=>[-1,1].map(s=>bar(name,P(x0-rp-ee,s*yt,z),P(x2+rp+2,s*yt,z),d,a.id));
 const top=through('Traverse du plateau (continue)',zt,50,e),low=through('Traverse basse (continue)',zb,40,2);
 /* cadre du plan de travail : traverse de largeur côté pied gauche (mi-bois) */
 const C0=bar('Traverse haute (largeur)',P(x0,-yt-rp-e,mb?zt:zt-80),P(x0,yt+rp+e,mb?zt:zt-80),50,a.id),C1=bar('Traverse haute (largeur)',P(x1,-yt+5,zt-28),P(x1,yt-5,zt-28),50,a.id);
 [-1,1].forEach((s,i)=>{const L=top[i];
  if(mb){try{mkMibois(L,C0,{pc:50})}catch(er){console.error('mibois cadre',er)}try{TJ(post(x0,s),C0,{mort:'thru',d:td(post(x0,s))});drill(L,P(x0,s*yt,zt),[0,0,1],td(post(x0,s))+1,'Mortaise du tenon du pied')}catch(er){console.error('tenon cadre',er)}}
  else{TJ(L,post(x0,s));}
  try{mkMibois(L,post(x1,s),{pc:50})}catch(er){console.error('mibois poteau central',er)}
  TJ(L,post(x2,s));TJ(C1,post(x1,s),{mort:'thru'});
  const B=low[i];TJ(B,post(x0,s));try{mkMibois(B,post(x1,s),{pc:50})}catch(er){console.error('mibois bas',er)}TJ(B,post(x2,s))});
 if(!mb){TJ(C0,post(x0,-1));TJ(C0,post(x0,1))}
 /* plateau du plan de travail : claies/rondins fendus sur les traverses continues */
 deckBuild(P,a,q,{x0,x1,yt,zt,dt:50,rp,pl,dc,nm:'plateau (rondins fendus)',logs:{d:dr,z:H},rails:top});
 /* étagère au niveau du plan de travail : claies sur les MÊMES traverses continues (deuxième encoche en quart de bois) */
 const ox=P(0,0,0)[0],r0=top[0].pos[0]-ox,c2={x0:x1,x1:x2,yt,rp,pl,tall:x1};
 if(ty=='claies')deckBuild(P,a,q,{...c2,zt,dt:50,dc,nm:'étagère au niveau du plan (claies droites)',rails:top});
 else mkNet(newAsm('Filet étagère au niveau du plan',a.id).id,'Filet de ficelle',P,yt,zt,x1+rp+8,x2-rp-8,50);
 /* étagère intermédiaire éventuelle (1,5 fois la hauteur du plan) : traverses propres, tenonnées */
 [1.5*H].filter(z=>z<ztop-250).forEach(z=>{z=Math.round(z);const rl=[-1,1].map(s=>{const b=bar('Traverse étagère haute',P(x1+5,s*yt,z),P(x2+rp+2,s*yt,z),50,a.id);TJ(b,post(x1,s),{mort:'thru'});TJ(b,post(x2,s));return b});
  if(ty=='claies')deckBuild(P,a,q,{...c2,zt:z,dt:50,dc,nm:'étagère haute (claies droites)',rails:rl});else mkNet(newAsm('Filet étagère haute',a.id).id,'Filet de ficelle',P,yt,z,x1+rp+8,x2-rp-8,50)});
 /* filet du bas : sous le plan de travail ET dans la colonne, sur les traverses basses continues, au plan médian des traverses */
 mkNet(newAsm('Filet du bas',a.id).id,'Filet de ficelle (bas)',P,yt,zb,x0+rp+8,x2-rp-8,40);
 /* dessus de la colonne : cadre en mi-bois sur les DEUX côtés, filet dessus */
 const tf=topFrame(P,a,q,{x0:x1,x1:x2,y:yt,zt:ztop,dl:50,dc:50,rp,pl,nameL:'Lisse haute étagère',crossZ:ztop-80});
 mkNet(newAsm('Filet du haut',a.id).id,'Filet de ficelle (haut)',P,yt,ztop,x1+rp+8,x2-rp-8,50);
 /* colonne à gauche : on tourne tout l'ensemble de 180° autour de la verticale */
 if(q.cote=='gauche'){const L=piecesOf(a.id),[mn,mx]=bounds(L),cc=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,0],R=new THREE.Matrix4().makeTranslation(cc[0],cc[1],0).multiply(new THREE.Matrix4().makeRotationZ(Math.PI)).multiply(new THREE.Matrix4().makeTranslation(-cc[0],-cc[1],0));
  L.forEach(o=>{const M0=new THREE.Matrix4().compose(new THREE.Vector3(...o.pos),new THREE.Quaternion().setFromEuler(new THREE.Euler(o.rot[0]*D,o.rot[1]*D,o.rot[2]*D,'ZYX')),new THREE.Vector3(1,1,1));setMat(o,R.clone().multiply(M0))})}};

/* ----- cotes : longueur du morceau incliné (pieds en X) ----- */
function xDims(a){const w=views.find(v=>v.k=='left');if(!w)return;vdata(w);const f=nrm(DIRS[w.k][1]),h=Math.abs(f[2])>.99?[1,0,0]:nrm(cr(f,[0,0,1])),v=cr(h,f),uv=p=>[dot(p,h),dot(p,v)],legs=piecesOf(a.id).filter(o=>/pied (montant|descendant)/.test(o.name));
 [legs.find(o=>/montant/.test(o.name)),legs.find(o=>/descendant/.test(o.name))].filter(Boolean).forEach((o,i)=>{const ax=axisOf(o);dims.push({id:did++,v:w.id,t:'d',pre:'',a:uv(ax.p0),b:uv(ax.p1),o:(i?-1:1)*14})})}

/* ----- montage : fenêtre d'action montrée à la première occurrence de chaque opération ----- */
function mtWin(s){const T=(MT_TOOLS.find(t=>t[0]==s.tool)||[])[1]||'Opération';let rows=[];
 if(s.kind=='joint'){const ops=[...new Set(s.objs.map(p=>(p.ops||[]).find(q=>q.jid==s.g.jid)).filter(Boolean).map(q=>U(q.lab||'')))],o=(s.g.op.rec||{}).opt||{};rows=['Pièces : '+s.objs.slice(0,3).map(p=>p.name).join(' + '),...ops.slice(0,3)];if(o.d)rows.push('Ø du tenon : '+Math.round(o.d)+' mm');if(o.pc)rows.push('Profondeur : '+Math.round(o.pc)+' %')}
 else{const o=s.objs[0];rows=[o.name+(o.type=='trav'&&o.p?' — Ø '+Math.round(o.p.d)+' × '+Math.round(o.p.L)+' mm':''),s.objs.length>1?s.objs.length+' pièces':''].filter(Boolean)}
 const el=document.createElement('div');el.id='mtw';el.innerHTML=`<b>${esc(T)}</b>${rows.map(r=>`<div>${esc(r)}</div>`).join('')}<button class="p">${s.kind=='joint'?'Appliquer':'Créer'}</button>`;document.body.appendChild(el);return el}
function mtStart(){const tops=Object.values(asms).filter(x=>!x.par);montage(selA!=null?selA:tops.length==1?tops[0].id:0)}

/* ===== Assistant : le fournisseur d'IA choisi par l'utilisateur (Gemini, Claude, ChatGPT, Grok, Mistral), avec SA clé ;
   la clé reste dans ce navigateur et les messages partent directement chez le fournisseur : rien ne transite par un serveur CathIA ===== */
const AIP={
 gemini:{nom:'Gemini (Google)',court:'Gemini',url:'https://aistudio.google.com/apikey',aide:'gratuite, avec un compte Google'},
 claude:{nom:'Claude (Anthropic)',court:'Claude',url:'https://console.anthropic.com/settings/keys',aide:'payante à l’usage',model:'claude-opus-5-5'},
 openai:{nom:'ChatGPT (OpenAI)',court:'ChatGPT',url:'https://platform.openai.com/api-keys',aide:'payante à l’usage',base:'https://api.openai.com/v1',pref:[/^gpt-5(\.\d+)?$/,/^gpt-5/,/^gpt-4\.1$/,/^gpt-4o$/,/^gpt/]},
 grok:{nom:'Grok (xAI)',court:'Grok',url:'https://console.x.ai',aide:'payante à l’usage',base:'https://api.x.ai/v1',pref:[/^grok-\d+(\.\d+)?$/,/^grok-\d/,/^grok/]},
 mistral:{nom:'Mistral (Le Chat)',court:'Mistral',url:'https://console.mistral.ai/api-keys',aide:'offre gratuite limitée',base:'https://api.mistral.ai/v1',model:'mistral-large-latest'}};
const GEM_MODELS=['gemini-flash-latest','gemini-2.5-flash'];
/* réglages : {p: fournisseur, k: {fournisseur: clé}, m: {fournisseur: modèle}} ; l'ancienne clé Gemini seule est reprise */
const IAC={lire(){let o=null;try{o=JSON.parse(localStorage.getItem('cathia.ia')||'null')}catch(e){}if(!o||typeof o!='object')o={p:'gemini',k:{},m:{}};o.k=o.k||{};o.m=o.m||{};if(!AIP[o.p])o.p='gemini';
  try{const g=localStorage.getItem('cathia.gk');if(g&&!o.k.gemini)o.k.gemini=g}catch(e){}return o},
 ecrire(o){try{localStorage.setItem('cathia.ia',JSON.stringify(o));localStorage.removeItem('cathia.gk')}catch(e){}}};
const GK={get:()=>{const o=IAC.lire();return o.k[o.p]||''}};
/* devine le fournisseur d'une clé collée (seulement pour présélectionner : aucune clé n'est refusée sur sa forme) */
function iaDevine(k){k=k.trim();return /^sk-ant-/.test(k)?'claude':/^xai-/.test(k)?'grok':/^sk-/.test(k)?'openai':/^(AIza|AQ\.)/.test(k)?'gemini':null}
function iaErr(code,text){const e=new Error(code);e.code=code;if(text)e.text=text;return e}
async function iaRefus(r){const j=await r.json().catch(()=>({}));const t=String((j.error&&(j.error.message||j.error.type))||j.message||j.detail||'').slice(0,200);
 if(r.status==401||r.status==403)return iaErr('badkey',t);if(r.status==429)return iaErr('rate_limited',t);return iaErr('http','Erreur '+r.status+(t?' : '+t:''))}
const ANT_H=k=>({'Content-Type':'application/json','x-api-key':k,'anthropic-version':'2026-10-21','anthropic-dangerous-direct-browser-access':'true'});
/* vérifie une clé auprès de son fournisseur ; renvoie le modèle retenu (ou celui déjà choisi) */
async function iaVerifier(p,k,m){const P=AIP[p];let r;
 if(p=='gemini')r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=50',{headers:{'x-goog-api-key':k}});
 else if(p=='claude')r=await fetch('https://api.anthropic.com/v1/models?limit=50',{headers:ANT_H(k)});
 else r=await fetch(P.base+'/models',{headers:{Authorization:'Bearer '+k}});
 if(!r.ok)throw await iaRefus(r);
 if(m)return m;if(P.model)return P.model;if(!P.pref)return'';
 const j=await r.json().catch(()=>({})),ids=(j.data||[]).map(x=>x.id).filter(Boolean).sort().reverse();
 for(const re of P.pref){const f=ids.find(i=>re.test(i));if(f)return f}return ids[0]||''}
function iaSchema(t){const s=t.inputSchema&&t.inputSchema.properties&&Object.keys(t.inputSchema.properties).length?t.inputSchema:{type:'object',properties:{}};const{$schema,...o}=s;return o}
function geminiSchema(s){if(!s||typeof s!='object')return s;const o={};for(const k in s){if(k=='additionalProperties'||k=='$schema')continue;o[k]=k=='properties'?Object.fromEntries(Object.entries(s[k]).map(([p,v])=>[p,geminiSchema(v)])):geminiSchema(s[k])}return o}
async function iaOutil(tools,name,args){const t=tools.find(x=>x.name==name);try{return String(t?await t.execute(args||{}):'Outil inconnu')}catch(e){return'Erreur : '+e.message}}

async function geminiChat(key,lead,turns,opt,tools,emit){
 const contents=turns.map(m=>({role:m.role=='assistant'?'model':'user',parts:[{text:String(m.content)}]}));
 if(opt.images&&opt.images.length&&contents.length){const last=contents[contents.length-1];for(const b of opt.images)last.parts.push({inline_data:{mime_type:b.type||'image/jpeg',data:await b64of(b)}})}
 const decl=tools.map(t=>({name:t.name,description:t.description||t.name,...(t.inputSchema&&t.inputSchema.properties&&Object.keys(t.inputSchema.properties).length?{parameters:geminiSchema(t.inputSchema)}:{})}));
 for(let it=0;it<8;it++){
  const body={systemInstruction:{parts:[{text:String(lead.content)}]},contents,generationConfig:{temperature:.4,maxOutputTokens:2048}};if(decl.length)body.tools=[{functionDeclarations:decl}];
  let r=null;for(const m of GEM_MODELS){r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(body),signal:opt.signal});if(r.status!=404)break}
  if(r.status==400){const j=await r.clone().json().catch(()=>({}));if(/api key|API_KEY/i.test(JSON.stringify(j)))throw iaErr('badkey',(j.error&&j.error.message||'').slice(0,200))}
  if(!r.ok)throw await iaRefus(r);
  const j=await r.json(),parts=(j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[],calls=parts.filter(p=>p.functionCall),tx=parts.filter(p=>p.text).map(p=>p.text).join('');
  if(tx)emit(tx);if(!calls.length)break;
  contents.push({role:'model',parts});const resp=[];
  for(const p of calls)resp.push({functionResponse:{name:p.functionCall.name,response:{result:await iaOutil(tools,p.functionCall.name,p.functionCall.args)}}});
  contents.push({role:'user',parts:resp})}}

async function claudeChat(key,model,lead,turns,opt,tools,emit){
 const messages=turns.map(m=>({role:m.role=='assistant'?'assistant':'user',content:String(m.content)}));
 if(opt.images&&opt.images.length&&messages.length){const last=messages[messages.length-1],c=[];for(const b of opt.images)c.push({type:'image',source:{type:'base64',media_type:b.type||'image/jpeg',data:await b64of(b)}});c.push({type:'text',text:last.content});last.content=c}
 const decl=tools.map(t=>({name:t.name,description:t.description||t.name,input_schema:iaSchema(t)}));
 const H={...ANT_H(key),'anthropic-beta':'server-side-fallback-2026-07-01'};
 for(let it=0;it<8;it++){
  const body={model:model||AIP.claude.model,max_tokens:16000,system:String(lead.content),messages,fallbacks:'default'};if(decl.length)body.tools=decl;
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:H,body:JSON.stringify(body),signal:opt.signal});
  if(!r.ok)throw await iaRefus(r);
  const j=await r.json(),content=j.content||[];
  if(j.stop_reason=='refusal'){emit('Claude a refusé de répondre à cette demande.');break}
  const tx=content.filter(b=>b.type=='text').map(b=>b.text).join('');if(tx)emit(tx);
  const calls=content.filter(b=>b.type=='tool_use');if(j.stop_reason!='tool_use'||!calls.length)break;
  // la réponse est renvoyée telle quelle (blocs de réflexion compris), puis les résultats des outils en un seul message
  messages.push({role:'assistant',content});const res=[];
  for(const c of calls)res.push({type:'tool_result',tool_use_id:c.id,content:await iaOutil(tools,c.name,c.input)});
  messages.push({role:'user',content:res})}}

async function oaiChat(p,key,model,lead,turns,opt,tools,emit){
 const P=AIP[p],messages=[{role:'system',content:String(lead.content)},...turns.map(m=>({role:m.role=='assistant'?'assistant':'user',content:String(m.content)}))];
 if(opt.images&&opt.images.length&&messages.length>1){const last=messages[messages.length-1],c=[{type:'text',text:last.content}];for(const b of opt.images)c.push({type:'image_url',image_url:{url:'data:'+(b.type||'image/jpeg')+';base64,'+await b64of(b)}});last.content=c}
 const decl=tools.map(t=>({type:'function',function:{name:t.name,description:t.description||t.name,parameters:iaSchema(t)}}));
 if(!model){model=await iaVerifier(p,key,'');const o=IAC.lire();o.m[p]=model;IAC.ecrire(o)}
 for(let it=0;it<8;it++){
  const body={model,messages};if(decl.length)body.tools=decl;
  const r=await fetch(P.base+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(body),signal:opt.signal});
  if(!r.ok)throw await iaRefus(r);
  const j=await r.json(),msg_=j.choices&&j.choices[0]&&j.choices[0].message||{},tx=typeof msg_.content=='string'?msg_.content:'';
  if(tx)emit(tx);const calls=msg_.tool_calls||[];if(!calls.length)break;
  messages.push({role:'assistant',content:msg_.content||null,tool_calls:calls});
  for(const c of calls){let a={};try{a=JSON.parse(c.function&&c.function.arguments||'{}')}catch(e){}messages.push({role:'tool',tool_call_id:c.id,content:await iaOutil(tools,c.function&&c.function.name,a)})}}}

/* l'assistant de CathIA : même interface que l'ancien (messages, options), quel que soit le fournisseur */
async function iaAssistant(messages,opt={}){const o=IAC.lire(),p=o.p,key=o.k[p]||'';if(!key)throw iaErr('nokey');
 const tools=Array.isArray(opt.tools)?opt.tools:[],lead=messages[0],turns=messages.slice(1);let text='';
 const emit=t=>{text+=(text?'\n\n':'')+t;opt.onText&&opt.onText({text})};
 try{if(p=='gemini')await geminiChat(key,lead,turns,opt,tools,emit);else if(p=='claude')await claudeChat(key,o.m.claude,lead,turns,opt,tools,emit);else await oaiChat(p,key,o.m[p],lead,turns,opt,tools,emit)}
 catch(e){if(e.name=='AbortError'){const x=iaErr('cancelled');x.text=text;throw x}if(e instanceof TypeError&&!e.code){throw iaErr('http','Le fournisseur '+AIP[p].court+' ne répond pas (réseau, ou appel depuis le navigateur bloqué).')}if(!e.text)e.text=text;throw e}
 return{text:text||'(pas de réponse)',truncated:false}}
iaAssistant.limits=async()=>({tools:true,images:true});
const geminiAI=iaAssistant;
function iaNom(){const o=IAC.lire();return o.k[o.p]?AIP[o.p].court:''}

function aiKeyDlg(){const o=IAC.lire();
 modal(`<h3>Assistant : fournisseur d’IA</h3><p class="mu">Choisissez l’IA qui anime l’assistant et collez <b>votre clé</b>. Elle reste dans ce navigateur ; vos messages partent directement chez le fournisseur, sans passer par un serveur CathIA.</p>
 <label>Fournisseur<select id="ia_p">${Object.entries(AIP).map(([k,v])=>`<option value="${k}"${k==o.p?' selected':''}>${esc(v.nom)}${o.k[k]?' ✓':''}</option>`).join('')}</select></label>
 <p class="mu" id="ia_aide" style="font-size:12px;margin:4px 0"></p>
 <label>Clé<input id="ia_k" type="password" autocomplete="off" spellcheck="false"></label>
 <label>Modèle <span class="mu" style="font-weight:400">(laisser vide : choisi automatiquement)</span><input id="ia_m" autocomplete="off" spellcheck="false"></label>
 <p id="ia_r" style="font-size:12px;min-height:16px;margin:4px 0"></p>
 <div class="r"><button class="p" id="ia_s">Vérifier et enregistrer</button><button id="ia_x">Effacer cette clé</button><button onclick="closeMd()">Fermer</button></div>`);
 const sel=$('#ia_p'),ki=$('#ia_k'),mi=$('#ia_m'),out=$('#ia_r');
 const montrer=()=>{const p=sel.value,P=AIP[p];ki.value=o.k[p]||'';mi.value=o.m[p]||'';mi.placeholder=P.model||'automatique';
  $('#ia_aide').innerHTML=`Clé ${esc(P.aide)} : <a href="${P.url}" target="_blank" rel="noopener">créer une clé ${esc(P.court)}</a>, puis collez-la ci-dessous.`;out.textContent=''};
 sel.onchange=montrer;montrer();
 ki.oninput=()=>{const d=iaDevine(ki.value);if(d&&d!=sel.value&&!o.k[sel.value]){const v=ki.value;sel.value=d;montrer();ki.value=v;out.textContent='Clé '+AIP[d].court+' reconnue.'}};
 $('#ia_s').onclick=async()=>{const p=sel.value,k=ki.value.trim(),m=mi.value.trim();if(!k){out.textContent='Collez d’abord la clé.';return}
  out.textContent='Vérification auprès de '+AIP[p].court+'…';$('#ia_s').disabled=true;
  try{const mod=await iaVerifier(p,k,m);o.p=p;o.k[p]=k;if(mod)o.m[p]=mod;else delete o.m[p];IAC.ecrire(o);closeMd();msg('Assistant prêt avec '+AIP[p].court+(mod?' ('+mod+')':'')+'.');buildRibbon()}
  catch(e){if(e.code=='badkey'){out.innerHTML='<span style="color:var(--er)">'+esc(AIP[p].court+' refuse cette clé'+(e.text?' : '+e.text:'.'))+'</span>'}
   else if(e.code||e instanceof TypeError){o.p=p;o.k[p]=k;if(m)o.m[p]=m;IAC.ecrire(o);out.textContent='Clé enregistrée, mais la vérification n’a pas abouti ('+(e.text||e.message||'réseau')+'). Essayez l’assistant.'}
   else out.textContent=e.message}
  finally{const b=$('#ia_s');if(b)b.disabled=false}};
 $('#ia_x').onclick=()=>{const p=sel.value;delete o.k[p];delete o.m[p];IAC.ecrire(o);montrer();msg('Clé '+AIP[p].court+' effacée.')}}
setTimeout(()=>{if(!window.__ai){window.__ai=iaAssistant;AI_LIM={tools:true,images:true};buildRibbon()}},120);

/* ===== Réglage précis des nombres : boutons − / +, flèches (Maj ×10, Alt ×0,1) et molette sur le champ actif ===== */
function pasDe(i){const s=parseFloat(i.step);return isFinite(s)&&s>0?s:1}
function nudge(i,dir,mult){const v=parseFloat(i.value);const base=isFinite(v)?v:0,st=pasDe(i)*mult;let n=Math.round((base+dir*st)/st)*st;
 const mn=parseFloat(i.min),mx=parseFloat(i.max);if(isFinite(mn))n=Math.max(mn,n);if(isFinite(mx))n=Math.min(mx,n);
 i.value=String(Math.round(n*1000)/1000);i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}
document.addEventListener('keydown',e=>{const i=e.target;if(!(i instanceof HTMLInputElement)||i.type!='number')return;if(e.key!='ArrowUp'&&e.key!='ArrowDown')return;
 e.preventDefault();nudge(i,e.key=='ArrowUp'?1:-1,e.shiftKey?10:e.altKey?.1:1)},true);
document.addEventListener('wheel',e=>{const i=e.target;if(!(i instanceof HTMLInputElement)||i.type!='number'||document.activeElement!==i)return;
 e.preventDefault();nudge(i,e.deltaY<0?1:-1,e.shiftKey?10:e.altKey?.1:1)},{passive:false,capture:true});
function steppers(root){root.querySelectorAll('input[type=number]:not([data-st])').forEach(i=>{i.dataset.st=1;const w=document.createElement('span');w.className='stp';
 i.parentNode.insertBefore(w,i);w.appendChild(i);[['−',-1],['+',1]].forEach(([t,d])=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.tabIndex=-1;b.title=(d>0?'Augmenter':'Diminuer')+' (Maj : ×10)';
  b.onclick=e=>{e.preventDefault();nudge(i,d,e.shiftKey?10:1);i.focus()};d<0?w.insertBefore(b,i):w.appendChild(b)})})}
{const mb=document.getElementById('mb'),sd=document.getElementById('side');const ob=new MutationObserver(()=>{if(mb)steppers(mb);if(sd)steppers(sd)});[mb,sd].forEach(n=>n&&ob.observe(n,{childList:true,subtree:true}))}
