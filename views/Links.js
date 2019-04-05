var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require('../components/Footer');
const BrowseSearchBar = require('../components/BrowseSearchBar');
const LinkCards = require('../components/LinkCards');
module.exports = view

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

function view(state, emit) {
  return html`
    <body class="w-100 h-100 code lh-copy flex flex-column" onload=${()=> emit('fetch-links')}>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <header class="w-100 tc flex flex-column items-center">
          <h1 class="w-100 mw6 tc f1 lh-title">Links</h1>
          <img class="w4" src="/assets/1F33C.png">
          <p class="pa2 mw6">Connect others to your favorite parts of the web.</p>
      </header>
      ${state.cache(BrowseSearchBar, 'LinksSearch', state,emit, '/api/links', 'links').render() }
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
        ${showLinks(state, emit)}
      </main>
      ${Footer()}
    </body>
    `
}

