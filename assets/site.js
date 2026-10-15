(function(){
  var C = window.SITE_CONFIG || {};
  // Analytics (only if configured)
  if (C.analytics && C.analytics.plausibleDomain) {
    var s=document.createElement('script');s.defer=true;s.dataset.domain=C.analytics.plausibleDomain;s.src='https://plausible.io/js/script.js';document.head.appendChild(s);
  }
  if (C.analytics && C.analytics.ga4Id) {
    var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+C.analytics.ga4Id;document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',C.analytics.ga4Id);
  }
  if (C.adsenseClient) {
    var a=document.createElement('script');a.async=true;a.crossOrigin='anonymous';a.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+C.adsenseClient;document.head.appendChild(a);
  }
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-pro]').forEach(function(el){
      if (C.proPackUrl) { el.hidden=false; el.querySelectorAll('a[data-pro-link]').forEach(function(l){l.href=C.proPackUrl}); el.querySelectorAll('[data-pro-price]').forEach(function(p){p.textContent=C.proPackPrice}); }
    });
    var aff = C.affiliates||{}, box=document.querySelector('[data-affiliates]');
    if (box) {
      var names={xero:'Xero',myob:'MYOB',quickbooks:'QuickBooks'}, html='';
      Object.keys(names).forEach(function(k){ if(aff[k]) html+='<a class="btn ghost" rel="sponsored noopener" target="_blank" href="'+aff[k]+'">'+names[k]+'</a> '; });
      if (html) { box.hidden=false; box.querySelector('.aff-links').innerHTML=html; }
    }
    var ce=document.querySelector('[data-contact]'); if(ce&&C.contactEmail){ce.innerHTML='<a href="mailto:'+C.contactEmail+'">'+C.contactEmail+'</a>';}
    var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  });
})();
