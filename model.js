"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TodoState;
(function (TodoState) {
    TodoState[TodoState["Completed"] = 1] = "Completed";
    TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
    TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
    TodoState[TodoState["Cancelled"] = 4] = "Cancelled";
})(TodoState = exports.TodoState || (exports.TodoState = {}));
