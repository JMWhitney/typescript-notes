// enum TodoState {
//   Completed = 0,
//   HighPriority,
//   LowPriority,
//   Cancelled,
// }
// interface Todo {
//   name: string;
//   state: TodoState;
// }
var TodoService = /** @class */ (function () {
    function TodoService(todos) {
        this.todos = todos;
    }
    TodoService.prototype.getAll = function () {
        return this.todos;
    };
    return TodoService;
}());
// let todo1 :Todo = { name: 'Clean gutters', state: TodoState.HighPriority };
// let todo2 :Todo = { name: 'Wash The Dishes', state: TodoState.LowPriority }
// let todoList = [todo1, todo2];
// let service = new TodoService(todoList);
// console.log(service.getAll) // [todo1, todo2]
