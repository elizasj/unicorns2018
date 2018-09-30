---
date: '2017-03-17T00:00:00Z'
tags: ['css', 'animation', 'color', 'css', 'variables']
title: 'CSS Variables'
category: 'creative dev'
---

[Sass](http://sass-lang.com/) has always been one of those things on my ever-growing list of things to get to. While I haven't gotten to it _yet_, after a recent encounter with CSS variables, I've been wondering if I even still should bother at all. Because aren't variables one of the main reasons that [Sass](http://sass-lang.com/), [Less](http://lesscss.org/), [SCSS](http://sass-lang.com/documentation/) and all their other preprocessor brethren came to exist in the first place?

And as far as I can tell, plain old CSS might already have a leg up on preprocessors since you can modify CSS variables at runtime. Whereas with any preprocessor, you're pretty much stuck with a static variable.

To me that feels a bit backwards, because if I'm playing around with variables at all in CSS I'm doing so because I want a certain degree of continuous or changing state (Interactivity ftw! o/ )

Case in point: my most recent contribution to the ongoing [interactiveeshapes series](https://github.com/elizasj/interactiveshapes). I wanted to play around with gradients because they provided an interesting context for experimenting with many colors at once.

While color mixing is something that I've always been curious about, I'm also very intimidated by it. Curious because pretty colors... duh. Intimidated because I had already tried adding simple movement to a gradient in one of my first ever projects which ended up being a disaster.
So I wasn't feeling great about what I was trying to build... until I remembered that CSS now offers us variables! For free! Variables that I can access via my JS! And fiddle with!

Brilliant.

<p data-height="650" data-theme-id="light" data-slug-hash="RpoaoB" data-default-tab="result" data-user="elizasj" data-embed-version="2" data-pen-title="RpoaoB" class="codepen">See the Pen <a href="http://codepen.io/elizasj/pen/RpoaoB/">RpoaoB</a> by Eliza SJ (<a href="http://codepen.io/elizasj">@elizasj</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

So there a number of things I did here. First I set the gradient's initial state to be animated - if the user never moves the mouse, there's still something dynamic (albeit subtle) happening on the screen.

Next, I considered that I would have two main changes occurring based on mouse movement. Left/right movement would effect change on the angle the gradient was cascading, while up/down movement would scale the percentages of each of my gradient's colors at a given moment within the animation cycle.

Figuring out how to best manipulate the different shades in the gradient was actually the trickiest part of this whole exercise. I had started by changing the gradient directly via the `background-image`property color percentages but that quickly revealed itself to be the wrong approach. The colors weren't bleeding into each other at all anymore, instead tracing a very thick (&& ugh-ly) line between each of the two shades. No thanks.

I found the solution I needed in the keyframes, where for each marked moment in time I added two css variables that acted on the `background-position`.

...Wait, what? Unexpectedly, making the `background-position` the interactive element instead of the gradient itself created a more realistic representation of color movement within the gradient. Never a dull moment w/CSS amIright?

## CSS Variables vs Preprocessors

But what about preprocessors. They've been holding their own within the CSS ecosystem for years and I'd be hard pressed to find anyone who uses one wishing they didn't. And that's good news because there are some distinct differences between what both CSS Variables and preprocessors can do.

**CSS Variables**

- call a value via `var(--nameofcustomeproperty)`
- they inherit by default (this feature can be turned off)
- can be applied inline
- can be accessed and manipulated with javascript

**Preprocessors**

- static
- compiles down to regular CSS (inherent browser support)
- can strip units of value

So in fact, for now think of them as complimentary to one another. I do wonder what will happen when CSS Variables are supported across all browsers -- will we all just forego preprocessors in lieu of built-in functionality? It does kind of seem like a lot of what you can do with preprocessors you can do with CSS Variables while the same doesn't necessarily hold true in reverse. I guess time will tell ⌛⏳
