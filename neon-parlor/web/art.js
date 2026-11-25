"use strict";
const $=id=>document.getElementById(id), TAU=Math.PI*2;
const pink="#c06b48", ivory="#ebcf95", mint="#a5b79a", blue="#b6bdab";
const VALUE=i=>Math.floor(i/2)+1, COLOR=i=>i%2?"백":"흑";
const suits=["♠","♥","♦","♣"],rank=c=>c%13+2,suit=c=>Math.floor(c/13),face=c=>"23456789TJQKA"[c%13].replace("T","10");
const symbolNames=["7","체리","다이아","종","별"];
let ctx;
function fill(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function disk(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill()}
function stroke(x,y,r,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke()}
function txt(s,x,y,size,color,align="center",italic=false){ctx.textAlign=align;ctx.font=(italic?"italic ":"bold ")+size+"px Georgia, Batang, serif";ctx.fillStyle=color;ctx.fillText(s,x,y)}
function metal(a,b,c){let g=ctx.createLinearGradient(-95,-115,90,135);[[0,c],[.18,b],[.36,a],[.52,b],[.73,c],[.89,a],[1,b]].forEach(([n,v])=>g.addColorStop(n,v));return g}
function wheel(x,y,r,a,b){ctx.save();ctx.translate(x,y);ctx.scale(r/150,r/150);
 ellipse(4,8,151,150,"#0b1510");const gold=metal("#f8dfa0","#b58b4f","#65462d"),wood=metal("#a56c41","#76422c","#3c291e");
 disk(0,0,150,gold);disk(0,0,146,wood);stroke(0,0,141,"#bd9158",1.5);stroke(0,0,137,"#4d3028",5);stroke(0,0,133,"#d7b878",2);
 ctx.save();ctx.rotate(a);for(let i=0;i<12;i++){let s=i*TAU/12,m=s+TAU/24;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,131,s,s+TAU/12);ctx.closePath();ctx.fillStyle=i%2?"#d8c6a3":"#222822";ctx.fill();ctx.strokeStyle="#a58859";ctx.lineWidth=1.6;ctx.stroke();
 ctx.save();ctx.rotate(m);ctx.translate(115,0);ctx.rotate(Math.PI/2);txt(VALUE(i),0,6,22,i%2?"#433728":"#f7e3b9");ctx.restore()}ctx.restore();
 disk(0,0,99,gold);let bowl=ctx.createRadialGradient(-18,24,4,0,0,101);[[0,"#b68050"],[.55,"#97603a"],[.64,"#825035"],[.8,"#905734"],[1,"#683d2a"]].forEach(([v,c])=>bowl.addColorStop(v,c));disk(0,0,96,bowl);
 for(let i=0;i<25;i++){ctx.beginPath();ctx.arc(0,1,42+i*2.08,1.2+Math.sin(i)*.7,4.9+Math.cos(2*i)*.7);ctx.strokeStyle=i%2?"#e9bd7a15":"#3b241612";ctx.lineWidth=.8;ctx.stroke()}
 stroke(0,0,53,"#603d28",2);stroke(0,0,51,"#c1935d",1);ctx.save();ctx.rotate(a*.85-.33);for(let i=0;i<4;i++){ctx.rotate(TAU/4);fill(0,-2,37,4,gold);disk(37,0,5,gold)}ctx.restore();disk(0,0,12,"#513724");disk(0,0,9,gold);disk(-2,-2,3,"#eed7a0");
 let bx=Math.cos(b)*126,by=Math.sin(b)*126;disk(bx+1.8,by+2,5,"#473a2f");let ball=ctx.createRadialGradient(bx-2,by-2,0,bx,by,5);ball.addColorStop(0,"#fffce7");ball.addColorStop(.55,"#f3d995");ball.addColorStop(1,"#976c42");disk(bx,by,5,ball);ctx.restore()}
function rounded(x,y,w,h,r,color){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill()}
function card(x,y,c,w=48,h=68,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);rounded(2,4,w,h,4,"#0b1918a0");rounded(0,0,w,h,4,"#c2a77b");rounded(1,1,w-2,h-3,4,c==null?"#63402e":"#f6e9cd");
 if(c==null){ctx.save();ctx.beginPath();ctx.rect(4,4,w-8,h-8);ctx.clip();fill(3,3,w-6,h-6,"#813f33");for(let i=-h;i<w+h;i+=7){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+h,h);ctx.moveTo(i,h);ctx.lineTo(i+h,0);ctx.strokeStyle="#dfc19385";ctx.lineWidth=.8;ctx.stroke()}ctx.restore();disk(w/2,h/2,w*.19,"#6b382f");txt("✧",w/2,h*.56,w*.28,ivory)}
 else {let ink=[1,2].includes(suit(c))?"#a44034":"#26342e";txt(face(c),5,h*.24,w*.34,ink,"left");txt(suits[suit(c)],w*.53,h*.71,w*.72,ink);ctx.save();ctx.translate(w-4,h-3);ctx.rotate(Math.PI);txt(face(c),0,h*.16,w*.23,ink,"left");ctx.restore()}ctx.restore()}
