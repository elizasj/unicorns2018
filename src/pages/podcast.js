import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import cn from 'classnames/bind'
import Layout from '../components/layout'
import style from './podcast.module.css'

const cx = cn.bind(style)

class Podcast extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <p className={cx('blurb')}>
          I find tutorials and technical notes easier to read through than to
          listen to. In contrast, I prefer hearing about why people are drawn to
          the work that they do. If you do too, then the{' '}
          <strong>UFP Podcast </strong> might be of interest. It's where I put
          the many thoughts, ideas and questions I have that reach beyond
          technical notes and tinkering chronicled on this site.
          <br />
        </p>

        <h3>Ep.05 | All About Math</h3>
        <p>
          In this episode I'll be discussing math and it's role in creative
          coding, how I got over my own math traumas, the connection between
          pythagoras and music and why everyone is a math person.
        </p>
        <p>Show notes:</p>
        <ul>
          <li>
            <a href="http://www.kadenze.com/" target="_blank">
              Kadenze
            </a>
          </li>
          <li>
            <a href="http://www.goodpointpodcast.com/" target="_blank">
              Good Point Podcast
            </a>
          </li>
          <li>
            <a href="http://www.newrafael.com/" target="_blank">
              Rafael Ronzendaal
            </a>
          </li>
          <li>
            <a href="http://jeremybailey.net/" target="_blank">
              Jeremy Bailey
            </a>
          </li>
          <li>
            <a href="http://en.wikipedia.org/wiki/Bob_Ross" target="_blank">
              Bob Ross
            </a>
          </li>
          <li>
            <a href="http://shiffman.net/" target="_blank">
              Dan Shiffman
            </a>
          </li>
          <li>
            <a href="http://www.youtube.com/user/shiffman" target="_blank">
              Coding Train
            </a>
          </li>
          <li>
            <a href="http://patriciogonzalezvivo.com/" target="_blank">
              Patricio Gonzalez Vivo
            </a>
          </li>
          <li>
            <a href="http://thebookofshaders.com/" target="_blank">
              The Book of Shaders
            </a>
          </li>
          <li>
            <a href="http://bit.ly/2OZvbKb" target="_blank">
              A Beautiful Question by Frank Wilczek
            </a>
          </li>
          <li>
            <a href="https://bit.ly/2OVpCw5" target="_blank">
              Reflections on Mindstorms by Seymour Papert
            </a>
          </li>
        </ul>

        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep05-e2al7e"
          frameborder="0"
          scrolling="no"
        />
        <hr className={cx('seperator')} />

        <h3>Ep.04 | Creative Inspiration: Sol Lewitt</h3>
        <p>
          This episode is part of a mini-series that I'll be adding to from time
          to time, that chronicles some of the creatives and artists who've
          inspired me along the way. I'll be kicking things off with Sol Lewitt.
        </p>
        <p>Show notes:</p>
        <ul>
          <li>
            <a href="https://twitter.com/mattdesl" target="_blank">
              Matt DesLauriers
            </a>
          </li>
          <li>
            <a
              href="http://www.multimedialab.be/doc/citations/sol_lewitt_sentences.pdf"
              target="_blank"
            >
              Sentences on Conceptual Art - Letters
            </a>
          </li>
          <li>
            <a
              href="http://www.youtube.com/watch?v=VnSMIgsPj5M"
              target="_blank"
            >
              Live: Sol LeWitt to Eva Hesse - Read by Benedict Cumberbatch
            </a>
          </li>
          <li>
            <a
              href="http://www.youtube.com/watch?v=dTGvbhqWoFI"
              target="_blank"
            >
              Letters Live: Sol LeWitt to Eva Hesse - Read by Andrew Scott
            </a>
          </li>
          <li>
            <a href="http://vimeo.com/139094998t" target="_blank">
              Everything is a remix
            </a>
          </li>
        </ul>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep04-e1s738/a-a4h1vb"
          frameBorder="0"
          scrolling="no"
        />

        <hr className={cx('seperator')} />
        <h3>Ep.03 | Code, Data & the Visual Arts</h3>
        <p>
          This week I talk about my master thesis - about how using procedural
          techniques when creating art changes the way you relate to your work,
          and how art, math and science have been bridged together thanks to
          technology.
        </p>
        <p>Mentions:</p>
        <ul>
          <li>
            <a href="https://temp-studio.com/" target="_blank">
              Temp Studio
            </a>
          </li>
          <li>
            <a href="http://www.markijzerman.com/" target="_blank">
              Mark Ijzerman
            </a>
          </li>
          <li>
            <a href="http://philipgalanter.com/" target="_blank">
              Philip Galanter
            </a>
          </li>
          <li>
            <a href="http://www.reas.com/" target="_blank">
              Casey Reas
            </a>
          </li>
          <li>
            <a href="http://processing.org/" target="_blank">
              Processing
            </a>
          </li>
          <li>
            <a href="https://cycling74.com/products/max/" target="_blank">
              MaxMSP
            </a>
          </li>
          <li>
            <a href="https://openframeworks.cc/" target="_blank">
              openFrameworks
            </a>
          </li>
        </ul>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep03-e1qrtc"
          frameBorder="0"
          scrolling="no"
        />
        <hr className={cx('seperator')} />

        <h3>Ep.02 | Artist Residencies</h3>
        <p>
          This week I talk about my first experience participating in an artist
          residency, and I interview a fellow resident & digital artist, Robert
          Allison about his experience, and talk to him about a generative sound
          project he's been working on.
        </p>
        <p>Mentioned in this episode:</p>
        <ul>
          <li>
            <a href="https://temp-studio.com/" target="_blank">
              Temp Studio
            </a>
          </li>
          <li>
            <a href="http://bit.ly/2qnb9yh" target="_blank">
              Robert Allison
            </a>
          </li>
          <li>
            <a href="http://kinetecharts.org/" target="_blank">
              Kinetech
            </a>
          </li>
        </ul>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep02-e1qrtd"
          height="202px"
          width="900px"
          frameBorder="0"
          scrolling="no"
        />
        <p>
          For an in depth look at some of the technical aspects touched on in
          the podcast, checkout{' '}
          <a href="http://bit.ly/fft-pt1" target="_blank">
            Visualizing Sound (pt1): The FFT
          </a>{' '}
          and
          <a href="http://bit.ly/fft-pt2" target="_blank">
            Visualizing Sound (pt2): Three.js
          </a>
        </p>
        <hr className={cx('seperator')} />

        <h3>Ep.01 | Why I'm interested in visualizing sound</h3>
        <p>
          This episodes accompanies a two part series on the blog, and touches
          on the FFT (Fast Fourier Transform), Frequencies/Hz, Three.js, P5.js
          and the Web Audio API.
        </p>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep01-e1qrte"
          height="202px"
          width="900px"
          frameBorder="0"
          scrolling="no"
        />
        <p>
          For an in depth look at some of the technical aspects touched on in
          the podcast, checkout{' '}
          <a href="http://bit.ly/fft-pt1" target="_blank">
            Visualizing Sound (pt1): The FFT
          </a>{' '}
          and
          <a href="http://bit.ly/fft-pt2" target="_blank">
            Visualizing Sound (pt2): Three.js
          </a>
        </p>
        <hr className={cx('seperator')} />

        <h3>Ep.00 | Why I'm making a podcast</h3>

        <p>
          an exploration of the always expanding web development landscape &
          creative side of code. (
          <strong>
            Audio quality warning: I was very ill when I recorded this, also
            used a shitty mic...
          </strong>
          )
        </p>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep00-e1qrtf"
          height="202px"
          width="900px"
          frameBorder="0"
          scrolling="no"
        />
        <hr className={cx('seperator')} />
      </Layout>
    )
  }
}

export default Podcast
