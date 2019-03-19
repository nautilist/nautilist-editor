const feathersClient = require('../helpers/feathersClient');

module.exports = store

store.storeName = 'user'

function store(state, emitter) {
  const auth = new Auth();

  state.user = {
    username: "",
    authenticated: ""
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
  emitter.on('DOMContentLoaded', function () {
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
  })

  // AUTH FUNCTIONS
  function Auth() {
    // SIGNUP
    this.signup = function (_formData) {
      let credentials = {
        username: _formData.get("username"),
        email: _formData.get("email"),
        password: _formData.get("password")
      }
      feathersClient.service('users').create(credentials).then(() => {
        console.log("sign up successful yo!")
        emitter.emit(state.events.user_login, _formData)
      }).catch(err => {
        console.log("sign up unsuccessful! something went wrong!")
        return error;
      });
    };

    this.checkLogin = function (_formData) {
      feathersClient.authenticate().then(authResponse => {
        // try to auth using JWT from local Storage
        state.user.username = authResponse.username;
        state.user.id = authResponse._id;
        state.user.authenticated = true;
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        console.log("not auth'd friend!")
        state.user.authenticated = false;

        // emitter.emit("pushState", "/login")
        return err;
      });
    };

    // LOGIN
    this.login = function (_formData) {
      if (!_formData) {
        feathersClient.authenticate().then(authResponse => {
          // try to auth using JWT from local Storage
          state.user.username = authResponse.username;
          state.user.id = authResponse._id;
          state.user.authenticated = true;
          emitter.emit("pushState", "/")
          // emitter.emit("pushState", `/${state.user.username}/projects`) //${state.user.username}
        }).catch(err => {
          console.log("not auth'd friend!")
          state.user.authenticated = false;
          // emitter.emit("pushState", "/login")
          return err;
        });
      } else {
        // If we get login information, add the strategy we want to use for login
        let credentials = {
          username: _formData.get("username"),
          email: _formData.get("email"),
          password: _formData.get("password")
        }
        // create the payload
        const payload = Object.assign({
          strategy: 'local'
        }, credentials);

        feathersClient.authenticate(payload).then(authResponse => {
          state.user.authenticated = true;
          state.user.username = authResponse.username;
          state.user.id = authResponse._id;
          emitter.emit("pushState", "/")
          // emitter.emit("pushState", `/${state.user.username}/projects`) //${state.user.username}
        }).catch(err => {
          // Show login page (potentially with `e.message`)
          console.log('Authentication error', err);
          state.user.authenticated = false;
          // emitter.emit("pushState", "/login")
        });
      }
    };

    // LOGOUT
    this.logout = function () {
      feathersClient.logout();
      state.user.username = null;
      state.user.authenticated = false;
      // TODO: clear the state of data, etc
      emitter.emit('pushState', "/");
      emitter.emit('render');
    };

    
    this.sendVerificationToken = function (_formData) {

      const token = state.query.token
      var obj = {
        action: 'verifySignupLong',
        value: token
      }
      feathersClient.service("authmanagement").create(obj).then(result => {
        console.log('user verified!', result)
      }).catch(err => {
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
      feathersClient.service("authmanagement").create(obj).then(result => {
        console.log('password changed!', result)
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
      feathersClient.service("authmanagement").create(obj).then(result => {
        console.log('password changed!', result)
      }).catch(err => {
        return err;
      })
    };

  } // end Auth()
}