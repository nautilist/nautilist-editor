var html = require('choo/html')
const NavbarTop = require("../components/NavbarTop");
const Footer = require("../components/Footer");
const BackBtn = require('../components/BackBtn');
const AddFeatureBtn = require('../components/AddFeatureBtn');
const AddFeatureModal = require('../components/AddFeatureModal');
const EditableList = require('../components/EditableList');
const EditableListHeader = require('../components/EditableListHeader');
const helpers = require("../helpers")
const AddLinksToSectionModal = require('../components/AddLinksToSectionModal');
const AddSectionToListModal = require('../components/AddSectionToListModal');

const TITLE = 'Nautilists - List';

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `
    <body class="w-100 h-auto code lh-copy flex flex-column" onload=${() => emit('fetch-list', state.params.id)}>
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <!-- main -->
      <main class="w-100 h-auto  flex-grow-1 flex flex-column items-center">
        <section class="w-100 h-100 mw7 pa2 pb5">
        ${BackBtn(state, emit)}

        ${privateActions(state, emit)}
        ${state.cache(EditableListHeader,"EditableListHeader", state, emit).render()}
        ${publicActions(state, emit)}
        
        ${state.cache(EditableList,"EditableList", state, emit).render()}
        </section>
      </main>
      ${Footer()}
        ${state.cache(AddFeatureBtn, "AddFeatureBtn", state, emit).render()}
        ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
        ${state.cache(AddLinksToSectionModal, "AddLinksToSectionModal", state, emit).render()}
        ${state.cache(AddSectionToListModal, "AddSectionToListModal", state, emit).render()}
    </body>
  `

}


function publicActions(state, emit){
    const {selectedList} = state;

    function remix(id, db){
        return e => {
            e.preventDefault();
            e.stopPropagation();

            // TODO: not sure but event listeners are bubbling!
            // emit('remix', {id, db});
            state.api[db].get(id)
                .then(result => {
                let sanitizedResult = helpers.removeIds(result);
                return state.api[db].create(sanitizedResult)
                })
                .then(result => {
                // navigate to the route
                alert('feature copied!')
                    emit('pushState', `/${db}/${result._id}`);
                    // emit('render');
                })
                .catch(err => {
                alert(err);
                })
        }
    }

    return html`
    <section class="w-100 mt4 flex flex-row">
        <button class="bn bg-near-white dark-pink pa2 dropshadow mr2">Follow</button>
        <button id="remixBtn" onclick=${remix(selectedList._id, 'lists')} class="bn bg-near-white dark-pink pa2 dropshadow mr2">Remix</button>
    </section>
    `
}

function privateActions(state, emit){
    const {user, selectedList} = state;

    if(Object.keys(selectedList).length <= 0){
        return ''
    }

    function toggleEditable(e){
        state.components.EditableList.toggleEditable();
        state.components.EditableListHeader.toggleEditable();
        emit('render')   
    }

    function addSection(e){
        state.api.links.find({query:{$limit:20}})
        .then(result => {
            state.links = result.data;
            state.components.AddSectionToListModal.open();
        }).catch(err => {
            alert(err);
        })
    }

    // TODO: do better getting links for modal
    function addLink(e){
        state.api.links.find({query:{$limit:20}})
        .then(result => {
            state.links = result.data;
            state.components.AddLinksToSectionModal.open();
        }).catch(err => {
            alert(err);
        })
    }

    const {ownerDetails, collaboratorDetails} = selectedList;
    if(user.authenticated === true && user.username === ownerDetails.username || collaboratorDetails.includes(user.username)){
        return html`
        <section class="w-100 mt4 flex flex-row items-center">
            <button onclick=${toggleEditable} class="h2 dropshadow bn bg-near-white mr2"><img class="h2" src="/assets/F000A.png"></button>
            <button onclick=${addSection} class="h2  dropshadow bn bg-near-white mr2">Add section</button>
            <button onclick=${addLink} class="h2  dropshadow bn bg-near-white mr2">Add link</button>
            <p class="f7 pl2 ma0 mr2">${state.components.EditableList.editable === true ? 'editing' : '' }</p>
        </section>
        `
    }

}





// ${headerSection(state, emit)}
// function headerSection(state, emit){
//     const {selectedList} = state;

//     if(Object.keys(selectedList).length <= 0){
//         return html`<p class="tc w-100">no details</p>`
//     }
//     const{name, description, ownerDetails, collaboratorDetails, followersDetails} = selectedList

//     return html`
//         <section class="w-100 mt4">
//             <p class="mb2 pa0 f6">${showFollowers(state, emit, followersDetails)}</p>
//             <h2 class="f2 lh-title ma0">${name}</h2>
//             ${showOwner(ownerDetails)}
//             ${showCollaborators(collaboratorDetails)}
//             <h4 class="f4 mt2">${description}</h4>
//         </section>
//     `
// }