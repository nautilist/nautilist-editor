var html = require('choo/html')
const NavbarTop = require('../components/NavbarTop');
const Footer = require('../components/Footer');

module.exports = view

function view (state, emit) {
  return html`
    <body class="w-100 h-100 code lh-copy">
    ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
    ${Footer()}
    </body>
  `
}