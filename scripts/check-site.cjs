const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const nodes={};
function element(value=''){return {value,textContent:'',innerHTML:'',hidden:false,setAttribute(){},addEventListener(){},querySelectorAll(){return [];},classList:{add(){},remove(){},toggle(){}}};}
const context={console,URL,Date,setTimeout,clearTimeout,document:{addEventListener(){},querySelectorAll(){return [];},getElementById(id){return nodes[id]||null;}},location:{search:'',hash:''},navigator:{},localStorage:{getItem(){return null;}},performance:{now(){return 0;}}};
context.window=context;context.addEventListener=()=>{};vm.createContext(context);
let scripts=0;
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)){vm.runInContext(m[1],context,{filename:'inline-'+(++scripts)});}
vm.runInContext('CAT=window.__BK_EMBEDDED__.components;LAPTOPS=window.__BK_EMBEDDED__.laptops;PRICES=window.__BK_EMBEDDED__.prices;BENCHMARKS=window.__BK_EMBEDDED__.benchmarks;syncVerificationDates();validateBuildKitData(CAT,LAPTOPS,PRICES);hydratePrices();auditOfferQuality(CAT,LAPTOPS);registerLaptopUrls(LAPTOPS);derivePrices();',context);
const additions=JSON.parse(fs.readFileSync(path.join(root,'data/laptop-additions-2026-10-24.json'),'utf8'));
const expected=608+additions.filter(x=>!x.updatesExistingRecord).length;
assert.equal(context.LAPTOPS.length,expected);assert.equal(context.__BK_EMBEDDED__.laptopAudit.finalCount,expected);
assert.equal(new Set(context.LAPTOPS.map(x=>x.id)).size,expected);
assert.equal(new Set(additions.map(x=>x.laptop.pn)).size,additions.length);
assert(html.includes('Understand every choice.'));
assert.equal((html.match(/id="catalogSearchInput"/g)||[]).length,1);
assert(context.LAPTOP_SORTS.includes('recent'));
for(const {laptop,priceRecord} of additions){
  const L=context.LAPTOPS.find(x=>x.id===laptop.id);assert(L);
  assert.equal(context.laptopValueWarning(L),'');assert.equal(context.laptopValueBadge(L),'');
  assert.equal(L.specCheckedAt,'2026-10-24');
  if(L.offers.every(o=>o.inStock!==true||o.priceCheckStatus&&!/^VERIFIED_PRICE_/.test(o.priceCheckStatus)))assert.equal(context.laptopBuyPrice(L),null,'Unavailable or unconfirmed offers cannot set a buy price');
  for(const link of context.buyLinksFor(L).filter(x=>x.buyable)){assert.equal(link.offer.inStock,true);assert.equal(link.offer.priceCheckStatus,'VERIFIED_PRICE_IN_STOCK');}
}
const operator=context.LAPTOPS.find(L=>L.offers.some(o=>o.operatorSupplied));
assert(operator);assert.equal(context.laptopBuyPrice(operator),null);
assert.equal(context.laptopPriceStatus(operator).kind,'OPERATOR');
assert(!context.sameLaptopSoftwarePlatform({os:'Windows 11',cpu:'Snapdragon X'},{os:'Windows 11',cpu:'Intel Core i5-14500HX'}));
assert(context.sameLaptopSoftwarePlatform({os:'Windows 11 Pro',cpu:'AMD Ryzen 7 260'},{os:'Windows 11 Home',cpu:'Intel Core i5-14500HX'}));
const ambiguous=context.LAPTOPS.find(L=>context.laptopRecordIssues(L).length&&L.offers.length);
assert(ambiguous);assert.equal(context.laptopBuyPrice(ambiguous),null);
assert(context.buyLinksFor(ambiguous).every(x=>!x.buyable));
const gpu115=context.LAPTOPS.find(L=>L.pn==='FX608JMI-TU251WS');
const gpu85=context.LAPTOPS.find(L=>L.pn==='FX610JM-TU105WS');
assert.equal(gpu115.tgp,115);assert.equal(gpu85.tgp,85);
const unknownStock=structuredClone(gpu115);unknownStock.offers.forEach(o=>{o.inStock=null;o.priceCheckStatus='VERIFIED_PRICE_STOCK_UNKNOWN';});assert.equal(context.laptopBuyPrice(unknownStock),null,'A displayed price does not confirm stock');
const gamingRelease=['FX608JHI-TU225WS','FA608PP-QT014WS','G614PR-RV032WS','V3607VJ-TK227WS','E20RNPA#ACJ','E26Q2PA#ACJ','UN.U4QSI.003','UN.U46SI.004','UN.U7MSI.007'];
for(const sku of gamingRelease){const L=context.LAPTOPS.find(x=>x.pn===sku);assert(L,sku);assert(context.laptopMatchesUse(L,'gaming'),sku+' should match Gaming');assert.equal(context.LAPTOPS.filter(x=>x.pn===sku).length,1,sku+' must not be duplicated');}
const unknown={p:50000,inStock:true,operatorSupplied:true,sourceUrl:'https://www.flipkart.com/search?q=example'};
assert.equal(context.validateLaptopOfferLink(unknown,{pn:'EXAMPLE'},[]).buyable,false);
nodes.laptopEvidence=element('priced');nodes.fltBrand=element('any');
const getResults=()=>context.laptopFinderGrouped(100000,context.LAPTOPS,'all',[],'recent').inBudget;
const priced=getResults();assert(priced.length>30);assert(!priced.some(L=>L.id===operator.id));
assert(priced.every(L=>context.buyLinksFor(L).some(x=>x.buyable&&['TRUSTED','LISTING'].includes(context.offerTrust(x.offer)))));
assert.equal(context.laptopCheckedDate(priced[0]),'2026-10-24');
nodes.laptopEvidence.value='verified';const verified=getResults();
console.log("Evidence pools",verified.length,priced.length);assert(verified.length>=7&&verified.length<=priced.length);
assert(verified.every(L=>context.buyLinksFor(L).some(x=>x.buyable&&context.offerTrust(x.offer)==='TRUSTED')));
nodes.laptopEvidence.value='catalogue';assert(getResults().some(L=>L.id==='lap_asus_x1607ca_mb350ws'));
assert(getResults().some(L=>L.id===operator.id));
assert(getResults().some(L=>L.id===ambiguous.id),'Ambiguous records remain inspectable in catalogue mode');
context.lbudgetAll=false;assert(!getResults().some(L=>context.laptopBuyPrice(L)===null));
assert(getResults().some(L=>L.pn==='UN.37ZSI.00B'),'A ceiling must include cheaper laptops, without an arbitrary lower bound');
context.lbudgetRange={min:50000,max:100000,maxInclusive:true,label:'Explicit range'};
assert(!getResults().some(L=>context.laptopBuyPrice(L)<50000),'An explicit labelled range retains its lower bound');
context.lbudgetRange=null;context.lbudgetAll=true;
context.searchQuery='swift neo 226v';assert(getResults().length>=2);assert(getResults().every(L=>/Swift Neo/.test(L.modelName)&&/226V/.test(L.cpu)));context.searchQuery='';
nodes.laptopEvidence.value='priced';
for(const uc of ['esports','aaa','creator'])for(const res of [1080,1440,2160]){
  const build=context.optimizeDesktop(220000,uc,res,{},{},{},context.CAT,0,false);
  assert(build,uc+' '+res+' should produce a complete build');
  const total=context.buildCost(build,{},context.CAT,0);
  assert(Number.isFinite(total));assert(total<=220000||build.__noFit);
}
// Exercise the real renderer while replacing browser layout-only helpers.
for(const id of ['lbudget','lbudgetOut','lsort','laptopCatalogueStatus','lresultsStatus','lresults','stepupContainer'])nodes[id]=element();
for(const name of ['syncSizeChips','syncBudgetPills','syncUseChips','renderLaptopFilterChips','persist'])context[name]=()=>{};
context.BRAND_BAR_BUILT=true;context.lsort='recent';context.renderLaptops();
assert(nodes.lresults.innerHTML.includes('Showing 30 of'));
context.laptopVisibleLimit=60;context.renderLaptops(true);assert(nodes.lresults.innerHTML.includes('Showing 60 of'));
assert(!context.renderLaptopCard(context.LAPTOPS.find(x=>x.id==='lap_asus_x1607ca_mb350ws'),'').includes('View Deal'));
for(const id of ['homeBudget','homeBudgetOut','homeBuildPreview'])nodes[id]=element();
const optimize=context.optimizeDesktop;context.optimizeDesktop=()=>null;context.homeBudget=220000;context.renderHomeLive();
assert.equal(nodes.homeBudget.value,220000);assert.equal(nodes.homeBudgetOut.textContent,'₹2,20,000');
assert(nodes.homeBuildPreview.innerHTML.includes('missing compatible part'));
context.optimizeDesktop=optimize;
const newModels=additions.map(x=>x.laptop.id);
const comparison=context.buildCompareTable([newModels[0],newModels[1]],context.LAPTOPS,context.CAT,{},100000,1080,'aaa');
assert(comparison.includes('Comparable performance evidence is incomplete'));
assert(!comparison.includes('BEST GAMING'));assert(!comparison.includes('BEST FOR YOUR SELECTED USE'));
const sampleBuild=context.optimizeDesktop(220000,'aaa',1080,{},{},{},context.CAT,0,false);
const mixedComparison=context.buildCompareTable(['desktop',newModels[0],newModels[1]],context.LAPTOPS,context.CAT,sampleBuild,220000,1080,'aaa');
assert(!mixedComparison.includes('BEST PORTABILITY'),'An unknown desktop weight must not become a portability winner');
nodes.homeLaptopShelf=element();context.renderHomeFeatured();
assert.equal((nodes.homeLaptopShelf.innerHTML.match(/data-home-laptop=/g)||[]).length,2,'Promote only brands represented in the checked shortlist');
assert(!nodes.homeLaptopShelf.innerHTML.includes('3200U'),'Legacy examples should not be promoted on the landing page');
const controls=[0,1,2].map(index=>({attrs:{},handlers:{},dataset:{lesson:String(index)},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.handlers[k]=fn;},focus(){this.focused=true;}}));
const query=context.document.querySelectorAll;context.document.querySelectorAll=()=>controls;
let selected;context.bindHomeTabs('test',button=>{selected=button;});
controls[0].handlers.keydown({key:'End',preventDefault(){}});
assert.equal(selected,controls[2]);assert.equal(controls[2].attrs['aria-selected'],'true');assert(controls[2].focused);
context.document.querySelectorAll=query;
console.log('Records requiring model/CPU review:',context.LAPTOPS.filter(L=>context.laptopRecordIssues(L).length).length);
console.log(`PASS: ${scripts} scripts; ${expected} unique records; ${additions.length} sourced additions; evidence, stock, search, pagination, budget ceilings, comparison, landing tabs and 9 desktop profiles.`);

