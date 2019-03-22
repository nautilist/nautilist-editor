var Component = require('choo/component')
var html = require('choo/html')

class NavSelect extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      selectedValue:''
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleRouteUpdate = this.handleRouteUpdate.bind(this);
    // this.setSelected = this.setSelected.bind(this);
  }

  handleRouteUpdate(){
    this.local.selectedValue = `/${this.state.route}`
  }
  

  handleSelectChange(e){
    console.log()
    this.emit('pushState', e.currentTarget.value)
  }

  createElement () {
    return html`
    <select id="selectChange" class="input-reset bn  pl1 pr1 h2 f5 underline" onchange=${this.handleSelectChange}>
      <option name="projects" value="/projects">Projects ▾</option>
      <option name="collections" value="/collections">Collections ▾</option>
      <option name="users" value="/users">Users ▾</option>
    </select> 
    `
  }

  update () {
    // e.value = `/${this.state.route}`
    this.handleRouteUpdate();
    return true
  }

  afterupdate(el){
    el.value = `/${this.state.route}`
    el.childNodes.forEach( (item, idx) => {
      if(item.value == el.value){
        console.log('true')
        el.selectedIndex = idx;
      }
    })
  }
  

  load(el){
    el.value = `/${this.state.route}`
  }

}

module.exports = NavSelect