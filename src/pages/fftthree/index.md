---
date: '2018-01-01T00:00:00Z'
tags: ['threejs', 'data', 'dataviz', 'audio']
title: 'Visualising Sound (pt2): Three.js'
category: 'creative dev'
---

Visualising audio using three.js isn’t all that different than doing it with the p5 library. You use the FFT to analyze and isolate frequencies, which you then use to influence and act on certain aspects of your visuals. Things like shape and size, colour, rotation angle…

#### N.B This is part two of a series on audio visualisation. If you want a gentle primer on what the FFT is and how it works with p5.js, jump back to <a href="https://www.unicornsfartpixels.com/posts/2017-10-25audio-fft/" target="_clear">Part One</a>

...So from a theoretical standpoint, we’re not really in new territory here. However, practically speaking, the story is a bit different. To visualise audio with three.js you can use the library’s built in <a href=“https://threejs.org/docs/index.html#api/audio/AudioAnalyser” target="_clear">AudioAnalyser object</a>, but that will only get you so far. It’s not quite as flexible as p5’s <a href="https://www.unicornsfartpixels.com/posts/2017-10-25audio-fft" target="_clear">`getEnergy()`</a> in that it only provides you with the average frequency of the sound you’re feeding it. It doesn’t really let you specify any kind of range. This works great for something like an equalizer, but if you want to get more specific you’ll need something that gives you more access under the hood.

### The Web Audio API

First things first - before we can analyze any audio, we have to get at the audio itself. Contrary to p5, it’s not as simple as loading the file and sending it into the instantiated FFT object. We instead have to create an audio context, it’s source and it’s analyser, grab our audio file, and connect everything together:

```javascript
// grab audio to be analyzed
const audioToAnalyse = new Audio()
audio.src = 'demo/youraudiotrack.mp3'

// create audio context
const ctx = new AudioContext()

// inject audio into audio context
const source = ctx.createMediaElementSource(audio)

// create the fft and connect it to the audio source
const analyser = ctx.createAnalyser()
source.connect(analyser)
analyser.connect(ctx.destination)
audio.play()
```

If you’re familiar with HTML5’s `<canvas>` element, then you can think of audio context in a similar way. Where the canvas houses your visual creations and their manipulation within the browser, audio context houses the audio you create and/or that you manipulate within the browser.

Once you have your audio context declared, you can go ahead and create the modules you need, who’s output you then hook to a target with `AudioNode.connect()`

In our case we need to get the audio that we’ve imported into the audio context we created. We do that with `AudioContext.createMediaElementSource()`, which can take any `<audio>` or `<video>` element for playback or manipulation.

Next, we create an analyser node inside our audio context. As the name might suggest, it’s fundamental to visualising audio - the node can do things like give us access to the time domain and the frequency data that comes with it (…which should ring a bell if you read my original <a href="https://www.unicornsfartpixels.com/posts/2017-10-25audio-fft/" target="_blank">FFT post</a>.)

It also gives us access to our audio’s frequency bin count, aka the amount of data values we’ll have access to for our visualisation…

<section class="reminder">
<strong>Reminder:</strong> Bins have everything to do with the sample buffer, which is a little snapshot of sound used by the FFT’s algorithm in it’s analysis. Bin count is always half the fft size. Feel free to hop back to my post on the <a href=“https://www.unicornsfartpixels.com/posts/2017-10-25audio-fft/“ target="_blank">FFT & p5js </a> if you want more details on that.
</section>

… which we store in an array in order to animate our visualisations. Which brings us to Matt DesLauriers aka <a href="https://github.com/mattdesl" target="_blank">mattdesl's</a> very handy <a href="https://www.npmjs.com/package/analyser-frequency-average" target="_blank">analyser-frequency-average</a> module, which basically let’s us set a frequency range within the data we’re collecting off of the audio.

