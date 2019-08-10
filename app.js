var TodoState;
(function (TodoState) {
    TodoState[TodoState["Completed"] = 1] = "Completed";
    TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
    TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
    TodoState[TodoState["Cancelled"] = 4] = "Cancelled";
})(TodoState || (TodoState = {}));
var TodoService = /** @class */ (function () {
    function TodoService(todos) {
        this.todos = todos;
    }
    Object.defineProperty(TodoService.prototype, "nextId", {
        get: function () {
            return TodoService._lastId += 1;
        },
        enumerable: true,
        configurable: true
    });
    TodoService.prototype.add = function (todo) {
        todo.id = this.nextId;
        this.todos.push(todo);
        return todo;
    };
    TodoService.prototype.getAll = function () {
        return this.todos;
    };
    TodoService.prototype.getById = function (todoId) {
        // Return only the Todos with id == todoId
        var filtered = this.todos.filter(function (x) { return x.id == todoId; });
        // If we found it, return it. 
        if (filtered.length) {
            return filtered[0];
        }
        //Otherwise return nothing.
        return null;
    };
    TodoService.prototype.delete = function (todoId) {
        //Obtain reference to the object we want to remove
        var toDelete = this.getById(todoId);
        //Find its position in the list of todos
        var deletedIndex = this.todos.indexOf(toDelete);
        //Remove it from the list
        this.todos.splice(deletedIndex, 1);
    };
    TodoService._lastId = 0;
    return TodoService;
}());
