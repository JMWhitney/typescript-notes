# TypeScript

TypeScript is a superset of JavaScript, meaning every TypeScript program is transpiled into plain JavaScript. This also means every JavaScript program is also a valid TypeScript program. 

## JavaScript and its typing system

JavaScript often relies on a principle called "Duck" typing, because it has no way to define its own data types like traditional class-based object oriented programming languages. The principle behind duck typing is that if it looks like a duck, walks like a duck, and quacks like a duck, it is probably a duck. The metaphore here is that if an object is called "Duck", and contains a property quack() then it is probably a duck type. 

```javascript
var Duck = {
  quack: function() {
    console.log("Quack my name is " + this.name);
  }
}

var Bill = Object.create(Duck);

Bill.name = "Bill"

//If Bill has a quack property he is probably a duck
if(Bill.quack) {
  Bill.quack();
}

```

The purpose of TypeScript is to eliminate some or all of this guessing game. Instead of writing code to evaluate the type of variables and parameters during runtime, TypeScript evaluates type and throws errors if needed to during compilation time. 

TypeScript also allows you to use the latest ECMAScript features in your TypeScript programs and compile them into JavaScript that is compatable in environments that only allow older versions of JavaScript. 

For example:

```javascript
var container = document.getElementById('container');

function countdown(initial, final=0, interval=1) {
  var current = initial;

  while(current > final) {
    container.innerHTML = current;
    current -= interval;
  }
}
```
This snippet of code that uses ES6 default parameters compiles to 

```javascript
var container = document.getElementById('container');

function countdown(initial, final, interval) {
    if (final === void 0) { final = 0; }
    if (interval === void 0) { interval = 1; }

    var current = initial;
    while (current > final) {
        container.innerHTML = current;
        current -= interval;
    }
}
```
which is compatible with versions of JavaScript previous to ES6. 

The build version(s) of JavaScript you want to target can be specified in a file labeled "tsconfig.json" like this:

```javascript
//tsconfig.json
{
  "compilerOptions": {
      "target": "es5"
  }
}
```

Now let's look at how TypeScript handles type declaration and checking.

You can specify a variable's type by placing a colon and keyword after the variable name. This works for function parameters, as well as return values. 

```typescript
function totalLength(x: string, y: any[]): number {
  var total: number = x.length + y.length;
  return total;
}
```

This piece of code expects the function totalLength to receive two parameters, x of type string and y of type array, and expects totalLength to return a number. This works because both the String and Array prototypes contain a property called length. 

We can also use union types to allow multiple types for our variables.

```typescript
function totalLength(x: (string | any[]), y: (string | any[])): number {
  var total: number = x.length + y.length;

  x.slice(0)

  if( x instanceof Array ) {
    x.push('abc')
  }

  if( x instanceof String ) {
    x.substr(1)
  }

  return total;
}
```

This snippet works the same way as the previously mentioned code but allows x and y to be either a string or an array. This can be more flexible than the previous method, but if used too freely defeats the purpose of a strictly typed system in the first place.

If you come from another language with strict typing like Java or C# you might try and solve this by overloading the function declaration like this:

```javascript
function totalLength(x: string, y: string) {...}
function totalLength(x: any[], y: any[]) {...}
```

But this won't work in JavaScript because the previous function implementation will get overwritten by the following one. In JavaScript you can only have a single implementation of a function.

In TypeScript you perform this function overloading by stacking the function declarations on top of the function implementation like this:

```typescript
function totalLength(x: string, y: string): number
function totalLength(x: any[], y: any[]): number
function totalLength(x: (string | any[]), y: (string | any[])): number {
  var total: number = x.length + y.length;

  x.slice(0)

  if( x instanceof Array ) {
    x.push('abc')
  }

  if( x instanceof String ) {
    x.substr(1)
  }

  return total;
}
```

The only difference here is that when you go to call the function, TypeScript will only show you the two function calls that take either a string or an array. Not the union type that accepts both. 

```typescript
  totalLength(...) 
  // autocomplete suggestions: 
  // totalLength(x: string, y: string): number
  // Or 
  // totalLength(x: any[], y: any[]): number
```

Note that when the overloaded function above is compiled to JavaScript, these overloaded function calls dissappear. They are simply metadata that TypeScript uses to help you write better code. 

When you take a look at the transpiled JavaScript for the function above you see this: 

```javascript
function totalLength(x, y) {
  x.slice(0);
  if (x instanceof Array) {
      x.push('abc');
  }
  if (x instanceof String) {
      x.substr(1);
  }
  var total = x.length + y.length;
  return total;
}
```

## Custom Types

### Defining Custom Types with Interfaces

TypeScript allows you to work with ES2015 features while preventing some common bugs like misspelling a variable name or returning the wrong type from a function. But a more powerful feature of TypeScript is the ability to create your own custom data types that describe the data structures and behavior in your applicaions. 

TypeScript offers three ways to define abstract types, that you are probably familiar with if you have spent time programming in classical OOP languages. Classes, Interfaces, and enums.

Interfaces in TS are basically the same as they are in C# or Java. They act as a contract that describes the data and behavior that the object exposes for other objects to interact with. In order to define an interface in TS you use this syntax:

```typescript
  interface Todo {
    name;
    completed;
  }
```
This interface describes a task we want to do, and a boolean that says whether or not this task has already been completed. Since we are working in TS we might as well assign them types because we can.

```typescript
  interface Todo {
    name: string;
    complete: boolean;
  }
```

Since you are probably wonder, let's take a look at the JavaScript that this code generates:

```javascript

```

That's right, it generates nothing. That is because interfaces are strictly used for compile-time checks, and have no effect on code at run-time. Therefore they should only be used to catch errors at build-time and shouldn't be depended on for run-time functionality. 

Now that we know that let's put our interface to work. 

```typescript
  interface Todo {
    name: string;
    complete: boolean;
  }

  var todo: Todo = {} // TypeScript Error: Type '{}' is not assignable to type 'Todo'. Property 'name' is missing in type '{}'. 
```
Here we try to create a variable based on the Todo interface, but assign it to an empty object literal. TS throws an error and warns you that it can't find the property(ies) defined in the Todo abstract type. 

alternitively you could use specify the type of the object using the casting syntax:

```typescript
var todo = <Todo>{}
```

However, some people prefer to avoid this in favor of the first method. Telling TypeScript what type you intend the object to be, and having the compiler do the checking for you.

So let's re-examine the first case were TS complains of an illegal type, and add a name property to it. But instead of giving the name value a string type, as it expects, let's give it a number value.

```typescript
  var todo: Todo = { name: 123 }; 
  //TS Error: Type '{ name: number; }' is not assignable to type 'Todo'. Types of property 'name' are incompatible. Type 'number' is not assignable to type 'string'.
```

Nope. TS did not like that either. Now it's telling us it found a name property, but the type is incompatible with the type we told TS to expect. 

So now let's satisfy TS and assign name to a string.

```typescript
  var todo: Todo = {
    name: 'Clean the gutters'
  }
  //TS Error: Type '{ name: string }' is not assignable to type 'Todo'. Property 'completed' is missing in type '{ name: string; }'.
```

Okay, maybe this is a bit expected at this point. But, from here we have at least two options of how to remedy the situation. First we can add a completed property to the object with a boolean value,

```typescript
  var todo: Todo = {
    name: 'Clean the gutters',
    completed: false
  }
```

Or we could decide whether or not all Todos need to be specified as completed or not. In this case we would update the interface to mark completed properties as optional.

```typescript
  interface Todo {
    name: string;
    completed?: boolean; // ? denotes optional properties
  }
```
The above syntax specifies that not every Todo needs to contain a completed property, but every completed property on a Todo object must still be of the boolean type.

