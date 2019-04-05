var Component = require('choo/component')
var html = require('choo/html')

class NavSearchBar extends Component {
  constructor (id, state, emit) {
    super(id);
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      searchTerm:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    this.local.searchTerm = e.target.value;
  }

  handleSubmit(state, emit){
    return e => {
      e.preventDefault();
      const payload= {
        searchTerm: this.local.searchTerm
      }
      emit('fetch-navsearch', payload);
    }
  }

  createElement () {
    return html`
      <form class="w-100 h-100 flex flex-row items-center" onsubmit=${this.handleSubmit(this.state, this.emit) }>
        <img class=" dropshadow bl bb bt bw1 b--dark-pink w2 h2" src="/assets/1F50E.png">
        <input class=" dropshadow w-100 ma0 h2 input-reset br bb bt bw1 b--dark-pink pa1 f7 i ba" type="search" value="${this.local.searchTerm}" onchange=${this.handleChange} placeholder="search: terms, users, etc">
      </form>
    `
  }

  update () {
    return true
  }
}

module.exports = NavSearchBar