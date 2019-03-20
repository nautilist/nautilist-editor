var Component = require('choo/component')
var html = require('choo/html')

class NavSelect extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
    this.handleSelectChange = this.handleSelectChange.bind(this);
    // this.setSelected = this.setSelected.bind(this);
  }

  

  handleSelectChange(e){
    console.log()
    this.emit('pushState', e.currentTarget.value)
  }

  createElement () {
    return html`
    <select id="selectChange" class="bn bg-light-gray br2 br--right h2" onchange=${this.handleSelectChange}>
      <option name="projects" value="/projects">Projects</option>
      <option name="collections" value="/collections">Collections</option>
      <option name="users" value="/users">Users</option>
    </select> 
    `
  }

  update () {
    return false
  }

  load(e){
    e.value = `/${this.state.route}`
  }

}

module.exports = NavSelect