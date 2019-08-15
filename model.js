var TodoApp;
(function (TodoApp) {
    var Model;
    (function (Model) {
        var TodoState;
        (function (TodoState) {
            TodoState[TodoState["Completed"] = 1] = "Completed";
            TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
            TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
            TodoState[TodoState["Cancelled"] = 4] = "Cancelled";
        })(TodoState = Model.TodoState || (Model.TodoState = {}));
    })(Model = TodoApp.Model || (TodoApp.Model = {}));
})(TodoApp || (TodoApp = {}));
