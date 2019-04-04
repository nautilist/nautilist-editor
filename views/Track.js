var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer");
const BackBtn = require('../components/BackBtn');
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

const TITLE = 'Nautilists - Track';

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `
    <body class="w-100 h-100 code lh-copy flex flex-column">
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <!-- main -->
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
        <section class="w-100 h-100 mw7 pa2">
            ${BackBtn(state, emit)}

        </section>
      </main>
      ${Footer()}
        ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
  `

}