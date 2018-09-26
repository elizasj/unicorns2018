import React from 'react'
import { Link } from 'gatsby'
import styles from './style.css'
import Bio from '../components/Bio'

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
      <div
        style={{
          margin: '0 auto',
          maxWidth: 900,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0,
        }}
      >
        <header style={{ marginBottom: `1.5rem`, marginTop: `1.5rem` }}>
          <div>
            <Link
              to="/"
              style={{ textShadow: `none`, backgroundImage: `none` }}
            >
              <h3 style={{ display: `inline`, paddingBottom: `1px` }}>
                Unicorns Fart Pixels
              </h3>
            </Link>
            <Bio />
          </div>
          <ul className="menu" style={{ margin: `0`, paddingTop: `3px` }}>
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
