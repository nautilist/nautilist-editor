var html = require('choo/html')
const NavbarTop = require('../components/NavbarTop');
const Footer = require('../components/Footer');
const LinkCards = require('../components/LinkCards');
const UserCards = require('../components/UserCards');
const ListCards = require('../components/ListCards');
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

module.exports = view

function view (state, emit) {
  return html`
    <body class="w-100 h-auto code lh-copy">
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 flex-grow-1 pa4 flex flex-column outline">
        ${SearchResults(state, emit)}
        ${searchCategoriesSection(state, emit)}
      </main>
      ${Footer()}
      ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
  `
}


function SearchResults(state, emit){
  // TODO: add these in soon
  // ${showTracks(state, emit)}
  // ${showCollections(state, emit)}
  return html`
    <section class="w-100 flex flex-column">
      <h2 class="f2 lh-title tc">Search Results by category</h2>
      ${showLinks(state, emit)}
      ${showLists(state, emit)}
      ${nautilistUsers(state, emit)}
    </section>
  `
}

function showTracks(state, emit){
  const {tracks} = state;
  let cards;
  if(tracks.length <= 0){
    cards = html`<p class="w-100 tc">no tracks yet</p>`
  } else {
    cards = LinkCards(links);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Tracks</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}



function showCollections(state, emit){
  const {collections} = state;
  let cards;
  if(collections.length <= 0){
    cards = html`<p class="w-100 tc">no collections yet</p>`
  } else {
    cards = LinkCards(links);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Collections</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}


function showLinks(state, emit){
  const {links} = state;
  let cards;
  if(links.length <= 0){
    cards = html`<p class="w-100 tc">no links yet</p>`
  } else {
    cards = LinkCards(links);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Links</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}


function showLists(state, emit){
  const {lists} = state;
  let cards;
  if(lists.length <= 0){
    cards = html`<p class="w-100 tc">no lists yet</p>`
  } else {
    cards = ListCards(lists);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Lists</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}

function nautilistUsers(state, emit){
  const {users} = state;
  let cards;
  if(users.length <= 0){
    cards = html`<p class="w-100 tc">no users yet</p>`
  }
  else {
    cards = UserCards(users);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Contributors</h2>
    <div class="mw9 center ph3-ns h-100 overflow-scroll-x">
      ${cards}
    </div>
  </section>
  `
}




// ${searchCategoriesSection(state, emit)}
// ${projectsPreviewSection(state, emit)}
// ${collectionsPreviewSection(state, emit)}

function browseHeader(state, emit){
  return html`
  <header class="w-100 pa4 flex flex-column items-center">
        <div class="w-100 pa4 flex flex-row items-center justify-center">
          <img class="h3" src="/assets/1F308.png">
          <h1 class="f1 f-headline lh-solid tl pa2 tc">Find the list of your dreams</h1>
          <img class="h3 reverse-img" src="/assets/1F308.png">
        </div>
        <p class="tc mw6">Have you ever had to share the same list of stuff with friends over and over again? Have you ever wished you could quickly reuse parts of syllabus or tutorial? The core principle of Nautilist is to allow curating and sharing useful lists of links, fast and easy.</p>
      </header>
      
  `
}


function searchCategoriesSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Browse Categories</h2>
    <div class="w-100 flex flex-row-ns flex-column items-start justify-start tc">
      
      <!-- links -->
      <div class="w-third-ns w-100 flex flex-column justify-start">
        <a class="link black w-100" href="/links">
          <img style="max-width:60%" class="h4-ns h3" src="/assets/1F517.png">  
          </a>
        <h3 class="f2 lh-title">links</h3>
        <p class="pa2">Links are the heart of nautilist projects. Add 'em in and organize them into lists.</p>
      </div>  

      <!-- lists -->
      <div class="w-third-ns w-100 flex flex-column justify-start">
        <a class="link black w-100" href="/lists">
          <img style="max-width:60%" class="h4-ns h3" src="/assets/1F4A5.png">  
        </a>
        <h3 class="f2 lh-title">lists</h3>
        <p class="pa2">Lists are the home for your wonderful links. These have been created, curated, and saved to Nautilist for you to reuse and remix.</p>
      </div>

      <!-- collections -->
      <div class="w-25-ns w-100 dn">
        <a class="link black w-100" href="/collections">
        <img style="max-width:60%" class="h4-ns h3" src="/assets/1F490.png"> 
        </a>
        <h3 class="f2 lh-title">Collections</h3>
        <p class="pa2">Collections are groups of projects. Collections may contain similar themed projects such as for a class or larger project.</p>
      </div>

      <!-- users -->
      <div class="w-third-ns w-100 flex flex-column justify-start">
        <a class="link black w-100" href="/users">
        <img style="max-width:60%" class="h4-ns h3" src="/assets/1F984.png">
        <h3 class="f2 lh-title">users</h3>
        </a>
        <p class="pa2">Oh and what would we be without our wonderful users? Go checkout their projects and collections for inspiration or to collaborate!</p>
      </div>
    </div>

    <p class="i"> Organizing lists into tracks and collections coming soon! </p>
  </section>
  `
}

function projectsPreviewSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Projects We Love</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tc">
        coming soon!
    </div>
    <div class="w-100 tc mt4">
      <a class="link underline black" href="/projects">Browse more projects</a>
    </div>
  </section>
  `
}

function collectionsPreviewSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Collections We Love</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tc">
    coming soon!
    </div>
    <div class="w-100 tc mt4">
      <a class="link underline black" href="/collections">Browse more collections</a>
    </div>
  </section>
  `
}