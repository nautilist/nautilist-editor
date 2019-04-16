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
const AddCollaboratorModal = require('../components/AddCollaboratorModal');
const EditFeatureModal = require('../components/EditFeatureModal');
const ShowFollowersModal = require('../components/ShowFollowersModal');

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
        ${state.cache(AddCollaboratorModal, "AddCollaboratorModal", state, emit).render()}
        ${state.cache(EditFeatureModal, "EditFeatureModal", state, emit).render()}
        ${state.cache(ShowFollowersModal, "ShowFollowersModal", state, emit).render()}
    </body>
  `

}


function publicActions(state, emit){
    const {selectedList} = state;

    function addFollower(e){
        let c = confirm('follow this list?')
        if(c === true){
            alert('You are now following this list!')

            const params = {
                $push:{
                    followers: state.user.id
                }
            }
            state.api.lists.patch(selectedList._id, params, {})
                .then(result => {
                    state.selectedList = result
                    emit('render');
                })
                .catch(err => {
                    alert(err);
                })

        } else {
            return;
        }
    }

    function remix(id, db){
        return e => {
            e.preventDefault();
            e.stopPropagation();

            // TODO: not sure but event listeners are bubbling!
            // emit('remix', {id, db});
            state.api[db].get(id)
                .then(result => {
                let sanitizedResult = helpers.removeIds(result);
                // Remove collaborators
                sanitizedResult.collaborators = [];
                // Remove followers
                sanitizedResult.followers = [];
                // Remove followers
                sanitizedResult.suggested = [];

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
        <button onclick=${addFollower} class="bn bg-near-white dark-pink pa2 dropshadow mr2">Follow</button>
        <button id="remixBtn" onclick=${remix(selectedList._id, 'lists')} class="bn bg-near-white dark-pink pa2 dropshadow mr2">Remix</button>
    </section>
    `
}



function privateActions(state, emit){
    const {user, selectedList} = state;
    const {ownerDetails, collaboratorDetails} = selectedList;

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

    function addCollaborator(e){
        // alert('add collaborator');
        state.components.AddCollaboratorModal.open();
    }

    function deleteList(e){
        let c = confirm(`Are you sure you want to delete this list - ${selectedList.name} - for you and your collaborators?`)
        if(c === true){
            state.api.lists.remove(selectedList._id)
            .then(result => {
                alert("list deleted!")
                emit('pushState', `/users/${ownerDetails.username}`)
            }).catch(err => {
                alert(err);
            })
        } else{
            return;
        }
    }

    const isCollaborator = collaboratorDetails.find(item => item.username === user.username) ? true:false;
    if(user.authenticated === true && user.username === ownerDetails.username || isCollaborator === true){
        return html`
        <section class="w-100 mt4 flex flex-row-ns flex-column items-center-ns flex-wrap-ns items-start">
            <button onclick=${toggleEditable} class="mt2 h2 flex flex-row items-center dropshadow bn bg-near-white mr2"><img class="ma0 pa0 h2" src="/assets/1F58D.png"> Edit List</button>
            <button onclick=${addSection} class="mt2 h2 flex flex-row items-center dropshadow bn bg-near-white mr2"><img class="ma0 pa0 h2" src="/assets/1F490.png"> Add section</button>
            <button onclick=${addLink} class="mt2 h2 flex flex-row items-center  dropshadow bn bg-near-white mr2"><img class="ma0 pa0 h2" src="/assets/1F517.png"> Add link</button>
            <button onclick=${addCollaborator} class="mt2 h2 flex flex-row items-center dropshadow bn bg-near-white mr2"><img class="ma0 pa0 h2" src="/assets/1F984.png"> Add Collaborator</button>
            <button onclick=${deleteList} class="mt2 h2 flex flex-row items-center  dropshadow bn bg-near-white red mr2"><img class="ma0 pa0 h2" src="/assets/1F5D1.png"> Delete List</button>
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