import uuid from 'uuid'

class Project {
  constructor (json = {}) {
    this.id = json.id || uuid()
    this.teamId = json.teamId || null
    this.createdAt = json.createdAt || Math.floor(new Date() / 1000)
    this.name = json.name || 'New Project'
  }

  toApi () {
    const json = {
      id: this.id,
      teamId: this.teamId,
      createdAt: this.createdAt,
      name: this.name
    }
    return JSON.parse(JSON.stringify(json))
  }

  toDatastore () {
    const json = {
      id: this.id,
      teamId: this.teamId,
      createdAt: this.createdAt,
      name: this.name
    }
    return JSON.parse(JSON.stringify(json))
  }

  fromApiPost (json) {
    if (typeof json.teamId !== 'string' || json.teamId.length === 0) {
      throw new Error('teamId is not valid')
    }
    if (typeof json.name !== 'string' || json.name.length === 0) {
      throw new Error('name is not valid')
    }
    this.teamId = json.teamId
    this.name = json.name
  }

  fromApiPatch (json) {
    this.name = (typeof json.name === 'string') ? json.name : this.name
  }

  clientFromApiGet (json) {
    this.id = json.id
    this.teamId = json.teamId
    this.createdAt = json.createdAt
    this.name = json.name
  }
}

export default Project