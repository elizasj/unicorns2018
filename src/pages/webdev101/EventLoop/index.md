---
date: '2017-05-03T00:00:00Z'
tags: ['javascript', 'under the hood', 'webdev101']
title: 'The Event Loop'
category: 'webdev101'
---

## First things first: some context

[V8](https://developers.google.com/v8/) is Chrome's javascript runtime aka the thing that allows javascript to execute inside your browser.

I'm sure you've come across [Web APIs](https://developer.mozilla.org/en/docs/Web/API) before, but just in case this is new for you here's the general gist: a lot of the common things devs consistently rely on -- like setTimeout or the DOM -- aren’t included in Chrome's javascript runtime, but instead are accessible via Web APIs.

Which brings us to javascript's single threaded nature. In js you have a single **call stack** which can only execute one thing at a time, top to bottom, as it's laid out in your code.

Of course, we know this to be untrue - just use that handy setTimeout to change up the order of execution in your code! Easy enough right? Until you block your call stack... 💥😫💥

**Blocking** is when slow running code (image processing for example, or network requests) freezes the call stack. Nothing can or will happen until the requests complete. And then your program plays a messy game of catch-up with rest of the un-rendered stuff in the call stack that it was aware of but as of yet unable to run. You can imagine the rapid firing that can happen here. Less than ideal.

One solution for blocking is asynchronous callbacks, made possible by none other than the title and subject of this post, **the event loop**. Whew, we made it to the event loop. Which admittedly seems like a tiny detail when compared to all the context we had to wade through to get here. But tiny details can have a powerful impact. Case in point, the event loop provides us with _concurrency_

# One at a time, all at once

Ok so Chrome is a web browser - this we know. And it gives us dev tools - this we appreciate. It also gives us APIs like the DOM, Ajax, and setTimeout, which are ~~kind of like~~ additional threads we can tap into. See where I'm going with this?

The browser is _more_ than just a runtime. While V8 is single threaded the APIs give us the ability to make calls to them #duh🙄, but I mention it because to my knowledge you can never access them directly.) Since the browser grants us the ability to call on the APIs, well, bam! You’ve got concurrency ftw.

When you make a request to the API, as soon as the call is fired and starts to get processed it's popped off the call stack and handed off to the API, where it gets treated. When the request is complete, it's sent into the the callback queue where it sits, queued up, ready and waiting for the event loop to push it into the call stack to be run.

**The event loop essentially listens to the call stack, and if/when it becomes empty (aka everything has run,) throws up the first thing from the callback queue to the call stack to be rendered.**

_"Ok but what about SetTimeout = 0?"_ If you've poked around other people's code even just a tiny bit, you've likely come across this little hack. It's usually used when you're trying to defer something until the call stack is clear. Remember, you’re making an API call, so the callback gets pushed immediately onto the task queue, and has to wait until everything else is run for the event loop to pass it up to the call stack.

And that's it! If things were fuzzy before, hopefully this little overview has shed some light on what the event loop is and how you might use it to your advantage. Being aware of these little details comes in pretty handy for debugging ✌
