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
assert.equal(context.LAPTOPS.length,616);assert.equal(context.__BK_EMBEDDED__.laptopAudit.finalCount,616);
assert.equal(new Set(context.LAPTOPS.map(x=>x.id)).size,616);
assert.equal((html.match(/id="catalogSearchInput"/g)||[]).length,1);
assert(context.LAPTOP_SORTS.includes('recent'));
for(const {laptop} of additions){
  const L=context.LAPTOPS.find(x=>x.id===laptop.id);assert(L);
  assert.equal(context.laptopValueWarning(L),'');assert.equal(context.laptopValueBadge(L),'');
  assert.equal(L.specCheckedAt,'2026-10-24');
  if(L.brand==='Acer')assert(Number.isFinite(context.laptopBuyPrice(L)),L.pn+' must retain its observed offer');
  else {assert.equal(context.laptopBuyPrice(L),null,'Unknown stock must not be buyable');assert.equal(context.laptopPriceStatus(L).kind,'REFERENCE');assert(context.buyLinksFor(L)[0].flags.includes('STOCK_UNCONFIRMED'));}
}
const operator=context.LAPTOPS.find(L=>L.offers.some(o=>o.operatorSupplied));
assert(operator);assert.equal(context.laptopBuyPrice(operator),null);
assert.equal(context.laptopPriceStatus(operator).kind,'OPERATOR');
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
context.lbudgetAll=false;assert(!getResults().some(L=>context.laptopBuyPrice(L)===null));context.lbudgetAll=true;
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
console.log(`PASS: ${scripts} scripts; 616 unique records; 8 additions; price evidence, stock, search, pagination and 9 desktop profiles.`);


