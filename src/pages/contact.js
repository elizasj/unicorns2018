import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'

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
        <h3>Get in touch</h3>
        <p>
          <strong>
            Questions, comments & [constructive] critiques are welcome...
          </strong>
        </p>
        <p>
          ...which might surprise some, who may have noticed that this space is
          free of a comments section. That decision was made to honor the
          notebook/written-in-pencil spirit of{' '}
          <a href="http://www.unicornsfartpixels.com/about/">UFP</a>. However,
          the spirit of the Internet also carries some weight with me, so feel
          free to ping me on{' '}
          <a href="https://twitter.com/iamelizasj">twitter</a> or if you feel
          inclined to type out more than ~~140~~, er, I mean{' '}
          <a
            href="https://www.theguardian.com/technology/2017/sep/28/twitter-users-respond-to-280-character-limit-mostly-in-140-characters"
            target="_blank"
          >
            280 chars
          </a>
          , send along an{' '}
          <a href="mailto:unicornsfartpixelsblog@gmail.com">email</a>.
        </p>
      </Layout>
    )
  }
}

export default Contact
