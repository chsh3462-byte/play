const games=[
 ["LUCKY SEVEN","러키 세븐","REEL MACHINE",pink,"릴 3개가 순서대로 멈춥니다. 777은 30배, 다른 그림 세 개는 8배, 같은 그림 두 개는 1.5배입니다. 배수는 베팅액을 포함한 총 지급액입니다."],
 ["MONO ORBIT","모노 오빗","ORBIT WHEEL",ivory,"흑·백에 숫자 1~6이 각각 있습니다. 칩 단위와 칸을 골라 여러 번 추가하세요. 각 베팅에서 색+숫자는 2배, 색만 맞으면 1.5배, 나머지는 0입니다. 구슬이 멈춘 칸이 당첨입니다."],
 ["HARBOR HOLD’EM","하버 홀덤","HEADS-UP POKER",mint,"딜러와 같은 앤티를 냅니다. 각자 2장과 공용 5장 중 최고의 5장으로 겨룹니다. 프리플롭·플롭·턴·리버마다 먼저 체크하거나 앤티만큼 베팅하세요. 딜러도 체크·베팅·콜·폴드할 수 있습니다. 한 거리당 베팅은 한 번이며 레이즈는 없습니다. 무승부는 팟을 반씩 나눕니다."],
 ["BLUE HOUR 21","블루아워 21","BLACKJACK",blue,"A는 1 또는 11, 그림 카드는 10입니다. 딜러는 소프트 17을 포함해 17 이상에서 스탠드합니다. 처음 두 장의 블랙잭은 2.5배, 일반 승리는 2배, 무승부는 원금 반환입니다. 더블은 첫 두 장에서 베팅액을 두 배로 올리고 한 장만 받습니다."] ];
