var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')
const Sortable = require('sortablejs');
const slugify = require('slugify');
const yaml = require('js-yaml');
const helpers = require('../helpers');
const md2jt = require('../helpers/md2jt');


class VisualEditor extends Component {
  constructor (id, state, emit, _editFeatureModal) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
    this.editFeatureModal = _editFeatureModal;
    this.openEditModal = this.openEditModal.bind(this);
    this.editFeatureButton = this.editFeatureButton.bind(this);
    this.createlistItem = this.createlistItem.bind(this);
    this.createList = this.createList.bind(this);
    this.addFeatureButton = this.addFeatureButton.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.makeSortable = this.makeSortable.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.createNewParent = this.createNewParent.bind(this);
  }

  createNewParent(){
      let newFeature = {}
  
      let newLink = {
        url: "#",
        name: "New URL!",
        depth:"2", // need to add depth in helpers.pushNewFeature
        description: "A description for your new URL?"
      }
  
      newFeature = {
        type: "list",
        name: "New List Name",
        depth: 1,
        description: "New List Description",
        features:[
          newLink
        ]
      }

      const newParent = newFeature
      const cleanJson = helpers.removeClientId(newParent)

      const newMd = md2jt.json2md(cleanJson)
      // const newJson = md2jt.md2json(newMd)

      this.state.workspace.md = newMd
      // this.state.workspace.json = md2jt.md2json(newMd)
      this.state.workspace.json = newParent

      this.emit("json:addClientId", this.state.workspace.json)
      this.emit(this.state.events.RENDER)
  }
  
  createElement () {
    const {json} = this.state.workspace;
    if(!json || !json.features){ 
      return html`
        <div class="flex flex-row w-100 justify-center pa4">
        <button class="w-100 h2 bn bg-pink f7 mt2" 
        onclick="${this.createNewParent}">start new list</button>
        </div>
        `
    }

    const {features, name, description} = json;

    let isUrlList = features.every(items => items.hasOwnProperty('url'))
    console.log(isUrlList)
    let buttonType;
    if(isUrlList){
      buttonType = "link"
    } else{
      buttonType = "list"
    }

    return html`
      <div class="w-100 h-100 pl2 pr2 overflow-y-scroll bg-washed-red">
        <header class="w-100 flex flex-column pl2 pr2">
          <div class="w-100 flex flex-row justify-between items-start">
            <h1 class="f2 lh-title mb0">${name || "No list name yet"}</h1>
            <button class="bn bg-transparent mt4" onclick="${this.openEditModal(json.clientId, json.clientId)}">✎</button>
          </div>
          
          <p class="f6 lh-copy mt0 mb2">${description ||  "No list description yet"}</p>
        </header>
        <section class="w-100">
          ${this.createList(json, this.addFeatureButton(json, buttonType))}
        </section>
      </div>
    `
  }

  load(el){
    // when the dom mounts, but before render
    this.makeSortable(el)
  }

  afterupdate(el){
    // after each update, rerun sortable to make sure we can keep sorting!
    this.makeSortable(el)
  }

  update (el) {
    return true
  }


  // triggers opening the edit modal that is passed into this component
  openEditModal(parentid, featureid){
    return e => {
      console.log("opening edit modal for", featureid);
      this.editFeatureModal.displayed = 'flex';
      let selectedItem = helpers.findFeature(this.state.workspace.json, featureid);
      this.editFeatureModal.render(selectedItem);
    }
  } // end openEditModal

  editFeatureButton(parentid, featureid){
    return html`
      <button class="bn bg-transparent" onclick="${this.openEditModal(parentid, featureid)}">✎</button>
    `
  } // end editFeatureButton
  

  createlistItem(parentObject, feature){
    return html`
    <li class="item pa2 ba bw1 mb1 mt1 bg-white" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
      <div class="w-100 flex flex-row justify-between items-start">
        <a class="link underline black f7 b" href="${feature.url}">${feature.name}</a>
        ${this.editFeatureButton(parentObject.clientId, feature.clientId)}
      </div>
      <p class="ma0 f7">${feature.description}</p>
    </li>
    `
  } // end createListItem

  

  addFeature(_parentid, featureToAdd){
    return e => {
      console.log("adding feature to", _parentid)
      let featureType = "link";
  
      let newFeature = {}
  
      let newLink = {
        url: "#",
        name: "New URL!",
        depth:"", // need to add depth in helpers.pushNewFeature
        description: "A description for your new URL?"
      }
  
      if(featureToAdd == "link"){
        newFeature = newLink;
      } else if (featureToAdd == "list") {
        newFeature = {
          type: "list",
          name: "New List Name",
          description: "New List Description",
          features:[
            newLink
          ]
        }
      }
  
      const newParent = helpers.pushNewFeature(this.state.workspace.json, _parentid, newFeature);
      const cleanJson = helpers.removeClientId(newParent)

      const newMd = md2jt.json2md(cleanJson)
      // const newJson = md2jt.md2json(newMd)

      this.state.workspace.md = newMd
      // this.state.workspace.json = md2jt.md2json(newMd)
      this.state.workspace.json = newParent

      this.emit("json:addClientId", this.state.workspace.json)
      this.emit(this.state.events.RENDER)
    }
  }

  addFeatureButton(parentObject, featureToAdd){
    return html`
    <button class="w-100 h2 bn bg-pink f7 mt2" 
    onclick="${this.addFeature(parentObject.clientId, featureToAdd)}">add</button>
    `
  } // end addFeatureButton

  createList(parentObject, addFeatureBtn){
    const {features} = parentObject;

    return html`
    <ul class="list pl0 list-container">
      ${
        features.map(feature => {
          if(feature.hasOwnProperty('features')){
            return html`
              <li class="item mt2 mb4" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
                <fieldset class="ba b bw2 bg-light-green b--dark-pink dropshadow">
                  <legend class="bg-white ba bw2 b--dark-pink pl2 pr2">${feature.name} ${this.editFeatureButton(parentObject.clientId, feature.clientId)}</legend>
                  <p class="ma0 pl2 mb3">${feature.description}</p>
                  ${this.createList(feature, this.addFeatureButton(feature, 'link'))}
                </fieldset>
              </li>
            `
          }
          return this.createlistItem(parentObject, feature);
        })
      }
      ${addFeatureBtn}
    </ul>
    `
  } // end createList


  makeSortable(el){
    const nestedSortables = [].slice.call(document.querySelectorAll('.list-container'));
  
    const sortableConfig = {
      animation: 150,
      draggable: ".item",
      onEnd: this.handleSorting(this.state, this.emit)
    }
  
    nestedSortables.forEach( feature => {
      new Sortable( feature, sortableConfig);
    })

  } // end makeSortable

  handleSorting(state, emit){
    return e => {
      const {parentid} = e.clone.dataset;
  
      let newJson = helpers.moveFeature(state.workspace.json, parentid,  e.oldIndex, e.newIndex )
  
      state.workspace.json = newJson;
      let cleanJson = helpers.removeClientId(newJson)
  
      state.workspace.md = md2jt.json2md(cleanJson)
      emit("json:addClientId", state.workspace.json)
      emit('render');    
    }
  } // end handleSorting



} // end component

module.exports = VisualEditor