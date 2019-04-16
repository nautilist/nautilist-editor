var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require('../components/Footer');
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

module.exports = view


function profileImageSelect(state, emit){
  const {selectedUser} = state;
  const {profile} = selectedUser;

  function changeImage(e){
    console.log(e.target.value)
    const data = {
      selectedEmoji: parseInt(e.target.value)
    }

    console.log(data)
    state.api.users.patch(profile._id, data)
      .then(result => {
        console.log(result);
        state.selectedUser.profile = result;
        emit('render');
      })
      .catch(err => {
        alert(err);
      })
  }

  return html`
    <select class="w4" name="selectedEmoji" onchange=${changeImage}>
      ${profile.emojis.map( (emoji, idx) => {
        const emojiname = emoji.split('-')[0].toLowerCase()
        if(idx == profile.selectedEmoji ){
          return html`<option value="${idx}" selected>${emojiname}</option>`
        }
        return html`
          <option value="${idx}">${emojiname}</option>
        `
      })}
    </select>
  `
}

function view(state, emit) {
  const {user, selectedUser} = state;

  function handleSubmit(e){
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    const data = {
      bio: formData.get('bio'),
      selectedEmoji: parseInt(formData.get('selectedEmoji'))
    }

    state.api.users.patch(user.id, data)
      .then(result => {
        alert('profile saved!')
        state.selectedUser.profile = result;
        emit('render')
      })
      .catch(err => {
        alert(err);
      })

  }
  
  if(user.authenticated === true && user.username === selectedUser.profile.username ){
    return html`
    <body class="w-100 h-auto code lh-copy flex flex-column" onload=${()=> emit('fetch-user', state.params.username)}>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
      <section class="w-100 h-100 mw7 pa2 pb5">
        <a class="bn black f6" href="/users/${selectedUser.profile.username}">Back to user page</a>

        <h1>Settings</h1>
        <h2>${selectedUser.profile.username}</h2>

        <form onsubmit=${handleSubmit}>
          <fieldset class="w-100 flex flex-column bn">
          <legend>Profile Image</legend>
          <img class="w4" src="/assets/${selectedUser.profile.emojis[selectedUser.profile.selectedEmoji]}">
          ${profileImageSelect(state, emit)}
          </fieldset>

          <fieldset class="w-100 flex ba b--black dropshadow flex-column mt3">
          <legend class="pl2 pr2">Bio</legend>
          <input class="w-100 h2 bg-near-white bn" name="bio" type="text" value="${selectedUser.profile.bio}">
          </fieldset>
          <input class="bg-navy bn dropshadow h3 pa2 pink mt3" type="submit" value="save settings">
        </form>


      </section>
      </main>
      ${Footer()}
      ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
    `
  } else {
    return html`
    <body class="w-100 h-auto code lh-copy flex flex-column" onload=${()=> emit('fetch-user', state.params.username)}>
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
      <section class="w-100 h-100 mw7 pa2 pb5">
        <h1>Hello there. You're not logged in.</h1>
        <p>→ <a class="link black underline f3" href="/login">login</a></p>
      </section>
      </main>
      ${Footer()}
      ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
    `
  }
    
}

