function totalLength(x, y) {
    x.slice(0);
    if (x instanceof Array) {
        x.push('abc');
    }
    if (x instanceof String) {
        x.substr(1);
    }
    var total = x.length + y.length;
    return total;
}
