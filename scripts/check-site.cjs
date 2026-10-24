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
  if(priceRecord.offers.some(o=>o.inStock===true))assert(Number.isFinite(context.laptopBuyPrice(L)),L.pn+' must retain its observed offer');
  else {assert.equal(context.laptopBuyPrice(L),null,'Unknown stock must not be buyable');assert.equal(context.laptopPriceStatus(L).kind,'REFERENCE');assert(context.buyLinksFor(L)[0].flags.includes('STOCK_UNCONFIRMED'));}
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
assert.equal(context.laptopBuyPrice(gpu115),null,'ASUS stock must stay unknown despite a displayed price');
const gamingRelease=['FX608JHI-TU225WS','FA608PP-QT014WS','G614PR-RV032WS','V3607VJ-TK227WS','E20RNPA#ACJ','E26Q2PA#ACJ','UN.U4QSI.003','UN.U46SI.004','UN.U7MSI.007'];
for(const sku of gamingRelease){const L=context.LAPTOPS.find(x=>x.pn===sku);assert(L,sku);assert(context.laptopMatchesUse(L,'gaming'),sku+' should match Gaming');assert.equal(context.LAPTOPS.filter(x=>x.pn===sku).length,1,sku+' must not be duplicated');}
const unknown={p:50000,inStock:true,operatorSupplied:true,sourceUrl:'https://www.flipkart.com/search?q=example'};
assert.equal(context.validateLaptopOfferLink(unknown,{pn:'EXAMPLE'},[]).buyable,false);
nodes.laptopEvidence=element('priced');nodes.fltBrand=element('any');
const getResults=()=>context.laptopFinderGrouped(100000,context.LAPTOPS,'all',[],'recent').inBudget;
const priced=getResults();assert(priced.length>30);assert(!priced.some(L=>L.id===operator.id));
assert(priced.every(L=>context.buyLinksFor(L).some(x=>x.buyable&&['TRUSTED','LISTING'].includes(context.offerTrust(x.offer)))));
assert.equal(priced[0].specCheckedAt,'2026-10-24');
nodes.laptopEvidence.value='verified';const verified=getResults();
console.log("Evidence pools",verified.length,priced.length);assert(verified.length>=7&&verified.length<priced.length);
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
nodes.homeLaptopShelf=element();context.renderHomeFeatured();
assert.equal((nodes.homeLaptopShelf.innerHTML.match(/data-home-laptop=/g)||[]).length,3);
assert(!nodes.homeLaptopShelf.innerHTML.includes('3200U'),'Legacy examples should not be promoted on the landing page');
const controls=[0,1,2].map(index=>({attrs:{},handlers:{},dataset:{lesson:String(index)},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.handlers[k]=fn;},focus(){this.focused=true;}}));
const query=context.document.querySelectorAll;context.document.querySelectorAll=()=>controls;
let selected;context.bindHomeTabs('test',button=>{selected=button;});
controls[0].handlers.keydown({key:'End',preventDefault(){}});
assert.equal(selected,controls[2]);assert.equal(controls[2].attrs['aria-selected'],'true');assert(controls[2].focused);
context.document.querySelectorAll=query;
console.log('Records requiring model/CPU review:',context.LAPTOPS.filter(L=>context.laptopRecordIssues(L).length).length);
console.log(`PASS: ${scripts} scripts; ${expected} unique records; ${additions.length} sourced additions; evidence, stock, search, pagination, budget ceilings, comparison, landing tabs and 9 desktop profiles.`);
