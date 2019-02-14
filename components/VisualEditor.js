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

function renderUrl(feature, parentName){
  return html`
    <div class="w-100 flex flex-column ba bw1 mt2 item" data-parentname="${parentName}" data-featurename="${slugify(feature.name)}">
      <!-- url -->
      <div class="w-100 pl2 pr2 bg-light-green truncate">
        <small class="ma0 small">${feature.url}</small>
      </div>
      <!-- link details -->
      <div class="w-100 flex flex-row">
        <!-- link name -->
        <div class="w-40 pa2">
          <p class="f6 b ma0"> <a class="link black" href="${feature.url}" target="_blank">${feature.name} </a></p>
        </div>
        <!-- link description -->
        <div class="w-60 pl2 pa2">
          <p class="f6 ma0">${feature.description}</p>
        </div>
      </div>
    </div>
  `
}


class VisualEditor extends Component {
  constructor (state, emit) {
    super()
    this.state = state;
    this.emit = emit;
    // this.createSortable = this.createSortable.bind(this)
    // this.createUrlList = this.createUrlList.bind(this)
    // this.local = state.components[id] = {}
  }

  // createUrlList(_json, state, emit){
  //   console.log("from createUrlList", _json)
  //   const {features, name, description} = _json;
  //   const parentName = slugify(name);
  
  //   // if there's no data, then return null
  //   if(typeof features !== "object" || features == null){
  //     return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`
  //   }

  //   return html`
  //   <ul>
  //     ${
  //       features.map(feature => {
  //         let els;

  //         if(feature.hasOwnProperty("features")){
  //           let subParentName = slugify(feature.name);
  //           let nestedEls = html`
  //           <ul class="item"> 
  //           ${
  //             feature.features.map(nestedFeature => {
  //                 let nestedFeatureName = slugify(nestedFeature.name)
  //                 return html`
  //                   <li class="item" data-parentname="${subParentName}" data-featurename="${nestedFeatureName}">${nestedFeature.name}</li>
  //                 `
  //               })
  //             }
  //           </ul>
  //          `

  //          nestedEls = new Sortable(nestedEls, {
  //             animation:150, 
  //             draggable: ".item",
  //             fallbackOnBody: true,
  //             onEnd: (evt)=> {
  //               console.log("sortable", evt.newIndex);
  //               console.log("sortable", evt);
  //               console.log("🌮🌮🌮", evt.clone.dataset.parentname);
  //               const payload = Object.assign({newPosition: evt.newIndex, oldPosition: evt.oldIndex}, evt.clone.dataset)
  //               // emit(state.events.workspace_json_reorder, payload)
  //               console.log("yes!")
  //               emit(state.events.workspace_json_reorder, payload)
  //             }}).el
  //           // console.log(nestedEls)

  //           els = html`
  //             <li class="item-group" data-parentname="${parentName}">
  //               ${feature.name}
  //               ${nestedEls}
  //             </li>
  //           `
  //         } else{
  //           let featureName = slugify(feature.name)
  //           els = html`
  //           <li class="item" data-parentname="${parentName}" data-featurename="${featureName}">
  //             ${feature.name}
  //           </li>
  //           `
  //         }
          
  //         // return new Sortable(els, {animation: 150})
  //         return els
  //       })
  //     }
  //   </ul>
  //   `
  // }

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
  
  

  // ${JSON.stringify(this.state.workspace.json)}
  createElement () {
    const {json} = this.state.workspace;
    if(!json){ return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`}

    const {features, name} = json;

    return html`
      <div class="w-100 h-100 pl2 pr2 overflow-y-scroll">
        <header class="w-100 flex flex-column pl2 pr2">
          <h1 class="f1 lh-title mb0">${json.name || "Add an awesome list name"}</h1>
          <p class="f2 lh-copy mt0 mb2">${json.description ||  "Add an awesome list description"}</p>
        </header>
        <section class="w-100">
          <ul class="list-container">
            ${features.map( feature => {
              const subListExists = feature.hasOwnProperty("features")
              let subList = ''
              if(subListExists){
                subList = html`
                  <ul class="list-container">
                    ${feature.features.map(subFeature => {
                      return html`<li class="item" data-parentid="${feature.clientId}" data-featureid="${subFeature.clientId}">${subFeature.name}</li>`
                    })}
                  </ul>
                `
              }
              return html`
                <li class="item" data-parentid="${json.clientId}" data-featureid="${feature.clientId}">${feature.name}
                  ${subList}
                </li>
              `
            })}
          </ul>
        </section>
      </div>
    `
  }

  load(el){
    // const myLists = document.querySelector(".list-container")
    var nestedSortables = [].slice.call(document.querySelectorAll('.list-container'));

    // helper functions
    function moveVal(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
    };

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
          
          // this.emit(this.state.events.workspace_json_reorder, payload)
      }
      });
    }
  }

  update () {
    return true
  }
}

module.exports = VisualEditor


    // return html`
    // <fieldset class="ba b--dark-pink bw2" data-parentname="${parentName}" data-featurename="${slugify(feature.name)}">
    //   <legend>${feature.name}</legend>
    //   <small>${feature.description}</small>
    //   ${sortables}
    // </fieldset>
    // `
  
    // recursion!
    // console.log("running!")
    // return html`
    // <section>
    // ${
    //   features.map(feature => {
        
    //     if(feature.hasOwnProperty('features')){
    //       let sortables = html`
    //       <div>
    //         ${feature.features.map(item => {
    //           return renderUrl(item, slugify(feature.name) )
    //         })}
    //       </div>
    //       `
    //       // ${this.createSortable(sortables, this.state, this.emit)}
    //       return html`
    //       <fieldset class="ba b--dark-pink bw2" data-parentname="${parentName}" data-featurename="${slugify(feature.name)}">
    //         <legend>${feature.name}</legend>
    //         <small>${feature.description}</small>
    //         ${this.createSortable(sortables, this.state, this.emit)}
    //       </fieldset>
    //       `
    //     } else {
    //       return renderUrl(feature, parentName)
    //     }

    //   })

    // }
    // </section>
    // `