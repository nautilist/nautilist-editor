var Component = require('choo/component')
var html = require('choo/html')

class EditorMenu extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  createElement () {
    return html`
      <div>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = EditorMenu