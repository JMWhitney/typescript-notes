
function totalLength(x: (string | any[]), y: (string | any[])): number {

  x.slice(0);

  if ( x instanceof Array ) {
    x.push('abc');
  }

  if ( x instanceof String ) {
    x.substr(1);
  }

  var total:number = x.length + y.length;
  return total;
}