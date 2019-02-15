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

    let nestedSortables = [].slice.call(document.querySelectorAll('.list-container'));

    function removeClientId(_json){
      let newObj = Object.assign({}, _json)
      delete newObj.clientId
      newObj.features.forEach( item => {
        if(item.hasOwnProperty('features')){
          item.features.forEach(subItem =>  {delete subItem.clientId})
        }
        delete item.clientId
      });
      return newObj
    }
    
    
    for (var i = 0; i < nestedSortables.length; i++) {
      new Sortable(nestedSortables[i], {
        animation: 150,
        draggable: ".item",
        onEnd: (evt) => {
          // console.log("sortable", evt.newIndex);
          // this.emit("test", evt.newIndex)
          // const payload = Object.assign({newPosition: evt.newIndex, oldPosition: evt.oldIndex}, evt.clone.dataset)
          let newJson = Object.assign({}, this.state.workspace.json);

          let parentObject, parentIndex;

          if(evt.clone.dataset.parentid === newJson.clientId){
            parentObject = newJson;
            moveVal(parentObject.features, evt.oldIndex, evt.newIndex); 
            newJson.features = parentObject.features;
          } else {
            // first find the parent array
            parentObject = newJson.features.find(item => {
              return item.clientId == evt.clone.dataset.parentid;
            });

            parentIndex = newJson.features.findIndex(item => {
              return item.clientId  == evt.clone.dataset.parentid;;
            })
            moveVal(parentObject.features, evt.oldIndex, evt.newIndex); 
            newJson.features[parentIndex].features = parentObject.features;
          }

          console.log(newJson)
          this.state.workspace.json = newJson;

          // clean json
          const cleanJson = removeClientId(newJson)
          this.state.workspace.yaml = yaml.safeDump(cleanJson , {'noRefs': true});
          this.emit("json:addClientId")
          this.emit('render');
          
      }
      });
    }
  }

  update () {
    return true
  }
}

module.exports = VisualEditor


  // createSortable(_newList, state, emit){
  //   let newList, sortableList;
  //     sortableList = Sortable.create(_newList, {
  //       animation: 150,
  //       fallbackOnBody: true,
  //       onEnd: function(evt){
  //         console.log("sortable", evt.newIndex);
  //         console.log("🌮🌮🌮", evt.clone.dataset.parentname);
  //         const payload = Object.assign({newPosition: evt.newIndex}, evt.clone.dataset)

  //         emit(state.events.workspace_json_reorder, payload)
  //       }
  //     });
  
  //     return sortableList.el;
  // }
  
  // function renderUrl(feature, parentName){
  //   return html`
  //     <div class="w-100 flex flex-column ba bw1 mt2 item" data-parentname="${parentName}" data-featurename="${slugify(feature.name)}">
  //       <!-- url -->
  //       <div class="w-100 pl2 pr2 bg-light-green truncate">
  //         <small class="ma0 small">${feature.url}</small>
  //       </div>
  //       <!-- link details -->
  //       <div class="w-100 flex flex-row">
  //         <!-- link name -->
  //         <div class="w-40 pa2">
  //           <p class="f6 b ma0"> <a class="link black" href="${feature.url}" target="_blank">${feature.name} </a></p>
  //         </div>
  //         <!-- link description -->
  //         <div class="w-60 pl2 pa2">
  //           <p class="f6 ma0">${feature.description}</p>
  //         </div>
  //       </div>
  //     </div>
  //   `
  // }
  