It is important to again note that interfaces do not enforce any type and/or property assignments, declarations, or coercions at run time. They only describe what you expect to happen.

To illustrate this point, consider a scenario were these objects are sourced outside of our application. Say we make an AJAX request to fetch data from a server. We have no guarantee that the server won't change its internal data structures at some point in the future, even if our initial interfaces were congruent with the expected data and our application had been running successfully for some time. In this instance our application may break, because our typescript interfaces can't do anything to help us guard against that. But by utilizing interfaces you only have one point in the code to refactor instead of all the places in the code that depend on that data type returned by the server. 

Now, data fields are not the only thing you can define in your interfaces. You can also specify the behaviours that an object might have by defining method signatures on the interface as well. 

Because Todo is intended to describe only the data structure of a Todo item, we'll define a Todo service interface that will contain method signatures intended to create, retrieve, update, and destroy Todo items.

```typescript
  interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }
```

Note: the actual implementations of these functions does not exist yet. The purpose of the interface is only to make sure that the parameter and return types of the methods on the object are valid. To create the funciton implementations we will need classes which will be covered later.

### Using interfaces to describe funcitons

If you are familiar with javascript then you know functions are objects. That means you can assign data and method properties to them just like you would any other object.

```javascript
  var $ = function(selector) {
    // Find DOM element
  }

  $.version = 1.12; // This is legitimate javascript code. 
```

That means that we will probably want to describe it with an interface sooner or later. 

```typescript
  // Represents the above snippet.
  interface jQuery {
    (selector: string): HTMLElement;
    version: number;
  }
```

The version property is nothing new here, but the way function objects are represented is by using a nameless function. Other than the fact that the function has no identifier inside the interface, all the normal rules still apply. It accepts a string type as a parameter, and returns an HTMLElement which is a built in type in javascript. 

To specify that TypeScript treat a function as an instance of this interface you can use casting syntax.

```typescript
  // Treat this funcion like an instance of the jQuery interface
  var $ = <jQuery>function(selector) {
    // Find DOM element
  }

  $.version = 1.12;
```
 
The casting syntax is like saying to TypeScript, "Hey, I don't care what type of object you think this is. It's definitely a jQuery type". In essence you override the basic type checking in place and some people suggest that as a reason the casting syntax should be used as little as possible.

### Extending interface definitions

JavaScript is a dynamic language, so sometimes you might want to extend the data and method properties on an object on the fly. One example of this is the jQuery library that allows you to add custom functionality to it with its plugin model. We started to describe jQuery in the above snippets, but let's continue to add functionality to make it behave more like the real thing.

```typescript
  interface jQuery {
    (selector: (string | any)): HTMLElement;
    fn: any;
    version: number;
  }

  var container = $('#container');
```

Except one difference between this description and the real jQuery library is that jQuery returns a jQueryElement, not an HTMLElement.

```typescript
  interface jQuery {
    (selector: (string | any)): jQueryElement;
    fn: any;
    version: number;
  }
```

The jQueryElement is a JavaScript object that has helper methods like the data method, that allows you to assign data to an HTMLElement data property, or extract a previously assigned value from the data property. 

In other words the interface for the jQueryElement might look like this:

```typescript
 interface jQueryElement {
   data(name: string): any;
   data(name: string, data: any): jQueryElement;
 }
```

And we would use jQuery to modify data properties like this:

```typescript
  interface Todo {
    name: string;
    completed?: boolean;
  }

  interface jQuery {
    (selector: (string | any)): jQueryElement;
    fn: any;
    version: number;
  }

  interface jQueryElement {
    data(name: string): any;
    data(name: string, data: any): jQueryElement;
  }

  var todo = { name: "Clean the gutters" };
  var container = $('#container'); // Use jQuery to get a reference to a DOM element
  container.data('todo', todo); // Assign the todo object to the DOM element's data property 'todo'
  var savedTodo = container.data('todo'); // Read the element's data property 'todo' using the jQueryElement overloaded data function. 
```

That's the behavior that comes with jQuery out of the box. But jQuery allows you to attach additional behavior to a special property that it has called fn. 

So I can use that fact to create a custom method that assigns an instance of a Todo to the data of an HTMLElement.

```typescript
  $.fn.todo = function(todo?: Todo): Todo {
    if(todo) {
      $(this).data('todo', todo);
    } else {
      return $(this).data('todo');
    }
  }
```

What's more is that once I define this property I should be able to call it using any previously created jQueryElement like this:

```typescript
  container.todo(Todo) //TypeScript Error: Property 'todo' does not exist on type 'jQueryElement'.
```

But TypeScript will complain and throw an error because todo is not listed on the jQueryElement Interface. 

Now, we just created the jQueryElement interface, so we could update it to include the methods that we want:

```typescript
  interface jQueryElement {
    data(name: string): any;
    data(name: string, data: any): jQueryElement;

    todo(): Todo;
    todo(todo: Todo): jQueryElement;
  }
```

But, since jQuery is a third party library that I didn't create nor do I own, let's assume I don't have to ability to modify this interface nor should I attempt to.

Thankfull, jQuery allows you to simply extend interfaces without actually changing the original definition. 

How you do this is by creating a new interface that shares the same name as the original definition but contains the custom properties that you defined.

```typescript
  //Original definition
  interface jQueryElement {
    data(name: string): any;
    data(name: string, data: any): jQueryElement;
  }

  //Interface extension. Does not override the original.
  interface jQueryElement {
    todo(): Todo;
    todo(todo: Todo): jQueryElement;
  }

  var todo = { name: "Clean the gutters" };
  var container = $('#container');
  container.todo(Todo); // Valid
```

You can have any number of interface extensions and they won't override previous interfaces of the same name. As a general practice, it is probably best to keep these extensions to code that you don't own/did not create.

### Defining constant values with enums

If you're familiar with enums in other languages such as Java or C#, enums in TS act is pretty much the same way. Enums are constants used to replace the "magic" strings and numbers you would otherwise use. To understand what we mean by magic let's rexamine our Todo code.

```typescript
  interface Todo {
    name: string;
    completed?: boolean;
  }

  var todo: Todo = {
    name: "Clean the gutters",
    completed: false
  }
```

Let's say that a Todo item can be in one of several states, but only in one of these states. Let's say high priority, low priority, completed, or cancelled. 

So instead of our completed property we will have a state property:

```typescript 
  interface Todo {
    name: string;
    state: number;
  }
```

Here we use a number to represent the state, and we might assign a mapping of each possible state to a number like this:

Completed: 0,
High priority : 1,
Low priority : 2,
Cancelled : 3,

Or a character, or a string, or whatever. But whatever the case, we will end up hard-coding the state throughout our application like this:

```typescript
  function cancel(todo: Todo) {
    if(todo.state != 3) {
      throw "Can't cancel a cancelled task!"; 
    }
  }
```

Which might make sense now. But what if you come back to the project later down the line and you forgot what the arbitrary mappings were? Or you want to hire someone else to work on the project? They won't understand the mappings, and it's needlessly confusing.

Instead we use enums to give ourselves more accurate descriptors. The TypeScript code to do this looks like:

```typescript
  enum TodoState {
    Completed = 0,
    HighPriority,
    LowPriority,
    Cancelled,
  }
```

Check out the JavaScript that this generates:

```javascript
  var TodoState;
  (function (TodoState) {
      TodoState[TodoState["Completed"] = 0] = "Completed";
      TodoState[TodoState["HighPriority"] = 1] = "HighPriority";
      TodoState[TodoState["LowPriority"] = 2] = "LowPriority";
      TodoState[TodoState["Cancelled"] = 3] = "Cancelled";
  })(TodoState || (TodoState = {}));
```

