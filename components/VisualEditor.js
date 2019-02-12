var Component = require('choo/component')
var html = require('choo/html')
var css = require('sheetify')

css`
.small{
  font-size:9px;
}
`

function createUrlList(_urlList){
  // recursion!
  console.log("running!")
  return _urlList.map(feature => {
    if(feature.hasOwnProperty('features')){
      return html`
      <fieldset class="ba b--dark-pink bw2">
        <legend>List</legend>
      ${createUrlList(feature.features)}
      </fieldset>
      `
    } else {
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
    }
  })
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
    return html`
      <div class="w-100 h-100 pl2 pr2">
        <header class="w-100 flex flex-column pl2 pr2">
          <h1 class="f1 lh-title mb0">${json.name}</h1>
          <p class="f2 lh-copy mt0 mb2">${json.description}</p>
        </header>
        <section class="w-100">
          ${createUrlList(json.features)}
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