const legacy=context.LAPTOPS.filter(L=>!L.rankingStatus);
assert(legacy.every(L=>!context.hasLaptopRanking(L)),'Legacy editorial scores cannot establish benchmark-backed rankings');
const neo=context.LAPTOPS.filter(L=>L.brand==='Apple'&&/MacBook Neo/.test(L.modelName));
assert.equal(neo.length,9);
for(const L of neo){assert.equal(L.batteryWh,36.5);assert.equal(L.weight,1.23);assert.equal(L.brightness,500);assert.equal(L.res,'2408 × 1506');assert(L.ports.includes('480Mbps'));assert.equal(L.fieldEvidence.batteryWh.sourceUrl,'https://www.apple.com/in/macbook-neo/specs/');}
const neoCompare=context.buildCompareTable(neo.slice(0,2).map(L=>L.id),context.LAPTOPS,context.CAT,{},100000,1080,'aaa');
assert(!/BEST GAMING|BEST VALUE|Strongest creator|BEST FOR YOUR/.test(neoCompare));
assert(neoCompare.includes("scope='row'"));assert(neoCompare.includes('36.5Wh'));assert(neoCompare.includes('No benchmark-based value verdict'));
assert.equal(context.laptopUpgradeability({storageSlots:2}).parts[0],'at least two storage slots; free slot not confirmed');
assert(context.sourceBox(neo[0]).includes('Field checks'));
console.log('PASS: legacy-score safeguards, 9 Neo hardware corrections, source provenance and comparison wording.');

