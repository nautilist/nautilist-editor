var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
const ProjectModal = require('../components/ProjectModal');
const NavSelect = require('../components/NavSelect');

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

  function isAuthd(){
    if(state.user.authenticated === false){
      return html`<a class="mr3 black underline" href="/login">login</a>`
    }
    return html`<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/users/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  }

  function handleSelectChange(e){
    console.log()
    emit('pushState', e.currentTarget.value)
  }


  return html`
    <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-projects')}>
      <header class="pt3 pl2 pr2 pb2 w-100">
        <nav class="w-100 flex flex-row items-center justify-between">
          <div>
          <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/projects">Nautilist Projects</a>
          <a class="link black mr4 pointer" href="/">Editor</a>
          <input type="search" class="w5 h2 pa2 bn bg-light-gray dn" placeholder="🔎 search">
          ${state.cache(NavSelect, "NavSelect", state, emit).render()}
          </div>
          <div>
            ${isAuthd()}

          </div>
        </nav>
      </header>
      <main class="w-100 pa4">
        <h1 class="tc">Check out these projects</h1>
        ${makeProjectList(state.projects, projectModal)}
      </main>
    </body>
    `
}

// ${projectModal.render()}   
