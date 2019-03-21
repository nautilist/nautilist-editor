var html = require('choo/html')
const NavbarTop = require('../components/NavbarTop');
const Footer = require('../components/Footer');

module.exports = view

function view (state, emit) {
  return html`
    <body class="w-100 h-100 code lh-copy">
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <header class="w-100 pa4 flex flex-column items-center">
        <div class="w-100 pa4 flex flex-row items-center justify-center">
          <img class="h3" src="/assets/1F308.png">
          <h1 class="f1 f-headline lh-solid tl pa2 tc">Find the list of your dreams</h1>
          <img class="h3 reverse-img" src="/assets/1F308.png">
        </div>
        <p class="tc mw6">Have you ever had to share the same list of stuff with friends over and over again? Have you ever wished you could quickly reuse parts of syllabus or tutorial? The core principle of Nautilist is to allow curating and sharing useful lists of links, fast and easy.</p>
      </header>
      
      <main class="w-100 flex flex-column justify-start items-start mb4">
        ${searchCategoriesSection(state, emit)}

        ${projectsPreviewSection(state, emit)}

        ${collectionsPreviewSection(state, emit)}
      </main>
      ${Footer()}
    </body>
  `
}


function searchCategoriesSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Browse Categories</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tc">
      <div class="w-third-ns w-100">
        <a class="link black w-100" href="/projects">
          <img src="/assets/1F33C.png">  
        <h3 class="f2 lh-title">Projects</h3>
        </a>
        <p class="pa2">Projects are lists of links. These have been created, curated, and saved to Nautilist for you to reuse and remix.</p>
      </div>
      <div class="w-third-ns w-100">
        <a class="link black w-100" href="/collections">
        <img src="/assets/1F490.png"> 
        <h3 class="f2 lh-title">Collections</h3>
        </a>
        <p class="pa2">Collections are groups of projects. Collections may contain similar themed projects such as for a class or larger project.</p>
      </div>
      <div class="w-third-ns w-100">
        <a class="link black w-100" href="/users">
        <img src="/assets/1F984.png">
        <h3 class="f2 lh-title">Users</h3>
        </a>
        <p class="pa2">Oh and what would we be without our wonderful users? Go checkout their projects and collections for inspiration or to collaborate!</p>
      </div>
    </div>
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