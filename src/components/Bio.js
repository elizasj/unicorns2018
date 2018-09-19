import React from 'react'

import profilePic from './profile-pic.jpg'

class Bio extends React.Component {
  render() {
    return (
      <div>
        <img src={profilePic} alt={`Kyle Mathews`} />
        <p>
          an online notebook cataloguing the always expanding web development
          landscape & creative side of code.
        </p>
      </div>
    )
  }
}

export default Bio
