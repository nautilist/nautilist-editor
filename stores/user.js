module.exports = store

store.storeName = 'user'

function store(state, emitter) {
  const auth = new Auth();

  state.user = {
    username: "",
    authenticated: "",
    id:""
  }


  state.events.user_signup = 'user:signup';
  state.events.user_login = 'user:login';
  state.events.user_logout = 'user:logout';
  state.events.user_resetPassword = 'user:resetPassword';
  state.events.user_sendResetPassword = 'user:sendResetPassword';
  state.events.user_sendVerificationToken = 'user:sendVerificationToken';

  

  // initialize the app by trying to login
  auth.checkLogin();
  // LISTENERS
  // emitter.on('DOMContentLoaded', () => {
    // SIGNUP
    emitter.on(state.events.user_signup, auth.signup);
    // LOGIN
    emitter.on(state.events.user_login, auth.login);
    // LOGOUT
    emitter.on(state.events.user_logout, auth.logout);
    // RESET
    emitter.on(state.events.user_resetPassword, auth.resetPassword);
    // SEND RESET
    emitter.on(state.events.user_sendResetPassword, auth.sendResetPassword);
    // SEND RESET
    emitter.on(state.events.user_sendVerificationToken, auth.sendVerificationToken);
  // })

  // AUTH FUNCTIONS
  function Auth() {
    // SIGNUP
    this.signup = function (_formData) {
      let credentials = {
        username: _formData.get("username"),
        email: _formData.get("email"),
        password: _formData.get("password")
      }
      state.api.users.create(credentials).then(() => {
        alert('Sign up successful - you will receive an email from hello.nautilists@gmail.com to verify your account')
        // emitter.emit(state.events.user_login, _formData)
        emitter.emit('pushState', "/verify")
      }).catch(err => {
        alert('Something went wrong!', err)
        return error;
      });
    };

    this.checkLogin = function (_formData) {
      state.api.authenticate().then(authResponse => {
        // try to auth using JWT from local Storage
        state.user.username = authResponse.username;
        state.user.id = authResponse.id;
        state.user.authenticated = true;
        // emitter.emit('pushState', '/')
        emitter.emit('render');
      }).catch(err => {
        console.log("Sorry, you're not logged in!")
        state.user.authenticated = false;
        return err;
      });
    };

    // LOGIN
    this.login = function (_formData) {
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
    };

    // LOGOUT
    this.logout = function () {
      state.api.logout();

      state.user.username = null;
      state.user.authenticated = false;
      state.user.id = null;
      // TODO: clear the state of data, etc
      emitter.emit('pushState', "/");
      // emitter.emit('render');
      // window.location = "/";
    };


    this.sendVerificationToken = function (_formData) {

      const token = state.query.token
      var obj = {
        action: 'verifySignupLong',
        value: token
      }
      state.api.authmanagement.create(obj)
      .then(result => {
        // console.log('user verified!', result)
        alert('Sending your account verification - please check your inbox :)')
      }).catch(err => {
        alert(err);
        return err;
      })
    };

    this.sendResetPassword = function (_formData) {

      const obj = {
        action: 'sendResetPwd',
        value: {
            email: _formData.get('email')
          }
        }
        state.api.authmanagement.create(obj)
          .then(result => {
            // console.log('sending reset password!', result)
            alert("Sending reset password url to your email inbox - please check your email")
          }).catch(err => {
            return err;
          })
    };

    this.resetPassword = function (_formData) {

      const token = state.query.token
      const obj = {
        action: 'resetPwdLong',
        value: {
          token: token,
          password: _formData.get('password')
        }
      }
      state.api.authmanagement.create(obj)
        .then(result => {
          // console.log('password changed!', result)
          // emitter.emit('pushState', '/login')
          window.location = "/login";
        }).catch(err => {
          return err;
        })
    };

  } // end Auth()
}