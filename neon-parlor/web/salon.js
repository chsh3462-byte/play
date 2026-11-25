const catalogue=[
 ["황동 기계실 · 삼연 릴","러키 세븐","황동 프레임 안에서 세 개의 릴이 차례로 멈춥니다. 가운데 줄에 나란히 선 문양을 확인하세요.","같은 문양 둘은 1.5배, 셋은 8배. 세븐 세 개는 30배를 지급합니다."],
 ["회전 살롱 · 상아 구슬","모노 오빗","마호가니 원판 위로 상아빛 구슬이 반대 방향으로 흐릅니다. 칩을 고르고 흑·백 번호판에 올리세요.","색만 맞으면 1.5배, 색과 숫자를 모두 맞히면 2배입니다. 숫자만 맞으면 지급액은 0입니다."],
 ["포커룸 · 헤즈업","하버 홀덤","딜러와 마주 앉아 두 장씩 받습니다. 공용 카드가 열릴 때마다 체크하거나 칩을 더 걸 수 있습니다.","각자의 두 장과 공용 다섯 장으로 최고의 다섯 장을 만듭니다. 무승부면 팟을 반씩 나눕니다."],
 ["카드 살롱 · 트웬티원","블루아워 21","상아색 카드 두 장으로 시작합니다. 한 장을 더 받거나 손을 멈춰 딜러보다 21에 가까이 가세요.","내추럴 블랙잭은 2.5배, 일반 승리는 2배. 동점은 원금을 돌려받습니다."] ];
function handRow(hand,x,y,hide,t){let spacing=Math.min(58,425/Math.max(1,hand.length));hand.forEach((c,i)=>{let age=Math.max(0,t-(cardTimes.get(c)??-5));let p=reduced?1:1-(1-Math.min(1,age/.28))**3;ctx.globalAlpha=.35+.65*p;card(x+(i-(hand.length-1)/2)*spacing-22+(1-p)*41,y-(1-p)*28,hide(i)?null:c,44,60);ctx.globalAlpha=1})}
function stage(t){ctx=$("table").getContext("2d");field(640,350);
 if(mode<2){let e=anim?t-anim.start:-1;if(mode===0)cabinet(316,169,2.02,t,reels,reduced?-1:e);
 else{let p=anim?Math.min(1,e/2.604):0,k=reduced?1:1-(1-p)**3;wheel(318,175,156,anim?anim.a+(anim.endA-anim.a)*k:angular,anim?anim.b+(anim.endB-anim.b)*k:ballAngle)}
 chips(77,286,3,"#394e40");chips(102,292,5);chips(540,285,4);
 }else{
 ellipse(320,182,306,158,"#714b34");ellipse(320,178,303,154,"#c5a269");ellipse(320,177,298,149,"#254a37");ellipse(320,176,281,135,"#8d8960");ellipse(320,176,279,133,"#264936");chips(96,214,3);chips(548,212,5,"#425946");
 if(!player.length){card(264,130,null,50,72,-.18);card(298,124,null,50,72,.07);card(328,126,null,50,72,.2);txt(mode===2?"HARBOR HOLD’EM":"BLUE HOUR 21",320,246,18,ivory)}
 else{let h=mode===2;txt("DEALER",320,41,12,ivory);handRow(dealer,320,51,i=>!exposed&&(h||i===1),t);
 if(h){for(let i=0;i<5;i++){ctx.strokeStyle="#92a07d";ctx.strokeRect(183+i*58,140,44,60)}board.forEach((c,i)=>handRow([c],205+i*58,140,()=>false,t));txt(stages[street],320,130,13,ivory)}
 else{txt("DEALER   "+(exposed?points(dealer):(dealer.length?points(dealer.slice(0,1))+" + ?":"…")),320,148,16,ivory);txt("PLAYER   "+points(player),320,193,17,ivory)}
 handRow(player,320,226,()=>false,t);txt("PLAYER",320,306,12,ivory);if(live)txt("POT   "+(h?pot+dealerContribution:pot),539,247,14,ivory)}
 }
 if(t<winUntil&&!reduced){for(let i=0;i<28;i++){let age=1.8-(winUntil-t),a=i*2.4;ctx.globalAlpha=Math.min(1,(winUntil-t)*2);disk(322+age*Math.cos(a)*(80+i*4),170-age*(80+(i%7)*20)+age*age*50,1+i%3,ivory)}ctx.globalAlpha=1}}
