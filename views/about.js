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
          <h1 class="f1 f-headline lh-solid tl pa2 tc"><img class="h3" src="/assets/1F4DD.png"></h1>
          <img class="h3 reverse-img" src="/assets/1F308.png">
        </div>
        <p class="tc mw6 b">Welcome to the Nautilist Project.</p>
        <p class="tc mw6">Have you ever had to share the same list of stuff with friends over and over again? Have you ever wished you could quickly reuse parts of syllabus or tutorial? The core principle of Nautilist is to allow curating and sharing useful lists of links, fast and easy.</p>
      </header>
      
      <main class="w-100 flex flex-column justify-start items-start mb4">
        ${gettingStartedSection(state, emit)}
        ${acknowledgementsSection(state, emit)}
      </main>
      ${Footer()}
    </body>
  `
}

function gettingStartedSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Getting Started</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tc">
        coming soon!
    </div>
    <div class="w-100 tc mt4">
      
    </div>
  </section>
  `
}

function acknowledgementsSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Acknowledgements</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tc">
        coming soon!
    </div>
    <div class="w-100 tc mt4">
      
    </div>
  </section>
  `
}