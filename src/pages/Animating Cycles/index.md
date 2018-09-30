---
date: '2018-28-09T00:00:00Z'
tags: ['shaders', 'math']
title: 'Sine/Cosine == Circles?'
category: 'creative dev'
---

As I've been studying the <a href="https://thebookofshaders.com/05/" target="_blank">The Book of Shaders</a>, I've spent a fair amount of time on chapter 5, <em>Algorithmic Drawing</em>. It deals with one-dimensional functions and understanding how to take the result of a **Lerp**, which we looked at <a href="#" target="_blank">last time</a>, and shape it into something new. Seems a pretty fitting skill to add to our toolkit.

While there are a generally lot of mathematical functions that come ready to use with most languages, - Shader code is no exception - the two keys that lie the heart of most if not all of them are **sine** and **cosine**.

<img src="https://thebookofshaders.com/05/sincos.gif">

> These two basic trigonometric functions work together to construct circles that are as handy as MacGyver’s Swiss army knife. It’s important to know how they behave and in what ways they can be combined. In a nutshell, given an angle (in radians) they will return the correct position of x (cosine) and y (sine) of a point on the edge of a circle with a radius equal to 1. But, the fact that they return normalized values (values between -1 and 1) in such a smooth way makes them an incredible tool.

The above gif (and quote) is from <a href="https://thebookofshaders.com/05/" target="_blank">The Book of Shaders</a> and it's been taunting me since I first laid eyes on it. Not only because I'd encountered it before, as I'm sure many of you have - and doesn't it just kind of drive you nuts that something so simple and elegant as this lies at the heart of something as mind bending as Shader code (_sigh_...) - but because while I understood in theory how the unit circle, sine and cosine are related, intuitively the gif above still sent my mind through a loop.

### Let me take you on a little journey, in which I peel appart this gif:

We can all agree that a circle is defined by points that are all equidistant from the same point. Below we have the Unit Circle. Sounds a lot like Unit Vector right? Indeed, they both play in that magical space contained within the 0.0 - 1.0 range.
<img src="/images/unitcircle1.png">
Since **x** and **y** are always scalable by the sin & cosine of whatever angle you move by, this gives us a way to directly find (aka map) all the points on a unit circle... or any circle for that mater...
<img src="/images/unitcircle2.png">
To map all the points that trace any potential circle, multiply cosine & sin by the circle's radius. So far so good, right? Nothing particularily mind bending here. But wait. Quick refresher on radians and their relationship to degrees. Which are in fact two completely oposing points of view, litterally.
<img src="/images/unitcircle3.png">
Think of degrees as your range of view, or how things are in relation to you (from the **0,0** position in the above visual for example,) while radians reflect a departure from your range of view, focussing instead on how much something in your range of view might be moving (the longer blue line, crawling around the edge of the circle). From <a href="https://twitter.com/betterexplained">Kalid Azad</a> at <a href="betterexplained" target="_blank">Better Explained</a>:

> A degree is the amount I, an observer, need to tilt my head to see you...Instead of wondering how far we tilted our heads, consider how far the other person moved... Degrees measure angles by how far we tilted our heads. Radians measure angles by distance traveled. But absolute distance isn’t that useful, since going 10 miles is a different number of laps depending on the track. So we divide by radius to get a normalized angle.

And so we find ourselves transported back to that 0.0 - 1.0 range. But the key here, at least for me, is recognizing the link between distance moved aka radians, and the concept of the cycle (in the case of our Book of Shaders gif, that means the interval of time needed to trace all the way around the circle, or the period that it takes the sway of sine or cosine to complete before repeating along the axis.) Adding the aspect of time takes us from the circle to the sine wave.

<img src="/images/unitcircle4.png">

BTW, Circles _have_ sine and cosine, like squares _have_ lines. A circle isn't sine or cosine, neither is a square a line. With that in mind, the gif we've been pulling appart can be summed up as a combination of two one-dimensional waves, sine and cosine.

<img src="https://betterexplained.com/wp-content/uploads/2016/12/Simple_harmonic_motion_animation.gif">
(<small><a href="https://betterexplained.com/articles/intuitive-understanding-of-sine-waves/" target="_blank">source</a></small>)

