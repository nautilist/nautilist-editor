var Component = require('choo/component')
var html = require('choo/html')

class VisualEditor extends Component {
  constructor (state, emit) {
    super()
    this.state = state;
    this.emit = emit;
    // this.local = state.components[id] = {}
  }

  createElement () {
    return html`
      <div class="w-100 h-100">
        ${JSON.stringify(this.state.workspace.json) }
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = VisualEditor