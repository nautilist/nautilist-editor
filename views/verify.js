var html = require('choo/html')

module.exports = view

function onClose(state, emit){
  return e => {
    e.preventDefault();
    emit('pushState', '/login')
  }
}

function triggerVerify(state, emit){
  if(state.query.hasOwnProperty('token')){
    console.log("yes!!")
    const token = state.query.token
    var obj = {
      action: 'verifySignupLong',
      value: token
    }
    state.api.authmanagement.create(obj)
    .then(result => {
      console.log('user verified!')
      // alert('Sending your account verification - please check your inbox :)')
    }).catch(err => {
      return err;
    })
  }
}

function showInput(state, emit){
  if(state.query.hasOwnProperty('token')){
    console.log("yes!!")
       return html`
    <div class="mw6 w-100 flex flex-column items-center">
        <h2>Your account was verified!</h2>
        <h3>Go to <a class="link black underline" href="/login">nautilists.com/login</a> to get started!</h3>
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
    <body class="code lh-copy w-100 h-100" onload=${() => triggerVerify(state, emit)}>
      <div class="w-100 flex flex-row items-center justify-between">
        <a class="link black w3 ml2" href="/"><img src="/assets/logo-wow.png"></a>
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