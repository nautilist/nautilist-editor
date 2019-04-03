var Component = require('choo/component')
var html = require('choo/html')

function AddCollectionForm(state, emit){
  
    function createNewCollection(e){
      e.preventDefault();
      let formData = new FormData(e.currentTarget);
      
      const payload = {
        name: formData.get('name') || "new collection",
        description: formData.get('name') || "new collection about something interesting",
      }
  
      state.api.collections.create(payload).then(result => {
        alert("new collection created!");
        emit('fetch-user') 
      }).catch(err => {
        alert(err);
      })
  
    }
    if (state.user.authenticated === true && state.params.username === state.user.username) {
      
        return html`
        <li class="mw6 shadow-5 mb3">
            <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
              <form id="newCollectionForm" name="newCollectionForm" class="flex flex-row-ns flex-column w-100" onsubmit=${createNewCollection}>
                <div class="w-two-thirds-ns w-100">
                  <input class="w-100 pa2 f6 bn mb1" type="text" name="name" placeholder="New Collection Name">
                  <input class="w-100 pa2 f6 bn" type="text" name="description" placeholder="New Collection Description">
                </div>
                <div class="w-third-ns w-100 tr">
                <input class="pointer bn pa3 bg-yellow navy h-100" type="submit" form="newCollectionForm" value="create">
                </div>
              </div>
            </div>
        </li>
        `
    }
    else{
      return ''
      }
  }

module.exports = AddCollectionForm