assert(!neoCompare.includes('LOWEST RECORDED WEIGHT'),'Equal weights should not manufacture a distinguishing badge');

assert.equal(context.validateBuildKitData(context.CAT,context.LAPTOPS,context.PRICES).errors.length,0,'SKU corrections must reach current offer records');

const priceAudit=JSON.parse(fs.readFileSync(path.join(root,'data/price-rechecks-2026-10-24.json'),'utf8'));
assert.equal(priceAudit.results.length,699);assert.equal(new Set(priceAudit.results.map(x=>[x.kind,x.id,x.index].join('/'))).size,699);
assert.equal(priceAudit.results.filter(x=>/^VERIFIED_PRICE_/.test(x.status)).length,313);
const recheckExample=priceAudit.results.find(x=>x.kind==='laptops'&&x.status==='CONFIGURATION_MISMATCH');
const recheckLaptop=context.LAPTOPS.find(x=>x.id===recheckExample.id);
assert.equal(context.laptopBuyPrice(recheckLaptop),null);assert.equal(context.laptopPriceStatus(recheckLaptop).kind,'RECHECK');assert(context.buyLinksFor(recheckLaptop).every(x=>!x.buyable));
for(const L of context.LAPTOPS)for(const link of context.buyLinksFor(L).filter(x=>x.buyable)){assert.equal(link.offer.priceCheckStatus,'VERIFIED_PRICE_IN_STOCK');assert.equal(link.offer.inStock,true);}
const ryzen=context.CAT.cpu.find(x=>x.id==='cpu_amd_r5_5500');assert.equal(ryzen.price,10700);
assert.equal(context.PRICES.components.cpu_amd_r5_5500.offers[0].price,10700);assert(context.PRICES.components.cpu_amd_r5_5500.history.some(x=>x.price===6849));
console.log('PASS: all 699 offers have outcomes; only reconfirmed in-stock offers are buyable; corrected prices retain history.');

