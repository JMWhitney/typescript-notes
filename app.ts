interface Todo {
  name: string;
  complete: boolean;
}

interface ITodoService {
  add(todo: Todo): Todo;
  delete(todoId: number): void;
  getAll(): Todo[];
  getById(todoId: number): Todo;
}

var todo = <Todo>{};