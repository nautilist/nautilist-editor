var Component = require('choo/component')
var html = require('choo/html')
const yaml = require('js-yaml');
const helpers = require('../helpers');

class EditFeatureModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.state = state;
    this.emit = emit;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.submit = this.submit.bind(this);
    this.displayed = 'dn';
    this.rerender = this.rerender.bind(this)
    this.checkIfList = this.checkIfList.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
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

  submit(){
    return e=> {
      console.log("submitting edits!")
      let currentForm = document.querySelector("#editFeatureForm");
      let formData = new FormData(currentForm);
      
      let updatedFeature = {
        url:formData.get('url'),
        name:formData.get('name'),
        description:formData.get('description'),
      }
      
      let newParent = helpers.updateFeature(this.state.workspace.json, currentForm.dataset.id,updatedFeature)
      let cleanJson = helpers.removeClientId(newParent)
      const newYaml = yaml.safeDump(cleanJson, {'noRefs': true});
      
      this.state.workspace.yaml = newYaml;
      this.state.workspace.json = updatedFeature;

      this.emit("json:addClientId", this.state.workspace.json)
      this.displayed = 'dn';
      this.emit(this.state.events.RENDER)
    }
  }

  checkIfList(_json){
    if(_json.type =="list"){
      return 'dn'
    } else {
      return ''
    }
  }

  removeFeature(_featureid){
    return e=>{
      console.log(this.state.workspace.json)
      let parentCopy = helpers.removeFromTree(this.state.workspace.json, _featureid);
      parentCopy = helpers.removeClientId(parentCopy)

      const newYaml = yaml.safeDump(parentCopy, {'noRefs': true});
      this.state.workspace.yaml = newYaml
      this.state.workspace.json = parentCopy
      this.emit("json:addClientId", this.state.workspace.json)
      this.displayed = 'dn';
      this.emit(this.state.events.RENDER)
    }
  }

  createElement (_json) {
    if(!_json){ 
      _json = {type:"", name:"", url:"", description:""}
    }

    return html`
    <div id="editFeatureModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(25, 169, 116, 0.7)">
    <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
      <header class="flex flex-row items-center justify-between">
        <h2>Edit: ${_json.name}</h2>
        <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
      </header>
      <!-- Edit section -->
      <section>
        <form id="editFeatureForm" data-id="${_json.clientId}">
          <!-- URL -->
          <fieldset class="w-100 ba bw1 b--black ${this.checkIfList(_json)}">
          <legend>URL</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="url" placeholder="url" value="${_json.url}">
        </fieldset>
        <!-- NAME -->
        <fieldset class="w-100 ba bw1 b--black">
          <legend>Name</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="name" placeholder="name" value="${_json.name}">
        </fieldset>
        <!-- DESCRIPTION -->
        <fieldset class="w-100 ba bw1 b--black">
          <legend>Description</legend>
          <textarea class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="description" placeholder="description">${_json.description}</textarea>
        </fieldset>
       </form>
      </section>
      <button class="w-100 h3 bn bg-navy washed-green pa2 mt3 mb3 pointer" onclick=${this.submit()}>save changes</button>
      <div class="w-100 h3 pl2 pt2 pb2 flex flex-row justify-end">
        <button class="bn bg-red dark-grey" onclick=${this.removeFeature(_json.clientId)}>⚠️ DELETE</button>
      </div>
    </div>
    <!-- invisible div under the modal to capture out of modal click to close -->
    <div class="w-100 h-100 fixed top-0 left-0" onclick=${this.close()}></div>
  </div>
    `
  }

  update () {
    return true
  }
}

module.exports = EditFeatureModal

