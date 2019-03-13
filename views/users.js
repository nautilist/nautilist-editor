var html = require('choo/html')

module.exports = view

function view (state, emit) {

  function renderUsers(){
    const {users} = state;
    if(users.length > 0){
      return users.map(user => {
        return html`
          <a href="/users/${user.username}">
          <article class="mw5 bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
            <div class="tc">
              <img src="http://tachyons.io/img/avatar_1.jpg" class="br-100 h4 w4 dib ba b--black-05 pa2" title="Photo of a kitty staring at you">
              <h1 class="f3 mb2">${user.username}</h1>
            </div>
          </article>
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

  function handleSelectChange(e){
    console.log()
    emit('pushState', e.currentTarget.value)
  }


  return html`
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-users')}>
    <header class="pt3 pl2 pr2 pb2 w-100">
      <nav class="w-100 flex flex-row items-center justify-between">
        <div>
        <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/public">Nautilist Public</a>
        <a class="link black mr4 pointer" href="/">Editor</a>
        <input type="search" class="w5 h2 pa2 bn bg-light-gray dn" placeholder="🔎 search">
        <select id="selectChange" class="bn bg-light-gray br2 br--right h2" onchange=${handleSelectChange}>
            <option name="public" value="/public">Projects</option>
            <option class="dn" value="collections">Collections</option>
            <option name="users" value="/users">Users</option>
          </select> 
        </div>
        <div>
          ${isAuthd()}

        </div>
      </nav>
    </header>
    <main class="w-100 pa4">
      <h1 class="tc">Check out these amazing contributors</h1>
      ${renderUsers()}
    </main>
  </body>
  `
}