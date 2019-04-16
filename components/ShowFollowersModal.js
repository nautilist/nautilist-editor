var Component = require('choo/component')
var html = require('choo/html')
// const feathersClient = require('../helpers/feathersClient')

class ShowFollowersModal extends Component {
  constructor(id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      open:this.open.bind(this),
      displayed:'dn'
    }
    this.state = state;
    this.emit = emit;
    
    this.rerender = this.rerender.bind(this)
    this.showCurrentFollowers = this.showCurrentFollowers.bind(this)
    this.removeFollower = this.removeFollower.bind(this);
    this.showRemoveButton = this.showRemoveButton.bind(this);
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


  removeFollower(_id) {
    return e => {
      const rmId = e.currentTarget.dataset.userid;

      const params = {
        $pull: {
          "followers": rmId
        }
      }

      let del = confirm("do you really want to stop following this list?");
      if (del === true) {
        this.state.api.lists.patch(_id, params, {})
        .then(result => {
          this.state.selectedList = result;
          this.rerender();
        })
        .catch(err => {
          alert("error removing follower", err);
          return err;
        })
      } else {
        return
      }
    }

  }

  showRemoveButton(followerId){
      const {_id} = this.state.selectedList
      if(this.state.user.authenticated &&  this.state.user.id === followerId){
        return html`
        <button data-userid="${followerId}" class="dropshadow pa2 bg-near-white red bn" onclick=${this.removeFollower(_id)}>Remove</button>
        `
      }
  }



  showCurrentFollowers() {

    const {
      _id
    } = this.state.selectedList

    if (this.state.selectedList.hasOwnProperty("followersDetails") &&
      this.state.selectedList.followersDetails.length > 0) {
      return this.state.selectedList.followersDetails.map(follower => {
        return html `
        <a href="/users/${follower.username}" class="w-100 bn bg-light-gray flex flex-column mb2 black link">
        <div class="w-100 pa3 flex flex-row items-center">
          <div class="w-two-thirds">
          <p class=" w-100 ma0 b">${follower.username}</p>
          </div>
          <div class="w-third tr">
          ${this.showRemoveButton(follower._id)}
          </div>
        </div>
      </a>
        `
      })
    } else {
      return `no followers yet`
    }
  }

  createElement() {
    return html `
    <div id="ShowFollowersModal" class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
    style="background:rgba(232, 253, 245, 0.9)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>People following this list</h2>
          <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>

        <!-- Current Collaborators -->
        <section class="w-100 mt2 mb2">
          ${this.showCurrentFollowers()}
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

module.exports = ShowFollowersModal