function drawHistory(){let target=$("entries");target.replaceChildren();if(!historyRows.length){target.textContent="아직 끝난 판이 없습니다.";return}for(let row of historyRows){let div=document.createElement("div"),title=document.createElement("b"),detail=document.createElement("span");div.className="entry";title.textContent=games[row.mode][1]+" · "+row.result;detail.textContent="베팅 "+row.stake+" / 지급 "+row.paid+" / 순증감 "+(row.paid-row.stake>0?"+":"")+(row.paid-row.stake);div.append(title,detail);target.append(div)}}
function loadRows(){try{let rows=JSON.parse(read("journal","[]"));return Array.isArray(rows)?rows.filter(r=>r&&Number.isInteger(r.mode)&&games[r.mode]&&typeof r.result==="string"&&Number.isFinite(r.stake)&&Number.isFinite(r.paid)).slice(0,20):[]}catch{return []}}
let historyRows=loadRows();
function record(stake,paid,result){historyRows.unshift({mode,stake,paid,result});historyRows=historyRows.slice(0,20);save("journal",JSON.stringify(historyRows));drawHistory()}
function cardSummary(){if(mode<2||!player.length)return "";let names=cs=>cs.map(c=>face(c)+suits[suit(c)]).join(" ");return "내 카드 "+names(player)+"　·　딜러 "+(exposed?names(dealer):mode===2?"비공개":dealer.length?names(dealer.slice(0,1))+" + 뒷면":"배분 중")+(board.length?"　·　공용 "+names(board):"")}
function bettingGrid(){let total=tickets.reduce((s,b)=>s+b.amount,0);for(let color of ["흑","백"])for(let number=1;number<=6;number++){let bet=tickets.find(b=>b.color===color&&b.number===number),amount=bet?.amount||0;
 let b=btn("boardGrid","",()=>{if(bet)bet.amount+=unit;else tickets.push({color,number,amount:unit});controls()},"pocket "+(color==="흑"?"black":"white")+(amount?" placed":"")+(exposed&&COLOR(lastWheel)===color&&VALUE(lastWheel)===number?" winner":""),total+unit>balance);
 let small=document.createElement("span");b.textContent=number;small.textContent=color+(amount?" · "+amount+"칩":"");b.append(small);b.setAttribute("aria-label",color+" "+number+"번, 베팅 "+amount+"칩")}
 btn("controls","전체 취소",()=>{tickets=[];controls()},"",!total);btn("controls","회전 · "+total,spinWheel,"primary",!total||total>balance);$("tickets").textContent=total?"대기 베팅 "+total+"칩　·　"+tickets.filter(b=>b.amount).map(b=>b.color+" "+b.number+"번 "+b.amount+"칩").join(" / "):"번호 칸을 누를 때마다 선택한 단위만큼 칩을 올립니다."}
for(let i=0;i<4;i++){let b=document.createElement("button"),g=games[i];b.className="tile";b.innerHTML='<canvas width="300" height="140" id="tile'+i+'"></canvas><div><small>'+g[0]+'</small><strong>'+g[1]+'<em>↗</em></strong></div>';b.onclick=()=>{tone();activate(i)};$("tiles").append(b)}
$("brand").onclick=$("back").onclick=()=>activate(-1);$("featured").onclick=()=>activate(1);
$("sound").onclick=()=>{muted=!muted;save("muted",muted?"1":"0");tone();sync()};
$("refill").onclick=()=>{if(!live&&balance<10){balance+=1000;save("chips",balance);sync();if(mode>=0)controls()}};
let last=-1;function frame(ms){if(ms-last>=32){let t=ms/1000;if(mode<0){hero(reduced?0:t);for(let i=0;i<4;i++)preview(i,reduced?0:t)}else stage(t);last=ms}requestAnimationFrame(frame)}
drawHistory();sync();requestAnimationFrame(frame);
