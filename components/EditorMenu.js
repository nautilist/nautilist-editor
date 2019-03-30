var Component = require('choo/component')
var html = require('choo/html')

class EditorMenu extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  createElement () {
    return html`
    <ul class="w-100 flex flex-row list justify-end pr2 pl2 pt2">
      <li class="pr2"><buttton class="h2 pa2 dropshadow bg-yellow navy">Save Project</button></li>
      <li class="pr2"><buttton class="h2 pa2 dropshadow bg-navy yellow">New Project</button></li>
      <li class="pr2"><buttton class="h2 pa2 dropshadow bg-white navy">Download</button></li>
      <li><buttton class="h2 pa2 dropshadow bg-white navy">Open</button></li>
    </ul>
    `
  }

  update () {
    return true
  }
}

module.exports = EditorMenu