var Component = require('choo/component')
var html = require('choo/html')
var feathersClient = require('../helpers/feathersClient');

class AddFeatureModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      displayed:'dn',
      open: this.open.bind(this)
    }
    this.state = state;
    this.emit = emit;
    
    this.rerender = this.rerender.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  open(){
      console.log("opening!")
      this.local.displayed = 'flex';
      this.rerender();
  }
  
  close(){
    return e => {
      console.log("closing!")
      this.local.displayed = 'dn';
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
          this.emit('pushState', '/projects');
          this.emit('render');
        }).catch(err => {
          return err;
        })

    }
  }


  createElement () {
    return html`
    <div id="addFeatureModal" class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(255, 215, 0,0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Add Feature</h2>
          <button class="bn bg-navy yellow bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <!-- Add feature -->
        <section class="w-100 mt2 mb2">
        <section>
        <form id="addFeatureForm">
          <!-- URL -->
          <fieldset class="w-100 ba bw1 b--black">
          <legend>URL</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="url" placeholder="url">
        </fieldset>
        <!-- NAME -->
        <fieldset class="w-100 ba bw1 b--black">
          <legend>Name</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="name" placeholder="name">
        </fieldset>
        <!-- DESCRIPTION -->
        <fieldset class="w-100 ba bw1 b--black">
          <legend>Description</legend>
          <textarea class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="description" placeholder="description"></textarea>
        </fieldset>
       </form>
      </section>
      <button class="w-100 h3 bn bg-navy washed-green pa2 mt3 mb3 pointer">add</button>
        </section>
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

module.exports = AddFeatureModal



