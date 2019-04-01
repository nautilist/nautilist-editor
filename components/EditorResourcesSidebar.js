var Component = require('choo/component')
var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
const Sortable = require('sortablejs')

class EditorResourcesSidebar extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      currentSelection: ''
    }
    this.fetchSelected = this.fetchSelected.bind(this);
    this.buildList = this.buildList.bind(this);
    this.makeSortable = this.makeSortable.bind(this);
    this.addFeature = this.addFeature.bind(this);
  }

  fetchSelected(data, state, emit){
    return e=> {
    switch(data){
      case 'links':
        feathersClient.service('/api/links').find({}).then(result =>{
          state.links = result.data
          state.editor.currentTab = 'links'
          this.local.currentSelection = 'links'
          emit('render');
        }).catch(err => {
          alert(err)
        })
        break;
      case 'projects':
        feathersClient.service('/api/projects').find({}).then(result =>{
          state.projects = result.data
          state.editor.currentTab = 'projects'
          this.local.currentSelection = 'projects'
          emit('render');
        }).catch(err => {
          alert(err)
        })
        break;
      case 'collections':
        feathersClient.service('/api/collections').find({}).then(result =>{
          state.collections = result.data
          state.editor.currentTab = 'collections'
          this.local.currentSelection = 'collections'
          emit('render');
        }).catch(err => {
          alert(err)
        })
        break
      default:
        return [];
        break
    }

    }
  }

  buildList(){
    const {currentTab} = this.state.editor
    if(!this.state[currentTab].length > 0){
      this.fetchSelected(currentTab)
    } 

    function removeItem(){
      return e=>{
        e.target.parentElement.remove()
        console.log(e.target)
      }
        
    }

    return this.state[currentTab].map(feat => {
      return html`
        <li class="f7 w-100 dropshadow list mb2 ba bw1 pa2" id="${feat._id}" style="border-color:${feat.colors[feat.selectedColor]}">
          <h4 class="ma0 f7 b">${feat.name}</h4>
          <small class="f7">by ${feat.ownerDetails.username}</small>
          <p class="ma0 f7">${feat.description}</p>
          <button class="workspace-view dn" onclick=${removeItem()}>remove</button>

          <section class="dn workspace-view">
            <p>I'm a bunch of really awesome details!</p>
            <p>${currentTab == 'projects' ? createList(feat.json) : ''}</p>
          </section>
        </li>
      `
    })
    
  }

  // triggers the add feature modal
  addFeature(data, state, emit){
    
    return e => {
      switch(data){
        case 'links':
          state.editor.currentTab = 'links'
          this.local.currentSelection = 'links'
          state.components.AddFeatureModal.open();
          break;
        case 'projects':
          state.editor.currentTab = 'projects'
          this.local.currentSelection = 'projects'
          state.components.AddFeatureModal.open();
          break;
        case 'collections':
          state.editor.currentTab = 'collections'
          this.local.currentSelection = 'collections'
          state.components.AddFeatureModal.open();
          break;
      }
    }
  }

  makeSortable(){
    let sortableEl = html`
      <ul class="w-100 pa2 pl0 overflow-scroll-y list ">
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
    return html`
      <div class="bn bw1 b--black w-100 h-100 pa2 shadow-5">
      <ul class="pl0 list w-100 flex flex-row justify-center ma0">
        <li class="mr2"><button class="f7 bn dropshadow pa2"
          onclick=${this.fetchSelected('links', this.state, this.emit)}>links</button></li>
        <li class="mr2"><button class="f7 bn dropshadow pa2"
          onclick=${this.fetchSelected('projects', this.state, this.emit)}>projects</button></li>
        <li class=""><button class="f7 bn dropshadow pa2"
          onclick=${this.fetchSelected('collections', this.state, this.emit)}>collections</button></li>
      </ul>
      <form class="w-100 mt3 shadow-5">
      <input class="w-100 ba bw1 b--green f7 pa2" type="search" placeholder="search">
      </form>
      <p><button class="ba w-100 h2 dropshadow bg-light-green" onclick=${this.addFeature(this.local.currentSelection, this.state, this.emit)}>add new</button></p>
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

module.exports = EditorResourcesSidebar

function createlistItem(parentObject, feature){
  return html`
  <li class="item pa2 ba bw1 mb1 mt1 bg-white">
    <div class="w-100 flex flex-row justify-between items-start">
      <a class="link underline black f7 b" href="${feature.url}">${feature.name}</a>
    </div>
    <p class="ma0 f7">${feature.description}</p>
  </li>
  `
} // end createListItem

function createList(parentObject){
  const {features} = parentObject;

  return html`
  <ul class="list pl0 list-container">
    ${
      features.map(feature => {
        if(feature.hasOwnProperty('features')){
          return html`
            <li class="item mt2 mb4">
              <fieldset class="ba b bw2 bg-light-green b--dark-pink dropshadow">
                <legend class="bg-white ba bw2 b--dark-pink pl2 pr2">${feature.name}</legend>
                <p class="ma0 pl2 mb3">${feature.description}</p>
                ${createList(feature)}
              </fieldset>
            </li>
          `
        }
        return createlistItem(parentObject, feature);
      })
    }
  </ul>
  `
} // end createList