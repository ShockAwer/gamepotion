import React from 'react'
import PropTypes from 'prop-types'

import classes from '../classes'
import isActionConfigurable from '../isActionConfigurable'

import resourceTypes from '../resourceTypes'
import icons from '../icons'

import List from '../components/List/List'
import ListItem from '../components/ListItem/ListItem'

const getLabel = (resourceTypeTypes, resources, actionClassInstance, action) => {
  const runArguments = Array.from(actionClassInstance.defaultRunArguments.values()).map((dra, i) => {
    if (resourceTypeTypes.includes(dra.type)) {
      const foundResource = resources.find(r => r.id === action.runArguments[i])
      return (foundResource !== undefined ? foundResource.name : '?')
    }
    return action.runArguments[i]
  })
  return actionClassInstance.toString(runArguments, action.appliesTo)
}

const ActionsList = ({ resources, actions, onAction }) => {

  const resourceTypeTypes = resourceTypes.map(r => r.type)

  const getList = (actions) => {
    let indentation = 0
    let indentation32 = 0
    return (
      <List emptyText='There aren&rsquo;t any actions for this event.'>
        {actions.map((action, i) => {
          const actionClassInstance = new classes.actions[action.id]()
          const previousActionClassInstance = actions[i - 1] ? new classes.actions[actions[i - 1].id]() : undefined
          if (actionClassInstance.invertIndentation === true && indentation > 0) {
            indentation -= 1
          }
          if (actionClassInstance.indentation === -1 && indentation > 0) {
            indentation -= 1
          }
          if (previousActionClassInstance !== undefined && previousActionClassInstance.invertIndentation === true) {
            indentation += 1
          }
          indentation32 = 4 + (indentation * 32)
          if (actionClassInstance.indentation === 1) {
            indentation += 1
          }
          const label = getLabel(resourceTypeTypes, resources, actionClassInstance, action)
          const actionActions = [
            ...(isActionConfigurable(actionClassInstance) ? ['edit'] : []),
            ...(i > 0 ? ['move-up'] : []),
            ...(i < actions.length - 1 ? ['move-down'] : []),
            'delete'
          ]
          return (<ListItem id={`${i}`} key={`${i}`} icon={icons.actions[action.id]} actions={actionActions} indentation={indentation32} onChoose={() => onAction(i, 'edit')} onAction={onAction}>{label}</ListItem>)
        })}
      </List>
    )
  }

  return getList(actions)
}

ActionsList.propTypes = {
  resources: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  onAction: PropTypes.func
}

ActionsList.defaultProps = {
  onAction: () => {}
}

export default ActionsList
