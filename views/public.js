var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
const ProjectModal = require('../components/ProjectModal');

module.exports = view


function view (state, emit) {
  const projectModal = new ProjectModal("ProjectModal", state, emit);

  function projectCard(project, projectModal){
  
    function handleRedirect(e){
      const {id, type} = e.currentTarget.dataset
      console.log('go to selected project!', id, type)
      emit('fetch-project',id);
    }

  
    const {name, description, _id} = project;

    return html`
    <a class="link black" href="/projects/${_id}">
    <div class="h5 w5 dropshadow br2 bg-near-white ma2" data-type="projects" data-id=${_id} onclick=${handleRedirect}>
      <header class="w-100 h3 bg-yellow br2 br--top"></header>
      <section class="pa2">
        <h3>${name}</h3>
        <p>${description}</p>
      </section>
    </div>
    </a>
    `
  }
  
  function makeProjectList(projects, projectModal){
    const projectCards = projects.map(project=>{
      return projectCard(project, projectModal)
    })
  
    return html`
      <section class="w-100 flex flex-row flex-wrap">
        ${projectCards}
      </section>
    `
  }

  return html`
    <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-projects')}>
      <header class="pt3 pl2 pr2 pb2 w-100">
        <nav class="w-100 flex flex-row items-center justify-between">
          <div>
          <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/public">Nautilist Public</a>
          <a class="link black mr4 pointer" href="/">editor</a>
          <input type="search" class="w5 h2 pa2 bn bg-light-gray" placeholder="🔎 search">
          <select class="bn bg-light-gray br2 br--right h2">
            <option value="projects">Projects</option>
            <option value="collections">Collections</option>
            <option value="users">Users</option>
          </select> 
          </div>
          <div>
            <a class="link black mr4 pointer" href="/">login</a>
          </div>
        </nav>
      </header>
      <main class="w-100 pa4">
        ${makeProjectList(state.projects, projectModal)}
      </main>
      ${projectModal.render()}   
    </body>
    `
}
