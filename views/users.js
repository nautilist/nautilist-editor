var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const staticAssetsUrl = "https://nautilist-public.herokuapp.com/images/user_placeholders/"
const NavbarTop = require("../components/NavbarTop");
const Footer = require('../components/Footer');

module.exports = view

function view(state, emit) {

  function renderUsers() {
    const {
      users
    } = state;
    // const emojis = ['🦄', '🦁', '🦕', '🌎', '🌼', '🌴', '🌈', '☃️']

    if (users.length > 0) {
      return users.map(user => {
        // let emojiSel = emojis[Math.floor(Math.random()* emojis.length)]
        // console.log(emojiSel)
        // <img src="https://nautilist.github.io/assets/howto.png" class="br-100 h4 w4 dib pa2" title="Photo of a kitty staring at you">
        return html `
        <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/users/${user.username}">
        <div class="h-100 shadow-5 bg-near-white ma2 tc pa3">
            <img src="${staticAssetsUrl}${user.emojis[user.selectedEmoji]}" class="br-100 h4 w4 dib pa2">
            <h1 class="f3 mb2">${user.username}</h1>
        </div>
        </a>
        `
      })
    }
    return html `<p>no users to show</p>`
  }

  function logout() {
    emit(state.events.user_logout);
  }

  function isAuthd() {
    if (state.user.authenticated === false) {
      return html `<a class="mr3 black underline" href="/login">login</a>`
    }
    return html `<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/users/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  }

  return html `
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-users') }>
    ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
    <header class="w-100 tc flex flex-column items-center">
          <h1 class="w-100 mw6 tc f1 lh-title">Users</h1>
          <img class="w4" src="/assets/1F984.png">
          <p class="pa2 mw6">Oh and what would we be without our wonderful users? Go checkout their projects and collections for inspiration or to collaborate!</p>
    </header>
    <main class="w-100 h-100 pa4">
      <div class="w-100">
        <div class="mw9 center ph3-ns h-100">
        ${renderUsers()}
        </div>
      </div>
    </main>
    ${Footer()}
  </body>
  `
}