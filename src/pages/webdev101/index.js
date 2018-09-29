import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import cn from 'classnames/bind'
import style from '../landing.module.css'

import Layout from '../../components/layout'

const cx = cn.bind(style)

class WebDev101Index extends React.Component {
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

        <p>
          Welcome to <strong>Web Dev 101</strong>. This is where I stash my
          notes on the more traditional aspects of web development, tools and
          technologies that don't deal directly with digital graphics.
        </p>

        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3 className={cx('blogpost_title')}>
                <Link
                  className={cx('blogpost_title_anchor')}
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>
              <p
                className={cx('blogpost_content')}
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default WebDev101Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { eq: "webdev101" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 280)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`
