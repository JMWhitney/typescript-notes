function totalLength<T extends { length: number }>(x: T, y: T) {
  var total: number = x.length + y.length;
  return total;
}

class CustomArray<T> extends Array<T> {}

var l1 = totalLength([1,2,3], [4,5,6]); 
var l2 = totalLength('Justin', [1, 2, 3]); 

var length = totalLength([1, 2, 3], new CustomArray<number>(1, 2, 3, 4))