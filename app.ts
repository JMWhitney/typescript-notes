interface Todo {
  name: string;
  state: TodoState;
}

enum TodoState {
  Completed = 1,
  HighPriority,
  LowPriority,
  Cancelled
}

class SmartTodo {

  constructor(private name: string, private _state: TodoState) {
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    // Trying to complete a 
    if( newState === TodoState.Completed && this._state !== TodoState.HighPriority  ) {
      // Exit with error 
      throw "Todo must be HighPriority before being completed"
    }

    // Otherwise set the state
    this._state = newState;
  }
}

class TodoStateChanger {
  constructor(private newState: TodoState) { }

  canChangeState(todo: Todo): boolean {
    return !!todo;
  }

  changeState(todo: Todo): Todo {
    if(this.canChangeState(todo)) {
      todo.state = this.newState;
    }

    return todo;
  }
}

class CompleteTodoStateChanger extends TodoStateChanger {

}

let todo = new SmartTodo("Clean the gutters", TodoState.LowPriority);
todo.state = TodoState.Completed;
