var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')
const Sortable = require('sortablejs');
const slugify = require('slugify');
const yaml = require('js-yaml');


css`
.small{
  font-size:9px;
}
`

// helper functions
function moveVal(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
};

function createlistItem(parentObject, feature){
  return html`
  <li class="item pa2 ba bw1 mb1 mt1" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
    <a class="link underline black f7 b" href="${feature.url}">${feature.name}</a>
    <p class="ma0 f7">${feature.description}</p>
  </li>
  `
}

function createList(parentObject){
  const {features} = parentObject;

  return html`
  <ul class="list pl0 list-container">
    ${
      features.map(feature => {
        if(feature.hasOwnProperty('features')){
          return html`
            <li class="item mt2 mb2" data-parentid="${parentObject.clientId}" data-featureid="${feature.clientId}">
              <fieldset class="ba b bw1 b--dark-pink">
                <legend class="pl2 pr2">${feature.name}</legend>
                <p class="ma0 pl2">${feature.description}</p>
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

}

class VisualEditor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
    this.addLinkPlaceHolder = this.addLinkPlaceHolder.bind(this);
    this.addListPlaceholder = this.addListPlaceholder.bind(this);
  }

  addLinkPlaceHolder(e){
    console.log("adding link!")
  }

  addListPlaceholder(e){
    console.log("adding list!")
  }

  
  createElement () {
    const {json} = this.state.workspace;
    if(!json || !json.features){ return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`}

    const {features, name, description} = json;
    return html`
      <div class="w-100 h-100 pl2 pr2 overflow-y-scroll">
        <header class="w-100 flex flex-column pl2 pr2">
          <h1 class="f2 lh-title mb0">${name || "No list name yet"}</h1>
          <p class="f3 lh-copy mt0 mb2">${description ||  "No list description yet"}</p>
        </header>
        <section class="w-100">
          ${createList(json)}
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

function makeSortable(el, state, emit){
  const nestedSortables = [].slice.call(document.querySelectorAll('.list-container'));

  console.log(nestedSortables);

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
    let newJson = Object.assign({}, state.workspace.json);
    const {parentid} = e.clone.dataset;

    // First find the parent object
    let updatedList = findRecursive(newJson, parentid);
    moveVal(updatedList.features, e.oldIndex, e.newIndex);

    updateMain(newJson, updatedList, parentid)
    // console.log( JSON.stringify(newJson) )

    state.workspace.json = newJson;
    let cleanJson = Object.assign({}, newJson);

    cleanJson = removeClientId(cleanJson)
    // console.log(cleanJson)

    state.workspace.yaml = yaml.safeDump(cleanJson , {'noRefs': true});
    emit("json:addClientId")
    emit('render');

          
  }
}

function updateMain(_myList, _updatedList, _parentId){
  // update the data directly here!
  if(_myList.clientId === _parentId){
    _myList = _updatedList
    return _updatedList
  }
  let p;

  for(p in _myList){
    if(_myList.hasOwnProperty(p) && typeof _myList[p] === 'object'){
      _myList = updateMain(_myList[p], _updatedList, _parentId);

      if(_myList){
        return _myList
      }
    }
  }
  return _myList

}


function findRecursive(_myList, _parentId){
  const listCopy = Object.assign({}, _myList);
  let result;
  let p;

  // early return
  if(listCopy.clientId === _parentId){
    return listCopy;
  }
  
  for(p in listCopy){
    if(listCopy.hasOwnProperty(p) && typeof listCopy[p] === 'object'){
      result = findRecursive(listCopy[p], _parentId);
      
      if(result){
        return result;
      }
    }
  }
  return result

}


function removeClientId(_json){
  let newObj = _json
  // remove the top clientId
  delete newObj.clientId

  newObj.features.forEach(item => {
    if(item.hasOwnProperty('features')){
      removeClientId(item);
    }
    delete item.clientId
  })
  
  return newObj;
}