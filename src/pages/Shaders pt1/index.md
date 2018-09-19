---
date: '2018-03-15T00:00:00Z'
tags: ['shaders', 'threejs']
title: 'Intro to Shaders (in Three.js)'
category: 'creative dev'
---

If you’re interested in textures or are curious about how you might digitally render out something that looks more organic than it does, well, digital, shaders might be for you. That’s what got me interested anyways, in taking on the notoriously complex language.

If you're not sure what shaders are, check out <a href="https://www.instagram.com/lejeunerenard/" target="_blank">Sean Zelmmer</a>'s work. The sometimes noisy, sometimes shiny, sometimes goopy/liquidy looking skin you see covering the shapes and textures in his posts are created using shaders. One of my personal favorites is also this <a href="http://apps.amandaghassaei.com/FluidSimulation/" target="_blank">fluid sim</a> by Amanda Ghassaei. As you can see, you can apply shaders to 3D forms or let them occupy the entirety of your screen as a standalone visual universe... or combine both \o/

#### N.B This is Part One of a series on getting started with Shaders in Three.js and will specifically cover how to create an environment that renders out a base texture onto which you can apply a shader (coming up in <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a>)aka rendering to a texture.

## A little background

Less like JS, more like C, Shaders are written in <a href="https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language" target="_blank">openGL Shading Language</a> (GLSL) and depend on parallel processing to run. Which basically just means lots of teeny tiny microprocessors all running at the same time (via the GPU) - as contrasted by serial processing, which does things pedantically, one after the other, allocating more processing time to bigger (heavier) tasks than others (via the CPU). Until now, any visuals you’ve made have likely been relying on the CPU. Not Shaders! Which is why they are so powerful. The best analogy I’ve ever seen for this can be found <a href="https://www.youtube.com/watch?v=WmW6SD-EHVY" target="_blank">here</a>. Hint: Mona Lisa + jumbo paint gun — well worth the click, I promise.

## Base Setup & Tooling

My go-to for getting up and running quickly with Three.js has been <a href="https://www.unicornsfartpixels.com/%E2%80%9Chttps://www.npmjs.com/package/budo%E2%80%9D" target="_blank">Budo</a>, a great little zero config browserify development server from <a href="https://twitter.com/mattdesl" target="_blank">Matt DesLauriers</a> that has live reloading integration right out of the box. As I mentioned in a previous <a href="https://www.unicornsfartpixels.com/posts/2018-01-01fftthree/" target="_blank">post</a> I created my own little <a href="https://github.com/elizasj/fftthree/blob/master/src/index.js" target="_blank">boilerplate</a>, largely inspired by <a href="https://github.com/superguigui">SuperGuiGui’s</a>. This tutorial will build off of my boilerplate, so feel free to use it. It also happens to come with everything you need to get rolling with audio visualisation in Threejs, which might come in handy in parts three/four of this Shaders series (_hint, hint_.)

## Rendering to a texture

