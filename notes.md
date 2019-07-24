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