TypeScript is a superset of JavaScript, meaning every TypeScript program is transpiled into plain JavaScript. This also means every JavaScript program is also a valid TypeScript program. 

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

#Defining Custom Types with Interfaces

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

Note: the actual implementations of these functions does not exist yet. The purpose of the interface is only to make sure that the parameter and return types of the methods on the object are valid. To create the funciton implementations we will need classes. 