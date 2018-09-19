---
date: '2018-03-01T00:00:00Z'
tags: ['basics', 'webdev101']
title: 'The For Loop(s)'
category: 'webdev101'
---

It’s safe to say that most of us are quite familiar with the for loop.

```javascript
const myArray = ['an', 'array', 'of', 'strings']

for (let i = 0; i < myArray.length; i++) {
  console.log(myArray[i])
}

// outputs :
// an
// array
// of
// strings
```

It’s dependable, flexible, and can be used in pretty much any situation that calls for a loop.

There are two other types of for loops that you can also use, which have more specific contexts of application:

### The for/of loop

```javascript
const myArray = ['an', 'array', 'of', 'strings']

for (let value of myArray) {
  console.log(value)
}

// also outputs :
// an
// array
// of
// strings
```

The for/of loop can be used to iterate over any itterable collection, which means that any object with the <a href=“https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator” target="_clear">Symbol.iterator</a> property can use this loop. That includes <strong>arrays</strong>, <strong>strings</strong>, <strong>maps</strong>, and <strong>sets</strong>.

If you consider that the <strong>Symbol.iterator</strong> comes with an <strong>@@iterator</strong> method that get’s triggered as soon as you call a loop on it, the for/of loop becomes a sort of wrapper for the iteration.

You can also use this loop on <strong>NodeLists</strong>, which is handy to keep in mind since despite resembling an array, the handy `forEach()` method you might tend to naturally reach for isn’t actually available to it. The <strong>Object</strong> object (sounds redundant, I know, but since everything in javascript is an object, it bears distinguishing) on the other hand can’t use this loop because it’s not an itterable.

### The for/in loop

```javascript
const myArray = ["an", "array", "of" "strings"];

for (let value in myArray) {
  console.log(value);
}

// outputs 0 1 2 3
```

The for/in loop can be used on things like <strong>arrays</strong>, <strong>strings</strong>, and <strong>DOM node collections</strong> and it will return a reference to the value.

One of the handiest things about this loop is that it’s the object’s answer to the array’s `forEach()` method, but
the loop can be used on any enumerable - which you can check for using property.enumerable.

If it returns true, you’re good to go! However unlike the for & for/of loop, you can’t use the for/in to modify the original enumerable.

The loop also executes its iteration arbitrarily, so if sequence order is important to you, like it usually is with say, an array, you’ll be better served using one of the other for loop options.
