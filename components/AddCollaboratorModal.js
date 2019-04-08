var Component = require('choo/component')
var html = require('choo/html')
// const feathersClient = require('../helpers/feathersClient')

class AddCollaboratorModal extends Component {
  constructor(id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      searchResults: [],
      open:this.open.bind(this),
      displayed:'dn'
    }
    this.state = state;
    this.emit = emit;
    
    this.rerender = this.rerender.bind(this)
    this.addByUrl = this.addByUrl.bind(this)
    this.searchByName = this.searchByName.bind(this)
    this.searchResults = this.searchResults.bind(this)
    this.selectAndAdd = this.selectAndAdd.bind(this)
    this.showCurrentCollaborators = this.showCurrentCollaborators.bind(this)
    this.removeCollaborator = this.removeCollaborator.bind(this);
  }

  open() {
    console.log("opening!")
    this.local.displayed = 'flex';
    this.rerender();
  }

  close() {
    return e => {
      console.log("closing!")
      this.local.displayed = 'dn';
      this.rerender();
    }
  }

  addByUrl(e) {
    e.preventDefault();
    const listId = this.state.selectedList._id
    const form = new FormData(e.currentTarget);
    const url = form.get('url');
    const username = url.split("/").slice(-1).pop()

    // TODO
    this.state.api.users.find({query:{username}}).then(result => {
      if(!result.data.length > 0){
        alert("user not found!");
        return
      } 
      let profile = result.data[0];
      const params = {
        "$push": {
          "collaborators": profile._id
        }
      }
      return this.state.api.lists.patch(listId, params)
    })
    .then(result => {
      alert('added collaborator!')
      this.emit('fetch-list', `${listId}`)
      this.local.open()
    })
    .catch(err => {
      alert(err);
      return err;
    })
  }

  searchByName(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get('username');

    // console.log("searching for: ", username)
    const searchQuery = {
      "query": {
        "$search": username
      }
    }
    this.state.api.users.find(searchQuery).then(result => {
      // console.log(result.data)
      this.local.searchResults = result.data;
      this.rerender();
    }).catch(err => {
      alert(err)
      return err;
    })
  }

  selectAndAdd(e) {
    console.log('clicked!');
    const userId = e.currentTarget.dataset.userid;
    const listId = this.state.selectedList._id;
    const params = {
      "$push": {
        "collaborators": userId
      }
    }

    this.state.api.lists.patch(listId, params, {}).then(result => {
        // alert(JSON.stringify(result)) ;
        alert("user added as collaborator!");
        // this.emit("pushState", `/lists/${listId}`)
        return this.state.api.lists.get(result._id)
      }).then(result => {
        this.state.selectedList = result;
        // this.rerender();
        this.showCurrentCollaborators()
        this.rerender();
      })
      .catch(err => {
        alert(err);
      })
  }

  searchResults() {
    if (this.local.searchResults.length > 0) {
      let users = this.local.searchResults.map(user => {
        return html `
          <div class="w-100 bn bg-light-gray flex flex-column mb2">
            <div class="w-100 pa3 flex flex-row items-center">
              <div class="w-two-thirds">
              <p class=" w-100 ma0 b">${user.username}</p>
              </div>
              <div class="w-third tr">
              <button data-userid="${user._id}" class="dropshadow pa2 bg-dark-pink white bn" onclick=${this.selectAndAdd}>Select</button>
              </div>
            </div>
          </div>
        `
      })
      return users
    } else {
      return ''
    }
  }

  removeCollaborator(_id) {
    return e => {
      const rmId = e.currentTarget.dataset.userid;

      const params = {
        $pull: {
          "collaborators": rmId
        }
      }

      let del = confirm("do you really want to remove this collaborator?");
      if (del === true) {
        this.state.api.lists.patch(_id, params, {})
        .then(result => {
          this.state.selectedList = result;
          this.rerender();
        })
        .catch(err => {
          alert("error removing collaborator", err);
          return err;
        })
      } else {
        return
      }
    }

  }

  showCurrentCollaborators() {

    const {
      _id
    } = this.state.selectedList

    if (this.state.selectedList.hasOwnProperty("collaboratorDetails") &&
      this.state.selectedList.collaboratorDetails.length > 0) {
      return this.state.selectedList.collaboratorDetails.map(collaborator => {
        return html `
        <div class="w-100 bn bg-light-gray flex flex-column mb2">
        <div class="w-100 pa3 flex flex-row items-center">
          <div class="w-two-thirds">
          <p class=" w-100 ma0 b">${collaborator.username}</p>
          </div>
          <div class="w-third tr">
          <button data-userid="${collaborator._id}" class="dropshadow pa2 bg-near-white red bn" onclick=${this.removeCollaborator(_id)}>Remove</button>
          </div>
        </div>
      </div>
        `
      })
    } else {
      return `no collaborators yet`
    }
  }

  createElement() {
    return html `
    <div id="addCollaboratorModal" class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
    style="background:rgba(232, 253, 245, 0.9)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Add Collaborator</h2>
          <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>

        <!-- Current Collaborators -->
        <section class="w-100 mt2 mb2">
          <h3>Current Collaborators</h3>
          ${this.showCurrentCollaborators()}
        </section>

        <!-- By URL section -->
        <section class="w-100 mt2 mb2">
          <h3>Add Collaborator by their profile URL</h3>
          <form id="addByUrlForm-collaborator" name="addByUrlForm-collaborator" onsubmit=${this.addByUrl}>
          <!-- url input -->
          <fieldset class="w-100 ba bw1 b--black flex flex-row-ns flex-column items-center">
          <legend>URL</legend>
          <input class="w-100 w-two-thirds-ns pl2 pr2 ba bw1 bg-light-gray h3 f6" type="text" name="url" placeholder="https://www.nautilists.com/users/shiffman">
          <input class="w-100 w-third-ns h3 pa2 bg-light-pink navy dropshadow bn mt2 ma0-ns" form="addByUrlForm-collaborator" type="submit" value="add collaborator">
          </form>
        </fieldset>
        
        <!-- Search section -->
        <section class="w-100 mt2 mb2">
          <h3>Add Collaborator by searching for their username</h3>
          <!-- Search bar -->
          <form id="searchByName-collaborator" name="searchByName" onsubmit=${this.searchByName}>
          <fieldset class="w-100 ba bw1 b--black flex flex-row-ns flex-column items-center">
          <legend>Search</legend>
          <input class="w-100 w-two-thirds-ns pl2 pr2 ba bw1 bg-light-gray h3 f6" type="search" name="username" placeholder="e.g. shiffman">
          <input class="w-100 w-third-ns h3 pa2 bg-light-pink navy dropshadow bn bw2 mt2 ma0-ns" form="searchByName-collaborator" type="submit" value="search">
          </fieldset>
          </form>
          <!-- Search results -->
          <section id="searchResults-collaborator" class="pa3 flex flex-column h5 overflow-y-scroll bg-white">
            <p>Search Results</p>
           ${this.searchResults()}
          </section>
        </section>
      </div>
      <!-- invisible div under the modal to capture out of modal click to close -->
      <div class="dn w-100 h-100 fixed top-0 left-0" onclick=${this.close()}></div>
    </div>
    `
  }

  update() {
    return false
  }
}

module.exports = AddCollaboratorModal