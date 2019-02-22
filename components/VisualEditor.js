var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')
const Sortable = require('sortablejs');
const slugify = require('slugify');
const yaml = require('js-yaml');
const helpers = require('../helpers');


class VisualEditor extends Component {
  constructor (id, state, emit, _editFeatureModal) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
    this.editFeatureModal = _editFeatureModal;
  }

  
  createElement () {
    const {json} = this.state.workspace;
    if(!json || !json.features){ return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`}

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
            <button class="bn bg-transparent mt4" onclick="${openEditModal(json.clientId, json.clientId, this.editFeatureModal, this.state, this.emit)}">✎</button>
          </div>
          
          <p class="f3 lh-copy mt0 mb2">${description ||  "No list description yet"}</p>
        </header>
        <section class="w-100">
          ${createList(json, addFeatureButton(json, buttonType, this.state, this.emit), this.editFeatureModal, this.state, this.emit)}
        </section>
      </div>
    `
  }

  load(el){
    // run makeSortable
    makeSortable(el, this.state, this.emit)

  }

  afterupdate(el){
    console.log(el);
    makeSortable(el, this.state, this.emit)
  }

  update (el) {
    return true
  }
}

module.exports = VisualEditor


// helper functions

function openEditModal(parentid, featureid, editFeatureModal, state, emit){
  return e => {
    console.log("opening edit modal for", featureid);
    editFeatureModal.displayed = 'flex';
    let selectedItem = helpers.findFeature(state.workspace.json, featureid);
    editFeatureModal.render(selectedItem);
  }
}

function createlistItem(parentObject, feature, editFeatureModal, state, emit){
  return html`

  <li class="item pa2 ba bw1 mb1 mt1 bg-white" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
    <div class="w-100 flex flex-row justify-between items-start">
      <a class="link underline black f7 b" href="${feature.url}">${feature.name}</a>
      <button class="bn bg-transparent" onclick="${openEditModal(parentObject.clientId, feature.clientId, editFeatureModal, state, emit)}">✎</button>
    </div>
    <p class="ma0 f7">${feature.description}</p>
  </li>
  `
}

function createList(parentObject, addFeatureBtn, editFeatureModal, state, emit){
  const {features} = parentObject;
  return html`
  <ul class="list pl0 list-container">
    ${
      features.map(feature => {
        if(feature.hasOwnProperty('features')){
          return html`
            <li class="item mt2 mb4" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
              <fieldset class="ba b bw2 bg-light-green b--dark-pink dropshadow">
                <legend class="bg-white ba bw2 b--dark-pink pl2 pr2">${feature.name} <button class="bn bg-transparent" onclick="${openEditModal(parentObject.clientId, feature.clientId, editFeatureModal, state, emit)}">✎</button></legend>
                <p class="ma0 pl2 mb3">${feature.description}</p>
                ${createList(feature, addFeatureButton(feature, 'link', state, emit), editFeatureModal, state, emit)}
              </fieldset>
            </li>
          `
        }
        return createlistItem(parentObject, feature, editFeatureModal, state, emit);
      })
    }
    ${addFeatureBtn}
  </ul>
  `

}

function addFeatureButton(parentObject, featureToAdd, state, emit){
  return html`
  <button class="w-100 h2 bn bg-pink f7 mt2" 
  onclick="${addFeature(parentObject.clientId, featureToAdd, state, emit)}">add</button>
  `
}


function addFeature(_parentid, featureToAdd, state, emit){

  return e => {
    console.log("adding feature to", _parentid)
    let featureType = "link";

    let newFeature = {}

    let newLink = {
      url: "#",
      name: "New URL!",
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

    let newParent = helpers.pushNewFeature(state.workspace.json, _parentid, newFeature);
    const cleanJson = helpers.removeClientId(newParent)
    // state.workspace.json = _payload;
    const newYaml = yaml.safeDump(cleanJson, {'noRefs': true});
    state.workspace.yaml = newYaml
    state.workspace.json = newParent
    emit("json:addClientId", state.workspace.json)
    emit(state.events.RENDER)
  }
}


function makeSortable(el, state, emit){
  const nestedSortables = [].slice.call(document.querySelectorAll('.list-container'));

  const sortableConfig = {
    animation: 150,
    draggable: ".item",
    onEnd: updateWorkspace(state, emit)
  }

  nestedSortables.forEach( feature => {
    new Sortable( feature, sortableConfig);
  })

}


function updateWorkspace(state, emit){
  return e => {
    const {parentid} = e.clone.dataset;

    let newJson = helpers.moveFeature(state.workspace.json, parentid,  e.oldIndex, e.newIndex )

    state.workspace.json = newJson;
    let cleanJson = helpers.removeClientId(newJson)

    state.workspace.yaml = yaml.safeDump(cleanJson , {'noRefs': true});
    emit("json:addClientId", state.workspace.json)
    emit('render');
          
  }
}