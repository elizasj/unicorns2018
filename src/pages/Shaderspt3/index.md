---
date: '2018-05-10T00:00:00Z'
tags: ['shaders', 'threejs']
title: 'Intro to Shaders (pt.3)'
category: 'creative dev'
---

Using data to power animations is one of the most interesting aspects of programing to me. However, pairing data with raw GLSL can be a bit tricky. Which is why I chose to dive into shader language via Three.js. Shaders alone can't easily handle (if at all) the amount of data and calculations that I'm interested in... which if you're new around here, generally relates to audio/sound.

**N.B This is Part Three of a series on getting started with shaders in Three.js and will specifically cover how to use time and data to animate shaders. This post assumes that you have a working render target set up within your Three.js environment and that you know how to create a basic custom shader. If not, jump back to <a href="https://www.unicornsfartpixels.com/posts/2018-03-15shaders-pt1/" target="_blank">Part One</a> and/or <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a> and get things set up. You'll need them both to follow this post.**

Before we dive into things, I've compiled a list of a few shader terms and functions that have proved useful as I've embarked on my GLSL journey. You'll find me referring to most if not all of them in the code presented further down the page:

## GLSL Variables

GLSL relies on three types of varibles: **uniforms**, **varyings** and **attributes**

- **uniforms**: are variables who's values don't change between vertex & fragment shaders. They are _read-only_ - whatever the value is in one will be the same in the other. This is useful for things like color, position, or say, dynamic data you're bringing in from an exterior source.

- **varyings (vUv)**: are variables who's values are first passed into the vertex shader where they are modified, and then these new modified values get sent into the fragment shader. For example, our custom shader from <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a> in which an interporlation was executed on the uv values that were set within the vertex shader, and then used to create a color gradient in the fragment shader.

- **attributes**: can only exist in the vertex shader, and are immutable (aka _read-only_). Mostly used to set things like vertex position.

## Supported Variable Types

When writing shaders, you have to set both the variable _types_ (so, how shaders will use the variable,) as well as the _type of data_ the variable itself refers to. For example, **float, bool, int, vec2, mat2**...:

- **int**: integer (0,5,22,-3...)
- **float**: floating point number (0.1, -0.3, 15.2...)
- **bool**: boolean (true/false, 0/1)
- **vec2**, **vec3**, **vec4**: these variables refer to _vectors_ of specific length. The numbers on the end of each refers to dimension.
- **mat2**, **mat3**, **mat4**: these variables refer to _matrices_ of specific length. The numbers on the end of each refers to dimension.
- **sampler1D, sampler2D, sampler3D, samplerCube**: texture types, are generally specified in uniform variables.

  <section class="reminder">
  A **vector** referes to either a position or a direction in space. It all depends on  whether the W of XYZ**W** - aka the 4th dimension of a `vec4` - is 1 (position) or 0 (direction).

A **matrix** is an array of a predefined number of rows and columns of vectors (each row or column would contain a vector) and gives us the ability to transform vertices.

If you really want to set your cranks spinning a bit, read this <a href="https://www.quora.com/Whats-the-difference-between-a-vector-and-a-matrix/answer/Gaspard-Sagot" target="_blank">Quora answer</a> on the difference between the two.

  </section>

## Global Variables

- **gl_Position**: a reserved global variable used to set your shader positon. Used inside the vertex shader.

```javascript
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); // sets vertex position to cover the full area of the screen
}
```

- **gl_FragColor**: a reserved global variable used to set your shader color. Used inside the fragment shader.

```javascript
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // R, G, B, A
}
```

## Shader Methods

As with every programing language, shaders come with some built in methods:

- **rand()**: returns a random number between 0.0 and 1.0
- **fract()**: returns a fraction based on the number you give it (not 100% clear on this one but the docs specify that if x is given to the function the return is calculated by `x - floor(x)`)
- **floor()**: given x, it returns the closest integer less than or equal to x
- **step()**: an interpolation function that takes a limit and a value to be checked/passed. If less than the limit, it will return 0.0, if above the limit, it will return 1.0
- **sin()**: returns the sin of whatever parameter you give it
- **mix()**: another linear interpolation function - this one takes two parameters and an interpolation value. Super fun to use with colors.
- **min()**: an easy one - it takes two parameters and returns the lesser value.

## Other Helpful Terms

- **vertex**: point where two (or more) lines/curves meet each other.

- **RGBA**: Red, Green, Blue and Alpha color channels. Alpha refers to level of transparency of whatever color is set with your RGB values. An alpha level of 0.0 makes the color completely transparent whereas a level of 1.0 makes the color totally opaque.

