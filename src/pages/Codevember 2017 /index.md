---
date: '2018-01-21T00:00:00Z'
tags: ['animation']
title: 'Japanese Fireworks w/Mo.js'
category: 'creative dev'
---

In November I took part in the <a href="http://codevember.xyz/" target="_blank">Codevember</a> challenge, which if you have no idea what I’m talking about, is a yearly month-long creative coding challenge. The concept is pretty straight forward and fun: make a sketch a day, and share it online with the the hashtag <a href="https://twitter.com/search?q=codevember&src=typd" target="_blank">#codvember</a> (so that your entry can be featured with all the others on the official website.) Fun!

While last year I went in with absolutely no plan - I think I made it through about four days before falling so far behind it felt like a lost cause to even try and catch up, - this year I decided to turn the challenge into an opportunity to learn a new technology. I restricted myself to only using the <a href="http://mojs.io/" target="_blank">mo.js library</a>, and iterating on one "burst" (small animation in mo-speak) a day.

I was a bit worried that the sketches would end up being redundant but it was quite the opposite. My initial simple burst yielded a collection of colorful aniamtions (check out the full collection <a href="https://codepen.io/collection/XegEbZ/#">here\*</a>.) that spawned a few requests about how I'd made them and even some comparisons to <a href="https://i.pinimg.com/736x/e6/82/76/e6827668847a3e51054783fc52b63a68--flat-illustration-illustration-fireworks.jpg" target="_blank">japanese fireworks</a>

Here I’ll walk you through how I created my 6th entry for this year’s codevember, a sort of <em>dandelion-spreading-its-pollen-in-the-wind</em> sort of thing:

<img src="images/codevemberday6.gif">

### Mo.js - motion for the web

In a nutshell, mo.js is a powerful animation library with some unfortunately incomplete documentation, that renders in SVG. This can make things frustrating if like me you find yourself reveling in the library's possibilities (endless) and spend any time looking through their tutorials only to see all the greyed out ‘soon!’ ’s beside each taunting topic. Code tease!

But for our purposes today, we have everything we need. I only use two modules. `Burst` and `Timeline`, which I can access by creating mo.js objects for each.

### mojs.Burst({})

Inside the Burst object, I set the `radius` of the burst, in this case going from 0 to 30 over the duration of the animation, with 25 burst particles emanating from it. The burst will rotate from -220 degrees to 55 degrees, and the particles will grow thanks to the `opacity` and `scale` I’ve set. Pretty straight forward so far.

```javascript
const burst = new mojs.Burst({
  radius: { 0: 30 },
  angle: { [-220]: 55 },
  scale: { 0: 1.2, easing: 'cubic.out' },
  count: 25,
  opacity: { 0: 1 },
})
```

If you're following along, you'll see this produces a set of 25 pink particles. Cute, right? But the real fun starts when you add in some `children`.

```javascript
const burst = new mojs.Burst({
  radius: { 0: 30 },
  angle: { [-220]: 55 },
  scale: { 0: 1.2, easing: 'cubic.out' },
  count: 25,
  opacity: { 0: 1 },
  children: {
    shape: 'line',
    stroke: { '#03FFD5': '#67b0d7', easing: 'cubic.in' },
    scale: { 0: 2, easing: 'cubic.out' },
    strokeWidth: { 5: 1 },
    radius: { 5: 30 },
    opacity: { 0: 1 },
    angle: { 10: [-200] },
    delay: 'stagger( 30 )',
    duration: 3000,
  },
})
```

Where a burst emanates particles from or to it’s centre point, each of those particles can have their <em>own</em> set of particles revolving around... the burst’s original particles as the centre point. It's a mouthfull I know, but let it sink in for a minute. This opens to the door to a lot of fun stacking options, and is exactly where I hit my stride with this lib.

### N.B: Mo.js has some built in shapes for your to play around with right out of the box, including circle (the default), rect, polygon, line, cross, equal, curve and zigzag.

In the above example, we set the child `shape` to line, of which by default there are going to be 25, because that’s how many particles we set in the initial burst.

You might have noticed I set the `color` value of the lines to two different colors - one initial and on that is eased into as the burst progresses in time. Here I also use `stroke`, which implies more fun things to play around with for shapes that could have a fill like a rect or polygon, (and some unexpected surprises with zigzag…)

Next `scale` - keep in mind that when you play with scale in the inner children object, it kind of doubles up on the initial scale you set. The two are not independent from each other. I set it to grow from 0 to 2 on the already 0 to 1.2 scale initially set in the parent.

The same goes for any key’s you might repeat in the children. If its been initially set in the parent it will piggy back off of that value. In fact it’s because of this that the lines rotate the way they do - the opposing angle values!

