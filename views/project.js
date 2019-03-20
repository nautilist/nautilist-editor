var html = require('choo/html')
const copy = require('clipboard-copy')
const feathersClient = require('../helpers/feathersClient');
const AddToCollectionModal = require("../components/AddToCollectionModal");

module.exports = view

function openInEditor(state,emit){
  return e => {
    console.log("opening in editor")
    // TODO: set this in another way?
    state.workspace._id = state.selectedProject._id
    // get the selectedProject.json
    emit(state.events.workspace_all_update, state.selectedProject.json);
    // then render!
    emit('pushState', '/');
  }
}

function deleteFeature(state, emit){
  
  function deleteProject(e){
    let {_id} = state.selectedProject
    let del = confirm("do you really want to delete this?");
      if(del === true){
        feathersClient.service("/api/projects").remove(_id).then(result => {
          alert("project deleted!")
          emit('pushState', '/projects');
        }).catch(err => {
          alert(err);
        })    
      } else {
        return;
      }
  }

  if(state.user.authenticated === true){
    if(state.selectedProject.hasOwnProperty("ownerDetails") && state.selectedProject.ownerDetails.username == state.user.username ){
      return html`
      <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-orange navy" onclick=${deleteProject}>Delete Project</button></li>
      `
    } else{
      return ``
    }
  }
}

function saveToLists(state,emit){
  return e => {
    console.log("creating a copy and saving to lists")
    let payload = {
        html:'',
        md: state.selectedProject.md,
        json: state.selectedProject.json,
        name: state.selectedProject.name,
        description: state.selectedProject.description
      }
      
      feathersClient.service('/api/projects').create(payload).then(result => {
        alert(`${result.name} - was saved to your projects!`)
      }).catch(err => {
        alert(err)
        return err;
      })

  }
}

function copyMarkdown(state, emit){
  return e=>{
    console.log("copying markdown")
    copy(state.selectedProject.md);
    /* Alert the copied text */
    alert("Copied the text: " + state.selectedProject.md);
  }
}

function addToCollection(state,emit, modal){
  return e=>{
    console.log("opening add to group modal")
    modal.open();
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
  const addToCollectionModal = new AddToCollectionModal("AddToCollectionModal", state, emit)
  let selectedProject = state.selectedProject;

  function checkOwner(project){
    if(project.hasOwnProperty('owner')){
      return html`<a class="link black underline" href="/users/${project.ownerDetails.username}">${project.ownerDetails.username}</a>`
    } else {
      return '🤖'
    }
  }

  return html`
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-project', state.params.id)}>
    <div class="w-100 flex flex-column h-100 pl2 pr2">
            <div class="w-100 pt3 pb2 ">
              <a class="link black underline pointer" href="/projects">Back to Projects</a>
            </div>
        <section class="w-100 h-auto flex flex-row pb4">
            <section class="w-70 h-100 pr2">
                <div class="w-100 h-100 pl2 pr2 bg-washed-red">
                  <header class="w-100 flex flex-column pl2 pr2">
                    <div class="w-100 flex flex-column">
                      <h1 class="f2 lh-title mb0">${selectedProject.name || "No list name yet"}</h1>
                      <small class="ma0">created by ${checkOwner(selectedProject)} </small>
                    </div>
                    
                    <p class="f5 lh-copy mt0 mb2">${selectedProject.description ||  "No list description yet"}</p>
                  </header>
                  <section class="w-100">
                    ${createList(selectedProject.json)}
                  </section>
                </div>
            </section>
            <section class="w-30 h-100">
                <div class="bn bg-light-gray br2 w-100 pa2 h-100">
                    <section>
                        <h3 class="">Use or Remix</h3>
                        <ul class="list pl0 flex flex-column items-start w-80">
                            <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-purple white" onclick="${openInEditor(state, emit)}">Open in Editor</button></li>
                            <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-navy yellow" onclick="${copyMarkdown(state, emit)}">Copy Markdown</button></li>
                        </ul>
                    </section>
                    <section>
                        <h3 class="">Organize</h3>
                        <ul class="list pl0 flex flex-column items-start w-80">
                            <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-yellow navy" onclick="${saveToLists(state, emit)}">Save to my projects</button></li>
                            <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-pink navy" onclick="${addToCollection(state, emit, addToCollectionModal)}">Add to collection</button></li>
                            ${deleteFeature(state, emit)}
                        </ul>
                    </section>    
                    <section class="w-100 dn">
                        <h3 class="">Suggest Links</h3>
                        <form class="w-100">
                            <fieldset class="w-100">
                                <legend>URL</legend>
                                <input type="text" class="w-100 pa2 f5">
                                <input type="submit" class="w-100 pa2 dropshadow bn mt2 bg-green" value="Send">
                            </fieldset>
                        </form>
                    </section>
                </div>
            </section>
            </section>
        </div>
        ${addToCollectionModal.render()}
  </body>
  `
}