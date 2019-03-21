var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const feathersClient = require('../helpers/feathersClient')

module.exports = view

function newCollectionBtn(state, emit){
  
  function createNewCollection(e){
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    
    const payload = {
      name: formData.get('name') || "new collection",
      description: formData.get('name') || "new collection about something interesting",
    }

    feathersClient.service('/api/collections').create(payload).then(result => {
      alert("new collection created!");
      emit('fetch-user') 
    }).catch(err => {
      alert(err);
    })

  }
  if (state.user.authenticated === true && state.params.username === state.user.username) {
    
      return html`
      <li class="mw6 shadow-5 mb3">
          <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
            <form id="newCollectionForm" name="newCollectionForm" class="flex flex-row-ns flex-column w-100" onsubmit=${createNewCollection}>
              <div class="w-two-thirds-ns w-100">
                <input class="w-100 pa2 f6 bn mb1" type="text" name="name" placeholder="New Collection Name">
                <input class="w-100 pa2 f6 bn" type="text" name="description" placeholder="New Collection Description">
              </div>
              <div class="w-third-ns w-100 tr">
              <input class="pointer bn pa3 bg-yellow navy h-100" type="submit" form="newCollectionForm" value="create">
              </div>
            </div>
          </div>
      </li>
      `
  }
  else{
    return ''
    }
}


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

  function renderFollowingProjects(){
    let projs = state.selectedUserFollowingProjects;
    if(!state.selectedUserFollowingProjects.length > 0){
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

  function renderUserCollections(){
    let collections = state.selectedUserCollections;
    if(!state.selectedUserCollections.length > 0){
      return html`
      <div>
      <p>no collections yet!</p>
      </div>`
    }
    
    return collections.map(collection => {
      return html`
        <li class="mw6 shadow-5 mb3">
        <a class="link black" href="/collections/${collection._id}">
          <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
            <div class="h1 w-100 h2-ns w2-ns mr4-ns mr0" style="background-color:${collection.colors[collection.selectedColor]}"></div>
            <div class="flex flex-column w-80-ns w-100">
              <h3 class="ma0">${collection.name}</h3>
              <p class="ma0 truncate f6">${collection.description}</p>
            </div>
          </div>
        </a>
        </li>
      `
    })
  }

  function renderFollowingCollections(){
    let collections = state.selectedUserFollowingCollections;
    if(!state.selectedUserFollowingCollections.length > 0){
      return html`
      <div>
      <p>no collections yet!</p>
      </div>`
    }
    
    return collections.map(collection => {
      return html`
        <li class="mw6 shadow-5 mb3">
        <a class="link black" href="/collections/${collection._id}">
          <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
            <div class="h1 w-100 h2-ns w2-ns mr4-ns mr0" style="background-color:${collection.colors[collection.selectedColor]}"></div>
            <div class="flex flex-column w-80-ns w-100">
              <h3 class="ma0">${collection.name}</h3>
              <p class="ma0 truncate f6">${collection.description}</p>
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
          <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/projects">Nautilist Projects</a>
          <a class="link black mr4 pointer" href="/">Editor</a>
          <input type="search" class="w5 h2 pa2 bn bg-light-gray dn" placeholder="🔎 search">
          </div>
          <div>
            ${isAuthd()}
          </div>
        </nav>
      </header>
      <main class="w-100 pa4 flex flex-column">
        <a class="link black b underline" href="/users">← back to users page</a>
    
        <h1 class="tl">${state.selectedUser.username}</h1>
        <div class="flex flex-row-ns flex-column w-100">
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>My Projects</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderUserProjects()}
              </ul>
            </section>
          </section>

          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>My Collections</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderUserCollections()}
              ${newCollectionBtn(state, emit)}
              </ul>
            </section>
          </section>
        </div>

        <h1 class="tl">Things I'm Following</h1>
        <div class="flex flex-row-ns flex-column w-100">
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>Projects I follow</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderFollowingProjects()}
              </ul>
            </section>
          </section>
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>Collections I follow</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderFollowingCollections()}
              </ul>
            </section>
          </section>
        </div>
      </main>
    </body>
  `
}