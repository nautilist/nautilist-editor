var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');

module.exports = view

function createlistItem(feature){
  return html`
  <li class="item w5 h5 pa2 ba bw1 mb1 mt1 bg-white mr1 ml1">
    <div class="w-100 flex flex-row justify-between items-start">
      <a class="link underline black f7 b" href="/projects/${feature._id}">${feature.name}</a>
    </div>
    <p class="ma0 f7">${feature.description}</p>
  </li>
  `
} // end createListItem

function createList(parentObject){
  if(parentObject !== undefined && parentObject.hasOwnProperty('projectsDetails') ){
  
    let {projectsDetails} = parentObject;
    return html`
    <ul class="list pl0 list-container flex flex-row flex-row-wrap">
      ${
        projectsDetails.map(project => {
            return createlistItem(project)
        })
      }
    </ul>
    `
  }
} // end createList

function view (state, emit) {
  let selectedCollection = state.selectedCollection;

  function checkOwner(project){
    if(project.hasOwnProperty('owner')){
      return html`<a class="link black underline" href="/users/${project.ownerDetails.username}">${project.ownerDetails.username}</a>`
    } else {
      return '🤖'
    }
  }

  return html`
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-collection', state.params.id)}>
    <div class="w-100 flex flex-column h-100 pl2 pr2">
            <div class="w-100 pt3 pb2 ">
              <a class="link black underline pointer" href="/collections">Back to Collections</a>
            </div>
        <section class="w-100 h-auto flex flex-row pb4">
            <section class="w-70 h-100 pr2">
                <div class="w-100 h-100 pl2 pr2 bg-washed-green">
                  <header class="w-100 flex flex-column pl2 pr2">
                    <div class="w-100 flex flex-column">
                      <h1 class="f2 lh-title mb0">${selectedCollection.name || "No collection name yet"}</h1>
                      <small class="ma0">created by ${checkOwner(selectedCollection)} </small>
                    </div>
                    
                    <p class="f5 lh-copy mt0 mb2">${selectedCollection.description ||  "No collection description yet"}</p>
                  </header>
                  <section class="w-100">
                  ${createList(selectedCollection)}
                  </section>
                </div>
            </section>    
        </section>
        </div>
  </body>
  `
}