var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer");
const UserCards = require('../components/UserCards')
const ListCards = require('../components/ListCards')
const LinkCards = require('../components/LinkCards')
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

const TITLE = 'Nautilists Home';

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)


  return html `
    <body class="w-100 h-auto code lh-copy flex flex-column" onload=${() => emit('fetch-home')}>
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      ${headerSection()}
      <!-- main -->
      <main class="w-100 h-100 pa4 flex flex-column">
        ${recentLists(state, emit)}
        ${recentLinks(state, emit)}
        ${nautilistUsers(state, emit)}
        ${acknowledgementsSection(state, emit)}
      </main>
      ${Footer()}
      ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
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
    <h2 class="f3 tc lh-title">Our Wonderful Contributors</h2>
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
    cards = html`<p class="w-100 tc">no links yet</p>`
  } else {
    cards = LinkCards(links);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Recently Contributed Links</h2>
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
    cards = html`<p class="w-100 tc">no lists yet</p>`
  } else {
    cards = ListCards(lists);
  }
  

  return html`
  <section class="w-100 mt4">
    <h2 class="f3 tc lh-title">Recently Contributed Lists</h2>
    <div class="mw9 center ph3-ns h-100">
    ${cards}
    </div>
  </section>
  `
}



function headerSection(){
  return html`
  <section class="w-100 h-auto flex flex-column items-center mt0 pt5 pb5 bg-washed-red">
  <header class="w-100  mw8-ns flex flex-row-ns flex-column items-center">
    <section class="w-third-ns w-100 flex flex-column h-100 justify-center pa2 pb5 pb0-ns">
      <h2 class="tl-ns tc b f2-ns f4 ma0">Welcome to <span class="dark-pink">Nautilists</span></h2>
      <h3 class="tl-ns tc f3-ns f5 mt1">Pick-and-mix lists for all occasions</h3>
    </section>
    <section class=" bg-near-white bn h-100 pa3-ns pt3 pb3 w-two-thirds-ns w-100 flex flex-row-ns flex-column ba-ns bw1-ns dropshadow-ns b--dark-pink">
      <div class="justify-between w-third-ns w-100 h-100 tc flex flex-column items-center">
        <h4 class="ma0">Add links</h4>
        <img class="h3 w3" src="/assets/1F517.png">
        <p class="f6 ma0 pa2 tl">Add your favorite links from across the web.</p>
      </div>
      <div class="justify-between w-third-ns w-100 h-100 tc flex flex-column items-center">
        <h4 class="ma0">Mix 'em up</h4>
        <img class="h3 w3" src="/assets/1F4A5.png">
        <p class="f6 ma0 pa2 tl">Pick-and-mix links and lists for all to see.</p>
      </div>
      <div class="justify-between w-third-ns w-100 h-100 tc flex flex-column items-center">
        <h4 class="ma0">Collaborate</h4>
        <img class="h3 w3" src="/assets/1F3D3.png">
        <p class="f6 ma0 pa2 tl">Build with buddies on collaborative lists.</p>
      </div>
    </section>
  </header>
  <div class="w-100 mw8-ns mt4 flex flex-row justify-end-ns justify-center">
      <h2 class="ma0">→ <a class="black underline" href="/browse">Get Started</a></h2>
      <img class="pl2 h2" src="/assets/2728.png">
  </div>
</section>
  `
}

function acknowledgementsSection(state, emit){
  
  return html`
  <section class="w-100 mt4 flex flex-column items-center">
    <h2 class="w-100 tc f3 lh-title">Acknowledgements</h2>
    <div class="w-100 tl mw7">
    <p>Nautilist is supported and maintained by NYU's Intertelecommunications Program. The project was materialized by <a class="link black underline" href="https://jk-lee.com" target="_blank">Joey Lee</a> through ITP's <a class="link black underline"  href="https://tisch.nyu.edu/itp/itp-people/faculty/somethings-in-residence-sirs" target="_blank">Something in Residence Program</a> under the supervision of Shawn Van Every, Dan Shiffman, and Dan O'Sullivan.</p>
    <p>Emojis via the <a class="link black underline" href="http://openmoji.org/index.html" target="_blank">OpenMoji Project</a> by the clever folks at <a class="link black underline" href="http://openmoji.org/about.html" target="_blank">Hfg Schwäbisch Gmünd</a>.</p>
    <p>Built with <a class="link black underline" href="https://choo.io/" target="_blank">Choo.js</a> & <a class="link black underline" href="https://feathersjs.com/" target="_blank">Feathers.js</a></p>
    <p>Other really cool projects worth exploring: 
      <a class="link black underline" href="https://subdex.co/" target="_blank">subdex.co</a> & 
      <a class="link black underline" href="https://www.instructables.com/" target="_blank">instructables</a>  
    </p>
    </div>
    <div class="w-100 tc mt4">
      
    </div>
  </section>
  `
}