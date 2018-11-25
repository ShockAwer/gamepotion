const baseReturn = {
  instanceClassesToDestroy: [],
  instancesToCreate: [],
  imageToSet: null,
  spaceToGoTo: null,
  soundToPlay: null
}

const handleActionBack = (actionBack) => {
  // console.warn('[handleActionBack] actionBack', actionBack)
  const actionBackLogics = {
    'INSTANCE_DESTROY': () => {
      return {
        ...baseReturn,
        instanceClassesToDestroy: actionBack.actionBackArguments
      }
    },
    'INSTANCE_CREATE': () => {
      const instancesToCreate = [
        {
          atomId: actionBack.actionBackArguments[0],
          x: actionBack.actionBackArguments[1],
          y: actionBack.actionBackArguments[2],
          z: 0
        }
      ]
      return {
        ...baseReturn,
        instancesToCreate,
      }
    },
    'INSTANCE_SET_IMAGE': () => {
      return {
        ...baseReturn,
        imageToSet: actionBack.actionBackArguments[0]
      }
    },
    'SPACE_GO': () => {
      return {
        ...baseReturn,
        spaceToGoTo: actionBack.actionBackArguments[0]
      }
    },
    'SOUND_PLAY': () => {
      return {
        ...baseReturn,
        soundToPlay: {
          soundToPlay: actionBack.actionBackArguments[0],
          doLoop: actionBack.actionBackArguments[1]
        }
      }
    }
  }
  const actionBackLogic = actionBackLogics[actionBack.actionBack]
  if (typeof actionBackLogic !== 'function') {
    throw new Error('unsupported actionBack type; this is quite bad')
  }
  return actionBackLogic()
}

export default handleActionBack
