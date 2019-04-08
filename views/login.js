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
    const _formData = new FormData(e.currentTarget);
    // emit(state.events.user_login, formData);
    // If we get login information, add the strategy we want to use for login
    const credentials = {
      username: _formData.get("username"),
      email: _formData.get("email"),
      password: _formData.get("password")
    }
    // create the payload
    const payload = Object.assign({
      strategy: 'local'
    }, credentials);


    state.api.authenticate(payload).then(authResponse => {
      state.user.authenticated = true;
      state.user.username = authResponse.username;
      state.user.id = authResponse.id;
      // alert('logging in now!')
      // emitter.emit("pushState", "/")
      alert('log in successful!')
      window.location = "/";
      // emitter.emit("pushState", `/${state.user.username}/projects`) //${state.user.username}
    }).catch(err => {
      // Show login page (potentially with `e.message`)
      console.log('Authentication error', err);
      alert(err);
      state.user.authenticated = false;
      // emitter.emit("pushState", "/login")
    });

  }

}

function view (state, emit) {
  return html`
    <body class="code lh-copy w-100 h-100">
      <div class="w-100 flex flex-row items-center justify-between">
        <a class="link black w3 ml2" href="/"><img src="/assets/logo-wow.png"></a>
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
                <a class="link black underline f7 b" href="/reset">I forgot my password 😬</a>
              </fieldset>
              <input class="w-100 ba bw2 mw5 mb3 dropshadow h3 b--dark-pink dark-pink bg-white b" type="submit" value="Log In">
            </form>
            
            <small>Don't have an account? <a class="link black underline" href="/signup">Sign up!</a></small>
          </div>
          
      </main>
    </body>
  `
}