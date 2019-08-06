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
var todo = new SmartTodo("Clean the gutters", TodoState.LowPriority);
todo.state = TodoState.Completed;
