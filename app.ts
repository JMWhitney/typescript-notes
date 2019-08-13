namespace TodoApp.Model {
  export class Todo {

  }
}

namespace TodoApp.Model {
  export enum TodoState {
    Completed = 1,
    HighPriority,
    LowPriority,
    Deleted
  }
}

namespace DataAccess {

  import Model = TodoApp.Model;
  import Todo = Model.Todo;

  export interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }
}
