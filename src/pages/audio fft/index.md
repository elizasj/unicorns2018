---
date: '2017-10-25T00:00:00Z'
tags: ['p5js', 'data', 'dataviz', 'audio']
title: 'Visualising Sound (pt1): The FFT'
category: 'creative dev'
---

The Fast Fourier Transform is what got me started with data visualisation.

There are many other entry points when it comes to dataviz, but I've always been really influenced by, and interested in music and the way rythms can play with our senses. It felt only natural to explore how I might play with that.

#### N.B This is part one of a series on audio visualisation. If you already have your bearings with the FFT and want to dive deeper into how the Web Audio Api works as a stand alone, and specifically how to integrate it into a three.js project, jump ahead to <a href="https://www.unicornsfartpixels.com/posts/2018-01-01fftthree/" target="_clear">Part One</a>

Fun fact: the FFT is also apparently the "_most important (numerical) algorithm of our lifetime_" (if we're to believe MIT's <a href="http://www-math.mit.edu/~gs/papers/amsci.pdf" target="_clear">Gilbert Strang</a>, which we do,) so I figured I might as well take a stab at figuring out what it's all about.

**Sidenote:** Mr. Strang was not only quite good at the math involved in the FFT, he's a wonderful writer. If you haven't clicked on that link I invite you to check him out. Even if you don't follow the complex bits, he's quite the penman.

### What is the FFT?

While the idea of converting a signal from its original domain (time/space) into it's equivalent frequency domain sounds - in theory - pretty straight forward (my initial thought was '_sounds sort of like maping an array_'), executing on that idea is another story. Once I delved into things a bit further I found myself surrounded by math notation and formulaic expressions that go above and beyond anything I ever learned at school.

As you might have guessed, I'm not a mathematician by any means, so I'll be leaving the formulas to the pros. Thankfully, one such pro, <a href="https://betterexplained.com/" target="_blank">Kalid Azad</a> , happens to enjoy distilling complex math ideas into simple intuitive theories. He really does a great job of breaking things down for us math-plebs, for example explaining the FFT like this:

> What does the Fourier Transform do? Given a smoothie, it finds the recipe.

> How? Run the smoothie through filters to extract each ingredient.

> Why? Recipes are easier to analyze, compare, and modify than the smoothie itself.

> How do we get the smoothie back? Blend the ingredients.

> The Fourier Transform changes our perspective from consumer to producer, turning What do I have? into How was it made?

So "_...each filter cycle will reveal the speeds, amplitudes or phases of any point in time_," just means we get a list of ingredients for our smoothy. The FFT basically reverse engineers the signal you give it.

As someone who's obsessed with understanding the how's and why's of inner-workings, the FFT makes me all kinds of happy.

There are a lot more mathy details one can delve into when it comes to the FFT, and I invite anyone who's curious about it to give <a href="https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/" target="_blank">Kalid's article</a> on the subject a read. It's a long one, but it's really interesting.

For our purposes though, we have all we need to understand how to get started playing around with audio using p5.js and three.js, two of my favourite libraries that use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank"> Web Audio API</a>

When it comes to picking which one to use, it really depends on what you're trying to do. (That age old question...) I consider p5.js great for starting out, and three.js is best saved for when you're ready for something a bit more intense. Not because of anything to do with audio, but more with regards to the type of visuals you want to use to illustrate your data. Would you rather sketch an idea out on paper? Or set up a studio replete with cameras, lights and a backdrop?

Below I've included a very basic setup in p5.js, to give you an idea of how the FFT can be used to isolate specific types of sound within an audio track, and illustrate it in your browser.

### The Sound library for P5.js

P5js is a funny one. It's a library that has it's own subset of specialty libraries. Beginners sometimes struggle to wrap their minds around that idea, and if you're one of them, try and think of it as an extension of the lib.

Case in point: **<a href="https://p5js.org/reference/#/libraries/p5.sound" target="_blank">p5.sound</a>**

This library comes with a solid set of tools that leverage the Web Audio API's capabilities with p5's visual capabilities. Within p5.sound, we're looking for the p5.FFT method, which we'll use to isolate the high, medium and low frequency levels.

To do so, you have to first instantiate <a href="https://p5js.org/reference/#/p5.FFT" target="_blank">the fft</a>

```javascript
fft = new p5.FFT()
```

