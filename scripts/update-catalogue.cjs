// Merge sourced additions into the self-contained distribution without losing history.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),file=path.join(root,'index.html');
let html=fs.readFileSync(file,'utf8');
const match=html.match(/(<script id="bk-embedded-data">\s*)window\.__BK_EMBEDDED__=(.*?);\s*\n/);
if(!match)throw new Error('Embedded catalogue missing');
const data=JSON.parse(match[2]);
const additions=JSON.parse(fs.readFileSync(path.join(root,'data/laptop-additions-2026-10-24.json'),'utf8'));
for(const {laptop,priceRecord} of additions){
  const index=data.laptops.findIndex(x=>x.id===laptop.id);
  if(index>=0)data.laptops[index]=laptop;else data.laptops.push(laptop);
  const old=data.prices.laptops[laptop.id];
  const history=[...old?.history||[],...priceRecord.history||[]];
  data.prices.laptops[laptop.id]={...priceRecord,history:history.filter((x,i)=>history.findIndex(y=>JSON.stringify(y)===JSON.stringify(x))===i)};
}
const corrections=JSON.parse(fs.readFileSync(path.join(root,'data/laptop-corrections-2026-10-24.json'),'utf8'));
for(const correction of corrections){const L=data.laptops.find(x=>x.id===correction.id);if(!L)throw Error('Missing corrected record '+correction.id);Object.assign(L,correction.values);L.fieldEvidence={...L.fieldEvidence,...correction.fieldEvidence};if(correction.values.pn){for(const offer of [...L.offers||[],...data.prices.laptops[L.id]?.offers||[]]){offer.sku=correction.values.pn;offer.skuCorrectedAt='2026-10-24';offer.skuSourceUrl=correction.fieldEvidence.pn.sourceUrl;}}}
const priceRechecks=path.join(root,'data/price-rechecks-2026-10-24.json');
if(fs.existsSync(priceRechecks))require('./apply-price-rechecks.cjs')(data,JSON.parse(fs.readFileSync(priceRechecks,'utf8')));
const ids=new Set();
for(const L of data.laptops){if(ids.has(L.id))throw new Error('Duplicate id '+L.id);ids.add(L.id);}
const offers=Object.values(data.prices.laptops).flatMap(x=>x.offers||[]);
data.laptopAudit={auditDate:'2026-10-24',finalCount:data.laptops.length,rawExactInStockRecordCount:offers.filter(o=>o.exactSkuMatch===true&&o.inStock===true&&o.linkStatus==='VERIFIED').length,exactOfferCount:offers.filter(o=>o.exactSkuMatch===true).length,sourcedConfigurations:additions.length,newSourcedConfigurations:additions.filter(x=>!x.updatesExistingRecord).length,refreshedConfigurations:additions.filter(x=>x.updatesExistingRecord).length,finderPolicy:'Observed store prices exclude owner estimates. Product-page checks and retailer listings remain distinct. All-specifications mode exposes unpriced models with All Budgets. Runtime URL and freshness checks can exclude raw offers.',generatedBy:'scripts/update-catalogue.cjs; raw evidence counts are not a claim of current checkout stock'};
html=html.replace(match[0],match[1]+'window.__BK_EMBEDDED__='+JSON.stringify(data)+';\n');
fs.writeFileSync(file,html);
console.log(data.laptops.length+' configurations; '+additions.length+' sourced additions merged.');
