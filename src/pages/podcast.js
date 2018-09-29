import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import cn from 'classnames/bind'

import style from './podcast.module.css'

import Layout from '../components/layout'

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
        <p>Podcast</p>

        <h3>Creative Inspiration: Sol Lewitt</h3>
        <p>
          This episode is part of a mini-series that I'll be adding to from time
          to time, that chronicles some of the creatives and artists who've
          inspired me along the way. I'll be kicking things off with Sol Lewitt.
        </p>
        <p>
          Show notes:
          <ul>
            <li>
              <a href="https://twitter.com/mattdesl" target="_blank">
                Matt DesLauriers
              </a>
            </li>
            <li>
              <a
                href="www.multimedialab.be/doc/citations/sol_lewitt_sentences.pdf"
                target="_blank"
              >
                Sentences on Conceptual Art - Letters
              </a>
            </li>
            <li>
              <a href="www.youtube.com/watch?v=VnSMIgsPj5M" target="_blank">
                Live: Sol LeWitt to Eva Hesse - Read by Benedict Cumberbatch
              </a>
            </li>
            <li>
              <a href="www.youtube.com/watch?v=dTGvbhqWoFI" target="_blank">
                Letters Live: Sol LeWitt to Eva Hesse - Read by Andrew Scott
              </a>
            </li>
            <li>
              <a href="vimeo.com/139094998t" target="_blank">
                Everything is a remix
              </a>
            </li>
          </ul>
        </p>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed"
          frameborder="0"
          scrolling="no"
        />

        <hr />
        <h3>Code, Data & the Visual Arts</h3>
        <p>
          This week I talk about my master thesis - about how using procedural
          techniques when creating art changes the way you relate to your work,
          and how art, math and science have been bridged together thanks to
          technology.
        </p>
        <p>
          Mentions:
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
          </ul>
          Processing: processing.org/ MaxMSP: cycling74.com/products/max/
          openFrameworks: openframeworks.cc/{' '}
        </p>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep03-e1qrtc"
          frameborder="0"
          scrolling="no"
        />
        <hr />

        <h3>Artist Residencies</h3>
        <p>
          This week I talk about my first experience participating in an artist
          residency, and I interview a fellow resident & digital artist, Robert
          Allison about his experience, and talk to him about a generative sound
          project he's been working on.
        </p>
        <p>
          Mentioned in this episode:
          <ul>
            <li>
              <a href="https://temp-studio.com/" target="_blank">
                Temp Studio
              </a>
            </li>
            <li>
              <a href="bit.ly/2qnb9yh" target="_blank">
                Robert Allison
              </a>
            </li>
            <li>
              <a href="http://kinetecharts.org/" target="_blank">
                Kinetech
              </a>
            </li>
          </ul>
        </p>
        <iframe
          className={cx('podcast')}
          src="https://anchor.fm/unicorns/embed/episodes/Unicorns-Fart-Pixels-ep02-e1qrtd"
          height="202px"
          width="900px"
          frameborder="0"
          scrolling="no"
        />
        <p>
          For an in depth look at some of the technical aspects touched on in
          the podcast, checkout{' '}
          <a href="bit.ly/fft-pt1" target="_blank">
            Visualizing Sound (pt1): The FFT
          </a>{' '}
          and
          <a href="bit.ly/fft-pt2" target="_blank">
            Visualizing Sound (pt2): Three.js
          </a>
        </p>
        <hr />

        <h3>Why I'm interested in visualizing sound</h3>
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
          frameborder="0"
          scrolling="no"
        />
        <p>
          For an in depth look at some of the technical aspects touched on in
          the podcast, checkout{' '}
          <a href="bit.ly/fft-pt1" target="_blank">
            Visualizing Sound (pt1): The FFT
          </a>{' '}
          and
          <a href="bit.ly/fft-pt2" target="_blank">
            Visualizing Sound (pt2): Three.js
          </a>
        </p>
        <hr />

        <h3>Why I'm making a podcast</h3>

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
          frameborder="0"
          scrolling="no"
        />
        <hr />
      </Layout>
    )
  }
}

export default Podcast
