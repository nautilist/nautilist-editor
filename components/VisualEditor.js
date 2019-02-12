var Component = require('choo/component')
var html = require('choo/html')

class VisualEditor extends Component {
  constructor () {
    super()
    // this.local = state.components[id] = {}
  }

  createElement () {
    return html`
      <div class="w-100 h-100">
      hello from Visual Editor!
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = VisualEditor