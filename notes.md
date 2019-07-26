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

```javascript
function totalLength(x: string, y: any[]): number {
  var total: number = x.length + y.length;
  return total;
}
```

This piece of code expects the function totalLength to receive two parameters, x of type string and y of type array, and expects totalLength to return a number. This works because both the String and Array prototypes contain a property called length. 

We can also use union types to allow multiple types for our variables.

```javascript
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

But this won't work in JavaScript because the previous function implementation will get overwritten by the following one. 

In TypeScript you perform this function overloading by stacking the function declarations on top of the function implementations like this:

```javascript
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