- **XYZW**: X, Y, Z, W coordinates. The `W` value distinguishes between the coordinates refering to a point in space, or a vector (aka direction). Set a point with the number 1, and set a vector with zero.

- **smoothstep**: refers to a type of polynomial interpolation. This is kind of 'advanced engineering maths' territory but basically where linear interpolation calculates the steps between two points on a straight line, **smoothstep** relies on something called Hermite interpolation, which caclulates the steps between two points on a line that can be curved. This type of interpolation provides you with control points that can be used to produce a curved path. If you've ever played around with Bezier curves in Illustrator, think of Hermite interpolation as Bezier's cousin:

<iframe width="560" height="315" src="https://www.youtube.com/embed/vvwT_5RGlxY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

(The control points I mentioned earlier would be the white bars in the video above. Volume up if you're into really cheezy background music 🎶🎷

- **dot aka `.`**: calculates the cosine of two vectors. It's often <a href="https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_shading_model" target="_blank">used with lighting</a>, and basically takes two normalized vectors (aka normals) and finds out whether they're pointing in the same direction or not. If yes, the function returns 1. If not, it returns -1. If you get a 0, then the vectors are perpendicular. Why is this helpful with lighting ? Because lighting relies on reflection and that means calculating angles. **Note to self:** when you use the function on two vectors, you'll get back the cosine of the angle between them, so remember to do a reverse cosine if what you want to access is the actual angle.

- **uv aka the [0, 1] domain aka discreet space**: As explained in <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a>, discrete space is how nature is represented in mathematics. Non-discreet is nature itself. In mathematics space is understood through discrete numbers - 1, 2, 1.5, etc... The [0,1] domain that we convert down to is basically a way to simplify the math into a format that makes manipulations easier. I still think this sounds a lot like vector normalization. I would love it if someone could <a href="https://twitter.com/iamelizasj">tell me</a> how they are different, (or not).

## Animating Shaders with Time & Data

### Setting the stage

First things first: if you're unfamiliar with how to isolate audio frequencies then check out <a href="https://www.unicornsfartpixels.com/posts/2018-01-01fftthree/" target="_blank">this post</a> - it has everything you need to get audio data into a Three.js project.

Once you've got your frequencies in order, the next step is to add the render target we created in <a href="https://www.unicornsfartpixels.com/posts/2018-03-15shaders-pt1/" target="_blank">Part One</a> to the custom shader we created in <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a>:

### Render Target + Custom Shader

What we're doing is basically combining that spinning box from <a href="https://www.unicornsfartpixels.com/posts/2018-03-15shaders-pt1/" target="_blank">Part One</a>, with our custom shader. The slight difference to note here is that our custom shader is being created from inside of `addObj()` where previously it was created in the global namespace.

This means that the "spinning box" will now no longer sit in the middle of the screen, and actually won't look like much of a box at all. Instead it will take up the size of our browser window, just like our custom shader did. Some new **uniforms** have also been added to our shader: **time**, **texture** and **frequencies**.

```Javascript
const renderTarget = new WebGLRenderTarget(w, h, { format: THREE.RGBAFormat });
console.log(w, h);

//...

function addObj(mesh) {

 // ...

  var cubeGeometry = new THREE.PlaneGeometry(1, 1);
  cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: {
        value: new THREE.Vector2(w, h)
      },
      texture: { value: renderTarget.texture },
      frequencies: { value: new THREE.Vector4() }
    },

    fragmentShader: FragmentShader,
    vertexShader: VertexShader
  });

  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.scale.set(w, h, 1);
  scene.add(cube);
  console.log(cube);

  engine.start();
}

 // ...
```

- - - **texture** links our shader to our render target, as you might guessed based on it's value. It's what allows our grid of imported 3D forms to take up the full size of the screen.

- - - **time** tracks the time in milliseconds from the moment our project loads in the browser window. We'll use this constant incrementation to calculate new positions for our vertexes.

- - - **frequencies** creates a bridge for our audio data to interact with our our shader. Pretty much everything we've been doing so far has been to get to this simple, single bit of code and is part of what makes pairing Three.js with shaders so fun and necessary - it creates space for things that wouldn't be possible otherwise, like funneling audio into our fragment shader.

### Vertex Shader

Our vertex shader is plain and simple - it's actually no different from the one we wrote in <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a>. Easy enough.

```Javascript
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Fragment Shader

Our new fragment shader on the other hand... is it's own beast. Here we have a lot of bits of code that have been improvised, smashed together and fiddled with - a lot of trial and error and seeing what kind of types of movement <a href="https://twitter.com/nicoptere" target="_blank">Nico</a> & I could create. Nico, one of the WegGL OG's, who so kindly hashed things out with me one afternoon, helping me get all the moving parts properly up and running 🙏🙏. I invite you poke around the code and have fun experimenting, just as I've been doing. (Also why I included a mini glossary at the beginning of this post.) I imagine the more math inclined might choose to go about this with more intention, but I personally prefer reverse engineering things and letting my intuition guide the way.

#### That being said...

There are a few key things to understand about this code. Firstly, you'll notice at the very top of our fragment shader file, we've declared the uniforms found in our Three.js project. This creates the bridge between our JS and our shader. There are also two functions declared in the global space just above our fragment shader - the first, `rand()` is used inside the second, `noise()`. This function is pretty important as it creates our base texture.

#### Making noise

From what I've worked out, to write a proper noise function you need to first create two variables -- one that stores a value using `floor()` and another with `fract` -- and then use them to interpolate within `mix()`.

```Javascript
varying vec2 vUv;

uniform float time; // timer starts on page load
uniform vec2 resolution;
uniform sampler2D texture; // grabs the three.js texture (our grid of objects)
uniform vec4 frequencies; // grabs audio data

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x)
        ,u.y);

    return res*res;
}
```

You're basically applying the `rand()` fn to your floored value, which you'll provide as the first two `mix()` parameters (if you remember from terms listed above, `mix()` is great for playing with color interpolation) and you'll set the `fract` value as the third parameter, the interpolation value.

The `noise()` fn above actually has two `mix()` fn's as parameters within a larger `mix()` fn, all of which is contained within a variable, `res`, that the `noise()` fn returns as final output.

There's a lot going on there!

To me that's part of the fun of shaders. You can layer really simple little equations together, and get really complex and unexpeceted results. Take a look at our fragment shader, and you'll see all the calculations and interpolations from our `noise()` fn are being further mixed into other functions:

```javascript
void main() {
    gl_FragColor = vec4(vUv.x,vUv.y,0.971,1.000);
    gl_FragColor = vec4(vUv.x,vUv.y, noise(vUv * 10. + time * 0.1) ,1.000); // <-- time

    vec2 uv = vUv;

    float nx = (noise(uv * 10. + time * 0.1) - 0.5) * 0.1;
    uv.x += nx;

    float ny = (noise(uv * 3. + time * 0.2) - 0.5) * 0.1;
    uv.y += ny;

    gl_FragColor = texture2D(texture, uv);
    gl_FragColor += vec4( vec3( noise(uv * 10. + time * 0.1) ), 1. );

    vec4 yellow = vec4(1., .8, 0., 1.);
    vec4 blue = vec4(0., .6, 1., 1.);

    float a = gl_FragColor.r;

    a = smoothstep( .25, .35, a * frequencies.x);
    gl_FragColor = mix(yellow, blue, a);


    gl_FragColor = min( gl_FragColor, texture2D(texture, vUv) );

}
```

From here on out, it pretty much boils down to how you decide to layer and interweave your functions. Play around with the numbers a bit and see what output you like best. Add the **time** and **frequency** uniforms into the mix and watch your shader start to move across the screen.

If you've been following along you should see something like this in your browser. Not the most elegent output, but guys, we made it. You now officially have a working base project.

<img src="/images/shaders.gif">

As always, if your code is bugging, feel free to compare and contrast with <a href="https://github.com/elizasj/shaders/tree/master/_3_animateShader" target="_blank">my code</a>. We've covered a lot of ground, and yet... this is really just the beginning!

Now that things are working, it's time to really dive in to the finer points of shaders, get crafty with things likes patterns and textures. To that end, I've been really enjoying reading through <a href="https://thebookofshaders.com" target="_blank">The Book of Shaders</a> and using the <a href="https://github.com/patriciogonzalezvivo/PixelSpiritDeck">Pixel Spirit Deck</a> for inspiration (still crossing my fingers that they do a re-issue on those cards one day🤞). Maybe these resources can prove helpful for you as well.

### Final Thoughts

This officially brings my intro to shaders series to an end. The usual disclaimer: as this blog mainly catalogues my learning process, if you notice any mixups, mistakes or confusion in my wording, <a href="https://twitter.com/iamelizasj">let me know</a>. I'm always happy to tweak anything I may have gotten wrong.

As I delve into creating patterns and better understanding how to use randomness and noise with shaders, I'll probably create a new series of posts around these topics, so stay tuned!