It might not be immediately obvious what this code does, so let's play around with it in the console.

```javascript
  console.log(TodoState) // {0: "Completed", 1: "HighPriority", 2: "LowPriority", 3: "Cancelled", Completed: 0, HighPriority: 1, LowPriority: 2, Cancelled: 3}
```

Interesting. So it appears that it creates an IIFE, passes in TodoState if it is already defined. Otherwise it passes in TodoState as an empty object. Then creates a pair of properties on TodoState for each original enum definition. One property maps the string to the number, and the other property maps the number to the string. So we have a value mapping that works in both directions. In practice this looks like:

```javascript
  console.log(TodoState.Completed) // 0
  console.log(TodoState[0]) // "Completed"
```

Pretty neat, huh? So let's refactor our Todo code from earlier to work with our enums instead.

```typescript
  interface Todo {
    name: string;
    state: TodoState;
  }

  var todo: Todo = {
    name: "Clean the gutters",
    state: TodoState.LowPriority
  }

  enum TodoState {
    Completed = 0,
    HighPriority,
    LowPriority,
    Cancelled,
  }

  function cancel(todo: Todo) {
    if(todo.state != TodoState.Cancelled) {
      throw "Can't cancel a cancelled task!"; 
    }
  }
```

As you can see, this is a simple and elegant way to avoid hardcoded constants, which can make code brittle and confusing. 

### Defining anonymous types

Now that we know how to explicitly declare interfaces, let's look at how to declare them inplicity in-line, anywhere that accepts a type. This approach is called an anonymous type.

Let's say I wanted to create an object with only a name property. I could define a whole interface, or I could specify the object type, in-line, next to the declaration, anonymously.

```typescript
  var todo: { name: string };
  
  todo = { age: 41 } //TypeScript Error: Type '{ age: number; }' is not assignable to type '{ name: sring; }'. Object literal may only specify known properties, and 'age' does not exist in type '{ name: string }'.
```

This can be pretty useful in certain circumstances. Remember when we created the totalLength function, that used union types to accept only parameters that were of a type string or array? 

```typescript
function totalLength(x: (string | any[]), y: (string | any[])): number {
  var total: number = x.length + y.length;
  return total;
}
```

Well why not fully embrace the dynamism of JavaScript and allow any parameter that has a length property? We can use anonymous types to do so.

```typescript
  function totalLength(x: { length: number }, y: { length: number }): number {
  var total: number = x.length + y.length;

  return total;
}
```

This can make code that is more reusable, and sometimes easier to understand. However, there is still one problem which is there is nothing stopping users from passing in two parameters of different types. That means someone could pass in an array and add it's lengh to the length of a string. Which may not be considerable meaningfull, and maybe we want to restrict users from doing so. But this will be solved when we cover generics later. 

## Classes

### Understanding ProtoTypal Inheritance

Before we mentioned that there are three ways to define custom types in TypeScript: Classes, interfaces, and enums. We covered how to work with interfaces and enums, and will now cover classes and how to use them to do general object-oriented things like inheritance, encapsulation, and abstraction. If you've been programming for some time in JavaScript, you probably know that TypeScript isn't the first agent to introduce classes to JavaScript. That would be ES6 class syntax. And if you're even more experienced in JavaScript you probably know that classes don't actually exist at all in JavaScript. The ES6 class syntax is merely syntactic sugar, and at the end of the day the only object-oriented programming that exists in JavaScript is prototype-based object-oriented programming.

Let's give a quick overview of how OOP works in JavaScript, and how we achieve some of the same goals that class based OOP aims to achieve. 

The primary method of code reuse in prototypal OOP is writing an object to house some base behavior, then creating instances of objects to delegate to this base object, called the prototype. This object, called the child object, has behavior that specialises on the behavior of the base object. When you want to access a property on the child object, JavaScript first looks on the child itself for the property identifier. But if JavaScript does not find the specified property name, it then tries to look for it on the object's prototype. And because object prototypes can have prototype objects themselves, JavaScript continues up the prototype chain until it either finds an object that contains the property you want to access, or reaches the ultimate ancesstor, in which case it throws a reference error stating it cannot find the given property. 

Let's take a look at a common design pattern in JavaScript called the constructor design pattern, and add some prototypal inheritance to it.

```javascript
  // This is called the constructor. 
  // It's responsible for assigning properties to new objects
  function TodoService() {
    this.todos = [];
  }

  // Specify some behavior on the object's prototype
  TodoService.prototype.getAll = function() {
    return this.todos;
  }

  // The constructor function must be used in conjunction with the "new" keyword.
  // "new" rebinds the "this" keyword to refer to the object you are creating.
  // If you didn't specify the new keyword, "this" would default to the global object.
  // In the browser this would be the window object. In Node it's simply called global.
  var service = new TodoService();

  // Utilize the prototype's shared behavior method.
  service.getAll() //Prints []
```

It is important to note the difference(s) between prototypal inheritance and class based inheritance. In classical inheritance all relationships are defined between classes themselves, not the objects. Classes exist as templates to produce objects, and each object instance receives a copy of the properties of its class, and any inherited classes. Whereas in JavaScript there is no such thing as a class, and this copy operation does not happen. This is important to note because the prototype can be changed during run time, and all objects that inherit the prototype will receive the altered behavior. Whereas this dynamic changing of behavior doesn't happen in class based hierarchies. To understand the differences between classical and prototypal inheritance in greater detail you can check out the book on object prototypes in the You Don't Know JS series by Kyle Simpson, found here: https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes/ .

### Defining a class

Now that we got that out of the way, class syntax is a feature of TypeScript, as well as JavaScript ES6+, so let's cover it. Let's take a look at the snippet we defined above:

```javascript
  function TodoService() {
    this.todos = [];
  }

  TodoService.prototype.getAll = function() {
    return this.todos;
  }

  let service = new TodoService;
  console.log(service.getAll) // []
```

and see how we would implement the same solution using ES6 class syntax in JavaScript.

```javascript
  class TodoService {
    constructor() {
      this.todos = []
    }

    getAll() {
      return this.todos;
    }
  }

  let service = new TodoService;
  console.log(service.getAll) // []
```

You may be wondering, if classes don't exist in JS then what is the above code doing? It seems to be functioning the way that I would expect a class to be behave. Well let's look at the javascript that the above code compiles into.

```javascript
var TodoService = /** @class */ (function () {
    function TodoService() {
        this.todos = [];
    }
    TodoService.prototype.getAll = function () {
        return this.todos;
    };
    return TodoService;
}());

var service = new TodoService;
console.log(service.getAll); // []
```

Seem familiar? That's because this code is almost identical to the code we wrote using prototypal inheritance. The only difference is that the constructor definition is wrapped inside an IIFE to control scope and prevent you from accidentally polluting the global namespace. Neat.

But we are here to talk about TypeScript, not just JavaScript. The class definition as it stands above will actually produce an error during TypeScript compilation.

```typescript
  class TodoService {
  constructor() {
    this.todos = [] // error TS2339: Property 'todos' does not exist on type 'TodoService'.
  }

  getAll() {
    return this.todos; // error TS2339: Property 'todos' does not exist on type 'TodoService'.
  }
}
```

This happens because TypeScript prevents you from assigning a value to a property you never declared should exist. You do that by adding this line of code:

```typescript
class TodoService {

  // Define the todos property to accept an array of Todo objects.
  todos: Todo[];

  constructor() {
    this.todos = [] 
  }

  getAll() {
    return this.todos; 
  }
}
```

Note that the line 
```typescript
  todos: Todo[];
```

Doesn't create the property todos. That happens in the constructor. You can combine the property declaration as well as the initialization on the same line by doing:

