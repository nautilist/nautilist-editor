var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs')
const EditorSearchBar = require('./EditorSearchBar');
const helpers = require('../../helpers');
const EditFeatureBtn = require('./EditFeatureBtn')

class EditorSidebar extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      currentSelection: '',
      fetchSelected: this.fetchSelected.bind(this)
    }
    
    this.buildList = this.buildList.bind(this);
    this.makeSortable = this.makeSortable.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  fetchSelected(data, state, emit){
    return e=> {
      switch(data){
        case 'links':
          state.workspace.currentTab = 'links'
          this.local.currentSelection = 'links'
          emit('fetch-links', {});
          break;
        case 'projects':
          state.workspace.currentTab = 'projects'
          this.local.currentSelection = 'projects'
          emit('fetch-projects', {});
          break;
        case 'collections':
          state.workspace.currentTab = 'collections'
          this.local.currentSelection = 'collections'
          emit('fetch-collections', {});
          break
        default:
          return [];
      }
    }
  }

  // TODO: remove by removing from the data array
  removeItem(state, emit){
    
    return e => {
      let {childNodes} = state.workspace
      let rm = confirm('are you sure you want to remove this?')
        
      let newChildNodes = childNodes.filter(item => {
        return item.id !== e.target.parentElement.parentElement.id
      })

      state.workspace.childNodes = newChildNodes
      e.target.parentElement.parentElement.remove()

    }
    
  }

  buildList(){
    const {currentTab} = this.state.workspace
    
    if(!this.state[currentTab].length > 0){
      this.fetchSelected(currentTab)
    }
           

    return this.state[currentTab].map(feat => {
      
      function createWorkspaceView(feat){
        if(currentTab == 'projects'){
          return html`
          <section data-features="true" class="dn workspace-view">
            ${helpers.createList(feat.json)}
          </section>
          `
        }
      }

      return html`
        <li class="f7 w-100 dropshadow list mb2 ba bw1 pa2" data-db="${currentTab}" id="${feat._id}" 
          style="border-color:${feat.colors[feat.selectedColor]};">
          <div class="w-100 flex flex-row justify-end">
            ${EditFeatureBtn(this.state, this.emit, feat)}
            <button class="bn underline workspace-view dn" 
            onclick=${this.removeItem(this.state, this.emit)}>remove</button>
            </div>
          <h4 data-name="${feat.name}" class="ma0 f7 b">${feat.name}</h4>
          <small class="f7">by ${feat.ownerDetails.username}</small>
          <p data-description="${feat.description}" class="mt2 f7">${feat.description}</p>
          ${createWorkspaceView(feat)}
        </li>
      `
    })
    
  }

  // triggers the add feature modal
  addFeature(data, state, emit){
    
    return e => {
      switch(data){
        case 'links':
          state.workspace.currentTab = 'links'
          this.local.currentSelection = 'links'
          state.components.AddFeatureModal.open();
          break;
        case 'projects':
          state.workspace.currentTab = 'projects'
          this.local.currentSelection = 'projects'
          state.components.AddFeatureModal.open();
          break;
        case 'collections':
          state.workspace.currentTab = 'collections'
          this.local.currentSelection = 'collections'
          state.components.AddFeatureModal.open();
          break;
      }
    }
  }

  makeSortable(){
    let sortableEl = html`
      <ul class="w-100 pa2 pl0 overflow-scroll-y list">
        ${this.buildList()}
      </ul>
    `

    let sortable =  new Sortable(sortableEl, {
      group: {
          name: 'shared',
          pull: 'clone',
          put:false
      },
      animation: 150
    });
    return sortable.el
  }

  createElement () {

    function showSelected(currentSelection, selection){
      if(currentSelection === selection){
        return 'bg-dark-pink white'
      } else{
        return 'bg-near-white navy'
      }
    }

    console.log(this.state.workspace.currentTab)

    return html`
      <div class="bn bw1 b--black w-100 h-100 pa2">
      <ul class="pl0 list w-100 flex flex-row justify-center ma0">
        <li class="mr2 w-third"><button class="w-100 f7 bn dropshadow pa2 ${showSelected(this.local.currentSelection, 'links')}"
          onclick=${this.fetchSelected('links', this.state, this.emit)}>links</button></li>
        <li class="mr2 w-third"><button class="w-100 f7 bn dropshadow pa2 ${showSelected(this.local.currentSelection, 'projects')}"
          onclick=${this.fetchSelected('projects', this.state, this.emit)}>projects</button></li>
        <li class="w-third"><button class="w-100 f7 bn dropshadow pa2 ${showSelected(this.local.currentSelection, 'collections')}"
          onclick=${this.fetchSelected('collections', this.state, this.emit)}>collections</button></li>
      </ul>
      <p><button class="ba b--white w-100 h2 dropshadow bg-light-green" onclick=${this.addFeature(this.local.currentSelection, this.state, this.emit)}>add new</button></p>
      <form class="w-100 mt3 shadow-5">
      <input class="w-100 ba bw1 b--green f7 pa2" type="search" placeholder="search">
      </form>
      <p class="pa2 tc ma0 f7">drag and drop these items into your workspace</p>
      <div class="w-100">
        ${this.makeSortable()}
      </div>
    </div>
    `
  }

  update () {
    return true
  }

  load(){
    this.fetchSelected('links', this.state, this.emit).call()
  }
}

module.exports = EditorSidebar;