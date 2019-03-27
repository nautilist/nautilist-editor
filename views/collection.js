var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');
const NavbarTop = require("../components/NavbarTop");
const Footer = require('../components/Footer')

module.exports = view

function deleteFeature(state, emit) {

    function deleteCollection(e) {
        let {
            _id
        } = state.selectedCollection
        let del = confirm("do you really want to delete this?");
        if (del === true) {
            feathersClient.service("/api/collections").remove(_id).then(result => {
                alert("collection deleted!")
                emit('pushState', '/collections');
            }).catch(err => {
                alert(err);
            })
        } else {
            return;
        }
    }

    if (state.user.authenticated === true) {
        if (state.selectedCollection.hasOwnProperty("ownerDetails") && state.selectedCollection.ownerDetails.username == state.user.username) {
            return html `
        <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-orange navy" onclick=${deleteCollection}>Delete Collection</button></li>
        `
        } else {
            return ``
        }
    }
}

function followCollection(state, emit) {
    return e => {
        const collectionId = state.selectedCollection._id
        const params = {
            "$push": {
                "followers": state.user.id
            }
        }
        feathersClient.service('/api/collections').patch(collectionId, params, {}).then(result => {
            alert("you started following this list!");
            return result
        }).catch(err => {
            alert(err);
            return err;
        })
    }
}



function view(state, emit) {
    let selectedCollection = state.selectedCollection;

    function createlistItem(feature) {

        function removeFromCollection(e) {
            e.preventDefault();
            const collectionId = state.selectedCollection._id
            const projectId = feature._id;

            const params = {
                "$pull": {
                    "projects": projectId
                }
            }

            let del = confirm("do you really want to delete this?");
            if (del === true) {
                feathersClient.service("/api/collections").patch(collectionId, params, {}).then(result => {
                    alert("project removed!")
                    emit('pushState', `/collections/${collectionId}`);
                }).catch(err => {
                    alert(err);
                })
            } else {
                return;
            }

        }

        function removeFromCollectionBtn(){
            if(state.user.authenticated === true && state.selectedCollection.ownerDetails.username === state.user.username){
                return html`<button class="f7 bn self-end" onclick=${removeFromCollection}>remove from collection</button>`
            } else{
                return ''
            }
        }

        return html `
      <li class="item w5 h5 pa2 ba bw1 mb1 mt1 bg-white mr1 ml1">
        <div class="w-100 h-100 flex flex-column justify-between items-start">
            <div>
                <a class="link underline black f7 b" href="/projects/${feature._id}">${feature.name}</a>
                <p class="ma0 f7">${feature.description}</p>
            </div>
          ${removeFromCollectionBtn()}
        </div>
      </li>
      `
    } // end createListItem

    function createList(parentObject) {
        if (parentObject !== undefined && parentObject.hasOwnProperty('projectsDetails')) {

            let {
                projectsDetails
            } = parentObject;
            return html `
        <ul class="list pl0 list-container flex flex-row flex-wrap">
          ${
            projectsDetails.map(project => {
                return createlistItem(project)
            })
          }
        </ul>
        `
        }
    } // end createList

    function checkOwner(project) {
        if (project.hasOwnProperty('owner')) {
            return html `<a class="link black underline" href="/users/${project.ownerDetails.username}">${project.ownerDetails.username}</a>`
        } else {
            return '🤖'
        }
    }

    return html `
  <body class="w-100 h-100 code lh-copy" onload=${()=> emit('fetch-collection', state.params.id)}>
  ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
    <div class="w-100 flex flex-column h-auto pl2 pr2 bg-washed-green" style="flex-grow:1">
            <div class="w-100 pt3 pb2 ">
              <a class="link black underline pointer" href="/collections">Back to Collections</a>
            </div>
        <section class="w-100 h-auto flex flex-row pb4">
            <section class="w-70 h-100 pr2">
                <div class="w-100 h-100 pl2 pr2 bg-washed-green">
                  <header class="w-100 flex flex-column pl2 pr2">
                    <div class="w-100 flex flex-column">
                      <h1 class="f2 lh-title mb0">${selectedCollection.name || "No collection name yet"}</h1>
                      <small class="ma0">created by ${checkOwner(selectedCollection)} </small>
                    </div>
                    
                    <p class="f5 lh-copy mt0 mb2">${selectedCollection.description ||  "No collection description yet"}</p>
                  </header>
                  <section class="w-100">
                  ${createList(selectedCollection)}
                  </section>
                </div>
            </section>  
            <section class="w-30 h-100">
                <div class="bn bg-light-gray br2 w-100 pa2 h-100">
                    <section>
                        <h3 class="">Organize</h3>
                        <ul class="list pl0 flex flex-column items-start w-80">
                            <li class="mb2 w-100"><button class="w-100 pa2 bn dropshadow bg-light-blue navy" onclick=${followCollection(state, emit)}>Follow Collection</button></li>
                            ${deleteFeature(state, emit)}
                        </ul>
                    </section>
                </div>
            </section>  
        </section>
        </div>
        ${Footer()}
  </body>
  `
}