```typescript
  class TodoService {

    // Define the todos property and initialize it to an empty array.
    todos: Todo[] = [];

    constructor() {
      // this.todos = [] // This line becomes unnecessary.
    }

    getAll() {
      return this.todos; 
    }
 }
```

This is a good way to define an initial property that is hard coded across all new instantiated objects of the same type. But it is often the case that you want to use the values that you pass into the constructor function to initialize the properties on your object. You do that in this way:

```typescript
  class TodoService {

    // Define the todos property and initialize it to an empty array.
    todos: Todo[];

    constructor(todos: Todo[]) {
      this.todos = todos;
    }

    getAll() {
      return this.todos; 
    }
 }
```

In fact, this is such a common practice that TypeScript has syntactic sugar to define a constructor parameter and class property in one line using a access modifier such as 'private'.

```typescript
  class TodoService {
    constructor(private todos: Todo[]) {}

    getAll() {
      return this.todos;
    }
  }
```

If we take a look at the code that this snippet compiles into:

```javascript
var TodoService = /** @class */ (function () {
    function TodoService(todos) {
        this.todos = todos;
    }
    TodoService.prototype.getAll = function () {
        return this.todos;
    };
    return TodoService;
}());
```

We find that it does the exact same thing as the code that defines a property, passes a value into the constructor, and assigns the property all on different lines. 

### Applying static properties

If you program long enough in class based OOP, you may come across situations where you want a piece of data to be shared and maintained across all instances of a class. That is a variable that is declared once per class, not object, and can be modified by any object that belongs to that class. This is referred to as a 'static' variable. 

To give an example of why you would want to do this, let's consider our Todo service. Let's say we want to give each of our Todo items a unique identifier property, so that we can reference specific Todo items in our application. 

A basic way to do this is to create a static variable that will keep track of the number of Todo items, update it whenever a Todo object is created or destroyed, and assign the Todo.id to the value of this number. So the first Todo will have an id of 1, the second will have an id of 2, and so on. 

In languages like C#, Java, or C/C++ there exists the static keyword to create these variables. In JavaScript the way this was handled for a long time is to, believe it or not, create a variable like `var lastId = 0;` and place it on the global scope. But this is considered a very bad practice, especially if you are using generic identifiers like `var id = 0;`. How can you guarantee that none of the other files in your application, or any third party libraries that you use won't also place a variable `var id = 123;` on the global namespace or try to modify it? The answer is you can't, and you should try to pollute the global namespace as little as possible to avoid difficult to diagnose bugs. 

So instead of placing this static variable in the global scope, it would be great if I could attach it to an object in its own protected scope. Moreover it would make sense to place this variable on the object (or function) that would use it the most. It would make sense, then, to attach any static variables or methods that you want to the constructor function. At any time, there is only one instance of the constructor, so there will only be one instance of the properties that you assign to it.

Prior to ES6 class syntax that would look like this:

```javascript
function TodoService() {
  ...
}

// Static data
TodoService.lastId = 0;

// Static method
TodoService.getNextId = function() {

  // Access static data
  return TodoService.lastId += 1;
}

TodoService.prototype.add = function(todo) {
  //Access static method
  var newId = TodoService.getNextId();
}
```

But that is with the ES5 syntax. ES6 class syntax adds syntactic sugar for this process and it looks like this:

```javascript
  class TodoService {
    static lastId = 0;
    
    constructor(private todos: Todo[]) { }

    add(todo) {
      var newId = TodoService.getNextId();
    }
    getAll() {
      return this.todos;
    }
  }

  static getNextId() {
      return TodoService.lastId += 1;
    }

  console.log(TodoService.lastId) // 0
```

and with TypeScript we can assign it type information just like any other class property.

```typescript
  class TodoService {

    static lastId:number = 0;
    
    constructor(private todos: Todo[]) { }

    add(todo: Todo) {
      var newId = TodoService.getNextId();
    }

    getAll() {
      return this.todos;
    }

    static getNextId() {
      return TodoService.lastId += 1;
    }
  }

  console.log(TodoService.lastId) // 0
```

While static methods can be helpful to centralize small pieces of logic across many components, static properties should be used sparingly. Even if they are attached to a class, and not the global namespace, they can make your code tightly coupled and brittle and that defeats a lot of the intent of OOP in the first place. 

### Making properties smarter with accessors

One of the core principles behind object oriented programming is the concept of encapsulation. In theory this means that objects should contain and protect all the data members/properties that they need to operate, and only expose as little information to the outside world as possible through defined accessor methods. These accessors are called getters and setters and they do probably what you can imagine they do. 

Getters retrieve a specified data property, and setters mutate data properties in only the specific ways that you define. Any interaction with the private data properties outside these accessor methods should be illegal, otherwise they are free to be mutated in any way anywhere in your program. The intended goal is to only expose and mutate your data in predicable, well defined pathways such that they do not get left in inconsistent states and debugging errors is easier. 

Here is an example with the Todo app we have been working with so far:

```typescript
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

var todo = {
  name: "Clean the gutters",
  get state() {
    return this._state;
  },
  set state(newState) {
    this._state = newState;
  }
}

// Access state that hasn't been assigned
console.log(todo.state) // undefined

// Assign state with setter
console.log(todo.state = TodoState.LowPriority); // 3

// Retrieve state with getter
console.log(todo.state); // 3 
```

