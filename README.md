# TypeScript

TypeScript is a superset of JavaScript, meaning every TypeScript program is transpiled into plain JavaScript. This also means every JavaScript program is also a valid TypeScript program. 

### JavaScript and its typing system

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

## Defining a class

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

## Applying static properties

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

## Making properties smarter with accessors

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

## Inherit behavior from a base class

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
