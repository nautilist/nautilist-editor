var Component = require('choo/component')
var html = require('choo/html')
const UserContributionsMenu = require('./UserContributionsMenu');
const UserContributionCard = require('./UserContributionCard');


function renderItems(route,features){
  if(features.length <= 0){
    return 'none';
  }
  
  const items = features.map(feature => {
    return UserContributionCard(route,feature);
  })

  return html`
    <ul class="list w-100 pl0 mt4">
      ${items}
    </ul>
  `
}

class UserContributions extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      setSelectedTab: this.setSelectedTab.bind(this),
      currentTab: 'lists'
    }
    this.showCurrentSelection = this.showCurrentSelection.bind(this);
  }

  showCurrentSelection(){
    const{currentTab} = this.local;
    const currentItems = this.state.selectedUser[currentTab];
    return renderItems(currentTab, currentItems);
  }

  setSelectedTab(tab){
    switch(tab){
      case 'links':
        this.local.currentTab = tab;
        console.log('links')
        this.rerender();
        break;
      case 'lists':
        this.local.currentTab = tab;
        console.log('lists')
        this.rerender();
        break;
      case 'tracks':
        this.local.currentTab = tab;
        console.log('tracks')
        this.rerender();
        break;
      case 'collections':
        this.local.currentTab = tab;
        console.log('collect')
        this.rerender();
        break;
      default:
        break;
    }
  }

  createElement () {
    return html`
    <section class="w-100">
      ${this.state.cache(UserContributionsMenu, "UserContributionsMenu", this.state, this.emit).render()} 
      ${this.showCurrentSelection()}
    </section>
  `
  }

  update () {
    return true
  }
}

module.exports = UserContributions