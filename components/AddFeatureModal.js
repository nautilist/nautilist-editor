var Component = require('choo/component')
var html = require('choo/html')
// var feathersClient = require('../helpers/feathersClient');


class AddFeatureModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      displayed:'dn',
      featureType: null,
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
    const {featureType} = this.local
    const formData = new FormData(e.currentTarget);
    let payload = {
      url: formData.get('url'),
      name: formData.get('name'),
      description: formData.get('description'),
      tags: formData.get('description').split(','),
    }
    
    if(featureType !== 'links'){
      delete payload.url;
    }

    this.state.api[featureType].create(payload)
      .then(result => {
        if(this.state.params.hasOwnProperty('username')){
          this.emit(`fetch-user`, this.state.params.username)
        } else {
          this.emit(`fetch-${featureType}`)
        } 
        alert('feature added!')
        this.close().call();
      })
      .catch(err => {
        alert(err);
      })

  }

  createElement () {
    let {featureType} = this.local;

    return html`
    <div id="addFeatureModal" class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
    style="background:rgba(232, 253, 245, 0.9)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Add Feature:${featureType}</h2>
          <button class="bn bg-navy yellow bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <!-- Add feature -->
        <section class="w-100 mt2 mb2">
        <form id="addFeatureForm" name="addFeatureForm" onsubmit=${this.handleSubmit}>
          <!-- URL -->
          <fieldset class="w-100 ba bw1 b--black ${featureType == 'links' ? 'fl':'dn'}">
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



