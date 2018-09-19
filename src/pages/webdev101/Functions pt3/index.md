---
date: '2017-03-14T00:00:00Z'
tags: ['javascript', 'functions', 'series', 'under the hood', 'webdev101']
title: 'Functions pt.3'
category: 'webdev101'
---

Initially I only set out to do a single post touching on a few of the intricacies about functions that I found helpful. But here I am three posts later with more info still! There's just a lot going on with functions-or-do-you-mean-objects in JS - a solid understanding of which I think will bust the door wide open on why the code you write causes your programs to behave in the mysterious ways they sometimes do.

## `__proto__` vs Prototype

**TL;DR :**
Instances have `__proto__`, while objects have prototype.

By now we're fairly comfortable with the idea of execution contexts and scope chain. (If not, hop back to [Functions pt.2](https://unicornsfartpixels.github.io/blog/2017/02/13/2017Functions-pt2) for a refresher.) We've talked a lot about how **where** you place variables in your code has a huge effect on **how** you can access them. But what about properties?

Does the same pattern apply? Does our program simply look them up on the scope chain via whatever execution context we might be in, climbing the DOM tree branch by branch until what's being looked for is found? Well, sort of. But not really.

Sort of because there is still a climb to do. Not really because in this case instead of looking outward, you're diving inward, via your function's prototype chain.

Which brings us to `Object.prototype` aka your object's (&& every object in JS ever,) internal prototype, and `__proto__`, that towards which your objects internal prototype points when it's created via a constructor function. Both a tongue twister and a bit of a mindfu\*k I know. But bear with me.

First of all, let's agree on why the prototype property is even relevant to us: it helps extend and add meat to what can often be a somewhat brittle stand-alone blueprint.

And if you're completely unfamiliar with `__proto__` , no worries. It's hard to find, and that's kind of the point. It only becomes available to us when you create an object using the `new` keyword. Hidden deep down inside every object your constructor function creates, and only evocable if you include the double underscores, `__proto__` isn't actually there for us to play around with. It's an object in and of itself (surprise, surprise,) who's purpose is to serve up any properties we set via the prototype.

In essence it's a pointer - or better yet a getter function - that returns the link between the instance you've created via `new` and whatever the `this` binding happens to be: instances have `__proto__`, while objects have prototype.

## Constructor Functions

But let's hit pause on all this `__proto__`/prototype stuff for a second and look at what constructor functions are. If you've ever created an array, you've used a constructor function - aka a function object that defines the properties and methods of the object you create via the keyword `new`.

```javascript
const unicorns = new Array('first', 'second', 'third')
```

The only difference between the array's constructor and your own is that the former is baked into the javascript language, ready and waiting for you to use anytime you might need it, complete with built-in methods right out of the box. While the later is really up to you to define.

```javascript
function Unicorn(name, age) {
  this.name = name
  this.age = age
}

const pixelfarter = new Unicorn('Meme', 1)
console.log(pixelfarter)
// Unicorn { name: 'Meme', age: '1' }

Unicorn.prototype.getDetails = function() {
  return 'my name is: ' + this.name + '  and my age is ' + this.age
}
```

## What is going on

So let's break it down: in the above example we've written a simple constructor function, based off which we then created a new object that we're saving to memory via the `pixelfarter` variable.

So far so good.

And thanks to the way Javascript is built, we have also simultaneously just set the prototype. Or rather, JS did it for us.

Go ahead and call `__proto__` on `pixelfarter` and you'll get a glimpse of both what is happening behind the scenes, and why `__proto__` is so important.

```javascript
pixelfarter.__proto__
// Unicorn {}
```

That empty object you see there? That's the prototype! But don't get it confused: that empty object isn't the prototype of the function constructor itself. It's the prototype of **any object that you create using the function constructor**. There's a certain degrees-of-separation factor that you need to keep in mind here, which also explains _why_ we have both `__proto__` & prototype.

So any objects you create specifically via the `new` keyword not only have whatever properties and methods you attached to them inside the constructor function, but they also have a prototype, which is the prototype property of that function:

`pixelfarter` is the instance to which `Unicorn.prototype` is attached via `__proto__`, which itself becomes available to us upon creation of the instance of pixelfarter (by using `new`).

Whew! Ok, I think we've circled how everything is linked together for long enough at this point. But wait, one more (tiny, I promise,) thing!

## Object.create()

With all browsers officially supporting Object.create, this feels as good a time as any to review what in fact, this is and what it's good for. For one, it's the most literal way to apply prototypal inheritance in Javascript. When you call it, it provides you with an empty object, much like a constructor, who's prototype doesn't point to, but in fact _is_, that which you passed into the `create()` property.

```javascript
var unicorn = {
  firstname: 'Default',
  lastname: 'Default',
  Greeting: function() {
    return 'Neigh' + this.firstname
  },
}

const pixelfarter = Object.create(unicorn)
```

So the object that is createed by Object.create actually forms the prototype of the new object itself.

```javascript
const pixelfarter = new Unicorn() === Object.create(Unicorn.prototype)
```

The pattern goes that you'd just override the object with whatever properties you might need to add as you go forward.

As for when and where to apply one over the other, I personally tend toward constructor functions for the simple reason that I'm most comfortable with them. That being said I haven't encountered any solid argument for or against either option. The only warning that comes up again and again in the docs and discussions online is of course to avoid mixing both approaches in your code. Pick one and run with it. You're code will be more clear, and since your objects will all have been built the same way, you'll have an easier time (in theory) with debugging.
