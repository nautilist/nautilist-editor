var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')
const Sortable = require('sortablejs');
const slugify = require('slugify');


css`
.small{
  font-size:9px;
}
`




class VisualEditor extends Component {
  constructor (state, emit) {
    super()
    this.state = state;
    this.emit = emit;
    this.createSortable = this.createSortable.bind(this)
    this.createUrlList = this.createUrlList.bind(this)
    // this.local = state.components[id] = {}
  }

  createUrlList(_json){
    const {features, name, description} = _json;
    const parentName = slugify(name);
  
    // if there's no data, then return null
    if(typeof features !== "object" || features == null){
      return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`
    }
  
    // recursion!
    console.log("running!")
    return html`
    <section>
    ${
      features.map(feature => {
        if(feature.hasOwnProperty('features')){
          return html`
          <fieldset class="ba b--dark-pink bw2">
            <legend>${feature.name}</legend>
            <small>${feature.description}</small>
          ${this.createSortable(this.createUrlList(feature), this.state, this.emit ) }
          </fieldset>
          `
        } else {
          return html`
          <div class="w-100 flex flex-column ba bw1 mt2" data-parentname="${parentName}" data-featurename="${slugify(feature.name)}">
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

  createSortable(_newList, state, emit){
    let newList, sortableList;
      sortableList = Sortable.create(_newList, {
        onEnd: function(evt){
          console.log("sortable", evt.newIndex);
          console.log("🌮🌮🌮", evt.clone.dataset.parentname);
          // const payload = {
          //   parentBranchId: evt.clone.dataset.parentid,
          //   parentCollection: evt.clone.dataset.parentdb,
          //   recipeId: evt.clone.dataset.id,
          //   newRecipePosition: evt.newIndex
          // }

          const payload = Object.assign({newPosition: evt.newIndex}, evt.clone.dataset)
          emit(state.events.workspace_json_reorder, payload)
        }
      });
  
      return sortableList.el;
  }
  
  

  // ${JSON.stringify(this.state.workspace.json)}
  createElement () {
    const {json} = this.state.workspace;
    if(!json){ return html`<div class="flex flex-row w-100 justify-center mt4">No lists yet! 🏝</div>`}

    const mySortableList = this.createSortable( this.createUrlList(json), this.state, this.emit )

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