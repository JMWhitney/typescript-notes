"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _lastId = 0;
function generateTodoId() {
    return _lastId += 1;
}
var TodoService = /** @class */ (function () {
    function TodoService(todos) {
        this.todos = todos;
    }
    TodoService.prototype.add = function (todo) {
        todo.id = generateTodoId();
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
    return TodoService;
}());