<img src="https://thebookofshaders.com/05/sincos.gif">

### This is all well and great, but what does it actually mean for our shaders?

It means we understand the key to animating things! **sin(x)** or **cos(x)** are cycles at a given point in their cycle, **x** being a point somewhere within 2π radians, (or 360°). Add the dimension of time to the mix and you've got movement. Which is essentially that gif I keep harping on about.

There is also the notion of momentum at play - the constant pull back to center (π, 2π, 0°, 180°, or 360°,) is what keeps the cycle going.

You can now pair this knoweldge with some of GLSL's out of the box shaping functions and make colors and shapes move about.

The code below is borrowed directly from <a href="https://thebookofshaders.com/05/" target="_blank">The Book of Shaders</a>. I've modified it a bit to illustrate what a one dimensional sine function looks like. I won't pick apart all this code and explain everything because for the purpouse of this post, we are really only interested in one line, down in the fragment shader.

```javascript
float quadraticBezier (float x, vec2 a){

  float epsilon = 0.00001;
  a.x = clamp(a.x,0.0,1.0);
  a.y = clamp(a.y,0.0,1.0);
  if (a.x == 0.5){
    a += epsilon;
  }

  // solve t from x (an inverse operation)
  float om2a = 1.0 - 2.0 * a.x;
  float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
  float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
  return y;
}

float lineSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return smoothstep(0.0, 1.0 / u_resolution.x, length(pa - ba*h));
}

// Fragment
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	float px = 1.0 / u_resolution.y;

    // control point
    vec2 cp = vec2(sin(u_time)) * 0.45 + 0.5; // <-- line of code we care about
    float l = quadraticBezier(st.x, cp);
    vec3 color = vec3(smoothstep(l, l+px, st.y));

    // draw control point
    color = mix(vec3(0.5), color, lineSegment(st, vec2(0.0), cp));
    color = mix(vec3(0.5), color, lineSegment(st, vec2(1.0), cp));
    float d = distance(cp, st);
    color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,d));

    gl_FragColor = vec4(color, 1.0);
}
```

<img src="/images/1dsin.gif">

Basically, this is the shader equivalent of this guy, from earlier. Seems like the control point is the only thing animated when in fact we're seing the given point (**x**) of the sine function (**sin(x)**) plot itself out over the course of it's cycle. Seems quite boring here, but think of it as a pulse, or a spring and it can be quite useful for animation.
<img src="https://betterexplained.com/wp-content/uploads/2016/12/Simple_harmonic_motion_animation.gif">
(<small><a href="https://betterexplained.com/articles/intuitive-understanding-of-sine-waves/" target="_blank">source</a></small>)

Take the same code and add `cos(x)`, and we see our circle tracing itself, guiding a very smooth little bezier curve:

```javascript
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	float px = 1.0 / u_resolution.y;

    // control point
    vec2 cp = vec2(sin(u_time), cos(u_time)) * 0.45 + 0.5; // <-- line of code we care about
    float l = quadraticBezier(st.x, cp);
    vec3 color = vec3(smoothstep(l, l+px, st.y));

    // draw control point
    color = mix(vec3(0.5), color, lineSegment(st, vec2(0.0), cp));
    color = mix(vec3(0.5), color, lineSegment(st, vec2(1.0), cp));
    float d = distance(cp, st);
    color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.01+px,d));

    gl_FragColor = vec4(color, 1.0);
}
```

<img src="/images/1dsincos.gif">

Such beautiful, fluid movement 🤤

Once I understood all of the above, so many little doors unlocked in my mind. I've played around with a few ideas, one of which <a href="https://www.instagram.com/p/BnCaXa8BsJK/?taken-by=iamelizasj" target="_blank">I'm particularily satsifed with</a>. Now, let's not kid ourselves guys, I'm still experimenting much of the time. But little by little, the pieces that I'm experimenting with are starting to make so much more sense.

Something related, and particularily useful for shapes is inverse trigonometry (**arctan**, **arccos** and **arcsin**...) because it alows us to restrict domain and range. I'm also curious about picking appart the usefulness of GLSL's abs() and fract() functions, so look out for these topics in the near future. 👩🏼‍💻⚗️✨
