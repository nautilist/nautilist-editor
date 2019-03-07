var html = require('choo/html')

module.exports = view

function goBack(state, emit){
  return e => {
    emit('popState');
  }
}

function createlistItem(feature){
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
  if(parentObject !== undefined){
  
    let {features} = parentObject;
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
        return createlistItem(feature);
      })
    }
  </ul>
  `
}
} // end createList

function view (state, emit) {
  
  let selectedProject = state.selectedProject;

  return html`
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-project', state.params.id)}>
    <div class="w-100">
      <a href="/public">Back to Public</a>
    </div>
    
    <div class="w-100 flex flex-row">
            <section class="w-70 h-100 pr2">
                <div class="w-100 h-100 pl2 pr2 overflow-y-scroll bg-washed-red">
                  <header class="w-100 flex flex-column pl2 pr2">
                    <div class="w-100 flex flex-row justify-between items-start">
                      <h1 class="f2 lh-title mb0">${selectedProject.name || "No list name yet"}</h1>
                    </div>
                    
                    <p class="f3 lh-copy mt0 mb2">${selectedProject.description ||  "No list description yet"}</p>
                  </header>
                  <section class="w-100">
                    ${createList(selectedProject.json)}
                  </section>
                </div>
            </section>
            <section class="w-30">
                <div class="bn bg-light-gray br2 w-100 pa2">
                    <section>
                        <h3 class="">Actions</h3>
                        <ul class="list pl0 flex flex-column items-start">
                            <li class="mb2"><button class="pa2 bn dropshadow bg-purple white">Copy & Edit</button></li>
                            <li class="mb2"><button class="pa2 bn dropshadow bg-yellow navy">Save to lists</button></li>
                            <li class="mb2"><button class="pa2 bn dropshadow bg-navy yellow">Copy Markdown</button></li>
                            <li class="mb2"><button class="pa2 bn dropshadow bg-pink navy">Add to group</button></li>
                        </ul>
                    </section>    
                    <section class="w-100">
                        <form class="w-100">
                            <fieldset class="w-100">
                                <legend>URL</legend>
                                <input type="text" class="w-100 pa2 f5">
                            </fieldset>
                            <input type="submit" class="w-100 pa2 dropshadow bn mt2 bg-green" value="Suggest">
                        </form>
                    </section>
                </div>
            </section>
        </div>
  </body>
  `
}