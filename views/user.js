var html = require('choo/html')
const NavSelect = require('../components/NavSelect');
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer")
module.exports = view

function view (state, emit) {
  
  return html`
    <body class="w-100 h-100 code lh-copy flex flex-column" onload=${() => emit('fetch-user', state.params.username) }>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 flex flex-column flex-grow-1 items-center">
        <section class="w-100 h-100 mw7">
        ${UserDetails(state, emit)}
        </section>
      </main>
      ${Footer()}
    </body>
  `
}

function UserDetails(state, emit){
  const { selectedUser }= state;

  if(!selectedUser.hasOwnProperty('username')){
    return html`<p>no user</p>`
  }

  const{username, bio, emojis, selectedEmoji} = selectedUser;
  console.log(emojis)

  return html`
  <section class="w-100 flex flex-row">
    <div class="w4 h4">
      <img class="w-100 h-100" src="/assets/${emojis[selectedEmoji]}">
    </div>
    <div>
      <h1>${username}</h1>
      <p>${bio}</p>
    </div>
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