const uuid = require('uuid/v4')
const Datastore = require('@google-cloud/datastore')
const datastore = new Datastore({
  projectId: 'thegmc-219013'
})

const WORK_LOCALLY = true

const jsons = {
  'Users': require('./sample-data/Users.json'),
  'Teams': require('./sample-data/Teams.json'),
  'Projects': require('./sample-data/Projects.json'),
  'Resources': require('./sample-data/Resources.json')
}

const write = (entity, id, data) => {
  if (WORK_LOCALLY === true) {
    // warning: not persisted to filesystem!
    jsons[entity].push(data)
    return Promise.resolve(true)
  } else {
    if (!id) {
      id = uuid()
    }
    const entities = {
      'Users': () => {
        return Object.keys(data).map($ => {
          return {
            name: $,
            value: data[$],
            excludeFromIndexes: ['name'].includes($)
          }
        })
      },
      'Teams': () => {
        return Object.keys(data).map($ => {
          return {
            name: $,
            value: data[$],
            excludeFromIndexes: ['name'].includes($)
          }
        })
      },
      'Projects': () => {
        return Object.keys(data).map($ => {
          return {
            name: $,
            value: data[$],
            excludeFromIndexes: ['name'].includes($)
          }
        })
      },
      'Resources': () => {
        return Object.keys(data).map($ => {
          return {
            name: $,
            value: data[$],
            excludeFromIndexes: ['name'].includes($)
          }
        })
      }
    }
    const key = datastore.key([entity, id])
    const foundEntity = entities[entity]
    if (foundEntity !== undefined) {
      const object = {
        key,
        data: foundEntity()
      }
      return datastore.save(object)
    } else {
      const object = {
        key,
        data
      }
      return datastore.save(object)
    }
  }
}

const readByKeys = (keys) => {
  return datastore.get(keys).then($ => $[0])
}

const read = (entity, queryObject, orderBy, select) => {
  if (WORK_LOCALLY === true) {
    return Promise.resolve(jsons[entity].filter($ => {
      return Object.keys(queryObject).every(queryObjectKey => {
        if (queryObject[queryObjectKey][0] === '<') {
          return ($[queryObjectKey] < parseInt(queryObject[queryObjectKey].substring(1), 10))
        } else if (queryObject[queryObjectKey][0] === '>') {
          return ($[queryObjectKey] > parseInt(queryObject[queryObjectKey].substring(1), 10))
        } else if (queryObject[queryObjectKey][0] === '!') {
          return ($[queryObjectKey] !== queryObject[queryObjectKey])
        } else {
          return ($[queryObjectKey] === queryObject[queryObjectKey])
        }
      })
    }))
  } else {
    const query = datastore.createQuery(entity)
    if (select !== undefined) {
      query.select(select)
    }
    Object.keys(queryObject).forEach($ => {
      if (typeof queryObject[$] === 'string' && queryObject[$][0] === '<') {
        query.filter($, '<', parseInt(queryObject[$].substring(1), 10))
      } else if (typeof queryObject[$] === 'string' && queryObject[$][0] === '>') {
        query.filter($, '>', parseInt(queryObject[$].substring(1), 10))
      } else if (typeof queryObject[$] === 'string' && queryObject[$][0] === '!') {
        throw new Error('you cant do a NOT EQUAL in real life; fuck you')
      } else {
        query.filter($, queryObject[$])
      }
    })
    if (orderBy !== undefined) {
      query.order(orderBy.indexOf('descending:') === 0 ? orderBy.substring('descending:'.length) : orderBy, {
        [orderBy.indexOf('descending:') === 0 ? 'descending' : 'ascending']: true
      })
    }
    return datastore
      .runQuery(query)
      .then(results => {
        // return results[0].map($ => {
        //   return $[datastore.KEY]
        // })
        return results[0]
      })
  }
}

const readOne = (entity, queryObject) => {
  // console.log('[datalayer] [readOne] entity/queryObject', entity, queryObject)
  if (WORK_LOCALLY === true) {
    const found = jsons[entity].find($ => {
      return Object.keys(queryObject).every(queryObjectKey => {
        return ($[queryObjectKey] === queryObject[queryObjectKey])
      })
    })
    return found ? Promise.resolve(found) : Promise.reject(new Error(`couldnt find ${entity}`))
  } else {
    const query = datastore.createQuery(entity)
    Object.keys(queryObject).forEach($ => {
      query.filter($, queryObject[$])
    })
    return datastore
      .runQuery(query)
      .then(results => {
        if (results[0].length === 0) {
          throw new Error(`couldnt find ${entity}`)
        } else {
          return results[0][0]
        }
      })
  }
}

const deleteOne = (entity, id) => {
  if (WORK_LOCALLY === true) {
    jsons[entity] = jsons[entity].filter($ => $.id !== id)
    return Promise.resolve(true)
  } else {
    const key = datastore.key([entity, id])
    return datastore.delete(key)
  }
}

module.exports = {
  write,
  read,
  readOne,
  readByKeys,
  deleteOne
}