var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer")
const UserContributions = require("../components/UserContributions")
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

module.exports = view

function view (state, emit) {
  
  return html`
    <body class="w-100 h-auto code lh-copy flex flex-column" onload=${() => emit('fetch-user', state.params.username) }>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
        <section class="w-100 h-100 mw7 pa2">
          ${UserDetails(state, emit)}
          ${state.cache(UserContributions, "UserContributions", state, emit).render()}
        </section>
      </main>
      ${Footer()}
      ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
  `
}

function EditUserDetailsBtn(state, emit){
  const {user} = state;
  const selectedUsername = state.params.username
  
  if(user.authenticated === true && user.username === selectedUsername ){
    return html`
      <button class="bn bg-white underline f7" onclick=${()=>alert('profile page')}>edit profile</button>
    `
  } else {
    return ''
  }

}

function UserDetails(state, emit){
  const { profile }= state.selectedUser;
  if(!profile.hasOwnProperty('username')){
    return html`<p>no user</p>`
  }

  const{username, bio, emojis, selectedEmoji} = profile;

  return html`
  <section class="w-100 flex flex-column mt4">
    <section class="w-100 flex flex-row">
    ${EditUserDetailsBtn(state, emit)}
    </section>
    <section class="w-100 h4 flex flex-row">
      <div class="h-100">
        <img class="h-100" src="/assets/${emojis[selectedEmoji]}">
      </div>
      <div class="w-100 h-100 flex flex-column justify-center pa2">
        <h1 class="ma0">${username}</h1>
        <p class="ma0">${bio}</p>
        <p class="ma0 f6"># followers · # following</p>
      </div>
    </section>
    
  </section>
  `
}



/**
<main class="w-100 pa4 flex flex-column">
        <a class="link black b underline" href="/users">← back to users page</a>
    
        <h1 class="tl">${state.selectedUser.username}</h1>
        <div class="flex flex-row-ns flex-column w-100">
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>My Projects</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderUserProjects()}
              </ul>
            </section>
          </section>

          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>My Collections</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderUserCollections()}
              ${newCollectionBtn(state, emit)}
              </ul>
            </section>
          </section>
        </div>

        <h1 class="tl">Things I'm Following</h1>
        <div class="flex flex-row-ns flex-column w-100">
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>Projects I follow</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderFollowingProjects()}
              </ul>
            </section>
          </section>
          <section class="w-50-ns w-100 flex flex-column">
            <section class="mb4">
              <h2>Collections I follow</h2>
              <ul class="list pl0 pr3 w-100">
              ${renderFollowingCollections()}
              </ul>
            </section>
          </section>
        </div>
      </main>
 */