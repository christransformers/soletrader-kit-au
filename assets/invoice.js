(function(){
var $=function(id){return document.getElementById(id)},KEY='stk-invoice-v1',fields=['sName','sAbn','sAddr','bName','bAbn','bAddr','num','date','due','notes','priceMode'];
var money=function(n){return n.toLocaleString('en-AU',{style:'currency',currency:'AUD'})};
var esc=function(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function addRow(d,q,p,g){var tr=document.createElement('tr');tr.innerHTML='<td><input class="d"></td><td><input class="q" type="number" step="any" min="0"></td><td><input class="p" type="number" step="0.01"></td><td><select class="g"><option value="taxable">Taxable</option><option value="free">GST-free</option></select></td><td><button type="button" class="x" aria-label="Remove line">✕</button></td>';
tr.querySelector('.d').value=d||'';tr.querySelector('.q').value=q==null?1:q;tr.querySelector('.p').value=p==null?'':p;tr.querySelector('.g').value=g||'taxable';
tr.querySelector('.x').onclick=function(){tr.remove();render()};$('items').querySelector('tbody').appendChild(tr)}
function rows(){return[].map.call(document.querySelectorAll('#items tbody tr'),function(tr){return{d:tr.querySelector('.d').value,q:parseFloat(tr.querySelector('.q').value)||0,p:parseFloat(tr.querySelector('.p').value)||0,g:tr.querySelector('.g').value}})}
function save(){var o={gst:$('gstReg').checked,rows:rows()};fields.forEach(function(f){o[f]=$(f).value});try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function render(){
 var reg=$('gstReg').checked,inc=$('priceMode').value==='inc',R=rows(),sub=0,gst=0,total=0,body='';
 $('priceMode').disabled=!reg;
 R.forEach(function(r){var line=r.q*r.p,g=0,ex=line;if(reg&&r.g==='taxable'){if(inc){g=line/11;ex=line-g}else{g=line*0.1}}
  sub+=ex;gst+=g;total+=ex+g;
  body+='<tr><td>'+esc(r.d)+(reg&&r.g==='free'?' <small>(GST-free)</small>':'')+'</td><td>'+r.q+'</td><td class="right">'+money(inc&&reg&&r.g==='taxable'?r.p/1.1:r.p)+'</td>'+(reg?'<td class="right">'+money(g)+'</td>':'')+'<td class="right">'+money(ex+g)+'</td></tr>'});
 var title=reg?'TAX INVOICE':'INVOICE',fmtD=function(v){return v?new Date(v+'T00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'}):''};
 var allTaxable=R.every(function(r){return r.g==='taxable'});
 $('invoice-preview').innerHTML='<div class="inv-head"><div><h2>'+title+'</h2><p><b>'+esc($('sName').value||'Your business name')+'</b><br>ABN: '+esc($('sAbn').value||'—')+'<br>'+esc($('sAddr').value).replace(/\n/g,'<br>')+'</p></div>'+
 '<div class="right"><p><b>Invoice #</b> '+esc($('num').value)+'<br><b>Date:</b> '+fmtD($('date').value)+(($('due').value)?'<br><b>Due:</b> '+fmtD($('due').value):'')+'</p></div></div>'+
 '<p><b>Bill to:</b><br>'+esc($('bName').value||'—')+($('bAbn').value?'<br>ABN: '+esc($('bAbn').value):'')+'<br>'+esc($('bAddr').value).replace(/\n/g,'<br>')+'</p>'+
 '<table><thead><tr><th>Description</th><th>Qty</th><th class="right">Unit'+(reg?' (ex GST)':'')+'</th>'+(reg?'<th class="right">GST</th>':'')+'<th class="right">Amount</th></tr></thead><tbody>'+body+'</tbody></table>'+
 '<table class="totals">'+(reg?'<tr><td>Subtotal (ex GST)</td><td class="right">'+money(sub)+'</td></tr><tr><td>GST</td><td class="right">'+money(gst)+'</td></tr>':'')+'<tr><td><b>Total'+(reg?' (incl. GST)':'')+'</b></td><td class="right"><b>'+money(total)+'</b></td></tr></table>'+
 (reg&&allTaxable&&R.length?'<p><small>Total price includes GST.</small></p>':'')+(!reg?'<p><small>No GST has been charged.</small></p>':'')+
 ($('notes').value?'<p><b>Payment details</b><br>'+esc($('notes').value).replace(/\n/g,'<br>')+'</p>':'');
 // compliance hints
 var w=[];var a=$('sAbn').value.replace(/\D/g,'');
 $('abnMsg').textContent=a?(validABN(a)?'✓ ABN format valid':'✗ ABN format invalid'):'';
 if(!$('sName').value)w.push('Add your business name.');
 if(!a)w.push('Add your ABN.');else if(!validABN(a))w.push('Your ABN fails the checksum — check for typos.');
 if(!$('date').value)w.push('Add an issue date.');
 if(R.some(function(r){return!r.d}))w.push('Every line needs a description.');
 if(reg&&total>=1000&&!$('bName').value&&!$('bAbn').value)w.push('Sales of $1,000 or more need the buyer\'s identity or ABN on a tax invoice (ATO).');
 $('warn').innerHTML=w.length?'<b>Before you send:</b><ul>'+w.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul>':'✅ Looks complete against the ATO\'s tax invoice checklist. (General information only.)';
 save();
}
function load(){var o=null;try{o=JSON.parse(localStorage.getItem(KEY))}catch(e){}
 var t=new URLSearchParams(location.search).get('trade');
 if(o&&!t){fields.forEach(function(f){if(o[f]!=null)$(f).value=o[f]});$('gstReg').checked=o.gst!==false;(o.rows||[]).forEach(function(r){addRow(r.d,r.q,r.p,r.g)})}
 if(!$('date').value){var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};var d=new Date();$('date').value=iso(d);d.setDate(d.getDate()+14);$('due').value=iso(d)}
 if(t){fetch('data/trades.json').then(function(r){return r.json()}).then(function(list){var x=list.find(function(i){return i.slug===t});
   document.querySelector('#items tbody').innerHTML='';(x?x.items:[['',1,'']]).forEach(function(i){addRow(i[0],i[1],i[2])});render()})}
 else if(!document.querySelector('#items tbody tr'))addRow('',1,'');
 render()}
document.addEventListener('input',function(e){if(e.target.closest('.card'))render()});
document.addEventListener('change',function(e){if(e.target.closest('.card'))render()});
$('add').onclick=function(){addRow('',1,'');render()};
$('pdf').onclick=function(){render();window.print()};
$('clear').onclick=function(){if(confirm('Clear saved invoice data from this browser?')){localStorage.removeItem(KEY);location.href=location.pathname}};
load();
})();
