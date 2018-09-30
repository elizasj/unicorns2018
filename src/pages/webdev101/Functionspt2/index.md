---
date: '2017-02-13T00:00:00Z'
tags: ['javascript', 'functions', 'series', 'under the hood', 'webdev101']
title: 'Functions pt.2'
category: 'webdev101'
---

Welcome to part deux of my little intro to functions. If you're unclear on why functions are objects or what the difference between a function statement and expression is, pop on over to [part one](https://unicornsfartpixels.github.io/blog/2017/02/01/2017Functions-pt1) and have a quick read through. Otherwise, let's dive into `this` and one of my favourite features of ES6: arrow functions!

## This doesn't have to be confusing:

`this` get's a lot of flack for being disorienting. Really, it's not so bad if you keep [execution context](<https://en.wikipedia.org/wiki/Execution_(computing)#Context_of_execution>) and [scope chain](<https://en.wikipedia.org/wiki/Scope_(computer_science)>) in mind. When you invoke a function, an execution context is created, which is where the function's code runs. The variables created here have their own environment within the curly bracket-gilded walls of the function. Beyond these walls is the function object itself, which has been committed to the computer's memory somewhere in the scope chain (aka where you've written the function in your code.) It's position in the scope chain will be important to keep in mind when you call on variables that aren't in the functions execution context. Javascript will peek outside the functions curly brackets, and scan your code layer by layer (because let's not forget that functions can contain other functions and objects and so on...) looking for that variable - which itself might reference a function stored in memory, etc, - until it hits the outer walls of your code, aka the global namespace.

Great, but what about `this`? When you invoke a function and it's execution context is created, Javascript does you a favor and hands you a pointer toward (in theory,) that function's execution context. You might have guessed at this point - that pointer is `this`. But `this` won't necessarily always point at the execution context you _expect_ it to, namely the one you've just created. In fact, how and when you call your function is what really decides where `this` will point.

For example, if you call a **function statement** or **expression** as is, their manifestation of `this` will always point to the global object

```javascript
function unicornsFart() {
  console.log(this)
  this.whatdotheyfart = 'pixels'
}
unicornsFart()
```

```javascript
var unicornsFart = function() {
  console.log(this)
  this.whatdotheyfart = 'pixels'
}
unicornsFart()
```

In our example then, `pixels` attaches `whatdotheyfart` to the global execution context and not to the function that calls it. Which might feel a bit weird to some - I get it. It did at one point seem so natural for me to assume that `this`'s purpose was to attach methods and variables to the functions that created and used them. But when you understand the true nature of functions within the context of Javascript, the surprising bits about the language start making perfect sense. Well, sort of...

```javascript
var unicornsStillFart = {
   name: 'the unicorn object',
   log:  function() {
     this.name = "the unicorns fart pixels object'
     console.log(this)
   }
}
```

Remember everything I said about `this` up there? When it comes to **objects**, you can just flip pretty much everything I said on its head. Here our example shows a function as the value of log within the `unicornsStillFart` object - aka a method function. To invoke the function, we have to go through `unicornsStillFart`, calling the log method on the object - in which case `this` no longer points to the global namespace but instead **points to the object that contains it**.

Or does it? What if `this` is invoked from two layers deep inside the object?

```javascript
var unicornsStillFart = {
	name: 'the unicorn object',
	log:  function() {
		this.name = "the unicorn fart object'
		console.log(this)

		var  changename = function(newname) {
			this.name = newname
		}
	changename('the unicorns fart pixels object')
	console.log(this)
}
unicornsStillFart.log()
```

As it happens, if you create a function inside a function inside of an object, when you invoke that function, the execution context that hands you `this` will be pointing to ... the global namespace!

Yea, this part of js is decidedly a bit weird, and there's no real way around it, which as you can imagine has caused _many_ a coder to rip their hair out in frustration. In fact most seasoned programers consider this functionality to be a solid mistake in how Javascript functions. But alas, error or no error, it's part of the languages anatomy.

But not to worry because (duh,) there's always a hack - should you find yourself confronted by this frustrating functionality, apply a quick fix by injecting `var self = this;` into the object method (aka the function that will contain the nested function.) This will force reset the execution context.

Since your object method contains a new variable that points to `this`, they'll be referencing the same location in your computer's memory, which in this case is the `unicornsStillFart` object. Swap out `this` for self in the rest of your code and you're in the clear.

```javascript
var unicornsStillFart = {
	name: 'the unicorn object',
	log:  function() {
		var self = this

		this.name = "the unicorn fart object'
		console.log(self)

		var  changename = function(newname) {
			self.name = newname
		}
	changename('the unicorns fart pixels object')
	console.log(self)
}
unicornsStillFart.log()
```

With ES6 this ( <-- hah) is less of an issue - but since legacy code is a thing and not everyone is actively using ES6 yet, chances are you'll most definitely come across this pattern at some point.

## Arrow functions

Ok so arrow functions! Let's jump from some vanilla js basics into ES6 specifics. No one can argue against arrow functions being great for shortening code, and once you understand how they work it will actually make your code quite a bit more readable imo. But that doesn't mean you should forego javascript's tried and true traditional function expressions. Arrow functions aren't meant to replace so much as to compliment their classic counterpart. So in what circumstances are we to use one over the other?

Before we get into that, let's break down how an arrow function works because it can be written a few different ways

```javascript
// FUNCTION EXPRESSION
const listUnicorns = unicorns.map(function(unicorn) {
  return `${unicorn}`
})

// ARROW FUNCTION V.1
const listUnicorns = unicorns.map((unicorn) => {
  return `${unicorn}`
})

// ARROW FUNCTION V.2
const listUnicorns = unicorns.map(unicorn => return `${unicorn}`)

// ARROW FUNCTION V.3
const listUnicorns = unicorns.map(() => return `Supreme Unicorn`)

// ARROW FUNCTION V.4
const listUnicorns = (unicorn) => { return (hello `${name}`)}
```

To give you an idea, **V.1** is a kind of 'direct translation' of the above function expression as an arrow function. **V.2** shows that when you have a single argument, you can forego putting it inside parentheses while **V.3** shows that in the absence of any arguments, you can't forget to include an empty pair of parentheses. Finally, **V.4** shows that while arrow functions are always anonymous, you can nonetheless store them inside of variables.

Now that you know what they look like, let's look at what they're good for.
Hint: arrow functions are always both anonymous and give implicit returns.

**A note on implicit returns**

Most of the time I argue in favor of explicit everything because implicit things leave a lot of room for interpretation from the programer. But in this case I have to conceed - it feels anything but confusing, and creates what feels like a much more fluid exchange with your computer.

```javascript
const numbers = [23, 546, 69, 28]
const high = numbers.filter(age => number >= 60)
// if the number is above 60, returns true & adds to new filtered array.
// no need for an if statement. snazzy!
```

**scope and this**

When you use an arrow function, `this` is inherited from whatever the parent scope is - which can be handy for things like click handlers. Speaking of `this`, the `self` pattern mentioned above can now be avoided completely: just make the inner function an arrow function, et voila! Problem solved, and your code looks cleaner. This is possible because the arrow function doesn't change the value of 'this'. It just inherits from the parent.

```javascript
var c = {
	name: 'the c object',
	log:  function() {

		this.name = "updated c object'
		console.log(this)

		var  setname = ()(new name) => this.name = newname)

	setname('updated again!)
	console.log(this)
}
c.log();
```

With these examples in mind you can probably begin to imagine many cases where you could easily reach for an arrow function. But there are a few situations where it would actually do more harm than it would help.

**Don't use arrow functions...**

- to create constructors
- to create function methods
- to rebind the value of 'this'
- to add a prototype method
- to access the arguments object

Which brings us to the end of this second installment of my humble little Functions overview. To sum up arrow functions: they are (really) great and you should (really) use them - especially now that you understand how to keep a handle on `this`. Like I said, arrow functions are suppose to compliment function expressions. So just remember the key contexts in which you wouldn't want to rely on the arrow function's functionality.
