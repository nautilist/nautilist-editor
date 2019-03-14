var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const staticAssetsUrl = "https://nautilist-public.herokuapp.com/images/user_placeholders/"

module.exports = view

function view (state, emit) {

  function renderUsers(){
    const {users} = state;
    // const emojis = ['🦄', '🦁', '🦕', '🌎', '🌼', '🌴', '🌈', '☃️']

    if(users.length > 0){
      return users.map(user => {
        // let emojiSel = emojis[Math.floor(Math.random()* emojis.length)]
        // console.log(emojiSel)
        // <img src="https://nautilist.github.io/assets/howto.png" class="br-100 h4 w4 dib pa2" title="Photo of a kitty staring at you">
        return html`
        <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/users/${user.username}">
        <div class="h-100 dropshadow br2 bg-near-white ma2 tc pa3">
            <img src="${staticAssetsUrl}${user.emojis[user.selectedEmoji]}" class="br-100 h4 w4 dib pa2">
            <h1 class="f3 mb2">${user.username}</h1>
        </div>
        </a>
        `
      })
    }
    return html`<p>no users to show</p>`
  }

  function logout(){
    emit(state.events.user_logout);
  }

  function isAuthd(){
    if(state.user.authenticated === false){
      return html`<a class="mr3 black underline" href="/login">login</a>`
    }
    return html`<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  }

  return html`
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-users') }>
    <header class="pt3 pl2 pr2 pb2 w-100">
      <nav class="w-100 flex flex-row items-center justify-between">
        <div>
        <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/public">Nautilist Public</a>
        <a class="link black mr4 pointer" href="/">Editor</a>
        <input type="search" class="w5 h2 pa2 bn bg-light-gray dn" placeholder="🔎 search">
        ${state.cache(NavSelect, "NavSelect", state, emit).render()}
        </div>
        <div>
          ${isAuthd()}

        </div>
      </nav>
    </header>
    <main class="w-100 pa4">
      <h1 class="tc">Check out these amazing contributors</h1>
      <div class="w-100">
      <div class="mw9 center ph3-ns h-100">
      ${renderUsers()}
      </div>
      </div>
    </main>
  </body>
  `
}