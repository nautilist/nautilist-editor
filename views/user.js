var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer")
const UserContributions = require("../components/UserContributions")
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');
const ShowUserFollowersModal = require('../components/ShowUserFollowersModal');
const ShowUserFollowingModal = require('../components/ShowUserFollowingModal');

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
      ${state.cache(ShowUserFollowersModal, "ShowUserFollowersModal", state, emit).render()}
      ${state.cache(ShowUserFollowingModal, "ShowUserFollowingModal", state, emit).render()}
    </body>
  `
}

function EditUserDetailsBtn(state, emit){
  const {user} = state;
  const selectedUsername = state.params.username
  
  if(user.authenticated === true && user.username === selectedUsername ){
    return html`
      <button class="bn bg-white underline f7" onclick=${()=> emit('pushState', `/settings/${selectedUsername}`)}>edit profile</button>
    `
  } else {
    return ''
  }

}

function UserDetails(state, emit){
  const { profile, followers }= state.selectedUser;
  if(!profile.hasOwnProperty('username')){
    return html`<p>no user</p>`
  }

  const{username, bio, emojis, selectedEmoji, followingDetails} = profile;

  let hasFollowers = followers.length > 0 ? followers.length : 0;


  function followersBtn(){
    return html`
      <span class="underline pointer" onclick=${() => state.components.ShowUserFollowersModal.open()}>followers</span>
    `
  }

  function followingBtn(){
    return html`
      <span class="underline pointer" onclick=${() => state.components.ShowUserFollowingModal.open()}>following</span>
    `
  }

  return html`
  <section class="w-100 flex flex-column mt4">
    <section class="w-100 flex flex-row">
    ${EditUserDetailsBtn(state, emit)}
    </section>
    <section class="w-100 h-auto flex flex-row-ns flex-column">
      <div class="h-100">
        <img class="h4" src="/assets/${emojis[selectedEmoji]}">
      </div>
      <div class="w-100 h-100 flex flex-column justify-center pa2">
        <h1 class="ma0">${username}</h1>
        <p class="ma0">${bio}</p>
        <p class="ma0 f6">${hasFollowers} ${followersBtn()} · ${followingDetails.length} ${followingBtn()}</p>
      </div>
    </section>
    
  </section>
  `
}