Once you've created an instance of the **p5.FFT object**, you have a few different options in the form of methods, that you can call on your fft.

In our case, we want to isolate specific frequency levels within the spectrum so we'll use `fft.getEnergy()`. However, for this to work it has to be used in tandem with `fft.analyze()` which grabs the amplitude values of the the audio file you give it from lowest to highest. `getEnergy()` needs these results to find what you're looking for.

Once you've called the analyze method of your fft, you can then use getEnergy to pinpoint a specific frequency or a set range.

```javascript
var spectrum = fft.analyze()
var lowLvls = fft.getEnergy('bass', 'lowMid')
```

Above you'll notice I included strings as the parameters that define what frequencies I want to grab. That's because p5.audio gives us a handy set of predefined ranges to play with: `"bass"`, `"lowMid"`, `"mid"`, `"highMid"`, and `"treble"`.

When I was first starting out playing with audio I found it really helpful to have these presets. But if you'd rather tinker with your own set of numbers you can definitely do that. Any numbers you give as params should correspond to frequencies (in Hz).

A quick lesson in frequencies/Hz's:
The normal range for the average human ear is between 20 and 20,000Hz. However, the range we encounter most often in our day to day lives is in the 250 to 6,000Hz range.

Since 60-ish percent of the audio spectrum is undetectable to the human ear, we won't bother ourselves with it. So if you're taking the full 20-20,000Hz range:

- low levels are the lowest 5% of our range
- mid mevels are between 5% and 15.5%
- high levels are between 15.5% and 25.5%

Within the 250-6,000Hz range, the basics breakdown is as follows:

Vowel sounds (a short 'o' for example) can be isolated at the 250-1,000Hz range
Consonant sounds ('s' for example) can be isolated at the 1,500-6000Hz range

N.B: If you're looking to visualise intensity of sound, that means swapping frequencies (Hz) for decibels (dB), and `p5.FFT()` for <a href="https://p5js.org/reference/#/p5.Amplitude" target="_blank">`p5.Amplitude()`</a>. For the purpose of this article I won't be delving int that, but know that the basic setup is the same (instantiate and play around with the provided methods!)

A note on instantiating the p5.FFT object: it can optionally take two parameters: smoothing and bins.

Smoothing from what I've understood is something akin to periln noise - it basically kind of cleans the edges off any jagged data, which for our purposes, creates an easier (smoother) visual within the canvas.

Bins have everything to do with the sample buffer, which is a little snapshot of sound used by the FFT's algorithm in it's analysis. The FFT returns an array full of data, aka amplitude measurements, aka _bins_. This is handy to be aware of because you can
play around with the size of the array which in turn modifies the specificity (think resolution quality) of the sample buffer you're grabbing. The FFT size sets the number of bins used to divide up the audio into equal parts (snapshots). The default setting is 1024 bins (the array's length,) and can be changed to any number between 16 and 1024, as long as it's a power of two.

When you play around with this keep in mind that whatever number of bins you set will give you double the samples. For example, 512 bins = 1024 samples, 1024 bins = 2048 samples...

### The visuals

Assuming you know the basics of <a href="https://p5js.org/" target="_blank">p5</a>, here is a simple setup to get you started. Add your desired canvas size, background, frame rate, etc.

```javascript
var fft

function preload() {
  // preload your audio file so everything is ready on page load
  song = loadSound('song.mp3')
}

function setup() {
  //instantiate the fft object
  fft = new p5.FFT(smoothing, binCount)
}

function draw() {
  // analyze amplitude values along the whole frequency domain
  var spectrum = fft.analyze()

  //grab low levels
  var lowLvls = fft.getEnergy('bass', 'lowMid')
}
```

So now that you know how to get the data from your audio file, what to do with it?

Well... that's up to you! One great place to start is by mapping the frequency range you grabbed onto a basic shape, setting it to something like width or height. Grab another range and add another shape. You can keep adding shapes and frequencies, or adding maps of other things like color or position to the frequencies you already have. From here the possibilities are pretty endless.

For an example of multiple elements in action, check out one of my <a href="https://elizasj.github.io/fftpatterns/" target="_blank">first audio-powered visualisation patterns</a>.

Next up, <a href="https://www.unicornsfartpixels.com/posts/2018-01-01fftthree/" target="_clear">part two</a> of audio viz basics in three.js.
