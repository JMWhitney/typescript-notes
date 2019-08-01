var TodoState;
(function (TodoState) {
    TodoState[TodoState["Completed"] = 0] = "Completed";
    TodoState[TodoState["HighPriority"] = 1] = "HighPriority";
    TodoState[TodoState["LowPriority"] = 2] = "LowPriority";
    TodoState[TodoState["Cancelled"] = 3] = "Cancelled";
})(TodoState || (TodoState = {}));
