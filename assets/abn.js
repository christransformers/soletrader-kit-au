// ABN checksum per ABR: subtract 1 from first digit, weight, sum % 89 === 0
function validABN(s){var d=String(s).replace(/\D/g,'');if(d.length!==11)return false;var w=[10,1,3,5,7,9,11,13,15,17,19],t=0;
for(var i=0;i<11;i++){var n=+d[i];if(i===0)n-=1;t+=n*w[i]}return t%89===0}
