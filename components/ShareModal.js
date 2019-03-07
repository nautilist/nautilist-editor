var Component = require('choo/component')
var html = require('choo/html')
var feathersClient = require('../helpers/feathersClient');

class ShareModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.state = state;
    this.emit = emit;
    this.open = this.open.bind(this);
    this.displayed = 'dn';
    this.rerender = this.rerender.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.isAuthd = this.isAuthd.bind(this)
  }

  open(){
    return e => {
      console.log("opening!")
      this.displayed = 'flex';
      this.rerender();
    }
    
  }
  
  close(){
    return e => {
      console.log("closing!")
      this.displayed = 'dn';
      this.rerender();
    }
    
  }

  handleSubmit(){
    return e=> {
        console.log("submitting to public!")
        const payload = {
          html:'',
          md: this.state.workspace.md,
          json: this.state.workspace.json,
          name: this.state.workspace.json.name,
          description: this.state.workspace.json.description
        }
        
        // submit the payload to the server annonymously
        feathersClient.service("/api/projects").create(payload).then(result => {
          console.log(results)
          this.emit('pushState', '/public');
          this.emit('render');
        }).catch(err => {
          return err;
        })

    }
  }

  isAuthd(){
    feathersClient.authenticate().then( authResponse => {
      // try to auth using JWT from local Storage
      // state.user.username = authResponse.username;
      // state.user.id = authResponse._id;
      // state.user.authenticated = true;
      // emitter.emit(state.events.RENDER);
      console.log('is authenticated!');
      return html`<div>hello @username!</div>`
    }).catch(err => {
      console.log("not auth'd friend!")
      // state.user.authenticated = false;
      
      // emitter.emit("pushState", "/login")
      // console.log(err);
      // return err;
      return html`<div>submit anonymously</div>`
    });
  }

  createElement () {
    return html`
    <div id="shareModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(255, 215, 0,0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Share (Coming soon!)</h2>
          <button class="bn bg-navy yellow bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 mt2 mb2">
          <p>Share your list in <a class="link black underline b" href="/public" target="_blank">Nautilist Public</a> or as an HTML page. More formats coming soon!</p>
        </section>
        <!-- Sharing Options -->
        <section class="flex flex-column">
          ${this.isAuthd()}
         <button onclick="${this.handleSubmit()}" class="h3 grow pointer pa2 mb2 bn dropshadow bg-pink navy">🚀 Send to Nautilist Public</button>
         <button class="pa2 mb2 bn dropshadow bg-pink navy dn">✨ Download HTML page</button>
        </section>
        <button class="w-100 h3 bn bg-navy yellow pa2 mt3 mb3 pointer" onclick=${this.close()}>close</button>
      </div>
      <!-- invisible div under the modal to capture out of modal click to close -->
      <div class="w-100 h-100 fixed top-0 left-0" onclick=${this.close()}></div>
    </div>
    `
  }

  update () {
    return false
  }
}

module.exports = ShareModal