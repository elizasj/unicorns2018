import React from 'react'
import { Link } from 'gatsby'
import cn from 'classnames/bind'
import style from './layout.module.css'
import Bio from '../components/Bio'

const cx = cn.bind(style)

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <div className={cx('container')}>
        <header className={cx('header')}>
          <div>
            <Bio />
          </div>
          <ul className={cx('menu')}>
            <ListLink to="/webdev101/">Web Dev 101</ListLink>
            <ListLink to="/about/">About</ListLink>
            <ListLink to="/contact/">Contact</ListLink>
          </ul>
        </header>

        <div className={cx('main')}>{children}</div>

        <footer>
          <p>
            This site is built with{' '}
            <a href="https://www.gatsbyjs.org/" target="_blank">
              Gatsby
            </a>{' '}
            & hosted on{' '}
            <a href="https://www.netlify.com/" target="_blank">
              Netlify
            </a>
            . The source code is on{' '}
            <a href="https://github.com/elizasj/unicorns2018" target="_blank">
              Github
            </a>
            .
          </p>
          <p>© 2018 Unicorns Fart Pixels</p>
        </footer>
      </div>
    )
  }
}

export default Template
