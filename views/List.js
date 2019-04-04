var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer");
const BackBtn = require('../components/BackBtn');
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');

const TITLE = 'Nautilists - List';

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `
    <body class="w-100 h-100 code lh-copy flex flex-column" onload=${() => emit('fetch-list', state.params.id)}>
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <!-- main -->
      <main class="w-100 flex flex-column flex-grow-1 items-center mb5">
        <section class="w-100 h-100 mw7 pa2">
        ${BackBtn(state, emit)}

        ${privateActions(state, emit)}
        ${headerSection(state, emit)}
        ${publicActions(state, emit)}
        </section>
      </main>
      ${Footer()}
        ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
    </body>
  `

}

function showOwner(details){
    return html`<p class="f6 mt1">By <a class="link black underline" href="/users/${details.username}">${details.username}</a></p>`
}

function showCollaborators(details){
    if(details.length <=0){
        return ''
    }

    const collaborators = details.map( (person, idx)  => {
        return html`
            <a class="link black underline" href="/users/${person.username}">${person.username} ${idx < details.length - 1 ? '·' : ''}</a>
        `
    });

    return html`
        <p class="ma0 f6">Together with ${collaborators}</p>
    `
}

function showFollowers(state, emit, details){
    function displayFollowerList(e){
        alert('show followers');
    }

    return html`
        <button onclick=${displayFollowerList} class="ma0 pa0 bn  bg-white f6">${details.length} Followers</button>
    `
}



function headerSection(state, emit){
    const {selectedList} = state;

    if(Object.keys(selectedList).length <= 0){
        return html`<p class="tc w-100">no details</p>`
    }
    const{name, description, ownerDetails, collaboratorDetails, followersDetails} = selectedList

    return html`
        <section class="w-100 mt4">
            <p class="mb2 pa0 f6">${showFollowers(state, emit, followersDetails)}</p>
            <h2 class="f2 lh-title ma0">${name}</h2>
            ${showOwner(ownerDetails)}
            ${showCollaborators(collaboratorDetails)}
            <h4 class="f4 mt2">${description}</h4>
        </section>
    `
}

function publicActions(state, emit){
    return html`
    <section class="w-100 mt4 flex flex-row">
        <button class="bn bg-near-white dark-pink pa2 dropshadow mr2">Follow</button>
        <button class="bn bg-near-white dark-pink pa2 dropshadow mr2">Remix</button>
    </section>
    `
}

function privateActions(state, emit){
    const {user, selectedList} = state;

    if(Object.keys(selectedList).length <= 0){
        return ''
    }

    const {ownerDetails, collaboratorDetails} = selectedList;
    if(user.authenticated === true && user.username === ownerDetails.username || collaboratorDetails.includes(user.username)){
        return html`
        <section class="w-100 mt4 flex flex-row">
            <button class="bn bg-near-white mr2"><img class="h2" src="/assets/F000A.png"></button>
        </section>
        `
    }

}