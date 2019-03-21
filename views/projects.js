var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
const ProjectModal = require('../components/ProjectModal');
const NavSelect = require('../components/NavSelect');
const NavbarTop = require("../components/NavbarTop");

module.exports = view


function view (state, emit) {
  const projectModal = new ProjectModal("ProjectModal", state, emit);

  function projectCard(project, projectModal){
  
    function handleRedirect(e){
      const {id, type} = e.currentTarget.dataset
      console.log('go to selected project!', id, type)
      emit('fetch-project',id);
    }
    function checkOwner(project){
      if(project.hasOwnProperty('owner')){
        return `${project.ownerDetails.username}`
      } else {
        return '🤖'
      }
    }

    function showCollaborators(project){
      if(project.collaboratorDetails.length > 0){
        return `+ ${project.collaboratorDetails.length} collaborators`
      }
      
    }

    const {name, description, _id, selectedColor, colors} = project;

    return html`
    <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/projects/${_id}">
    <div class="h-100 dropshadow br2 bg-near-white ma2" data-type="projects" data-id=${_id} onclick=${handleRedirect}>
      <header class="w-100 h3 br2 br--top" style="background-color:${colors[selectedColor]};"></header>
      <section class="pa2">
        <h3 class="ma0">${name}</h3>
        <small class="ma0">created by <a class="link black underline" href="/users/${project.ownerDetails.username}">${checkOwner(project)}</a> ${showCollaborators(project)}</small>
        <p class="ma0 truncate">${description}</p>
      </section>
    </div>
    </a>
    `
  }
  
  function makeProjectList(projects, projectModal){
    const projectCards = projects.map(project=>{
      return projectCard(project, projectModal)
    })
    
    if(projects.length > 0){
      return html`
      <div class="w-100">
        <div class="mw9 center ph3-ns h-100">
          ${projectCards}
        </div>
      </div>
    `
    } else {
      return html`<p>loading...</p>`
    }

    
  }

  function logout(){
    emit(state.events.user_logout);
  }

  function handleSelectChange(e){
    console.log()
    emit('pushState', e.currentTarget.value)
  }


  return html`
    <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-projects')}>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}

      <main class="w-100 pa4">
        <h1 class="tc">Check out these projects</h1>
        ${makeProjectList(state.projects, projectModal)}
      </main>
    </body>
    `
}

// ${projectModal.render()}   
