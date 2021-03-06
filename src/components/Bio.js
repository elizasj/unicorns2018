import React from 'react'
import { Link } from 'gatsby'
import cn from 'classnames/bind'
import style from './Bio.module.css'

const cx = cn.bind(style)

class Bio extends React.Component {
  render() {
    return (
      <div>
        <p className={cx('bio')}>
          <Link to="/">unicornsfartpixels</Link> is an online notebook
          cataloguing the always expanding web development landscape & creative
          side of code.
        </p>
      </div>
    )
  }
}

export default Bio
