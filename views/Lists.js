var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require('../components/Footer');
const BrowseSearchBar = require('../components/BrowseSearchBar');
const ListCards = require('../components/ListCards')

module.exports = view

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

function view(state, emit) {
  return html`
    <body class="w-100 h-100 code lh-copy flex flex-column" onload=${()=> emit('fetch-lists')}>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <header class="w-100 tc flex flex-column items-center">
          <h1 class="w-100 mw6 tc f1 lh-title">Lists</h1>
          <img class="w4" src="/assets/1F33C.png">
          <p class="pa2 mw6">Connect others to your favorite parts of the web.</p>
      </header>
      ${state.cache(BrowseSearchBar, 'ListsSearch', state,emit, '/api/lists', 'lists').render() }
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
        ${showLists(state, emit)}
      </main>
      ${Footer()}
    </body>
    `
}