assert(context.getFreshness('2026-10-24',Date.parse('2026-10-24T20:00:00Z')).label.includes('time not recorded'));
assert(context.getFreshness('2026-10-24T18:00:00Z',Date.parse('2026-10-24T20:00:00Z')).label.includes('2 hours'));

context.searchQuery='AS15-42';nodes.laptopEvidence.value='catalogue';context.lbudgetAll=true;context.renderLaptops();assert(!nodes.stepupContainer.innerHTML.includes('<b>Cheaper:</b>'),'An unknown price cannot produce a savings claim');context.searchQuery='';

// Buying evidence must describe the same offer as the headline price.
const chosen=context.LAPTOPS.find(L=>context.inBuyingShortlist(L));assert(chosen);
const evidence=context.laptopBuyingEvidence(chosen);
assert(evidence.includes(chosen.pn));assert(evidence.includes('Price observed'));assert(evidence.includes('Price source'));
const advice=context.laptopBuyingAdvice(chosen);assert(advice.includes('Why choose this'));assert(advice.includes('Main compromise'));
const card=context.renderLaptopCard(chosen,'');assert(card.includes('Report incorrect information'));assert(card.includes('Copy link'));
assert(card.includes('mailto:buildkitindia@gmail.com?subject='));
assert(context.laptopReportLink(chosen).includes(encodeURIComponent(chosen.pn)));
assert.equal(context.BUYING_SHORTLIST.length,8);assert.equal(new Set(context.BUYING_SHORTLIST).size,8);
assert(context.BUYING_SHORTLIST.every(id=>context.LAPTOPS.some(L=>L.id===id)));
const unsupported=structuredClone(chosen);delete unsupported.fieldEvidence;assert(!context.inBuyingShortlist(unsupported));
const noStock=structuredClone(chosen);noStock.offers.forEach(o=>o.inStock=null);assert(!context.inBuyingShortlist(noStock));
nodes.focusedShortlist=element();nodes.focusedShortlist.checked=true;
const focused=getResults();assert(focused.length>0&&focused.length<=8);assert(focused.every(L=>context.inBuyingShortlist(L)));
nodes.focusedShortlist.checked=false;assert(getResults().length>focused.length);
const other=context.LAPTOPS.find(L=>L.id!==chosen.id&&context.inBuyingShortlist(L));
const diff=context.buildCompareTable([chosen.id,other.id],context.LAPTOPS,context.CAT,{},100000,1080,'aaa');
assert(diff.includes('Recorded differences'));assert(diff.includes('Matching and unknown details'));assert(diff.includes('Copy comparison link'));
assert(diff.includes('Price dates, exact SKUs and sources'));
const mixedLink=context.comparisonPermalink(['desktop',chosen.id]);assert(mixedLink.includes('desktop'));assert(mixedLink.includes('&b='),'Shared desktop comparisons must carry build configuration');
assert.equal(context.laptopPermalink('id with/#?'),'#laptop?id=id%20with%2F%23%3F');
const evil=structuredClone(chosen);evil.pn='<img src=x onerror=alert(1)>';assert(!context.laptopBuyingEvidence(evil).includes(evil.pn));
console.log('PASS: focused shortlist, matching price evidence, buying advice, report links, comparison disclosures and escaped share links.');

