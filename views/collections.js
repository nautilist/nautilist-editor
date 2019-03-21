var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
// const ProjectModal = require('../components/ProjectModal');
const NavbarTop = require("../components/NavbarTop");

module.exports = view


function view (state, emit) {
//   const projectModal = new ProjectModal("ProjectModal", state, emit);

  function collectionCard(collection){
  
    function handleRedirect(e){
      const {id, type} = e.currentTarget.dataset
      console.log('go to selected project!', id, type)
      emit('fetch-collection', id);
    }

    function checkOwner(collection){
      if(collection.hasOwnProperty('owner')){
        return `${collection.ownerDetails.username}`
      } else {
        return '🤖'
      }
    }

    function projectIndicator(projects){
        return projects.map(project => {
            return html`
            <div class="h1 w1 bg-yellow br2 bn mr1 mb1"></div>
            `
        })
    }
    // ${projectIndicator(collection.projects)}

    const {name, description, _id, selectedColor, colors} = collection;



    return html`
    <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/collections/${_id}">
    <div class="h-100 dropshadow br2 bg-near-white ma2" data-type="collections" data-id=${_id} onclick=${handleRedirect}>
      <header class="w-100 h3 br2 br--top flex flex-column justify-center items-end pr2" style="background-color:${colors[selectedColor]};">
        <div class="br-100 bn bg-white h2 w2 dib tc flex flex-column items-center justify-center"><h3 class="ma0 f6">${collection.projects.length}</h3></div>
      </header>
      <section class="pa2 flex flex-column justify-between">
        <div>
        <h3 class="ma0">${name}</h3>
        <small class="ma0">created by <a class="link black underline" href="/users/${collection.ownerDetails.username}">${checkOwner(collection)}</a> </small>
        <p class="ma0 truncate">${description}</p>
        </div>
        <div class="flex flex-row flex-wrap">
            
        </div>
      </section>
    </div>
    </a>
    `
  }
  
  function makeCollectionsList(collections){
    const collectionCards = collections.map(collection=>{
      return collectionCard(collection)
    })
    
    if(collections.length > 0){
      return html`
      <div class="w-100">
        <div class="mw9 center ph3-ns h-100">
          ${collectionCards}
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
    <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-collections')}>
        ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
    
      <main class="w-100 pa4">
        <h1 class="tc">Check out these collections</h1>
        ${makeCollectionsList(state.collections)}
      </main>
    </body>
    `
}
