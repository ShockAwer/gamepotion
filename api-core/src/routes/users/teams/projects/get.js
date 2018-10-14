const errors = require('restify-errors')
const wiener = require('../../../../abstractions/datalayer')
const classFactory = require('../../../../classes/factory')

const route = (request, response, next) => {
  wiener.readOne('Projects', {id: request.params.id, teamId: request.authorization.user.teamId})
    .then(async object => {
      const c = classFactory.project(object)
      response.send(c.toApi())
      return next()
    })
    .catch((error) => {
      console.error('[route users teams projects get] datalayer.readOne caught', error)
      response.send(new errors.NotFoundError('this project doesnt exist or it doesnt belong to you'))
      return next(false)
    })
}

module.exports = route