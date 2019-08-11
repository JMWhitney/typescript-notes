var KeyValuePair = /** @class */ (function () {
    function KeyValuePair(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValuePair;
}());
var pair1 = new KeyValuePair(1, 'First');
var pair2 = new KeyValuePair('Second', new Date(Date.now()));
var pair3 = new KeyValuePair(3, 'Third');
var KeyValuePairPrinter = /** @class */ (function () {
    //Pass reference to an array of key-value pairs of type T and U.
    function KeyValuePairPrinter(pairs) {
        this.pairs = pairs;
    }
    //Iterate through the array and print each key-value property.
    KeyValuePairPrinter.prototype.print = function () {
        for (var _i = 0, _a = this.pairs; _i < _a.length; _i++) {
            var p = _a[_i];
            console.log(p.key + ": " + p.value);
        }
    };
    return KeyValuePairPrinter;
}());
var printer = new KeyValuePairPrinter([pair1, pair3]);
printer.print(); // 1: 'First' 3: 'Third'
