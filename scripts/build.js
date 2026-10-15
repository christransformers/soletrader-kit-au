// Static site builder: node scripts/build.js
// Wraps src/*.html in the shared layout and generates one programmatic
// page per entry in data/trades.json, plus sitemap.xml. No dependencies.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const BASE='https://christransformers.github.io/soletrader-kit-au'; // TODO: update if custom domain
const SITE='Sole Trader Kit AU';
const trades=JSON.parse(fs.readFileSync(path.join(ROOT,'data/trades.json'),'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function layout({title,desc,url,body,depth=0,schema}){
  const p='../'.repeat(depth);
  return `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${BASE}/${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${BASE}/${url}"><meta property="og:image" content="${BASE}/assets/og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${p}assets/style.css">
${schema?`<script type="application/ld+json">${JSON.stringify(schema)}</script>`:''}
<script src="${p}assets/config.js"></script><script src="${p}assets/site.js"></script>
</head><body>
<header class="site"><div class="wrap"><a class="logo" href="${p}index.html">Sole Trader Kit <span>AU</span></a>
<nav><a href="${p}invoice.html">Invoice generator</a><a href="${p}gst-calculator.html">GST calculator</a><a href="${p}abn-checker.html">ABN checker</a><a href="${p}invoice-template/">Templates</a></nav></div></header>
<main class="wrap">${body}</main>
<footer><div class="wrap"><p><a href="${p}privacy.html">Privacy</a><a href="${p}terms.html">Terms</a><a href="${p}disclaimer.html">Disclaimer</a><span data-contact></span></p>
<p>General information only — not tax, legal or financial advice. Based on public ATO and business.gov.au guidance. Everything you type stays in your browser. © <span id="year"></span> ${SITE}</p></div></footer>
</body></html>`;
}
const pages=[];
for(const f of fs.readdirSync(path.join(ROOT,'src'))){
  const raw=fs.readFileSync(path.join(ROOT,'src',f),'utf8');
  const m=raw.match(/^<!--(\{[\s\S]*?\})-->\n?/); const meta=JSON.parse(m[1]);
  const url=f==='index.html'?'':f;
  fs.writeFileSync(path.join(ROOT,f),layout({...meta,url,body:raw.slice(m[0].length)}));
  pages.push(url);
}
// Programmatic trade pages
fs.mkdirSync(path.join(ROOT,'invoice-template'),{recursive:true});
let list='';
for(const t of trades){
  const dir=path.join(ROOT,'invoice-template',t.slug); fs.mkdirSync(dir,{recursive:true});
  const rows=t.items.map(i=>`<tr><td>${esc(i[0])}</td><td>${i[1]}</td><td>$${i[2].toFixed(2)}</td><td>$${(i[1]*i[2]).toFixed(2)}</td></tr>`).join('');
  const total=t.items.reduce((s,i)=>s+i[1]*i[2],0);
  const title=`Free ${t.name} Invoice Template (Australia, GST-ready) | ${SITE}`;
  const desc=`Create an ATO-compliant ${t.name.toLowerCase()} tax invoice in your browser. ABN, GST and line items pre-filled — download as PDF free.`;
  const body=`<section class="hero"><h1>${esc(t.name)} invoice template — Australia</h1><p>A free, GST-ready ${esc(t.name.toLowerCase())} invoice you can fill in and save as a PDF in under two minutes. Nothing is uploaded — it all runs in your browser.</p>
<a class="btn" href="../../invoice.html?trade=${t.slug}">Open the ${esc(t.name.toLowerCase())} invoice generator →</a></section>
<div class="grid"><div class="card"><h2>Example line items</h2><table><tr><th>Description</th><th>Qty</th><th>Unit (ex GST)</th><th>Amount</th></tr>${rows}</table>
<p class="muted">Example subtotal $${total.toFixed(2)} + GST $${(total*0.1).toFixed(2)} = <b>$${(total*1.1).toFixed(2)}</b> (if GST-registered). Example prices are illustrative only — use your own rates.</p></div>
<div class="card"><h2>${esc(t.name)} invoicing tip</h2><p>${esc(t.tip)}</p><h3>What a tax invoice must show</h3><ul class="check"><li>The words "Tax invoice"</li><li>Your business name and ABN</li><li>Date of issue</li><li>Description, quantity and price of what you sold</li><li>GST payable (or "Total price includes GST")</li><li>Buyer's identity or ABN if the sale is $1,000 or more</li></ul>
<p class="muted">Source: <a href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices/" rel="noopener">ATO — Tax invoices</a>.</p></div></div>
<div class="card pro" data-pro hidden style="margin-top:1rem"><h2>Pro Pack — <span data-pro-price></span></h2><p>Branded invoice + quote + receipt templates (Word/Google Docs), payment-reminder email scripts and a sole-trader admin checklist.</p><a class="btn" data-pro-link href="#">Get the Pro Pack</a></div>`;
  fs.writeFileSync(path.join(dir,'index.html'),layout({title,desc,url:`invoice-template/${t.slug}/`,body,depth:2,schema:{"@context":"https://schema.org","@type":"WebPage","name":title,"description":desc}}));
  pages.push(`invoice-template/${t.slug}/`);
  list+=`<a class="card" style="text-decoration:none" href="${t.slug}/"><h3>${esc(t.name)}</h3><span class="muted">Invoice template →</span></a>`;
}
fs.writeFileSync(path.join(ROOT,'invoice-template','index.html'),layout({title:`Free Australian Invoice Templates by Trade | ${SITE}`,desc:'GST-ready invoice templates for Australian sole traders and freelancers, by trade. Free, private, PDF download.',url:'invoice-template/',depth:1,
  body:`<section class="hero"><h1>Invoice templates by trade</h1><p>Pick your trade for pre-filled example line items, then generate a PDF invoice for free.</p></section><div class="grid">${list}</div>`}));
pages.push('invoice-template/');
const today=new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+pages.map(u=>`  <url><loc>${BASE}/${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')+`\n</urlset>\n`);
console.log('built',pages.length,'pages');