But as it stands now our setter method isn't very useful because it doesn't perform any input restrictions. So maybe we want our setter to impose some restrictions, like a todo cannot be set to complete if it is not a high priority. ( Otherwise you perhaps, philosophically, shouldn't be working on low priority tasks while there are high priority tasks. )

```typescript
  var todo = {
    name: "Clean the gutters",
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

  todo.state = TodoState.LowPriority; // 3
  todo.state = TodoState.Completed; // "Todo must be HighPriority before being completed"
```

So it's at this point that a confession should be made. It doesn't make a lot of sense to place these accessor methods onto object literals. But this example is just to demonstrate how they work, and that you can put them on object literals. Normally they would be placed on the 'class' that you instantiate the object with. So let's make a class to represent our todo items and copy the logic there.

```typescript
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

// Instantiate todo, with a low priority
let todo = new SmartTodo("Clean the gutters", TodoState.LowPriority);

todo.state = TodoState.Completed; // "Todo must be HighPriority before being completed!"
``` 

And now you can start to see how getters and setters can be useful in situations where you want to tightly control the modification of data properties.

### Inherit behavior from a base class

After talking about getter/setter methods, we will now talk about why some people prefer not to use them, and instead extract the logic its own utility/service classes. That's because often logic that may seem simple on the service may be more complex than you anticipate. You may also consider it conveinient to have all your related data mutators wrapped into one object, rather than across many different ones. 

The previous example of conditionally setting a Todo state to completed is a good example to demonstrate this practice. If there is logic for the completed state, then it is probable that there would be logic to govern the other state changes as well. In that case you may want to implement the design pattern called the "state machine" to represent the logic for each of these state transitions as its own class. The exact implementation details of the state machine design pattern are outside the scope of these notes, but most of the state change classes we will work with here will look a lot like this class:

```typescript
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
```

This class takes a TodoState as an argument to its constructor, has a method to make sure that a given Todo object is elligable to have its state changed, and has a method to change the state of a passed in Todo object if it passes the canChangeState method. 

In a class based OOP language, like C# or Java, we would use the TodoStateChanger as a base class and have classes that inherit its properties as well as override the ones that we would like to specify. 

Thankfully there is a way to do this with the ES6 class syntax, using the keyword `extends`. So now let's create a class that inherits these base properties, and that implements the 'completed' state change that we defined in the getter/setter example.

```typescript
  class CompleteTodoStateChanger extends TodoStateChanger {

  }
```
Technically this is all you have to do to create a new class called CompleteTodoStateChanger, that has access to all the properties defined on the class TodoState Changer. But this isn't particularly useful because the purpose of extending a base class is to specify/override the base behaviors.

We'll start with the constructor. In other statically type languages, like C# or Java, whenever you derive a class from a class that has a constructor with a parameter, you must explicitly define a new constructor on the derived class. The same actually does not apply to ES6 class syntax, and the derived class will inherit the constructor along with the other properties. In other words this is perfectly valid code:

```typescript
  class CompleteTodoStateChanger extends TodoStateChanger {

  }

  let changer = new CompleteTodoStateChanger(TodoState.Completed); 
```

This is suitable for some situations, but not for the example we are working with. It doesn't make sense to pass a variable to the CompleteTodoStateChanger constructor to set the state to anything other than Completed. 

So we will create a new constructor that doesn't allow the ability to pass in a TodoState. 

One thing to keep in mind when doing this is that when defining a constructor on a derived class, you must also call the constructor of the base class. You do this with the `super` keyword.

```typescript
  class CompleteTodoStateChanger extends TodoStateChanger {
    constructor() {
      super(TodoState.Complete);
    }
  }
```

So now that we have that out of the way, let's override the default behaviors inherited from the TodoStateChanger class to implement the logic we defined in the getter/setter section. 

```typescript
  class CompleteTodoStateChanger extends TodoStateChanger {
    constructor() {
      super(TodoState.Complete);
    }

    canChangeState(todo: Todo): boolean {
      return super.canChangeState(todo) && todo.state === TodoState.HighPriority
    }
  }
```

Notice the use of the `super` keyword in our canChangeState definition. Here super is not being used to reference the parent class's constructor, but rather to access the parent's object properties. In this situation we don't want to completely override the canChangeState method, rather we want to extend its definition to be more specific. 

### Implementing an Abstract Class

So far most of the class syntax we have talked about has included standard ES6 features, and is not exclusive to TypeScript itself. But one feature that ES6+ does not support but TypeScript does is the concept of an abstract class. That is, a class that exists for the sole purpose of being a parent class, and won't have any direct instantiations.

In our previous example we had the base class TodoStateChanger, intended to be extended for each of the states that we want to create logic for. But let's say we never intended to create a direct instantiation of it. Right now there is nothing preventing us from creating a TodoStateChanger object, even if it doesn't make much sense to do so.

This is actually a simple fix. TypeScript offers us the `abstract` keyword to be placed before class definitions to signify our intent.

```typescript
  abstract class TodoStateChanger {
    constructor(private newState: TodoState) {
    }

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

  new TodoStateChanger(); // Cannot create an instance of the abstract class 'TodoStateChanger'.
```

Moreover, the `abstract` keywork can be used on any methods that we want to signify must be overridden by any child classes. 

It would make sense in this example that we want every child class of TodoStateChanger to implement its own canChangeState method to govern the logic with which we state changes. That would look like this:

```typescript
  abstract class TodoStateChanger {

    constructor(private newState: TodoState) {

    }

    abstract canChangeState(todo: Todo): boolean;

    changeState(todo: Todo): Todo {
      if(this.canChangeState(todo)) {
        todo.state = this.newState;
      }

      return todo;
    }
  }
```

Notice that with the `abstract` keyword infront of a class method the implementation is no longer needed and is removed. This is because it is expected that the child class will completely override that behavior and inherit none of it from the parent class. 

You may remember that our CompleteTodoStateChanger class defined its canChangeState method to reference its parent canChangeState method using super. Well that doesn't make sense anymore, and TypeScript will throw an error because the method doesn't exist anymore. Let's fix that.

```typescript
  class CompleteTodoStateChanger extends TodoStateChanger {
    constructor() {
      super(TodoState.Complete);
    }

    canChangeState(todo: Todo): boolean {
      return !!todo && todo.state === TodoState.HighPriority
    }
  }
```

### Controlling visibility with access modifiers

Previously in the section on defining a class, we briefly talked about access modifier and the `private` keyword. If you're familiar with traditionally class based languages then you are probably aware that there are certain keywords that modify whether or not certain members of a class are accessable outside of that class or not. 

Access modifiers can be placed before any class member, a data member, a function member, a constructor, even static members and getter/setter methods. Although the same access modifier must be placed on any getter/setter of the same name. 

TypeScript offers three access modifying keywords. `Private`, `public`, and `protected`. 

The `private` keyword is the most restrictive modifier. It disallows the specificed member from being accessed from any object that isn't a direct instantiation of the class. Even if the object an instance of an inherited or derived class.

The `protected` keyword is similar to the `private` keyword, except it allows access to objects that are instances of related classes.

The `public` modifier allows access to a member from any place or object in your code. In other words it describes the default behavior of JavaScript (and TypeScript) so you probably won't see it much. However, one place you may see it frequently used is in the parameters to a constructor to create an inline class property, just like we did but with the `private` keyword.

```typescript
  class SmartTodo {
    name: string;

    constructor(name: string) {
      this.name = name;
    }
  }
```

With the `public` keyword this becomes:

```typescript
  class SmartTodo {
    constructor(public name: string) {
    }
  }
```

And the same thing can be done with any of the keywords depending on the access modification that you desire. 

At this point it is also important to point out that JavaScript doesn't support private object properties. And TypeScript compiles into JavaScript so it can't change the default behavior of JavaScript. As with interfaces and typechecking, this preventative access is only evaluated during compilation time, and has no effect at run time. But that doesn't mean it isn't worth using. One of the purposes of statically typed code is to convey intent, and JavaScript developers would invent ways to signify intent with code conventions. One example is to place an underscore `_` before the variable name to indicate it is intended to be a private member.

### Implementing interfaces

Previously we talked about how to define interfaces to ensure the objects you reference have the members you expect them to. But the primary reason for the existance of interfaces in is to attach them to classes to ensure that they have the members that you intend for them to have.

Before we discuss this 

Throughout these notes we have constructed several different classes and interfaces, notably:

```typescript
  interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }

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
```

and the class:

```typescript
  class TodoService {

    private static _lastId: number = 0;

    get nextId() {
      return TodoService._lastId += 1;
    }

    constructor(private todos: Todo[]) {
    }

    add(todo: Todo) {
      var newId = this.nextId;
    }

    getAll() {
      return this.todos;
    }
  }
```

From the name, you can probably infer that we want the TodoService class to implement the ITodoService interface. But at this moment there is nothing explicitly linking the two. To do this you simply place the keyword "implements" after the class declaration and follow it up with the identifier of the interface you want to implement.

```typescript

interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }

  interface Todo {
    name: string;
    state: TodoState;
  }

  class TodoService implements ITodoService { 

    private static _lastId: number = 0;

    get nextId() {
      return TodoService._lastId += 1;
    }

    constructor(private todos: Todo[]) {
    }

    add(todo: Todo) {
      var newId = this.nextId;
    } 

    getAll() {
      return this.todos;
    }
  }
```

Right away TypeScript starts enforcing the behavior specified on the interface, and throws an error stating there are incompatible return types defined by the `add` method on the class and the `add` method defined on the interface.

So let's fix that by updating our Todo object to contain an id number, and change the `add` method to set the id of the passed in Todo object, push it onto the array of stored Todos, and then return the added Todo.

```typescript
  interface Todo {
    id: number;
    name: string;
    state: TodoState;
  }
```

```typescript
interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }
```

```typescript
  class TodoService implements ITodoService { // Class 'TodoService' incorrecly implements interface 'ITodoService'.
  // Type 'TodoService' is missing the following properties from type 'ITodoService': delete, getById

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
  }
```

The error we received on the `add` method has vanished, but has been replaced with an error stating TypeScript could not find the properties 'delete' and 'getById'. So let's add that now:

```typescript
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
```

Great, now TypeScript is not giving us any errors. However, there is one problem left. In the `getAll` function, we return a reference to the actual stored list of todos, because JavaScript passes objects and arrays by reference. So there is nothing stopping an outside party from directly modifying the contents of our todos, so we should change that for security reasons. 

```typescript
  // ...

  getAll():Todo[] {
    var clone = JSON.stringify(this.todos);
    return JSON.parse(clone);
  }

  // ...
```

One thing to note is that this performs a lossy deep copy. That means some properties that don't have JSON.stringify equivalencies like `undefined`, `Infinity`, circular references, or functions don't get copied. If you need a complete deep copy you should probably use a library defined deep copy like lodash's _.cloneDeep().

Other than that the class now successfully implements the `ITodoService` interface. If the class members get modified so that they receive the wrong parameters, or return the wrong type TypeScript will throw an error. 

And if you're wondering, it is possible for a class to implement more than one interface. Simply delimit each interface you want to implement after the `implements` keyword with a commma.

```typescript
  interface IIdGenerator {
    nextId: number;
  }

  interface ITodoService {
    add(todo: Todo): Todo;
    delete(todoId: number): void;
    getAll(): Todo[];
    getById(todoId: number): Todo;
  }

  class TodoService implements ITodoService, IIdGenerator {

    private static _lastId: number = 0;

    get nextId(): number { ... }
    constructor(private todos: Todo[]) { }
    add(todo: Todo): Todo { ... }
    getAll():Todo[] { ... }
    getById(todoId: number): Todo { ... }
    delete(todoId: number): void { ... }

  }
```

The class here successfully implements both ITodoService and IIdGenerator, because it contains all the members defined on both interfaces. 


## Generics

### Introducing generics

Throughout these notes we've discussed using TypeScript to implement a number of object oriented principles that are typically found in class-based statically typed languages like C# or Java. Another one of these principles are generics. Generics are a way to create functions and classes that define a behavior that can be used across many different types while retaining the information about that type. If that sounds confusing then let's look at an example.

```typescript
  function clone(value) {
    let serialized = JSON.stringify(value);
    return JSON.parse(serialized);
  }
```

Here is a function whose intent is to perform a deep copy on an object. (Coincidentally it looks a lot like the `getAll` method from our `TodoService` class). The return value from the call to `JSON.stringify` is simply a JSON string representing object and the properties it contains. But at this point information about the original object type is lost. When the JSON string gets parsed to form a new object, there's no way for TypeScript to infer anything about the original object type. But it sure would be nice to guarantee that the return value is of the same type as the original object no matter what type of object is passed in.  

Using generics, we can solve two problems at once. Not only can we give TypeScript the type information it needs to determine the return type, we can reuse this code for any arbitrary types throughout our application.

The way to specify a generic is by using left and right angle brackets after the function name, but before the parameter parantheses like this: 

```typescript
  function clone<T>(value){
    let serialized = JSON.stringify(value);
    return JSON.parse(serialized);
  }
```

What this does is tell TypeScript that you will be using a generic type in this function, and you will be refering to that type by the name `T`. Note that the indentifier `T` is used here simply by convention. The identifier can be any valid variable name. You can then use the generic type throughout the function anywhere that you would specify a regular type. 

```typescript
  function clone<T>(value: T): T {
    let serialized = JSON.stringify(value);
    return JSON.parse(serialized);
  }
```

Here we specify that the function `clone` accepts a parameter of arbitrary type `T` and that it also must return that same type. The generic gets evaluated whenever the function is called, and changes depending on you use it.

```typescript
  clone('Hello World!'); // TypeScript: function clone<string>(value: string): string
  clone(123); // TypeScript: function clone<number>(value: number): number
```

When we pass in a string, TypeScript automatically updates `<T>` to be a string type, and when we pass in a number it updates `<T>` to be a number type. And of course they work with custom defined types, and even anonymous types. 

```typescript
  var todo: Todo = {
    id: 1,
    name: 'Pick up drycleaning',
    state: TodoState.HighPriority
  };

  clone(todo) // TypeScript: clone<Todo>(value: Todo): Todo

  clone({ name: 'Justin' }) // TypeScript function clone<{name: string}>(value: {name: string}): {name: string}
```

Generics can be a powerful way to reduce duplicated code where the only difference is typing. 

### Creating generic classes

Previously we defined how to define generics in functions, but that is not the only place where they can be used. You can apply them to classes too. In fact we've already used a generic class in action without realizing it. Among others, TypeScript handles the built in JavaScript array type as a generic class. Previously we used this syntax to indicate an array of a specific type:

```typescript
  var array: number[] = [1, 2, 3];
```

But you can also use a different syntax that make it more explicit that the built in array uses a generic type.

```typescript
  var array: Array<number> = [1, 2, 3];
```

The two syntaxes presented are exactly, functionally equivalent. The only difference is that the first syntax is slightly shorter. 

Another situation where generics come in handy is the typed key value pair class. It looks like this:

```typescript
  class KeyValuePair<TKey, TValue> {
    constructor(
      public key: TKey,
      public value: TValue
    ) {}
  }
```

This class creates two generics, `TKey` to be the type of the key parameter, and `TValue` to be the type of the value parameter. We can now use this class to create instances of typed key value pairs.

```typescript
  let pair1 = new KeyValuePair(1, 'First'); // TypeScript: let pair1: KeyValuePair<number, string>
  let pair2 = new KeyValuePair('Second', Date.now()); // TypeScript: let pair2: KeyValuePair<string, number>
  let pair3 = new KeyValuePair(3, 'Third'); // TypeScript: let pair3: KeyValuePair<number, string>
```

We see that TypeScript dynamically infers information about the types based on the values that we pass in. Even more useful we can explicitly define the types that we expect.

```typescript
  let pair1 = new KeyValuePair<number, string>(1, 'First');
  let pair2 = new KeyValuePair<string, Date>('Second', Date.now()); // Error: Argument of type 'number' is not assignable to parameter of type 'Date'.
  let pair3 = new KeyValuePair<number, string>(3, 'Third');
```
And by doing so, we found a bug in our code. You could probably see this coming, but the JavaScript `Date.now` method doesn't return a Date object. It returns a the number of milliseconds since January 1, 1970, 00:00:00 UTC. So we need to make sure we create an object of the right type.

```typescript
  let pair1 = new KeyValuePair<number, string>(1, 'First');
  let pair2 = new KeyValuePair<string, Date>('Second', new Date(Date.now()));
  let pair3 = new KeyValuePair<number, string>(3, 'Third');
```

And that's pretty cool but it gets more interesting. Now that we've defined a generic key-value pair type, we can create a class to interact with any instances of that type. 

For example, we can create a utility that iterates through a collection of any type of key-value pair and prints them to the console.

```typescript

  let pair1 = new KeyValuePair<number, string>(1, 'First');
  let pair2 = new KeyValuePair<string, Date>('Second', new Date(Date.now()));
  let pair3 = new KeyValuePair<number, string>(3, 'Third');

  class KeyValuePairPrinter<T, U> {

    //Pass reference to an array of key-value pairs of type T and U.
    constructor(private pairs: KeyValuePair<T, U>[]) { }

    //Iterate through the array and print each key-value property.
    print() {
      for(let p of this.pairs) {
        console.log(`${p.key}: ${p.value}`)
      }
    }
  }

  var printer = new KeyValuePairPrinter([ pair1, pair3 ]); 
  printer.print(); // 1: 'First' 3: 'Third'

```

Simply printing the properties to the console may not be that exciting, but what is cool is that we have statically typed access to the object's `key` and `value` properties regardless of what types `T` and `U` are. TypeScript is able to determine that `KeyValuePairPrinter` should only accept an array of `KeyValuePair` objects that have congruent `<T, U>` types. 

In this example, TypeScript tells us `KeyValuePairPrinter` should only accepts Key value pairs of type `<number, string>`, and will in fact throw an error if we try to pass in parameters that don't agree with that type. 

```typescript
  var printer = new KeyValuePairPrinter([ pair1, pair2, pair3]); // Error: Type 'KeyValuePair<string, Date>' is not assignable to type 'KeyValuePair<number, string>'. Type 'string' is not assignable to type 'number'.
  printer.print();
```

TypeScript throws an error because `pair2` has different type parameters from the rest of the list, so for all intents and purposes is a different type of object.


### Applying generic constraints

Let's return back to one of the first examples we talked about earlier in these notes. The `totalLength` function that adds the length properties of two objects.

```typescript
  function totalLength(x: { length: number }, y: { length: number }) {
    var total: number = x.length + y.length;
    return total;
  }
```

As we discussed previously, the way that this function is implemented, there is nothing stopping us from adding the length of two incongruent objects. For example adding the length of an array to the length of a string probably doesn't make very much sense to do. So to avoid this possibility let's use generic types to enforce that the object parameters be of the same type. 

```typescript
   function totalLength<T>(x: T, y: T) {
     var total: number = x.length + y.length; // Error: Property 'length' does not exist on type 'T'.
     return total;
   }

   var length = totalLength('Justin', [1, 2, 3]); // Error: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

We've solved the problem of differing types, but now we get an error stating the property we tried to access isn't defined on our generic type. Luckily TypeScript offers the concept of generic constraints that we can apply to our generic type parameters to restrict the types of objects that satisfy those parameters. 

The generic constraint syntax is simple and it involves a keyword we have already used. Before we constrained our parameters to objects that contain a property called `length` with a type of `number` so let's do the same now using generic constraints:

```typescript
  function totalLength<T extends { length: number }>(x: T, y: T) {
    var total: number = x.length + y.length;
    return total;
  }

  var l1 = totalLength([1,2,3], [4,5,6]); // 6 
  var l2 = totalLength('Justin', [1, 2, 3]); // Error: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

And as we see, the error message on line 2 has disappeared but the error on line 7 remains, which is exactly what we want. We now have a function that does what we originally sought out to do, which is to only accept parameter objects of the same type, and specify that that type must have a length property represented by a number. 

And in the event that implementing your generic constraints with anonymous types becomes cumbersome, you can simply abstract them into interfaces and it functions exactly the same.

```typescript
  interface HasLength {
    length: number;
  }

  function totalLength<T extends HasLength>(x: T, y: T) {
    var total: number = x.length + y.length;
    return total;
  }

  var l1 = totalLength([1,2,3], [4,5,6]); // 6 
  var l2 = totalLength('Justin', [1, 2, 3]); // Error: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

That is a basic overview of generic constraints, but there is a caveats to be aware of. So far we have said that both parameters must be of the same type, that is whatever TypeScript evaluates `<T>` to be. But that's not strictly true. They can be any type that is compatible with type `<T>` including those types that inherit from it. 

To demonstrate this let's define our own custom class that extends the base array class like this:

```typescript
  class CustomArray<T> extends Array<T> {}
```

Because it inherits from the Array class it IS and instance of the Array class so it matches the same generic type parameter `<T>`. 

```typescript
  var length = totalLength([1, 2, 3], new CustomArray<number>(1, 2, 3, 4))) // 7