// Resolve links through the actual router, without depending on browser layout.
context.URLSearchParams=URLSearchParams;
const savedRouting={switchTab:context.switchTab,fillCompare:context.fillCompare,openLaptop:context.openLaptop,closeLaptopModal:context.closeLaptopModal,restore:context.restore,resolveRestoredManual:context.resolveRestoredManual,validateRestoredDesktopBuild:context.validateRestoredDesktopBuild,renderDesktop:context.renderDesktop};
let routedTab,openedId,restoredComparison=0;
context.switchTab=name=>{routedTab=name;};context.fillCompare=()=>{};context.openLaptop=id=>{openedId=id;};context.closeLaptopModal=()=>{};
context.location.hash=context.laptopPermalink(chosen.id);context.routeFromHash();assert.equal(routedTab,'laptop');assert.equal(openedId,chosen.id);
context.location.hash=context.comparisonPermalink([chosen.id,other.id]);context.routeFromHash();assert.equal(routedTab,'compare');assert.equal(context.cmpSlots[0],chosen.id);assert.equal(context.cmpSlots[1],other.id);
context.location.hash='#compare?ids=unknown,'+chosen.id+','+chosen.id;context.routeFromHash();assert.equal(context.cmpSlots.filter(Boolean).length,1);
context.restore=()=>{restoredComparison++;};context.resolveRestoredManual=()=>{};context.validateRestoredDesktopBuild=()=>{};context.renderDesktop=()=>{};
context.location.hash=mixedLink;context.routeFromHash();assert.equal(restoredComparison,1);assert.equal(context.cmpSlots[0],'desktop');assert(context.isShareHash());
Object.assign(context,savedRouting);context.location.hash='';
console.log('PASS: laptop and comparison deep links, unknown/duplicate IDs, and desktop state in mixed comparisons.');
