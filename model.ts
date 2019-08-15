namespace TodoApp.Model {

  export interface Todo {
      id: number;
      name: string;
      state: TodoState;
  }

  export enum TodoState {
      Completed = 1,
      HighPriority,
      LowPriority,
      Cancelled
  }
}