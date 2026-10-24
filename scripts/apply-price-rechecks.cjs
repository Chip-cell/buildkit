// Apply only exact-model, corroborated prices; failed checks preserve historical observations.
const assert=require('node:assert/strict');
function applyPriceRechecks(data,audit){
  for(const row of audit.results){
    const record=data.prices[row.kind]?.[row.id],offer=record?.offers?.[row.index];
    assert(offer,'Missing offer '+row.kind+'/'+row.id+'/'+row.index);
    assert.equal(offer.sourceUrl||'',row.sourceUrl||'','Price-check source no longer matches');
    assert.equal(String(offer.sku||'').trim().toUpperCase(),String(row.sku||'').trim().toUpperCase(),'Price-check model no longer matches');
    const verified=/^VERIFIED_PRICE_(IN_STOCK|OUT_OF_STOCK|STOCK_UNKNOWN)$/.test(row.status);
    offer.priceCheckStatus=row.status;offer.priceAttemptedAt=audit.summary.checkedAt;offer.priceCheckNote=row.note||row.status.replaceAll('_',' ');
    if(!verified)continue;
    assert(row.identityMatched&&Number.isFinite(row.observedPrice)&&row.observedPrice>0,'Unconfirmed price cannot be applied');
    const old={observedAt:offer.checkedAt,retailer:offer.retailer,sku:offer.sku,price:offer.price,stock:offer.stock||null,sourceUrl:offer.sourceUrl};
    const observation={observedAt:audit.summary.checkedAt,retailer:offer.retailer,sku:offer.sku,price:row.observedPrice,stock:row.inStock===true?'IN_STOCK':row.inStock===false?'OUT_OF_STOCK':'UNKNOWN',sourceUrl:offer.sourceUrl,method:row.priceMethod};
    record.history=record.history||[];
    for(const point of [old,observation])if(!record.history.some(x=>x.observedAt===point.observedAt&&x.retailer===point.retailer&&x.sku===point.sku&&x.price===point.price&&x.stock===point.stock&&x.sourceUrl===point.sourceUrl))record.history.push(point);
    Object.assign(offer,{price:row.observedPrice,inStock:row.inStock,stock:observation.stock,checkedAt:audit.summary.checkedAt,exactSkuMatch:true,configurationVerified:offer.configurationVerified===false?false:true,linkStatus:'VERIFIED',linkCheckedAt:audit.summary.checkedAt,httpStatus:200,sourceQuality:'PRODUCT_PAGE',listingSourced:false,operatorSupplied:false,checkedFields:[...new Set([...(offer.checkedFields||[]),'sku','price','stock'])],priceEvidenceMethod:row.priceMethod});
    record.verifiedAt=audit.summary.checkedAt;
  }
  data.priceRecheckAudit=audit.summary;
}
module.exports=applyPriceRechecks;
if(require.main===module){
 const sourceUrl='https://example.com/exact-product';const data={prices:{components:{a:{offers:[{sourceUrl,sku:'ABC123',price:100,checkedAt:'2026-09-10',retailer:'Store',stock:'IN_STOCK'}],history:[]}},laptops:{}}};
 const audit={summary:{checkedAt:'2026-10-24'},results:[{kind:'components',id:'a',index:0,sourceUrl,sku:'ABC123',status:'VERIFIED_PRICE_OUT_OF_STOCK',identityMatched:true,observedPrice:120,inStock:false,priceMethod:'PRIMARY_PRICE'}]};
 applyPriceRechecks(data,audit);assert.equal(data.prices.components.a.offers[0].price,120);assert.equal(data.prices.components.a.offers[0].inStock,false);assert(data.prices.components.a.history.some(x=>x.price===100&&x.observedAt==='2026-09-10'));
 const before=JSON.stringify(data);applyPriceRechecks(data,audit);assert.equal(JSON.stringify(data),before,'Repeated updates must not add history');
 const failed=structuredClone(audit);failed.results[0].status='CONFIGURATION_MISMATCH';failed.results[0].observedPrice=999;applyPriceRechecks(data,failed);assert.equal(data.prices.components.a.offers[0].price,120);assert.equal(data.prices.components.a.offers[0].checkedAt,'2026-10-24');
 console.log('PASS: verified-only updates, out-of-stock references, preserved history and idempotence.');
}
