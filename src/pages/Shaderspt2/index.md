---
date: '2018-04-01T00:00:00Z'
tags: ['shaders', 'threejs']
title: 'Intro to Shaders (pt.2)'
category: 'creative dev'
---

Graphics demand a lot of your computer because rendering them means your machine is doing pixel-by-pixel calculations. Each and every digital dot needs to be computed. Imagining all the computing involved in 3D animations sets my head spining - things like color & location, but also geometries and perspective need to be worked out, instant by instant.

**N.B This is Part Two of a series on getting started with Shaders in Three.js and will specifically cover how to create a custom shader. This post assumes that you have a working render target set up within your Three.js environment. If not, jump back to <a href="https://www.unicornsfartpixels.com/posts/2018-03-15shaders-pt1/">Part One</a>.**

In this post we're going to set up a simple full page custom shader. For now, we'll forgoe the more complicated 3D animated objects in order to get used to the language of shaders themselves. If you followed along in **Part One**, great. Keep that primed Three.js environment handy as we'll need it in order to put all the pieces together in **Part Three**.

## What is a shader, actually?

The above happens to be a pretty loaded question. As you might remember from the last <a href="http://localhost:3000/posts/2018-03-15shaders-pt1/" target="_blank">post</a>, shaders are run in the GPU - which invites us to understand a lot of abstract stuff about the computers we use. Like for example, how the CPU and GPU swap info between themselves and render things onto the screen.

### Peeking under the hood

The very (very) general gist of things goes something like this:

Your computer's **hard drive** (**HDD**) relies on it's **central processing unit** (**CPU**) which relies on **system memory** (**RAM**), as well as the **graphic processing unit** (**GPU**) which relies on **graphic card memory** (**VRAM**) to work.

And by work I mean do all the computery things you need it do. The most obvious being coding & surfing the web. But also things like allowing you to interact with it via a graphic interface (the mouse pointer, folders, etc, that you click around on,) or better yet, rendering out slick video game imagery.

**Fun fact**: If your CPU or GPU are low quality, it won't matter how much RAM or VRAM you have. More memory on a shit system can only help so much (aka not much at all).

With that in mind, when you're coding your visuals, your computer starts orchestrating this sort of dance between the HDD, CPU and GPU in which parts of things are passed from one place to another, other things are stored and referenced, and others yet are destroyed and reproduced when called upon again, on a need-to-know kind of basis. Things like textures and meshes, the bare bones of future visuals.

And that's before we even get to the **render state**, which is basically a collection of values that describe how your 3D form's meshes will be rendered. The setup for big finale, in which the CPU commands the GPU to render everything out using the render values and coordinates that have been set. Render values are things like materials, textures, _shaders_...

### Except that wait, there's more.

Once the **render state** is set, we get to the **draw call**, in which the CPU calls the GPU to tell it what exactly to draw and when that's set into motion, we land at the **pipeline**, which is this whole complex conversion process where the GPU takes the **render state** values and the vertex data (aka your **assets** - also aka part of your shader, but more on that in a second...) & converts everything into pixels, (visuals,) on your screen.

To get something showing on the screen, your GPU creates triangles out of the data provided by your assets.

If you've ever used Photoshop before you might have already encountered this 'triangle' process, better known as **rasterization**, which is basically the way your GPU creates images on your screen. So a 3D object can be boiled down to a list of triangles drawn at specific points and with specific colors, on your computer screen. Shaders also figure at this step of the process - but before I get to that...

**Please remember** that the above is an extreme generlization of how things work. I'm summarizing <a href="https://twitter.com/simonschreibt" target="_blank">Simon Schreibt's</a> amazingly thorough work, which I invite you to take the time to <a href="https://simonschreibt.de/gat/renderhell/" target="_blank">read</a>. He did a really phenomenal job reasearching everything, and definitely explains it more succinctly than I ever could. Added bonus: fun animations! <a href="https://simonschreibt.de/gat/renderhell/" target="_blank">Check it out</a>.

### Shaders

Ok, so shaders. A shader is comprised of two parts - a **fragment shader** and a **vertex shader**. At their most basic, the fragment shader can be understood as handling the aesthetics, and the vertex shader as handling positioning.

