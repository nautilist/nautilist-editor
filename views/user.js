var html = require('choo/html')

module.exports = view

function view (state, emit) {
  function logout(){
    emit(state.events.user_logout);
  }

  function isAuthd(){
    if(state.user.authenticated === false){
      return html`<a class="mr3 black underline" href="/login">login</a>`
    }
    return html`<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/users/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  }

  function renderUserProjects(){
    let projs = state.selectedUserProjects;
    if(!state.selectedUserProjects.length > 0){
      return html`<p>no projects yet!</p>`
    }
    
    return projs.map(proj => {
      return html`
        <li class="mw6 shadow-5 mb3">
        <a class="link black" href="/projects/${proj._id}">
          <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
            <div class="h1 w-100 h2-ns w2-ns mr4-ns mr0" style="background-color:${proj.colors[proj.selectedColor]}"></div>
            <div class="flex flex-column w-80-ns w-100">
              <h3 class="ma0">${proj.name}</h3>
              <p class="ma0 truncate f6">${proj.description}</p>
            </div>
          </div>
        </a>
        </li>
      `
    })
  }

  return html`
    <body class="w-100 h-100 code lh-copy" onload=${() => emit('fetch-user', state.params.username) }>
      
      <header class="pt3 pl2 pr2 pb2 w-100">
        <nav class="w-100 flex flex-row items-center justify-between">
          <div>
          <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/public">Nautilist Public</a>
          <a class="link black mr4 pointer" href="/">Editor</a>
          <input type="search" class="w5 h2 pa2 bn bg-light-gray dn" placeholder="🔎 search">
          <select class="bn bg-light-gray br2 br--right h2 dn">
            <option value="projects">Projects</option>
            <option value="collections">Collections</option>
            <option value="users">Users</option>
          </select> 
          </div>
          <div>
            ${isAuthd()}
          </div>
        </nav>
      </header>
      <main class="w-100 pa4">
        <h1 class="tl">${state.selectedUser.username}</h1>
        <h2>Projects</h2>
        <ul class="list pl0">
        ${renderUserProjects()}
        </ul>
      </main>
    </body>
  `
}