As I said, I really hit my stride with this library when I started playing around with the children object, and this is why. By putting certain options at opposition with each other, I was able to yield some really nice results. A lot of it came down to tweaking things until I found a fun idea - in this case I thought of dandelions when they’re still just white puff balls spewing their evil pollen germs - and going from there with a more specific goal.

Of note: `delay` and `duration` are pretty key to making your bursts work. Delay will bring in your particles at a delay, or if you stagger it like I did with this burst, over the total duration you set for your burst which in our case is 3000 milliseconds, aka 3 seconds.

```javascript
const burst2 = new mojs.Burst({
  radius: { 0: 175 },
  angle: { [-220]: 55 },
  scale: { 0: 1.2, easing: 'cubic.out' },
  count: 35,
  children: {
    shape: 'circle',
    fill: '#dfa0f7',
    strokeWidth: { 3: 1.5 },
    radius: { 5: 10 },
    opacity: { 0: 1 },
    angle: { 10: [270] },
    delay: 'stagger( rand(50, 100) )',
    duration: 3000,
  },
})

const burst3 = new mojs.Burst({
  radius: { 0: 175 },
  angle: { 55: [-220] },
  scale: { 0: 1.2, easing: 'cubic.out' },
  count: 35,
  children: {
    shape: 'circle',
    fill: '#dfa0f7',
    strokeWidth: { 3: 1.5 },
    radius: { 5: 10 },
    opacity: { 0: 1 },
    angle: { [270]: 10 },
    delay: 'stagger( rand(50, 100) )',
    duration: 3000,
  },
})
```

These two bursts are the ‘evil pollen’ elements - I won’t run through everything because you should be able to recognise a lot of it based on my above explanations.

Of note: I set the initial `angle` of rotation on each burst opposite to one another in both the parent and the children for the criss crossing effect the particles have. I also randomised the `stagger` setting, between the 50 and 100 range. I found the 50-100 setting kept the particles just a hair more restricted in their movement. Again, there’s a lot of tweaking based on feeling happening here. You have to play around with things and see what you like.

```javascript
const burst4 = new mojs.Burst({
  radius: { 0: 60 },
  angle: { 500: 150 },
  count: 35,
  stagger: '20',
  children: {
    shape: 'circle',
    fill: 'none',
    stroke: { '#3843E4': '#6978EC', easing: 'cubic.in' },
    strokeWidth: { 4: 1 },
    strokeDasharray: '40%',
    strokeDashoffset: { '-10%': '50%' },
    scale: { 0: 2, easing: 'cubic.out' },
    radius: { 5: 25 },
    opacity: { 0: 1 },
    duration: 3000,
  },
})
```

This last burst element features something we haven’t seen yet - `strokeDasharray` and `strokeDashoffset`, which you might be able to deduce from their names, adds some white space to anything you’ve stroked. This means you can introduce a shape over time, as if it were drawing itself, or in our case here, create a series of 35 dashed circle outlines. Thanks to stacking the `radius`, the `rotation` of the ‘broken’ circles creates a really nice flower-like pattern.

### mojs.Timeline({})

Last but not least and possibly the most important part of mo.js, is the `timeline` object. Because without it, nothing will show up on the screen.

```javascript
const timeline = new mojs.Timeline({
  repeat: 9999,
})
  .add(burst, burst2, burst3, burst4)
  .play()
```

You basically create your timeline, fill it with your burst objects, and run it using `.play()`. The repeat value is set to 9999 so that the burst runs <em>ad infinitum/à la gif</em>, which you can of course change to fit the needs of your sketch.

<p data-height="392" data-theme-id="0" data-slug-hash="ZaOgGm" data-default-tab="js,result" data-user="elizasj" data-embed-version="2" data-pen-title="codevember#6" class="codepen">See the Pen <a href="https://codepen.io/elizasj/pen/ZaOgGm/">codevember#6</a> by Eliza SJ (<a href="https://codepen.io/elizasj">@elizasj</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

If <strong>mo.js</strong> is something you think you might want to delve into further, check out this great little <a href="https://css-tricks.com/introduction-mo-js/" target="_blank">intro</a> by <a href="https://twitter.com/sarah_edo?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank">Sarah Drasner</a>, or pick your way through the mo.js <a href="https://github.com/legomushroom/mojs/blob/master/api/readme.md" target="_blank">docs</a>.

<strong>\*</strong>If you pikced around my <a href="https://codepen.io/collection/XegEbZ/#">collection of codevember entries</a>, you might have noticed that there are much less than 30 sketches on display here. That’s because I took a bit of a hiatus through part of the month to do an artist residency in Lisbon. I managed to do a few sketches while at the residency but eventually I gave in to the creative tornado that was that experience. But contrary to last year, I hope back on the bandwagon post-residency, and... just kept going. Because who says you always need to play catch up?