```

## Modules

### Understanding the need for modules in JavaScript

JavaScript has existed for quite some time, it's about 23 years old as of the time I am writing these notes. But it's only in the more recent years that the industry has started to take JavaScript seriously and apply patterns, practices, and development standards when working in the browser. We briefly hit upon a major point of contention, which is polluting the global namespace. This can be exacerbated in JavaScript because any .js file that gets read by the browser gets more or less concatenated into the same global scope. 

Placing code in the global namespace encourages a lot of anti-design patterns and dangerous practices simply because you can and its easy. Need to share a resource across two classes? Put it in a global variable, problem solved! As the code base scales you pretty quickly end up with code that is horribly obfuscated and tightly coupled. Adding additional features and tracking down bugs becomes frightening because the function of the application depends on its structure remaining exactly the way it currently is. It encourages implicit sharing and mutation, and thus competition for resources between classes. There may be collisions between variables were, for example, `var counter = 0;` gets accidentally overwritten by `var counter = 1` later on in the code. It's also very difficult to determine dependencies and relationships between your components.

This shouldn't come as a surprise if you come from other programming languages, because most have some kind of mechanism to modularize your code. The intent is to keep components separate, so they can be added and removed easily, enourage more explicit dependencies, and avoid collisions of objects/variables with different purposes but the same name. 

Prior to ES6 there wasn't any standard API or mechanism for doing this, but the need was still there. So developers invented their own design patterns to get around this. *Learning JavaScript Design Patterns* by Addy Osmani is a great resource to learn about design patterns not only as they pertain to modularization but many other topics as well. A link to the entire text is distributed by the author, for free, at this link https://addyosmani.com/resources/essentialjsdesignpatterns/book/index.html .

In this book is discussed several design patterns that relate to modularzation/encapsulation and the first is the Module Pattern/Revealing Module Pattern. The second is the concept of namespaces, and the third is ES6 modules/module loaders. In the following sections we will describe these patterns starting with namespaces.

### Organizing your code with namespaces

Most popular statically typed programming languages today have the concept of namespaces. C, C++, C#, and Java just to name a few. The reason namespaces are so popular is because they are an excellent way to avoid naming collisions and refer to a group of types as one organizational unit. If you have used C, C++, or C# then using namespaces should feel very familiar. (Not a surprise. C# and TypeScript were both developed by Microsoft). 

It is simply the keyword `namespace` followed by an identifier. Any valid identifer that can be used for a variable can be used here. i.e.:

```typescript
  namespace Model {

  }