function read(k,d){try{return localStorage.getItem("neonPier1."+k)??d}catch{return d}}
function save(k,v){try{localStorage.setItem("neonPier1."+k,v)}catch{}}
let balance=Number(read("chips",1000));if(!Number.isFinite(balance)||balance<0)balance=1000;
let muted=read("muted","1")==="1", audio, mode=-1, unit=10, live=false, busy=false, pot=0,deck=[],player=[],dealer=[],board=[],street=0,pending=false,exposed=false,tickets=[],choice="흑",numberChoice=1;
let reels=[0,0,0],lastWheel=0,angular=0,ballAngle=-1,anim=null,cardTimes=new Map(),winUntil=0;
const now=()=>performance.now()/1000, reduced=matchMedia("(prefers-reduced-motion: reduce)").matches, wait=ms=>new Promise(ok=>setTimeout(ok,reduced?30:ms));
function rnd(n){let a=new Uint32Array(1);crypto.getRandomValues(a);return Math.floor(a[0]/4294967296*n)}
function tone(f=360,d=.08,type="triangle"){if(muted)return;try{audio??=new AudioContext();if(audio.state==="suspended")audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function chime(){[440,554,659,880].forEach((v,i)=>setTimeout(()=>tone(v,.16),i*75))}
function sync(){$("wallet").textContent="◉ "+balance.toLocaleString()+" 칩";$("sound").textContent=muted?"소리 꺼짐":"소리 켜짐";$("refill").hidden=live||balance>=10;$("brand").disabled=$("back").disabled=live||busy}
function say(s){$("message").textContent=s}
function btn(id,text,fn,cls="",disabled=false){let b=document.createElement("button");b.textContent=text;b.className=cls;b.disabled=disabled;b.onclick=()=>{tone(410,.04);fn()};$(id).append(b);return b}
function spend(n){if(n>balance||n<=0)return false;balance-=n;save("chips",balance);sync();return true}
function finish(n,s){let stake=pot;record(stake,n,s);balance+=n;save("chips",balance);live=false;busy=false;exposed=true;anim=null;pot=0;if(n>stake){winUntil=now()+1.8;chime()}else tone(n?300:155,.16);say(s+"　·　지급 "+n+"칩");sync();controls()}
function freshDeck(){let d=Array.from({length:52},(_,i)=>i);for(let i=51;i>0;i--){let j=rnd(i+1);[d[i],d[j]]=[d[j],d[i]]}return d}
function deal(arr){let c=deck.pop();cardTimes.set(c,now());arr.push(c);tone(240+arr.length*80,.04);return c}
function points(hand){let v=0,aces=0;for(let c of hand){if(rank(c)===14)aces++;v+=Math.min(10,rank(c)===14?1:rank(c))}return v+(aces&&v+10<=21?10:0)}
const hands=["하이 카드","원 페어","투 페어","트리플","스트레이트","플러시","풀 하우스","포카드","스트레이트 플러시"];
function score5(cs){let rs=cs.map(rank).sort((a,b)=>b-a),counts=new Map();for(let r of rs)counts.set(r,(counts.get(r)||0)+1);
 let groups=[...counts].sort((a,b)=>b[1]-a[1]||b[0]-a[0]),flush=cs.every(c=>suit(c)===suit(cs[0])),straight=counts.size===5?(rs[0]-rs[4]===4?rs[0]:rs.join()==="14,5,4,3,2"?5:0):0;
 let type=flush&&straight?8:groups[0][1]===4?7:groups[0][1]===3&&groups[1][1]===2?6:flush?5:straight?4:groups[0][1]===3?3:groups[0][1]===2&&groups[1][1]===2?2:groups[0][1]===2?1:0;
 let tie=straight?[straight]:groups.map(p=>p[0]),n=type;for(let i=0;i<5;i++)n=n*15+(tie[i]||0);return n}
function best(cs){let hi=0;for(let a=0;a<cs.length;a++)for(let b=a+1;b<cs.length;b++)for(let c=b+1;c<cs.length;c++)for(let d=c+1;d<cs.length;d++)for(let e=d+1;e<cs.length;e++)hi=Math.max(hi,score5([cs[a],cs[b],cs[c],cs[d],cs[e]]));return hi}
const handName=n=>hands[Math.floor(n/15**5)], stages=["프리플롭","플롭","턴","리버"];
function roulettePay(t,i){return t.reduce((sum,b)=>sum+(b.color===COLOR(i)?b.amount*(b.number===VALUE(i)?2:1.5):0),0)}
function slotPay(rs){let k=new Set(rs).size;return k===1?(rs[0]===0?30:8):k===2?1.5:0}
function activate(n){if(live||busy)return;mode=n;$("lobby").hidden=n>=0;$("room").hidden=n<0;tickets=[];exposed=false;player=[];dealer=[];board=[];cardTimes.clear();winUntil=0;
 if(n>=0){let g=games[n];let info=catalogue[n];$("title").textContent=info[1];$("edition").textContent=info[0];$("intro").textContent=info[2];$("terms").textContent=info[3];$("roomTag").textContent=g[2];$("rules").textContent=g[4]+" 진행 중 창을 닫으면 건 칩은 소진됩니다.";$("rulesBox").open=false;say(n===1?"칩 단위를 고른 뒤 원하는 칸에 베팅하세요.":"칩 단위를 고르고 게임을 시작하세요.");controls()}sync();window.scrollTo(0,0)}
function controls(){
 let actions=$("controls"),stake=$("stakes");actions.replaceChildren();stake.replaceChildren();$("boardGrid").replaceChildren();$("cardsText").textContent=cardSummary();$("tickets").textContent="";
 if(!live){let l=document.createElement("span");l.className="stake";l.textContent=mode===1?"칩 단위":"베팅 칩";stake.append(l);[10,50,100].forEach(n=>btn("stakes",n,()=>{unit=n;controls()},n===unit?"chosen":""))}
 if(busy){actions.textContent=mode<2?"결과를 기다리는 중…":"카드를 펼치는 중…";return}
 if(mode===1&&!live){bettingGrid();return}
 if(!live){btn("controls",mode===0?"릴 돌리기":"카드 받기",start,"primary",balance<unit);return}
 if(mode===2){if(pending){btn("controls","콜 · "+unit,()=>poker("call"),"primary",balance<unit);btn("controls","폴드",()=>poker("fold"))}else{btn("controls","체크",()=>poker("check"),"primary");btn("controls","베팅 · "+unit,()=>poker("bet"),"",balance<unit);btn("controls","폴드",()=>poker("fold"))}}
 if(mode===3){btn("controls","히트",()=>black("hit"),"primary");btn("controls","스탠드",()=>black("stand"));btn("controls","더블",()=>black("double"),"",player.length!==2||balance<unit)}
}
async function start(){if(live||!spend(unit))return;live=true;busy=true;pot=unit;exposed=false;winUntil=0;sync();controls();
 if(mode===0){reels=[rnd(5),rnd(5),rnd(5)];anim={start:now()};say("릴이 회전합니다.");for(let i=0;i<3;i++){await wait(i?440:850);tone(330+i*130,.1,"square")}let mul=slotPay(reels);finish(unit*mul,reels.map(i=>symbolNames[i]).join(" · ")+" — "+(mul===30?"잭팟! 럭키 세븐":mul===8?"트리플 매치!":mul?"페어 적중":"매치 없음"));return}
 dealerContribution=unit;deck=freshDeck();player=[];dealer=[];board=[];street=0;pending=false;cardTimes.clear();say("딜러가 카드를 나눕니다.");
 for(let hand of [player,dealer,player,dealer]){deal(hand);await wait(160)}
 busy=false;
 if(mode===3){let p=points(player),d=points(dealer);if(p===21||d===21){finish(p===d?unit:p===21?unit*2.5:0,p===d?"양쪽 블랙잭 · 무승부":p===21?"내추럴 블랙잭!":"딜러 블랙잭");return}say("내 합계 "+p+"　·　한 장 더 받을까요?")}
 else say("프리플롭　·　내 차례입니다.");controls()
}
async function spinWheel(){let bets=tickets.slice(),total=bets.reduce((s,b)=>s+b.amount,0);if(live||!spend(total))return;live=busy=true;exposed=false;pot=total;sync();controls();lastWheel=rnd(12);let endA=angular+TAU*2+.8,endB=endA+(lastWheel+.5)*TAU/12;
 while(endB>ballAngle-TAU*3)endB-=TAU;anim={start:now(),a:angular,b:ballAngle,endA,endB};say("구슬이 궤도를 돌고 있습니다.");
 for(let i=0;i<12;i++){tone(520-i*18,.035);await wait(85+i*24)}
 angular=endA%TAU;ballAngle=endB%TAU;tickets=[];finish(roulettePay(bets,lastWheel),COLOR(lastWheel)+" "+VALUE(lastWheel)+"번 당첨")}
async function black(action){if(busy||!live)return;busy=true;controls();if(action==="double"){if(!spend(unit)){busy=false;controls();return}pot+=unit}
 if(action!=="stand"){deal(player);await wait(230);if(points(player)>21){finish(0,"버스트 · "+points(player));return}if(action!=="double"&&points(player)<21){say("내 합계 "+points(player));busy=false;controls();return}}
 exposed=true;cardTimes.set(dealer[1],now());say("딜러 차례");await wait(450);while(points(dealer)<17){deal(dealer);await wait(420)}
 let p=points(player),d=points(dealer),won=d>21||p>d;finish(won?pot*2:p===d?pot:0,(won?"플레이어 승":p===d?"무승부":"딜러 승")+" · "+p+" 대 "+d)}
let dealerContribution=0;
async function poker(action){if(busy||!live)return;busy=true;controls();
 if(action==="fold"){finish(0,"플레이어 폴드");return}
 let strength=board.length?Math.floor(best([...dealer,...board])/15**5):(rank(dealer[0])===rank(dealer[1])?2:Math.max(...dealer.map(rank))>=12?1:0);
 if(action==="bet"||action==="call"){if(!spend(unit)){busy=false;controls();return}pot+=unit}
 say("딜러가 생각 중입니다…");await wait(400);
 if(action==="bet"){if(!strength&&rnd(5)===0){finish(pot+dealerContribution,"딜러 폴드 · 팟 획득");return}dealerContribution+=unit}
 if(action==="check"&&balance>=unit&&rnd(100)<(strength?48:18)){dealerContribution+=unit;pending=true;busy=false;say("딜러가 "+unit+"칩을 베팅했습니다.");controls();return}
 pending=false;if(street===3){exposed=true;cardTimes.set(dealer[0],now());cardTimes.set(dealer[1],now());await wait(300);let p=best([...player,...board]),d=best([...dealer,...board]);let size=pot+dealerContribution;finish(p>d?size:p===d?size/2:0,(p>d?"플레이어 승":p===d?"무승부":"딜러 승")+" · 나 "+handName(p)+" / 딜러 "+handName(d));return}
 street++;for(let i=0;i<(street===1?3:1);i++){deal(board);await wait(140)}busy=false;say((action==="bet"?"딜러 콜 · ":action==="check"?"딜러 체크 · ":"콜 · ")+stages[street]+"　내 차례입니다.");controls()}

