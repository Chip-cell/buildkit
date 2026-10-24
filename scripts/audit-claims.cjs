// Inventory every stored laptop claim; a source URL alone never confirms a claim.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const match=html.match(/window\.__BK_EMBEDDED__=(.*?);\s*\n/);assert(match,'Embedded data missing');const data=JSON.parse(match[1]);
const fields=['brand','family','modelName','pn','cpu','gpu','vram','tgp','gpuTier','os','ram','ramGB','ramType','ramSoldered','ssd','storageSlots','ssdUpgradeable','dispSize','res','refreshHz','panelType','oled','touch','twoInOne','brightness','colorCoverage','batteryWh','weight','ports','wifi','webcam','warranty','strengths','downsides','categoryTags','exact','generationStatus','year','catalogueStatus','recordStatus','evidenceConfidence','platform','stockStatus','cpuPlatform'];
const rows=[],records=[];
for(const L of data.laptops){const claims=[];function add(field,value,source=L.specSource||''){let status=value===null||value===undefined||value===''?'MISSING':'PENDING_INDEPENDENT_REVIEW',note='Stored assertion; a recorded source is not field-level proof.',checkedAt='';
if(Array.isArray(value)&&!value.length)status='MISSING';
if(field.startsWith('scores.')||['strengths','downsides','gpuTier','categoryTags'].includes(field)){status=status==='MISSING'?status:'EDITORIAL_NOT_BENCHMARKED';note='Editorial assessment, not a measured result.';}
const proof=L.fieldEvidence&&L.fieldEvidence[field];if(proof&&proof.sourceUrl&&proof.checkedAt){status=proof.status||'MANUFACTURER_CONFIRMED';source=proof.sourceUrl;checkedAt=proof.checkedAt;note=proof.scope;}
if(field.startsWith('offers.')){note='Dated retailer observation; not independently verified by this inventory or guaranteed at checkout.';}
if(status==='MISSING')note='No value recorded. This does not establish absence of the feature.';
const row={field,value:value===undefined?null:value,status,source,checkedAt,note};claims.push(row);rows.push({id:L.id,model:L.brand+' '+L.modelName,...row});}
for(const field of fields)add(field,L[field]);for(const [key,value] of Object.entries(L.scores||{}))add('scores.'+key,value);
const price=data.prices.laptops[L.id];for(const [i,offer] of (price?.offers||[]).entries())for(const key of ['p','inStock','sku','exactSkuMatch','configurationVerified','sourceQuality','linkStatus'])add('offers.'+i+'.'+key,offer[key],offer.sourceUrl||'');
records.push({id:L.id,model:L.brand+' '+L.modelName,pn:L.pn,source:L.specSource||'',claims});}
const counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
const result={checkedAt:'2026-10-24',method:'Complete stored-claim inventory; selective external verification. Pending claims have NOT been certified.',recordCount:records.length,claimCount:rows.length,counts,records};
assert.equal(records.length,636);assert.equal(new Set(records.map(x=>x.id)).size,636);assert.equal(rows.filter(x=>x.status==='MANUFACTURER_CONFIRMED').length,9*14+24*4);assert(rows.some(x=>x.value===false&&x.status==='PENDING_INDEPENDENT_REVIEW'));
const dictionaries={fields:[],statuses:[],sources:[],notes:[]};
function intern(key,value){let i=dictionaries[key].indexOf(value);if(i<0){i=dictionaries[key].length;dictionaries[key].push(value);}return i;}
const compact={...result,schemaVersion:1,dictionaries,records:records.map(r=>({...r,claims:r.claims.map(c=>[intern('fields',c.field),c.value,intern('statuses',c.status),intern('sources',c.source),c.checkedAt,intern('notes',c.note)])}))};
assert.equal(compact.records.reduce((n,r)=>n+r.claims.length,0),rows.length);
fs.writeFileSync(path.join(root,'data/claim-audit.json'),JSON.stringify(compact));
function cell(value){let s=typeof value==='object'&&value!==null?JSON.stringify(value):String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
const columns=['id','model','field','value','status','source','checkedAt','note'];fs.writeFileSync(path.join(root,'data/claim-audit.csv'),'\ufeff'+[columns,...rows.map(row=>columns.map(k=>row[k]))].map(row=>row.map(cell).join(',')).join('\r\n'));
console.log(JSON.stringify({records:records.length,claims:rows.length,counts},null,2));
