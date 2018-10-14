const errors = require('restify-errors')
const wiener = require('../../../../abstractions/datalayer')
const classFactory = require('../../../../classes/factory')

const route = (request, response, next) => {
  wiener.read('Projects', {teamId: request.authorization.user.teamId}, 'descending:createdAt')
    .then(objects => {
      const apiObjects = objects.map(object => {
        const c = classFactory.project(object)
        return c.toApi()
      })
      response.send(apiObjects)
      return next()
    })
    .catch(error => {
      console.error('[route users teams projects getAll] datalayer.read caught', error)
      response.send(new errors.InternalServerError('sorry'))
      return next(false)
    })
}

module.exports = route