import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Module from './Module'

const StyledModules = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-gap: 1rem;
  // background-color: red;
`

const Modules = ({ modules }) => {
  // console.warn('[component-Bricks] modules', modules)
  return (
    <StyledModules className='component--modules'>
      {modules.map(module => {
        const {
          id,
          name,
          price
        } = module
        return (
          <Module key={id} id={id} name={name} price={price} />
        )
      })}
    </StyledModules>
  )
}

Modules.propTypes = {
  modules: PropTypes.array.isRequired
}

Modules.defaultProps = {
}

export default Modules