(Works pretty much the same as p5’s `.getEnergy()` module... still not clear on why the Web Audio API doesn’t come with that built in, but it has certainly sparked quite a <a href=“https://webcache.googleusercontent.com/search?q=cache:xedjZa2m770J:https://hn.svelte.technology/item/15240762+&cd=3&hl=en&ct=clnk&gl=ca&client=firefox-b-ab” target="\_blank">discussion </a>. TL;DR, it turns out the Web Audio API is a bit of a confused piece of technology — not that that has ever stopped a curious developer!)

```javascript
const freq = new Uint8Array(analyser.frequencyBinCount)

requestAnimationFrame(update)

function update() {
  requestAnimationFrame(update)
  analyser.getByteFrequencyData(freq)
  const signal = average(analyser, freq, 20, 80) // this is where you set the range
  console.log(signal)
}
```

So this handy little module allows you to set the min and max Hz range you want to play with, which you set inside javascript’s `requestAnimationFrame()` method.

<section class="reminder">
<strong>Reminder:</strong> The normal range for the average human ear is between 20 and 20,000Hz. However, the range we encounter most often in our day to day lives is in the 250 to 6,000Hz range.
Since 60-ish percent of the audio spectrum is undetectable to the human ear, we won’t bother ourselves with it. So if you’re taking the full 20-20,000Hz range:

- low levels are the lowest 5% of our range
- mid mevels are between 5% and 15.5%
- high levels are between 15.5% and 25.5%
  </section>

I tend to prefer saving my ranges in an object, in order to be able to easily call on them later from my main project file. This is especially useful if you analyze multiple audio files within the same project. I can then export only the analyser, frequency data array and frequency range object for each audio source I'm using, which I can call on later from inside three.js’ `render()` function:

```javascript
const layer = new Audio()
layer.src = 'src/static/song.ogg'

const ctx = new AudioContext()
const source = ctx.createMediaElementSource(layer)
const analyser = ctx.createAnalyser()
source.connect(analyser)
analyser.connect(ctx.destination)
layer.play()
layer.loop = true

const freq = new Uint8Array(analyser.frequencyBinCount)
requestAnimationFrame(update)

var bands = {
  sub: {
    from: 32,
    to: 512,
  },

  low: {
    from: 513,
    to: 2048,
  },

  mid: {
    from: 2049,
    to: 8192,
  },

  high: {
    from: 8193,
    to: 12384,
  },
}

function update() {
  requestAnimationFrame(update)
  analyser.getByteFrequencyData(freq)
}

export { analyser, freq, bands }
```

### Plugging into Three.js

Now that we’ve got our audio sorted out, it’s time to look at how to integrate this into your three.js project, which if like me you happen to be new to the library, can feel like no small feat. Three.js is a lot of fun, but comes with it’s own set of headaches if you’re looking to get things rolling with es6 modules and such. Prototyping can often feel more like a long, slow drudge through Webpacks more confusing corridors, unless you’re ready to use someone elses boilerplate. In my search for answers I did come upon a few good options. I ended up using Guillaume Gouessan aka <a href="https://github.com/superguigui" target="_blank">SuperGuiGui</a>’s <a href="https://github.com/superguigui/threejs-starter-kit" target="\_blank">threejs starter project</a> during my <a href="http://temp-studio.com/" target="_blank">TempStudio residency</a> back in November, which definitely helped me skip a few of the hurdles I kept running into using my usual base webpack setup. Ironically, turns out the boilerplate doesn't even use Weback!

### Budo <3

So I said that I found good options, not great one’s... because IMO it’s always better to set things up yourself. I figured this post was as good an excuse as any to build my own little base boilerplate project and I highly encourage you to do the same. Feel free to look at <a href="https://github.com/elizasj/fftthree"  target="_blank">my project</a> for inspiration if you need it.

After wrestling with some unexpected behaviour from <a href=“https://github.com/parcel-bundler/parcel” target="_blank">Parcel</a> I decided to dig through the boilerplate I'd used previously and see how things were set up there. Which is how I came across <a href=“https://www.npmjs.com/package/budo” target="_blank">Budo</a>, (one more handy tool we can thank Matt DesLauriers for!) which is a great little zero config browserify development server that has LiveReloading integration right out of the box, minus all the "magic" that makes debugging Parcel difficult. Think of my setup as a stripped down version of the SuperGuiGui boilerplate. I have only what I need, and nothing else. The parts that didn’t serve my project or that I simply didn’t understand, I got rid of (I really hate using tools that I don’t understand.)

### The base scene

This post assumes you understand the basics of setting up a Three.js scene. If not, pop over to <a href="https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene" target="_blank">the docs</a> for a quick run down, or skim <a href="https://github.com/elizasj/fftthree/blob/master/src/index.js">my boilerplate</a>. Once you have your renderer, scene, camera and lights set up, the real fun begins - let’s get some things on the screen!

_Some of the parts that I found most tricky about visualising sound with three.js are outlined here - hopefully this will save others some time:_

### Modifying imported objects

For this demo I grabbed a ready-made object from Google’s new(-ish) 3D library project, <a href=“https://poly.google.com/” target="_blank">Poly</a> - some sort of white rock - whose color and texture I wantd to tweek. In order to achieve this, you need to access the geometry as an array of parent/child and run a check to find an instance of THREE.mesh within the imported object data. If it exists push it into an array, and pass the element on for further usage:

```javascript
//model
var loader = new THREE.OBJLoader()
//load a resource
loader.load(
  'src/objects/model.obj',
  // called when resource is loaded
  function(object) {
    const objs = []

    // checking for mesh
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        objs.push(child)
      }
    })

    addObj(objs[0])
  }
)
```

### Creating lots of meshes from one import

In the above code you might have noticed that I’m calling the `addObj()` function on the first element of the objs array, (aka that mesh we were looking for). That’s a function I wrote myself, to populate my scene with many instances of the imported form.

```javascript
let particles
function addObj(mesh) {
  var xDistance = 30
  var yDistance = 40
  var zDistance = 35

  var xOffset = -40 //initial offset so does not start in middle
  var zOffset = -40

  particles = new THREE.Object3D()
  scene.add(particles)

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        const material = new THREE.MeshPhongMaterial({
          color: 0xed368c,
          flatShading: THREE.FlatShading,
          shininess: 100,
          emissive: 0x22121a,
          specular: 0xfffff,
        })

        var mesh = new THREE.Mesh(mesh.geometry, material)
        mesh.scale.set(50, 50, 50)
        mesh.position.x = xDistance * i + xOffset
        mesh.position.y = yDistance * j
        mesh.position.z = zDistance * k + zOffset

        mesh.updateMatrix()
        mesh.matrixAutoUpdate = true
        particles.add(mesh)
      }
    }
  }
}
```

`particles` is a sort of container <a href=“https://threejs.org/docs/#api/core/Object3D” target="_blank">3D Object</a> for the instances of the imported form. I know that declaring globals is generally frowned upon, but as I’d be needing to access it from the render loop later on, this seemed like the simplest solution. Next, I created a 3D grid with a nested for loop, and within that, I set the material and mesh details I wanted to apply. Finally, I added each newly created and defined mesh to the particles object.

### Putting it all together

Now that we have something to animate on the screen, we can plug in our audio data and get things moving. I can use the analyser, frequency data array and frequency range object that I’d exported above in my render loop along with my particles object.

Remember that particles acts as a container so you can animate both the grid as a whole structure as well as the individual elements that comprise it:

```javascript
// Render loop
function render() {
// get sound freqs
const subAvg = average(analyser, freq, bands.sub.from, bands.sub.to);
const lowAvg = average(analyser, freq, bands.low.from, bands.low.to);
const midAvg = average(analyser, freq, bands.mid.from, bands.mid.to);
const highAvg = average(analyser, freq, bands.high.from, bands.high.to);

for (var i = 0; i < particles.children.length; i++) {
particles.children[i].rotation.x += midAvg / 5;
particles.children[i].rotation.x -= highAvg / 5;

    particles.children[i].rotation.y += subAvg / 50;
    particles.children[i].rotation.y -= lowAvg / 50;

    particles.children[i].rotation.z += highAvg / 150;
    particles.children[i].rotation.z -= subAvg / 150;

}

for (var j = 0; j < particles.children.length; j = j + 2) {
particles.children[j].scale.set(150 _ midAvg, 150 _ midAvg, 150 \* midAvg);
}

for (var k = 1; k < particles.children.length; k = k + 2) {
particles.children[k].scale.set(50 _ subAvg, 50 _ subAvg, 50 \* subAvg);
}

renderer.render(scene, camera);
}
```

And that's pretty much all you need to get things going.
Check out the full demo in action <a href="https://elizasj.github.io/fftthree/" target="_blank">here</a>, or clone/fork the repo to play around with <a href="https://github.com/elizasj/fftthree" target="_blank">here</a>.

For a more elaborate example of all of this in action, feel free to check out what I was working on at the residency I mentioned above, <a href="https://elizasj.github.io/bloopV2/">here</a>.