In Threejs you have materials (which are basically 3D shapes... actually I'm almost sure this is technically-speaking quite incorrect, materials are not the shapes/forms themselves, but materials are used in such a way that they feel like shapes to me, since:) to which you can apply textures (which are basically like skins), “inside” which you can store a shader (which is basically …like skin pigment? I guess?), which you can then display on the screen.

There are of course some other important concepts to understand about shaders, and we’ll get to them in future posts. For now, you’ve got all the info needed to navigate this initial base-setup step.

#### Some things to keep in mind when prepping a basic scene for shaders in Threejs:

### Use an Orthographic Camera.

Right off the bat, we'll be swapping out the default **Perspective Camera** for an **Orthographic** one. The **Perspective Camera**, which tries to imitate the way human eyes see creates a bit of “distortion” that, generally speaking, actually makes things seem more realistic - which you'd think we'd want since we're aiming for a _not so digital_ feel. But it can actually prove problematic with shaders re: scaling since the distance between the rendered image and the Threejs camera isn’t necessarily constant. (The idea with the perspective camera is that much like IRL, the further away the observer is from the what's rendered on the screen, the smaller it is.)

```javascript
/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({ antialias: true })
renderer.setClearColor(0x323232)
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)

/* Main scene and camera */
const scene = new Scene()
const w = resize.width
const h = resize.height

const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000)

camera.position.set(0, 0, 150)
```

The **Orthographic Camera** fixes any issues, by getting rid of the foreshortening effect and keeping the object's dimensions constant regardless of how near or far the camera is. If you’re having trouble visualising what this might look like, think of old school <a href="https://www.packtpub.com/sites/default/files/Article-Images/6283OS_02_15.png" target="_blank">Sims/Sim City</a>, or (thinking back even further,) to <a href="https://www.youtube.com/watch?v=_enw8gnHNX4" target="_blank">Renaissance art</a>. Of course, artists of the time didn't have a camera persay, but they did use a technique called foreshortening, which is the same effect that the Orthographic Camera produces.

## Set a render target

This step is pretty important as you’re creating the container that will store your future shader data. You’re basically rendering an invisible texture - aka a render target - which gets passed to the render function so that our shader can eventually render into it. We’re giving the object a texture property so that it can receive our future shader.

```Javascript
const renderTarget = new WebGLRenderTarget(w, h, { format: THREE.RGBAFormat });
```

## Create a group

It’s important to create a group in the global namespace because later on in our code we’ll need to access the variable from within the render function. Here, I've included it just underneath the rest of the usual scene setup code:

```Javascript
/* Lights */
const frontLight = new PointLight(0xffffff, 1);
const backLight = new PointLight(0xffffff, 0.5);
scene.add(frontLight);
scene.add(backLight);
frontLight.position.x = 20;
backLight.position.x = -20;

const group = new Group();
scene.add(group);
```

If you’re using my boilerplate you’ll notice that **group** replaces **particles** which means we swap out the `Object3D()` base object class for it’s cousin `Group()`. To be honest, I don’t know that there’s a huge difference between either of these classes other than the added clarity of the word Group. From what I can tell, the `Group()` class is also handy for manually grouping things together, and you can have multiple `Object3D` groups within an instance of the `Group()` class, which we don't particularily need right now, but may eventually. If anyone has any other info/opinion on why using `Group()` is/isn't better, <a href="https://twitter.com/iamelizasj" target="_blank">ping me</a> on twitter, I'd be curious to know.

## Add mesh to group in the object grid

This part is pretty straight forward, especially if you followed along in my past <a href="https://www.unicornsfartpixels.com/posts/2018-01-01fftthree/" target="_blank">Audio w/Three.js post</a> - you’re basically importing a 3D object, creating a grid and rendering that object in each of the grid spaces.

```javascript
/* Content of scene */
//model
var loader = new THREE.OBJLoader();
//load a resource
loader.load(
  '/src/objects/model.obj',
  // called when resource is loaded
  function(object) {
    const objs = [];

    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        objs.push(child);
      }
    });

    addObj(objs[0]);
  }
);

function addObj(mesh) {
  var xDistance = w;
  var yDistance = h;
  var zDistance = h;

  var xOffset = -w / 2; //initial offset so does not start in middle
  var yOffset = -h / 2;
  var zOffset = -h / 2;

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: THREE.FlatShading,
    opacity: 5,
    shininess: 120,
    transparent: true
  });

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        var mesh = new THREE.Mesh(mesh.geometry, material);
        mesh.scale.set(250, 250, 250);
        mesh.position.x = xDistance * (i / 3) + xOffset;
        mesh.position.y = yDistance * (j / 2) + yOffset;
        mesh.position.z = zDistance * (k / 2) + zOffset;
        group.add(mesh);
      }
    }
  }
```

One new thing to note: we need to add the `mesh` (aka our repeatedly rendered object) created within the grid to our `group` instance.

## A scene within a scene

We're almost finished getting our scene set up to play nice with shaders! To connect all the dots and get our render target working, we have to place our initial scene (the grid of imported 3D objects) inside some sort of container, which we will render out into a(nother) Threejs scene.

So a scene within a scene... (kind of like <a href="https://www.youtube.com/watch?v=TAbbJT0ZXmk" target="_blank">inception</a> 🤔)

```javascript
    var cubeGeometry = new BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
    color: 0x00ff00
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.scale.multiplyScalar(200);
    scene.add(cube);

    engine.start();
}
```

This bit of code is found within the `addObj` function where we created our grid of objects. For the inception bit to work, we create a `BoxGemetry` & it’s material, which will contain our grid, onto which we'll render our texture (which if you remember, will store our shader data…)

Next we just need to create a container for the 3D object in the global space. This container will encase our grid of objects. Inception complete!

```javascript
var cube
```

## Rendering it out

Might be nice to actually see all this in action, right? We'll manage our scenes from inside the render function, first setting the `cube` to invisible and the `group` visible, and rendering out the `scene`, `camera` and `renderTarget`.

Then, just underneath, we'll flip things around and set the `cube` to visible and the `group` invisible. This time we' render out just the `scene` and `camera`.

```javascript
// cancel inception
cube.visible = false
group.visible = true
renderer.render(scene, camera, renderTarget)

// rerender
cube.visible = true
group.visible = false
renderer.render(scene, camera)

cube.rotation.x += 0.01
cube.rotation.y += 0.05
```

Congrats, you offically have a working render target \o/! When you hit `npm start` you should now see a slightly underwelming spinning cube in your browser. (If not, grab the full code <a href="https://github.com/elizasj/shaders/blob/master/_1_renderTarget/src/index.js" target="_blank">here</a> to debug.) But look a little closer and you'll see that your spinning cube contains a grid of 3D objects.

<img src="/images/shader.gif">

This is exciting. This means you're scene within a scene is working - you're render target has been set. Your Three.js project is primed and ready for some shaders, which we'll get to in the next post.

**Coming up in <a href="https://www.unicornsfartpixels.com/posts/2018-04-01shaders-pt2/" target="_blank">Part Two</a>**: I'll go over how to create a custom shader using two different code implementation methods - first the OG way, right inside the index.html file. And then I'll explain how to get shaders set up as independant files (readability ftw!)

Stay tuned!