```

Or if you want you can add dot nation `.` to add a hierarchy of nested namespaces.

```typescript
  namespace TodoApp.Model {

  }
```

If you're curious let's look at the JavaScript the above code compiles into:

```javascript
```

It doesn't actually generate anything. The namespace is empty and just gets ignored by the compiler. 

So let's put some code in there and see what the compiler generates.

```typescript
  namespace TodoApp.Model {
    interface Todo {
      id: number;
      name: string;
      state: TodoState;
    }
  }
```

==>

```javascript
```

Okay, it still generates nothing. This all seems kind of pointless, but it's to demonstrate that the namespace doesn't get generated if it's empty. And as we recall from earlier, interfaces are a tool that only the TypeScript compiler utilizes. They don't actually generate any JavaScript code. So let's add some TypeScript that does:

```typescript
  namespace TodoApp.Model {
    enum TodoState {
      Completed = 1,
      HighPriority,
      LowPriority,
      Deleted
    }
  }
```

==>

```javascript
  var TodoApp;
  (function (TodoApp) {
      var Model;
      (function (Model) {
          var TodoState;
          (function (TodoState) {
              TodoState[TodoState["Completed"] = 1] = "Completed";
              TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
              TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
              TodoState[TodoState["Deleted"] = 4] = "Deleted";
          })(TodoState || (TodoState = {}));
      })(Model = TodoApp.Model || (TodoApp.Model = {}));
  })(TodoApp || (TodoApp = {}));
```

This looks convoluted, so let's just take a look at the first two IIFES:

```javascript
  var TodoApp;
  (function (TodoApp) {
      var Model;
      (function (Model) {

      })(Model = TodoApp.Model || (TodoApp.Model = {}));
  })(TodoApp || (TodoApp = {}));
