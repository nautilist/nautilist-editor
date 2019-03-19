var html = require('choo/html')

module.exports = view

function onClose(state, emit){
  return e => {
    emit('pushState', '/login')
  }
}

// function submitSendReset(state, emit){
//   return e => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     emit(state.events.user_sendResetPassword, formData);
//   }
// }

// function submitReset(state, emit){
//   return e => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     emit(state.events.user_resetPassword, formData);
//   }

// }

function showInput(state, emit){
  if(state.query.hasOwnProperty('token')){
    emit(state.events.user_sendVerificationToken);
    
    return html`
    <div class="mw6 w-100 flex flex-column items-center">
        <h2>Your account was verified!</h2>
        <a href="/">go to nautilists.com</a>
    </div>
    `
  } else {
    return html`
    <div class="mw6 w-100 flex flex-column items-center">
      <h2>An email was sent to verify your account</h2>
    </div>
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