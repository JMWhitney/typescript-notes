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
var TodoState;
(function (TodoState) {
    TodoState[TodoState["Completed"] = 1] = "Completed";
    TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
    TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
    TodoState[TodoState["Cancelled"] = 4] = "Cancelled";
})(TodoState || (TodoState = {}));
var SmartTodo = /** @class */ (function () {
    function SmartTodo(name, _state) {
        this.name = name;
        this._state = _state;
    }
    Object.defineProperty(SmartTodo.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (newState) {
            // Trying to complete a 
            if (newState === TodoState.Completed && this._state !== TodoState.HighPriority) {
                // Exit with error 
                throw "Todo must be HighPriority before being completed";
            }
            // Otherwise set the state
            this._state = newState;
        },
        enumerable: true,
        configurable: true
    });
    return SmartTodo;
}());
var TodoStateChanger = /** @class */ (function () {
    function TodoStateChanger(newState) {
        this.newState = newState;
    }
    TodoStateChanger.prototype.canChangeState = function (todo) {
        return !!todo;
    };
    TodoStateChanger.prototype.changeState = function (todo) {
        if (this.canChangeState(todo)) {
            todo.state = this.newState;
        }
        return todo;
    };
    return TodoStateChanger;
}());
var CompleteTodoStateChanger = /** @class */ (function (_super) {
    __extends(CompleteTodoStateChanger, _super);
    function CompleteTodoStateChanger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CompleteTodoStateChanger;
}(TodoStateChanger));
var todo = new SmartTodo("Clean the gutters", TodoState.LowPriority);
todo.state = TodoState.Completed;
