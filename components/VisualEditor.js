var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')
const Sortable = require('sortablejs');


css`
.small{
  font-size:9px;
}
`

function createUrlList(_urlList){
  // if there's no data, then return null
  if(typeof _urlList !== "object" || _urlList == null){
    return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`
  }

  // recursion!
  console.log("running!")
  return html`
  <section>
  ${
    _urlList.map(feature => {
      if(feature.hasOwnProperty('features')){
        return html`
        <fieldset class="ba b--dark-pink bw2">
          <legend>List</legend>
        ${createSortable(createUrlList(feature.features)) }
        </fieldset>
        `
      } else {
        return html`
        <div class="w-100 flex flex-column ba bw1 mt2">
          <!-- url -->
          <div class="w-100 pl2 pr2 bg-light-green truncate">
            <small class="ma0 small">${feature.url}</small>
          </div>
          <!-- link details -->
          <div class="w-100 flex flex-row">
            <div class="w-40 pa2">
              <p class="f6 b ma0"> <a class="link black" href="${feature.url}" target="_blank">${feature.name} </a></p>
            </div>
            <div class="w-60 pl2 pa2">
              <p class="f6 ma0">${feature.description}</p>
            </div>
          </div>
        </div>
        `
      }
    })
  }
  </section>
  `

}

function createSortable(_newList){
  let newList, sortableList;
    sortableList = Sortable.create(_newList, {
      onEnd: function(evt){
        console.log("sortable", evt.newIndex);
        // console.log("🌮🌮🌮",evt.clone.dataset.parentid, evt.clone.dataset.parentdb);
        // const payload = {
        //   parentBranchId: evt.clone.dataset.parentid,
        //   parentCollection: evt.clone.dataset.parentdb,
        //   recipeId: evt.clone.dataset.id,
        //   newRecipePosition: evt.newIndex
        // }
        // emit(state.events.projects_reorderRecipes, payload)
        // emit("db:selectedFeature:reorder", evt.clone.dataset.parentid, evt.clone.dataset.parentdb,  evt.clone.dataset.featureid, evt.newIndex)
      }
    });

    return sortableList.el;
}


class VisualEditor extends Component {
  constructor (state, emit) {
    super()
    this.state = state;
    this.emit = emit;
    // this.local = state.components[id] = {}
  }

  // ${JSON.stringify(this.state.workspace.json)}
  createElement () {
    const {json} = this.state.workspace;
    if(!json){ return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`}

    const mySortableList = createSortable( createUrlList(json.features) )

    return html`
      <div class="w-100 h-100 pl2 pr2 overflow-y-scroll">
        <header class="w-100 flex flex-column pl2 pr2">
          <h1 class="f1 lh-title mb0">${json.name || "Add an awesome list name"}</h1>
          <p class="f2 lh-copy mt0 mb2">${json.description ||  "Add an awesome list description"}</p>
        </header>
        <section class="w-100">
          ${mySortableList}
        </section>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = VisualEditor

/**
 * 
 * 
 * ${this.state.workspace.json.features.map( feature => {
            return html`
            <div class="w-100 flex flex-column ba bw1 mt2">
              <div class="w-100 pl2 pr2 bg-light-green truncate">
                <small class="ma0 small">${feature.url}</small>
              </div>
              <div class="w-100 flex flex-row">
                <div class="w-40 pa2">
                  <p class="f6 b ma0"> <a class="link black" href="${feature.url}" target="_blank">${feature.name} </a></p>
                </div>
                <p class="w-60 f6 pl2 ma0 pa2">${feature.description}</p>
              </div>
            </div>
            `
          })}
 */