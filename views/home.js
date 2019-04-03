var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer");
const UserCards = require('../components/UserCards')
const ListCards = require('../components/ListCards')
const LinkCards = require('../components/LinkCards')

const TITLE = 'Nautilists Home';

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `
    <body class="w-100 h-100 code lh-copy flex flex-column" onload=${() => emit('fetch-home')}>
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      ${headerSection()}
      <!-- main -->
      <main class="w-100 flex-grow-1 pa4 flex flex-column">
        ${recentLists(state, emit)}
        ${recentLinks(state, emit)}
        ${nautilistUsers(state, emit)}
      </main>
      ${Footer()}
    </body>
  `

}

function nautilistUsers(state, emit){
  const {users} = state;
  let cards;
  if(users.length <= 0){
    cards = html`<p>no users yet</p>`
  }
  else {
    cards = UserCards(users);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f2 headline">Our Wonderful Contributors</h2>
    <div class="mw9 center ph3-ns h-100 overflow-scroll-x">
      ${cards}
    </div>
  </section>
  `
}

function recentLinks(state, emit){
  const {links} = state;
  let cards;
  if(links.length <= 0){
    cards = html`<p>no links yet</p>`
  } else {
    cards = LinkCards(links);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f2 headline">Recently Contributed Links</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}


function recentLists(state, emit){
  const {lists} = state;
  let cards;
  if(lists.length <= 0){
    cards = html`<p>no lists yet</p>`
  } else {
    cards = ListCards(lists);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f2 headline">Recently Contributed Lists</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}



function headerSection(){
  return html`
  <section class="w-100 flex flex-row justify-center">
  <header class="w-100 mw8-ns pa4 flex flex-row-ns flex-column items-center">
    <section class="w-third-ns w-100 flex flex-column h-100 mr2 justify-center pa2">
      <h2 class="tl-ns tc b f2 ma0">Welcome to <span class="dark-pink">Nautilists</span></h2>
      <h3 class="tl-ns tc f3 mt1">Pick-and-mix lists for all occasions</ph3>
    </section>
    <section class="pa2 w-two-thirds-ns w-100 flex flex-row-ns flex-column h-100 ba bw1 dropshadow b--dark-pink">
      <div class="w-third-ns w-100 tc flex flex-column items-center">
        <h4>Add Links</h4>
        <img class="h3 w3" src="/assets/1F517.png">
        <p class="f6 ma0 pa2 tl">Add your favorite links from across the web.</p>
      </div>
      <div class="w-third-ns w-100 tc flex flex-column items-center">
        <h4>Mix 'em up</h4>
        <img class="h3 w3" src="/assets/1F4A5.png">
        <p class="f6 ma0 pa2 tl">Pick-and-mix links and lists for all to see.</p>
      </div>
      <div class="w-third-ns w-100 tc flex flex-column items-center">
        <h4>Collaborate</h4>
        <img class="h3 w3" src="/assets/1F3D3.png">
        <p class="f6 ma0 pa2 tl">Build with buddies on collaborative lists.</p>
      </div>
    </section>
  </header>
</section>
  `
}
