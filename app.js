var TodoApp;
(function (TodoApp) {
    var Model;
    (function (Model) {
        var Todo = /** @class */ (function () {
            function Todo() {
            }
            return Todo;
        }());
        Model.Todo = Todo;
    })(Model = TodoApp.Model || (TodoApp.Model = {}));
})(TodoApp || (TodoApp = {}));
(function (TodoApp) {
    var Model;
    (function (Model) {
        var TodoState;
        (function (TodoState) {
            TodoState[TodoState["Completed"] = 1] = "Completed";
            TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
            TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
            TodoState[TodoState["Deleted"] = 4] = "Deleted";
        })(TodoState = Model.TodoState || (Model.TodoState = {}));
    })(Model = TodoApp.Model || (TodoApp.Model = {}));
})(TodoApp || (TodoApp = {}));
