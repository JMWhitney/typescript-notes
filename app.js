var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function totalLength(x, y) {
    var total = x.length + y.length;
    return total;
}
var CustomArray = /** @class */ (function (_super) {
    __extends(CustomArray, _super);
    function CustomArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CustomArray;
}(Array));
var l1 = totalLength([1, 2, 3], [4, 5, 6]);
var l2 = totalLength('Justin', [1, 2, 3]);
var length = totalLength([1, 2, 3], new CustomArray(1, 2, 3, 4));
