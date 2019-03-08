var html = require('choo/html')

module.exports = view

function onClose(state, emit){
  return e => {
    emit('pushState', '/')
  }
}

function submitLogin(state, emit){
  return e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    emit(state.events.user_login, formData);
  }

}

function view (state, emit) {
  return html`
    <body class="code lh-copy w-100 h-100">
      <div class="w-100 flex flex-row items-center justify-between">
        <a class="link dark-pink dropshadow ba br-pill pa2 bw1 mr3" href="/">Nautilist</a>
        <button class="bn moon-gray bw2 pa2 h3 w3 f3 pointer" onclick="${onClose(state, emit)}">╳</button>
      </div>
      <main class="w-100 h-100">
          <div class="w-100 flex flex-column justify-center items-center">
            <form class="mw6 w-100 flex flex-column items-center" onsubmit="${submitLogin(state, emit)}">
              <h2>Log In</h2>
              <fieldset class="w-100 mb3 bn">
                <legend>Email</legend>
                <input type="email" class="w-100 h3 dropshadow pa2 f4 bn bg-near-white" name="email" required>
              </fieldset>
              <fieldset class="w-100 mb4 bn">
                <legend>Password</legend>
                <input type="password" class="w-100 h3 dropshadow pa2 f4 bn bg-near-white" name="password" required>
              </fieldset>
              <input class="w-100 ba bw2 mw5 mb3 dropshadow h3 b--dark-pink dark-pink bg-white b" type="submit" value="Log In">
            </form>
            
            <small>Don't have an account? <a class="link black underline" href="/signup">Sign up!</a></small>
          </div>
          
      </main>
    </body>
  `
}