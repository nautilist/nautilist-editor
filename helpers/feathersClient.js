const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/rest-client');
const auth = require('@feathersjs/authentication-client');
const config = require('../config.js');
let restClientUrl;

if(process.env.NODE_ENV !== 'production'){
    restClientUrl =  'https://localhost:3030' // local feathersjs url
} else {
    restClientUrl =  config.NAUTILISTAPI // https://nautilist-public.herokuapp.com
}

// console.log(`i'm in ${process.env.NODE_ENV} and my url is: ${restClientUrl}`)
const restClient = rest(restClientUrl)
const feathersClient = feathers().configure(restClient.fetch(window.fetch));

// Socket.io is exposed as the `io` global.
// Configure an AJAX library (see below) with that client 
// const api = feathersConnection.configure(restClient.axios(axios));

feathersClient.configure(auth({
    header: 'Authorization', // the default authorization header for REST
    prefix: '', // if set will add a prefix to the header value. for example if prefix was 'JWT' then the header would be 'Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOi...'
    path: '/authentication', // the server-side authentication service path
    jwtStrategy: 'jwt', // the name of the JWT authentication strategy
    entity: 'user', // the entity you are authenticating (ie. a users)
    service: 'users', // the service to look up the entity
    cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
    storageKey: 'feathers-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
    storage: localStorage // Passing a WebStorage-compatible object to enable automatic storage on the client.
}));

module.exports = feathersClient;