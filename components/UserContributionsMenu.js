var Component = require('choo/component')
var html = require('choo/html')

class UserContributionsMenu extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      selectedTab:'lists'
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.showSelectedTab = this.showSelectedTab.bind(this);
  }

  showSelectedTab(tab){
    if(tab == this.local.selectedTab){
      return 'bg-dark-pink white'
    } else {
      return 'bg-near-white dark-pink'
    }
  }

  handleSelect(tab){
    return e=> {
      this.local.selectedTab = tab;
      this.state.components.UserContributions.setSelectedTab(tab);
      this.rerender()
    }
  }

  createElement () {
    return html`
    <menu class="pa0 mt4 reset-input w-100 flex flex-column">
      <ul class="list flex flex-row pa0">
        <li class="mr2">
          <button 
              class="${this.showSelectedTab('links')} bn pa2 dropshadow" 
              onclick=${this.handleSelect('links')}>links
          </button>
        </li>
        <li class="mr2">
          <button 
            class="${this.showSelectedTab('lists')} bn pa2 dropshadow" 
            onclick=${this.handleSelect('lists')}>lists
            </button>
          </li>
        <li class="dn mr2">
          <button 
            class="${this.showSelectedTab('tracks')} bn pa2 dropshadow" 
            onclick=${this.handleSelect('tracks')}>tracks
          </button>
        </li>
        <li class="dn mr2">
          <button 
            class="${this.showSelectedTab('collections')} bn pa2 dropshadow" 
            onclick=${this.handleSelect('collections')}>collections
          </button>
        </li>
      </ul>
    </menu>
  `
  }

  update () {
    return true
  }
}

module.exports = UserContributionsMenu