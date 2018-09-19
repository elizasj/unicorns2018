---
date: '2018-06-07T00:00:00Z'
tags: ['shaders', 'math']
title: 'Lerp & Normalization'
category: 'creative dev'
---

While my foray into the mysterious land of shaders has thus far had me happily experimenting with ready-made examples, I’m at a point where my mind is comfortable enough with the c-like syntax that I wan’t to start building from the ground up. No more playing around with things until I haphazardly stumble onto something that doesn’t look “too bad”. Now, it’s all about intention.

So far, this has meant dialing back a bit in terms of the complexity of my experiments. My most recent <a href="https://www.instagram.com/p/BjsyJW9gmg1/?taken-by=iamelizasj" targe="_blank">sketches</a> have involved some pretty basic pulsating squares. But I’m happy to momentarily forgo a bit of wow-factor if it means developing a some math intuition in the interim. The simple squares linked above were created, positioned and animated using linear algebra, which had you asked me a few years ago, I never would have believed I could get so excited about, let alone find creative uses for.

### Building a Math Toolkit

So full disclosure: I’m not nor have I ever been a whiz with numbers or the theories (laws?) that govern them. (I’m sure this isn’t a surprise given the nature of this blog, but it bears saying as I’m going to attempt to explain mathy things…#spoiler) To remedy this, I’m setting out to retrain my math mind, and build myself a set of tools based on the math ideas and functions that those well versed in GLSL have signaled as the most powerful to have in one’s repertoir. This is an exercise I plan to spread out across a number of posts, each building upon the last. Math intuition and stackable concepts, that’s the goal.

First up, **normalization** and **linear interpolation**.

### Context

Computer graphics necessarily deal with vectors and the cartesian space. In the teeny tiniest of nutshells, computer graphics can be summed up as vector graphics defined by 2D points on an inverted cartesian graph. And if you’re wondering about 3D graphics, well, they are in fact an extension of the same techniques used to render 2D vector graphics. If you’d like more info on that, the edge of the rabbit hole starts <a href="https://en.wikipedia.org/wiki/Vector_graphics" target="_blank">here</a> 🕳

If I mention any of this it’s because **normalisation** and **liner interpolation** (aka **lerp**), are ways of understanding how vectors relate to the space that contains them. In fact, they are each other’s opposite.

But before we dive in, a quick refresher on vectors: **a vector is defined by its magnitude & direction**. The clearest way I’ve found to think about this, (and big TY to <a href="https://twitter.com/mrCompScience" target="_blank">Jamie King</a> for the analogy,) is in terms of getting asked for directions.

Someone asks you, “How do I get to the store?” As you point in the direction of the store you answer, “Just walk 15 minutes that way.” Think of each minute as one unit of magnitude, and the “way” your pointing to as the direction. This works out to a vector of magnitude 15, pointing “that way”.

### TL;DR

To sum it up, forces command our world and vectors describe how each of these forces behaves. As coders, we can pick and choose what behavior we care about illustrating using these concepts.

When we only care about direction, we normalize. When we can about getting from one point to the other we lerp.

## Normalization

Normalization is all about proportions, understanding how things scale and **distilling a vector down to it’s direction** - essentially where is it pointing? That’s all normalization really cares about.

So let’s say you have a vector. To normalize it, all we need to do is divide it by it’s magnitude. However, with just an x and y value, we know where our vector is pointing but we don’t know how long it is.

**V = (x, y)**

Something that has often tripped me up since starting to work with vectors has been the jump back and forth between the Cartesian and Polar coordinate systems.

Let’s take our vector for example. This means keeping in mind that it’s **x** and **y** values don’t represent a ploted point of origin from which the vector emerges in a given direction on the coordinate system (which would involve positioning said point by moving up, down, left, right from the (0,0) mark - this would be the Cartesian approach.)

Instead, the x and y values allude to the vector’s length and angle, in which case it’s location is besides the point. And actually, since it doesn’t matter, we can go ahead an always just assume that it’s pointing from origin (0,0). You’re still plotting a point on a graph, but it’s not a start point, it’s a point that allows you to draw a rectangle from (0,0) to itself, and from there deduce things like direction and vector length. (This is the Polar approach)

So to work out our vectors direction, we need to first find it’s magnitude using everyone’s favorite trig theorem, the **Pythagorean theorem**. Our **x** and **y** then become Pythagoras’ **a** and **b**, which leaves us solving for **c**.

Our vector: **V = (x, y)**

Since **a^2 + b^2 = c^2** is the same as **c = sqrt(a^2 + b^2)**

we calculate our magnitude as so:

**|V| = sqrt(x*x + y*y)**

With our magnitude in hand, we can now normalize our vector: **V/|V| = (x/|V|, y/|V|)**

This leaves us with our “that way”, our magnitude unit of 1 pointing in a specific direction.

In proper math-speak, each unit of magnitude is better known as a **unit vector**, and since we used the Polar system to work out our normalized vector, we need a way of identifying it in the Cartesian system, where we actually place the results of our calculations. When we’re dealing in cartesian space, our vector’s normalized **(x,y)** coordinates are identifiable by what is called the **i** and **j-hat** (and k-hat if you’re playing around in 3D aka z-space). Think of these as aspects or dimensions of x & y, so **(xi, yj)**.

Where normalized vectors can be really handy for lighting in computer graphics - for example direction is really important when you want to point your lights at something or have something reflect light off of itself, - they can also be really handy for mapping values.

With that in mind, an entirely different way to think about normalizing would be in terms of ranges where the normalization value becomes a **percentage** within a **range**:

<img src="/images/normalization.png">

So our equation doesn’t change, but the purpose it serves is quite different. If you consider how your Vertex and Fragment shaders play together, you might start to get a better feel the power of normalization. (If you’re scratching your head, just keep reading! It’ll all make sense soon enough.)

Things start to really take shape with shaders when you pair this way of thinking about normalization with with it’s opposite, Lerp.

## Linear interpolation (Lerp)

Lerp is all about in-betweening, getting from point **a** to **b**, or conversly you can also think of it as blending **a** and **b** together. Here again, we have one equation utilized in different contexts. But it’s important to keep in mind that no matter the context, Lerp takes no detours - you’ll be getting from **a** to **b** in a straight line, or in the case of blending, think of things in a one-to-one context, (sounds a little like mapping, doesn’t it?) Basically, how to get from here to there? How to get from this to that?

If we borrow from our range/percentage analogy above and invert it, (because opposites,) we’re now starting off with a range, which is illustrated below as **(max - min)** and a normalized value, **0.5** in this case, which we calculated earlier. From this we can deduce the value within the given range that the normalized value is pointing to.

That’s a bit of a mouthfull, I know. Let’s break things down:

<img src="/images/linearinterpolation.png">

Now to bring the focus back to our beloved vectors. We’re basically trying to get from our hypothetical (0, 0) mark which as per my giving directions analogy you may recall is “here”, to the tip of our vector’s length, (magnitude,) aka “over there.”

You might be wondering what the percentage is even for at this point. Let’s look at GLSL’s built in Lerp function, called `mix()` to find out:

**myLerp = mix(x, y, a)**

Given our examples thus far, we can substitute out **x**, **y**, and **a** with:

**overThere = (overThereX, overThereY)**, which is our vector,

our hypothetical here, **(0,0)**,

and our percentage, which is **0.5** in the case of our above example.

Which gives us **myLerp = mix(here, overThere, percentage)**

You can think of **percentage** as the degree to which you want to interpolate. Or if you prefer, the GLSL bible, <a href="https://thebookofshaders.com/glossary/?search=mix" target="_blank">Book of Shaders</a>, refers to it as the _weight_ between the interpolation points - how big of a step-at-a-time you’ll be taking as you move from one point to the other. But remember, since we’re playing with normalized vectors, we’re in the **0.0** and **1.0** range.

With this in mind, the math behind **mix()** works out to

**Lerp = here*(1.0−percentage)+overThere*percentage**

or **x*(1.0−a)+y*a**

Hopefully we have the math down at this point. Because Lerp is really, really useful for animating things. In particular for animating things that have a lot of different attributes. Attributes that you might want to <a href="https://www.instagram.com/p/BjqKo0eDXUP/?taken-by=iamelizasj" target="_blank">transition over time</a>, say… 👩🏼‍💻⚗️✨.

## Stacking concepts

Lerp is also _especially_ useful when combined with normalization, as I mentioned earlier. Case in point the _Hello World_ of (custom) Shaders:

<img src="/images/custom-shader.png">

The rainbow of colors you see on your screen is a result of the blending together of our vertex and fragment shaders. This might have you thinking - blending, this must be Lerp! But not so fast.

If you recall from <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Intro to Shaders</a>, every single pixel is defined by a position and a texture coordinate. To see anything of type shader on your screen, you have to normalize your fragment coordinates by dividing them by the amount of pixels available to you. This is basicaly the purpouse of the `vUv` varrying vector you see in every Three.js shader program. It bridges the Vertex and Fragment shaders together.

At which point you can start one-to-one mapping pixel positions to color channels.

This is where Lerp comes in for the win, allowing us to do things like interpolate between the position (provided by the vertex shader,) of each pixel on the screen and the RGB values (set in the fragment shader.)That’s what gives us the colorful cascade above.

```javascript
// Vertex
varying vec2 vUv; // <--- bridge
void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

// Fragment
varying vec2 vUv; // <--- bridge
void main() {
        gl_FragColor = vec4(vUv.x,vUv.y,0.5,1.000); // mapping x to Red, and y to Green
    }
```

This excercize has certainly helped me better understand the different ways to think about these concepts and hopefully things are feeling a bit more intuitive for you, too. More coming soon!
