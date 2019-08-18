import { Todo } from './model';

let _lastId: number = 0;

function generateTodoId(): number {
  return _lastId += 1;
}

export interface ITodoService {
  add(todo: Todo): Todo;
  delete(todoId: number): void;
  getAll(): Todo[];
  getById(todoId: number): Todo;
}

class TodoService implements ITodoService { 
  constructor(private todos: Todo[]) {
  }

  add(todo: Todo): Todo {
    todo.id = generateTodoId();

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
