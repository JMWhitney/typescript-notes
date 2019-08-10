interface Todo {
  id: number;
  name: string;
  state: TodoState;
}

enum TodoState {
  Completed = 1,
  HighPriority,
  LowPriority,
  Cancelled
}

interface ITodoService {
  add(todo: Todo): Todo;
  delete(todoId: number): void;
  getAll(): Todo[];
  getById(todoId: number): Todo;
}

class TodoService implements ITodoService { 

  private static _lastId: number = 0;

  get nextId(): number {
    return TodoService._lastId += 1;
  }

  constructor(private todos: Todo[]) {
  }

  add(todo: Todo): Todo {
    todo.id = this.nextId;

    this.todos.push(todo);

    return todo;
  } 

  getAll():Todo[] {
    return this.todos;
  }

  getById(todoId: number): Todo {
    // Return only the Todos with id == todoId
    var filtered = this.todos.filter(x => x.id == todoId);

    // If we found it, return it. 
    if( filtered.length ) {
      return filtered[0];
    }

    //Otherwise return nothing.
    return null;
  }

  delete(todoId: number): void {
    //Obtain reference to the object we want to remove
    var toDelete = this.getById(todoId);
    
    //Find its position in the list of todos
    var deletedIndex = this.todos.indexOf(toDelete);

    //Remove it from the list
    this.todos.splice(deletedIndex, 1);
  }
}