function symbol(i,x,y,z){let c=["#a14032","#a5473c","#347261","#9e702d","#a66e31"][i];if(i===3){ctx.save();ctx.translate(x,y);ctx.scale(z,z);disk(0,-9,2,c);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-9,7);ctx.quadraticCurveTo(-6,4,-6,-2);ctx.bezierCurveTo(-6,-11,6,-11,6,-2);ctx.quadraticCurveTo(6,4,9,7);ctx.closePath();ctx.fill();disk(0,9,2,c);ctx.restore();return}if(i===1){disk(x-5*z,y+3*z,5*z,c);disk(x+5*z,y+5*z,5*z,c);ctx.beginPath();ctx.moveTo(x-5*z,y);ctx.quadraticCurveTo(x+2*z,y-19*z,x+8*z,y-9*z);ctx.lineTo(x+5*z,y+1*z);ctx.strokeStyle="#476649";ctx.lineWidth=2*z;ctx.stroke();return}txt(["7","","♦","♟","★"][i],x,y+10*z,30*z,c)}
function cabinet(x,y,s,t,values=[0,0,0],elapsed=-1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);let gold=metal("#eacf93","#af8853","#5c412c");rounded(-90,-55,185,119,8,"#0a1713");rounded(-94,-63,184,121,8,gold);rounded(-90,-59,176,113,6,"#613d2b");rounded(-85,-54,166,28,4,"#25362a");txt("LUCKY  SEVEN",-2,-34,18,ivory);for(let i=0;i<15;i++)disk(-79+i*11,-21,1.7,(i+Math.floor(t*5))%4?"#ca9b59":"#ffe2a5");
 for(let j=0;j<3;j++){let xx=-82+j*55;rounded(xx,-16,50,51,3,"#382c21");let g=ctx.createLinearGradient(0,-15,0,34);g.addColorStop(0,"#ac9976");g.addColorStop(.35,"#fff0d1");g.addColorStop(.65,"#f1dfbf");g.addColorStop(1,"#ab9473");fill(xx+2,-14,46,47,g);ctx.save();ctx.beginPath();ctx.rect(xx+2,-14,46,47);ctx.clip();let dur=.85+j*.44,tr=elapsed>=0&&elapsed<dur?13*(1-elapsed/dur)**1.5:0;for(let n=-1;n<=1;n++)symbol((values[j]+Math.floor(tr)+n+50)%5,xx+25,8+(n-tr%1)*49,1.35);ctx.restore()}
 fill(-65,42,130,2,gold);fill(91,-6,4,32,gold);disk(93,-8,7,"#ab5342");disk(91,-10,2,"#e5a37c");ctx.restore()}
function chips(x,y,n,color="#924b39"){for(let i=0;i<n;i++){let yy=y-i*4;ellipse(x,yy+1,15,5,"#594630");ellipse(x,yy-1,15,4.8,color);for(let a=0;a<6;a++){let k=a*TAU/6;fill(x+12*Math.cos(k)-1,yy+3.6*Math.sin(k)-1,3,2,ivory)}ellipse(x,yy-1,8,2.8,"#c2a372");ellipse(x,yy-1,6.7,2.2,color)}}
const feltCache=new Map();
function field(w,h){const key=w+"x"+h;if(feltCache.has(key)){ctx.drawImage(feltCache.get(key),0,0);return}
 const target=ctx, layer=document.createElement("canvas");layer.width=w;layer.height=h;ctx=layer.getContext("2d");let g=ctx.createRadialGradient(w*.55,h*.3,1,w*.55,h*.3,w*.65);g.addColorStop(0,"#31533e");g.addColorStop(.65,"#1c372a");g.addColorStop(1,"#14271f");fill(0,0,w,h,g);for(let j=0;j<h;j+=5)for(let i=(j%2)*3;i<w;i+=7)fill(i,j,1,1,"#c2c99a0d");feltCache.set(key,layer);ctx=target;ctx.drawImage(layer,0,0)}
function hero(t){ctx=$("heroArt").getContext("2d");ctx.clearRect(0,0,600,310);wheel(290,156,141,-.6+t*.032,.45+t*.032);card(428,161,25,55,78,-.17);card(460,156,12,55,78,.16);chips(421,249,4);chips(454,251,2,"#344d3f");}
function preview(i,t){ctx=$("tile"+i).getContext("2d");field(300,140);if(i===0)cabinet(148,74,.92,t);if(i===1)wheel(150,70,62,t*.066,-.9+t*.066);if(i>=2){card(116,30,i===2?11:25,50,72,-.22);card(152,23,i===2?24:9,50,72,.15);chips(201,109,3,i===2?"#90553f":"#3b5544")}}
