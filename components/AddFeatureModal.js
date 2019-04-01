var Component = require('choo/component')
var html = require('choo/html')
var feathersClient = require('../helpers/feathersClient');

class AddFeatureModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      displayed:'dn',
      // name:'',
      // description:'',
      // url:'',
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

  handleSubmit(e){
        e.preventDefault();
        // html:'',
        // md: this.state.workspace.md,
        // json: this.state.workspace.json,
        console.log("submitting to public!")
        const formData = new FormData(e.currentTarget);
        
        let payload = {
          url: formData.get('url'),
          name: formData.get('name'),
          description: formData.get('description'),
          tags: formData.get('description').split(','),
        }

        if(this.state.currentTab == 'links') delete payload.url;
        
        console.log(payload)
        // submit the payload to the server annonymously
        feathersClient.service(`/api/${this.state.editor.currentTab}`).create(payload).then(result => {
          console.log(result)
          // this.emit('pushState', '/projects');
          // this.state[this.state.editor.currentTab].unshift(result)
          this.close();
          this.emit('render');
        }).catch(err => {
          alert(err);
        })

    }


  createElement () {
    let {currentTab} = this.state.editor;
    return html`
    <div id="addFeatureModal" class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(255, 215, 0,0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Add Feature: ${this.state.editor.currentTab}</h2>
          <button class="bn bg-navy yellow bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <!-- Add feature -->
        <section class="w-100 mt2 mb2">
        <form id="addFeatureForm" name="addFeatureForm" onsubmit=${this.handleSubmit}>
          <!-- URL -->
          <fieldset class="w-100 ba bw1 b--black ${currentTab == 'links' ? 'fl':'dn'}">
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
        <fieldset class="w-100 ba bw1 b--black">
          <legend>Tags</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="tags" placeholder="tags, separated, by, comma">
        </fieldset>
        <input class="w-100 h3 bn bg-navy washed-green pa2 mt3 mb3 pointer tc" type="submit" value="add">
       </form>
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



