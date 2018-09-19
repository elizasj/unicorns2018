---
date: '2017-02-01T00:00:00Z'
tags: ['javascript', 'functions', 'series', 'under the hood', 'webdev101']
title: 'Functions pt.1'
category: 'webdev101'
---

Let's break down functions, shall we? Because while they may seem straight forward, there are a lot of little details about how you write them, and when and where you create and call them that can really make, or severely break your program.

## 1st class functions:

In Javascript, all functions are 1st class functions. But don't go looking for 2nd class functions because that's just not a thing. The term 1st class was coined in the 1960's, and just means that in JS, you can do things like pass a function as an argument, or return a function from another function. Everything you can do with other types you can also do with functions, too. Like assigning them to variables, passing them around, or creating them on the fly for example. This isn't something that's true for functions across programming languages, hence the special moniker.

## Everything is an object

I'm sure you've heard this before: in Javascript, _everything_ is an object. I had never really stopped to think about what that meant for my code until I landed on [Tony Alicea's](https://twitter.com/anthonypalicea?lang=en) overview of Javascript's weirder parts. (Well worth the 20$ on [Udemy](https://www.udemy.com/understand-javascript/) btw, but you can also grab the first 3 hours for free [over here](https://www.youtube.com/watch?v=Bv_5Zv5c-Ts).) It was one of those things that teachers annoyingly told me to "just know is true and move on" back in my bootcamp days. I really feel like not getting into the details of why it was important to know this seemingly small detail did us quite a disservice. Here's why:

It would have gone a ways in explaining why for example, one can attach both methods and properties to functions in js. Because functions aren't just _any old object_. They're a special kind. While they have all the [same features that objects have](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics), they also come with a few special extra goodies:

- **The CODE property:** this is where the code you write is actually stored. Yea, weird right? Because that means that the code you've written isn't the function itself, it's a property of the function. Let that sink in for a second: when you write a function, you're code gets stocked away as a property of the function object. The CODE property is itself quite special in that can it be invoked via parenthesees: `fn()`. When it's invoked, an execution context is created within your program, inside which all that pretty code you've written gets run. Imho this is where a lot of people get lost in JS's 'wierdness' : function's aren't code containers. They are objects with properties, methods, etc... The code you write is but one tiny piece of the puzzle.

## Statements vs Expressions

**Function Statements:**

```javascript
function unicorns() {
  console.log('fart pixels')
}
```

**Function Expressions:**

```javascript
var unicorns = function() {
  console.log('fart pixels')
}
```

While **function statements** (also sometimes referred to as function declarations) can claim OG status as they were the most popular way to call functions in js' early years, increasingly **function expressions** have been gaining traction. Why is this? **Scope**. Function statements are [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), while function expressions aren't. Lack of hoisting means that function expressions keep a handy copy of any local variables from the scope in which they were defined. Some also argue that the hoisted nature of function statements encourage sloppy code, which is pretty much every seasoned programmers pet peeve.

So you can maintain scope with function expressions because they aren't hoisted. Great. But wait - the variable name you give to your function expressions _is_ itself hoisted, and defaults to the primitive 'undefined' when first committed to memory at creation. This is why you might have noticed that if you actually do try to invoke a function expression _before_ the definition of the function in your code, the computer will return "undefined is not a function".

Fire up [Node](https://nodejs.org/en/) in your terminal and try it out with a simple variable. Declare one and you'll see as soon as you hit enter, Node returns "undefined". Only when you call the variable does it return the value you've given it:

![Image](https://raw.githubusercontent.com/unicornsfartpixels/unicornsfartpixels.github.io/master/media/node.png)

Let's review: when you run your code, the computer will first commit everything it can into memory and only when it's done that will it actually execute the code. Which explains the aforementioned error "undefined is not a function": the computer doesn't yet know what that variable you've created is equal to.

It's also interesting to note that technically, function expressions are anonymous functions, or better yet they're function objects contained within variables. You invoke a function expression by calling the variable name you assigned to it and adding parentheses, or leave it parentheses free and pass it to another function as parameter.

```javascript
var show = function(info) {
  console.log(info)
}

var unicorns = function(show) {
  show('fart pixels')
}

unicorns(show)
// fart pixels
```

That's it for Functions pt1! And while I can only speak for myself, I will say that a lot of things clicked into place when I really started digging into what "everything is an object" means, so hopefully this very humble little overview might prove helpful for someone else out there. Even now that I know this stuff inherently, as I wrote this post some of the theory still caused me to stop and think. Putting all the 'weird stuff' into words just reminds me how fun/strange/charming programing can be. Part 2 coming soon ✌️
