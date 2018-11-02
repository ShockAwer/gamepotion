import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledResource = styled.div`
`

class NotDoneYet extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      resource: props.resource
    }
  }

  render() {
    return (
      <StyledResource />
    )
  }
}

NotDoneYet.propTypes = {
  resource: PropTypes.object.isRequired,
  onUpdate: PropTypes.func
}

NotDoneYet.defaultProps = {
  onUpdate: () => {}
}

export default NotDoneYet