The reason a shader is made up of two parts is because back in the day, each part was a seperate stage in the <a href="https://www.opengl.org/about/#4" target="_blank">OpenGL pipeline</a>. OpenGL is basically the industry standard graphics API whose pipeline for displaying 2D & 3D visuals on the computer screen has included a **Pre-Vertex Processing** step, and a **Pre-Fragment Processing** step. These two steps would eventually merge into what we now call a **shader**.

## Instructions in two parts - finally, some code!

### Part One

A **Fragment Shader** deals with how pixels look and is computed during the rasterization step previously mentioned.

```javascript
varying vec2 vUv; // bridge between
void main() {
        gl_FragColor = vec4(vUv.x,vUv.y,0.5,1.000); // color interpolation example
    }
```

Above is an example of color interpolation. `gl_FragColor` is a reserved global variable that represents a 4D vector with values set for R,G,B & A, which will eventually render out on your screen like so:

<img src="/images/custom-shader.png">

Since our shader is broken into two parts, we need a way for them to communicate with each other. Enter **varying variables**. Placed just above each **main()** function this variable allows our fragment and vertex shaders to interface with one another.

```javascript
varying vec2 vUv;
```

You may have noticed that the **R** and **G** value in our fragment shader were set to be the **x** and **y** value of our varying variable (`vUv`). If you set a varying variable in your **vertex shader** (shown below), you can use its value in the fragment shader. The value will be interpolated over the visual being rendered, which in our case means we get a cascade of color based on the location of each pixel on our screen.

### Part Two

A **Vertex Shader** basically paves the way for everything you define in your fragment shader. In the graphics pipeline, the vertex shader actually gets calculated _before_ the fragment shader. It places each pixel on the screen before they hit the rasterization step.

```javascript
varying vec2 vUv; // bridge between
void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
```

So, first things first - OpenGL uses inverse texturing, which means that 'real world' coordinates, **(x, y, z)** are converted into something called **texture space** which orients itself on the **x & y** axis only, and _that_ gets converted into something called **discrete space**, which exists in the **(u,v)** aka **[0, 1]** domain. Which happens to be the value we are passing to our **vUv**.

If, like me, you're scratching your head at the term **discrete space**, this is where we hit some math theory. As far as I can tell (as a Communications undergrad & New Media/Fine Arts grad...) discrete space is part of _topology_, the study of the 'preserved properties' of space as it undergoes continuous changes, (like say being stretched or bent... things that one might do when manipulating or animating a 3D scene, say...)

But also, shoutout to having friends who are more knowledgable in math than you, and who are kind enough to break it down in lamens terms:

> Discrete [space] is how nature is represented in mathematics. Non-discreet is nature itself.

Mathematics understands space through discrete numbers - 1, 2, 1.5, etc...it's as simple as that. The [0,1] domain we convert down to is basically a way to simplify the math into a format that makes manipulations easier. Which, to be honest kind of reminds me of vector normalization... are these two things similar? Am I drawing parallels where I shouldn't? <a href="https://twitter.com/iamelizasj">Let me know</a>.

Now let's move on to that second line of code inside our vertex shader:

```Javascript
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
```

In terms of placing your shader in your Three.js scene, the library takes care of a few things for us. Notably, setting up the projection and model/view matrices, (which is just a fancy way of saying 'positioning your shader on the screen'...) The code featured above is actually pulled straight from the <a href="https://threejs.org/docs/#api/renderers/webgl/WebGLProgram">Three.js docs</a>, and essentially calculates vertex position. `gl_Position` is another reserved global variable, inside which we are storing our matrix info.

# Putting it all together

Hopefully tumbling down this rabbit hole with me has given you a bit of a (broad) idea of how and why things work the way they do. But how do we get everything up and running? As promised, I will go over two options.

## Old school: sticking everything in index.html

The upside here is that it gets you up and running fast, using the same <a href="https://www.npmjs.com/package/budo">Budo</a> workflow I've talked about <a href="http://localhost:3000/posts/2018-01-01fftthree/" target="_blank">before</a>. The downside is that your code will be a bit hard to read and debug because the script tags housing your code won't allow for any syntax highlighting.

`index.html`:

