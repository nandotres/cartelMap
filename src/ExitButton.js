import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import './ExitButton.css'

const ExitButton = ({ isSelected }) => {

      console.log('asdf')
        return (
            <div style={styles.button}>
                <button className="gradient-text-button" >╳</button>
            </div>
        )
}

const styles = {
  button: {
    position: 'absolute',
    top: 0,
    float: 'right'
  }
}

ExitButton.propTypes = {
  isSelected: PropTypes.bool.isRequired
}

export default ExitButton
