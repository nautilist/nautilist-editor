var html = require('choo/html')

module.exports = view

function onClose(state, emit){
  return e => {
    emit('pushState', '/login')
  }
}

function submitSendReset(state, emit){
  return e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // emit(state.events.user_sendResetPassword, formData);
      const obj = {
        action: 'sendResetPwd',
        value: {
            email: formData.get('email')
          }
        }
      state.api.authmanagement.create(obj).then(result => {
        console.log('sending reset password!', result)
        document.querySelector("#update").innerHTML = "an email was sent to your inbox - please open that URL"
      }).catch(err => {
        return err;
      })
  }
}

function submitReset(state, emit){
  return e => {
    e.preventDefault();
    document.querySelector("#update").innerHTML = "password changed - redirecting to login page!"
    const formData = new FormData(e.currentTarget);
    // emit(state.events.user_resetPassword, formData);
      const token = state.query.token
      const obj = {
        action: 'resetPwdLong',
        value: {
          token: token,
          password: formData.get('password')
        }
      }
      state.api.authmanagement.create(obj).then(result => {
        console.log('password changed!', result)
        emit('pushState', '/login')
      }).catch(err => {
        return err;
      })
    };
  }

function showInput(state, emit){
  if(state.query.hasOwnProperty('token')){
    return html`
    <form class="mw6 w-100 flex flex-column items-center" onsubmit="${submitReset(state, emit)}">
      <h2>Set new password</h2>
      <span id="update"></span>
      <fieldset class="w-100 mb3 bn">
        <legend>New Password</legend>
        <input type="password" class="w-100 h3 dropshadow pa2 f4 bn bg-near-white" name="password" required>
      </fieldset>
      <input class="w-100 ba bw2 mw5 mb3 dropshadow h3 b--dark-pink dark-pink bg-white b" type="submit" value="Send Password Reset">
    </form>
    `
  } else {
    return html`
    <form class="mw6 w-100 flex flex-column items-center" onsubmit="${submitSendReset(state, emit)}">
      <h2>Send password reset email</h2>
      <span id="update"></span>
      <fieldset class="w-100 mb3 bn">
        <legend>Email</legend>
        <input type="email" class="w-100 h3 dropshadow pa2 f4 bn bg-near-white" name="email" required>
      </fieldset>
      <input class="w-100 ba bw2 mw5 mb3 dropshadow h3 b--dark-pink dark-pink bg-white b" type="submit" value="Send Password Reset">
    </form>
    `
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
            ${showInput(state, emit)}
            <small class="dn">Don't have an account? <a class="link black underline" href="/signup">Sign up!</a></small>
          </div>
          
      </main>
    </body>
  `
}