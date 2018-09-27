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
            <Link to="/">
              <div className={cx('ufp')}>Unicorns Fart Pixels</div>
            </Link>
            <Bio />
          </div>
          <ul className={cx('menu')}>
            <ListLink to="/webdev101/">Web Dev 101</ListLink>
            <ListLink to="/about/">About</ListLink>
            <ListLink to="/contact/">Contact</ListLink>
          </ul>
        </header>

        {children}
      </div>
    )
  }
}

export default Template
