import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import cn from 'classnames/bind'
import Layout from '../components/layout'
import style from './contact.module.css'

const cx = cn.bind(style)

class Contact extends React.Component {
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

        <div className={cx('container')}>
          <div>
            <h3>Get in touch</h3>
            <p>👩🏼‍💻 Hey, I'm Eliza. I run this space.</p>
            <p>
              As both this site and podcast attest, I'm pretty curious about
              digital signal processing, generative visuals, interactive
              experiences and the creative tech scene as a culture. I'm always
              interested in chatting and collaborating with like minds, and am
              selectively open to speaking and workshop opportunities.
            </p>
            <p>
              Questions, comments & [constructive] critiques are always welcome,
              (trolls not so much.) Send me a ping on any of the usual
              platforms:
            </p>
            <ul>
              <li>
                <a href="https://twitter.com/iamelizasj">twitter</a>
              </li>
              <li>
                <a href="https://www.instagram.com/iamelizasj/">instagram</a>
              </li>
              <li>
                <a href="https://ello.co/elizasj">ello</a>
              </li>
              <li>
                <a href="https://github.com/elizasj">github</a>
              </li>
            </ul>
            <p>
              For professional/work related inquiries please contact me via{' '}
              <a href="mailto:unicornsfartpixelsblog@gmail.com">email</a>.
            </p>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Contact