```Console
<script id="vertexShader" type="x-shader/x-vertex">
  varying vec2 vUv; // bridge between
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
</script>

<script id="fragmentShader" type="x-shader/x-fragment">
  varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(vUv.x,vUv.y,0.5,1.000); // color interpolation example

  }
</script>

<script src="index.js"></script>
```

To import your shader into your Three.js project, simply instantiate the `ShaderMaterial()` class and grab each element as you normally would in javascript, with a `getElementbyID()`. Inside the instance, you'll also have to set a **uniform**, which is a sort of bridge between the **CPU** and **GPU**. In this case, we're using a uniform to set the display resolution for our shader, but you can generally use uniforms as a way to manage any kind of data coming in from the CPU that you'd want to interact with your shader - things like time (animation) or mouse movement (interaction) for example.

`index.js`:

```Javascript
...
var newGeometry = new THREE.PlaneGeometry(1, 1);
var newMaterial = new THREE.ShaderMaterial({
  uniforms: {
    resolution: { value: new THREE.Vector2() }
  },

  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});
var ourShader;
ourShader = new THREE.Mesh(newGeometry, newMaterial);

// x, y, z <--- if u put 0 instead of 1 it will explode
ourShader.scale.set(w, h, 1);
scene.add(ourShader);
...
```

## New school: individual main.frag, & main.vert files

This approach seperates out each shader into it's own file, allowing you to import them into your Three.js project as you might any regular javascript modules. Then, same as before, you need to instantiate the `ShaderMaterial()` class and set the `vertexShader`and `fragmentShader` values as your imported shaders.

`main.vert`:

```Javascript
varying vec2 vUv; // bridge between
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

`main.frag`:

```Javascript
varying vec2 vUv;
void main() {
    gl_FragColor = vec4(vUv.x,vUv.y,0.5,1.000); // color interpolation example

}
```

`index.js`:

```Javascript
import FragmentShader from './main.frag';
import VertexShader from './main.vert';

...

var newGeometry = new THREE.PlaneGeometry(1, 1);
var newMaterial = new THREE.ShaderMaterial({
  uniforms: {
    resolution: { value: new THREE.Vector2() }
  },
  fragmentShader: FragmentShader,
  vertexShader: VertexShader
});
var ourShader;
ourShader = new THREE.Mesh(newGeometry, newMaterial);

// x, y, z <--- if u put 0 instead of 1 it will explode
ourShader.scale.set(w, h, 1);
scene.add(ourShader);
```

### The catch

For this approach, you have to swap out **Budo** for a full **Webpack** setup. I won't go into the who's and the what's around Webpack as it's beyond the scope of this tutorial but obviously feel free to grab the code below.

`webpack.config.babel.js`:

```Javascript
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';


module.exports = (env = {}) => {
  const isProduction = env.production === true;
  const devPort = 8080;

  return {
    entry: [
      path.join(__dirname, 'src', 'index.js'),
    ],
    output: {
      path: path.join(__dirname, 'build'),
      publicPath: '/',
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel-loader',
        },
        {
          test: /\.(glsl|frag|vert)$/,
          exclude: /node_modules/,
          loader: 'raw-loader',
        },
      ],
    },
    devServer: {
      port: devPort,
    },
    devtool: (() => {
      if (isProduction) return 'hidden-source-map';
      return 'cheap-module-eval-source-map';
    })(),
    plugins: [
      new HtmlWebpackPlugin({
        title: 'WebGL Experiments',
      }),
    ],
  };
};
```

Ok, so you should now have a multicolor custom shader cascading across your computer screen, yay! (As per usual, if you're getting errors, feel free to compare and contrast with my <a href="https://github.com/elizasj/shaders/tree/master/_2_customShader/_webpack" targer="_blank">code</a>.) Now that you're familiar with some of the basics of shader concepts and language, you're ready to do things like animate, add interactive elements and integrate 3D objects.

**Coming up in Part Three**: I’ll go over some of the more commonly used vocabulary when creating with shaders, how to use the render target we created in <a href="https://www.unicornsfartpixels.com/posts/2018-03-15shaders-pt1/" target="_blank">Part One</a> with our new custom shader, and I'll also explain how to use time and data (uniforms) to power shader animations.

Stay tuned!
