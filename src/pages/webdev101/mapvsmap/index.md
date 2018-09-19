---
date: '2018-03-01T00:00:00Z'
tags: ['basics', 'webdev101']
title: '.map() vs p5.js map()'
category: 'webdev101'
---

The array’s integrated map method and p5’s map method are not to be confused. Maybe no one needs this reminder other than me but since I got comfortable with <strong>p5’s map()</strong> method before I really got my hands dirty with vanilla javascript’s built in <strong>Array.prototype.map()</strong>, I’ve tricked myself more than once into thinking that `map()` took an array and made it fit into a range that previously wasn’t available to it.
If you find that confusing, welcome to my world. Turns out I had mashed both <strong>map()</strong>’s uses into one hodgepodge of disfunction.
So let’s sort things out:

### Array.prototype.map()

<strong>map()</strong> takes an <strong>array</strong> and executes a function you provide on every element in the array, returning a new array that contains the results.

```javascript
const books = [
  {
    title: 'Shantaram',
    genre: 'nonfiction',
    pages: 933,
  },
  {
    title: 'Mindstorms',
    genre: 'nonfiction',
    pages: 252,
  },
  {
    title: 'A Beautiful Question',
    genre: 'nonfiction',
    pages: 448,
  },
  {
    title: 'The Goldfinch',
    genre: 'fiction',
    pages: 771,
  },
]

let bookGenres = books.map((book, index, books) => {
  return book.genre
})

// bookGenres = ["nonfiction", "nonfiction", "nonfiction", "fiction"]
```

### p5’s map()

<strong>map()</strong> tracks a <strong>value</strong> in one range and mirrors it’s behaviour in a new range.

```javascript
// map(value,start1,stop1,start2,stop2)

var value = 10
var m = map(value, 0, 100, 0, width)
ellipse(m, 50, 10, 10)
```

<p data-height="565" data-theme-id="dark" data-slug-hash="JMxwzr" data-default-tab="js,result" data-user="elizasj" data-embed-version="2" data-pen-title="p5 map() ex" class="codepen">See the Pen <a href="https://codepen.io/elizasj/pen/JMxwzr/">p5 map() ex</a> by Eliza SJ (<a href="https://codepen.io/elizasj">@elizasj</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## To recap...

<strong>Vanilla js'.map()</strong> is one of the first things you're taught when you dive into functional js because it can be used as a really handy replacement for a for loop. Whereas <strong>p5's .map()</strong> works more like the kind you'd use to explore a new city - it converts the scale of a range to fit into another.