```

As we see the code generates the variable TodoApp globally, which will eventually serve as our namespace. It then creates an anonymous IIFE, which takes the function parameter `(TodoApp || (TodoApp = {}))`. This serves the combined objective of passing TodoApp if it has already been defined elsewere in our code and we want to tack on additional features to the namespace, or initializing TodoApp to be an empty object if not. 

Then the code initializes the variable `Model` on line 3. The purpose of the IIFEs is to create regions of protected, nested scope. That way if we try and access `Model` in the global scope like this:

```typescript
  var TodoApp;
  (function (TodoApp) {
      var Model;
      (function (Model) {
        // ...
      })(Model = TodoApp.Model || (TodoApp.Model = {}));
  })(TodoApp || (TodoApp = {}));

  console.log(Model); // ReferenceError: Model is not defined
```

We receive a ReferenceError. On the next line, line 4 is another IIFE, which receives `(Model = TodoApp.Model || (TodoApp.Model = {}))` as a function parameter. The purpose of this is similar to the arguments to the outside IIFE. Assign the value of `Model` to the object `TodoApp.Model` if it has already been defined, otherwise create the property `Model` on our `TodoApp` object and assign it the value of an empty object. By the way, using IIFEs to create regions of private scope, and only exposing the properties and variables that we need to is called the revealing module pattern.

Let's probe the code a bit to see the actual structure of our resulting objects.

```javascript
var TodoApp;
(function (TodoApp) {
    var Model;
    (function (Model) {
        var TodoState;
        (function (TodoState) {
            TodoState[TodoState["Completed"] = 1] = "Completed";
            TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
            TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
            TodoState[TodoState["Deleted"] = 4] = "Deleted";
        })(TodoState || (TodoState = {}));
    })(Model = TodoApp.Model || (TodoApp.Model = {}));
})(TodoApp || (TodoApp = {}));

console.log(TodoApp) // { Model: {} }
```

So we have what you might have expected. `TodoApp` is an object that contains `Model`, an empty object. But if you were expecting the trend to continue, and that `Model` would contain `TodoState` as a property, you guessed wrong. If we want TypeScript to expose TodoState to the outside world then we need to use the `export` keyword, like this:

```typescript
  namespace TodoApp.Model {
    export enum TodoState {
      Completed = 1,
      HighPriority,
      LowPriority,
      Deleted
    }
  }
```

Which generates the following javascript code ==>

```javascript
var TodoApp;
(function (TodoApp) {
    var Model;
    (function (Model) {
        var TodoState;
        (function (TodoState) {
            TodoState[TodoState["Completed"] = 1] = "Completed";
            TodoState[TodoState["HighPriority"] = 2] = "HighPriority";
            TodoState[TodoState["LowPriority"] = 3] = "LowPriority";
            TodoState[TodoState["Deleted"] = 4] = "Deleted";
        })(TodoState = Model.TodoState || (Model.TodoState = {}));
    })(Model = TodoApp.Model || (TodoApp.Model = {}));
})(TodoApp || (TodoApp = {}));
```
The only difference between this code and the previous is on line 11, where `TodoState` gets set as a property on the `Model` object.

You can see how the `namespace` syntax is a lot more friendly to work with than the equivalent javascript. 

And if you're wondering why TypeScript bothers to generate code that passes the existing namespace into the IIFEs it's because you are free to declare the same namespace multiple times throughout your application, either in the same file or in separate ones. Each subsequent definition will simply concatenate the properties onto the existing namespace.

For example the following is totally valid code:

```typescript
namespace TodoApp.Model {
  export interface Todo {
    id: number;
    name: string;
    state: TodoState;
  }
}

// ...

namespace TodoApp.Model {
  export enum TodoState {
    Completed = 1,
    HighPriority,
    LowPriority,
    Deleted
  }
}
```

So that's all cool and dandy, but what how do we utilize the members defined in namespaces elsewhere in our code? What if we had a separate namespace in which we wanted to access members from TodoApp.Model like this?

```typescript
namespace TodoApp.Model {
  export interface Todo {
    id: number;
    name: string;
    state: TodoState;
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

namespace DataAcess {
  export interface ITodoService {
    add(todo: Todo): Todo; //Error: Cannot find name 'Todo'.
    delete(todoId: number): void;
    getAll(): Todo[]; //Error: Cannot find name 'Todo'.
    getById(todoId: number): Todo; //Error: Cannot find name 'Todo'.
  }
}
```

Well you can replace every Todo with TodoApp.Model.Todo:

```typescript
namespace DataAccess {
  export interface ITodoService {
    add(todo: TodoApp.Model.Todo): TodoApp.Model.Todo; 
    delete(todoId: number): void;
    getAll(): TodoApp.Model.Todo[]; 
    getById(todoId: number): TodoApp.Model.Todo; 
  }
}
```

Which is kind of cumbersome, so you can use the `import` keyworld to alias these namespace references.

```typescript
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
```
**Summary**: TypeScript namespaces are a simple yet powerful way to create regions of privately scoped variables. And not just pseudo-privately scoped, in the sense that the TypeScript compiler will throw an error if you try to access them, but rather they will be privately scoped in your actual executable javascript. TypeScript namespaces abstract on the revealing module design pattern, leaving a syntax that is functionally equivalent but much more comfortable to use. In the next section I'll talk about refactoring the application that we have been developing thus far to fully take advantage of namespaces.

### Using namespaces to encapsulate private members

In the previous section we talked about how namespaces work, so now let's see how to use them in practice, in the context of our todo application. We'll start by creating a file named `DataAccess.ts`, define a namespace `DataAccess` inside that file, and cut and paste the `TodoService` class as well as the `ITodoService` interface inside `DataAccess`. The resulting file will look like this:

```typescript
// DataAccess.ts
namespace DataAccess {

  import Model = TodoApp.Model;
  import Todo = Model.Todo;

  export interface ITodoService {
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
      var filtered = this.todos.filter(x => x.id == todoId);
 
      if( filtered.length ) {
        return filtered[0];
      }

      return null;
    }
  
    delete(todoId: number): void {
      var toDelete = this.getById(todoId);
      
      var deletedIndex = this.todos.indexOf(toDelete);
  
      this.todos.splice(deletedIndex, 1);
    }
  }
}
```

As we recall, members inside a namespace are privately scoped by default, so we can remove the `private static` keywords from our _lastId property and move it outside of the class.

```typescript
  // DataAccess.ts
  namespace DataAccess {
    import Model = TodoApp.Model;
    import Todo = Model.Todo;

    let _lastId: number = 0;

    export interface ITodoService {
      // ...
    }

    class TodoService implements ITodoService {
      // ...
    }
  }
```

And we also want to clean up any references to the TodoService._lastId property, which doesn't exist anymore. And while we're at it we'll move the `nextId` getter method outside of the class, rename it, and clean up any references to it as well.

```typescript
// DataAccess.ts

// ...

function generateTodoId() {
  return _lastId += 1;
}

class TodoService implements ITodoService {

// get nextId(): number {
//    return _lastId += 1;
// }

  add(todo: Todo): Todo {
    todo.id = generateTodoId();

    this.todos.push(todo);

    return todo;
  } 

// ...
}
```

But actually, we receive an error here, and that is because we haven't formally defined the TodoApp namespace yet. So let's create a file `model.ts` that will house the namespace to contain the model for our data.

```typescript
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
```

And now the code in `DataService.js` compiles correctly because TypeScript knows to look for the `TodoApp.Model` namespace and access its exported members. 

Namespaces, which use the internal module approach, are just one way that TypeScript offers to encapsulate your code. Another way, called the external module approach, is equally effective and actually more common in some circumstances, like browser based 'lazy loading' or node.js development. That is what we will cover in the next section.