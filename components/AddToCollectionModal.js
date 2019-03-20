var Component = require('choo/component')
var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient')

class AddToCollectionModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.state = state;
    this.emit = emit;
    this.open = this.open.bind(this);
    this.displayed = 'flex';
    this.rerender = this.rerender.bind(this)
    this.createAndAdd = this.createAndAdd.bind(this)
    this.addByUrl = this.addByUrl.bind(this)
  }

  open(){
    // return e => {
      console.log("opening!")
      this.displayed = 'flex';
      this.rerender();
    // }
    
  }
  
  close(){
    return e => {
      console.log("closing!")
      this.displayed = 'dn';
      this.rerender();
    }
  }

  createAndAdd(e){
    e.preventDefault();
    console.log(e.currentTarget);
    const form = new FormData(e.currentTarget);
    const name = form.get('name');

    const payload = {
        name: name,
        description: `A super interesting collection related to ${name}`,
        projects: [this.state.selectedProject._id]
    }

    feathersClient.service('/api/collections').create(payload, {}).then(result => {
      alert(JSON.stringify(result)) ;
    })
    .catch(err => {
      alert(err);
    })
    
  }

  addByUrl(e){
    e.preventDefault();
    console.log(e.currentTarget);
    const form = new FormData(e.currentTarget);
    const url = form.get('url');
    const collectionId = url.split("/").slice(-1).pop()

    const params = {
      "$push":{
        "projects": this.state.selectedProject._id
      } 
    }


    feathersClient.service('/api/collections').patch(collectionId, params, {}).then(result => {
      alert(JSON.stringify(result)) ;
    })
    .catch(err => {
      alert(err);
    })

  }

  createElement () {
    return html`
    <div id="addToCollectionModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(25, 169, 116, 0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Add To Collection</h2>
          <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        
        <!-- add section -->
        <section class="w-100 mt2 mb2">
          <p>Create a new collection and add this project</p>
          <form id="createAndAddForm" name="createAndAddForm" onsubmit=${this.createAndAdd}>
          <fieldset class="w-100 ba bw1 b--black flex flex-row-ns flex-column items-center">
            <legend>New Collection</legend>
            <input class="w-100 w-two-thirds-ns pl2 pr2 ba bw1 bg-light-gray h3 f6" type="text" name="name" placeholder="ITP Course XYZ">
            <input class="w-100 w-third-ns h3 pa2 bg-pink bn mt2 ma0-ns" form="createAndAddForm" type="submit" value="Create & Add">
          </fieldset>
          </form>
        </section>

        <!-- By URL section -->
        <section class="w-100 mt2 mb2">
          <p>Add this project to an existing collection by URL</p>
          <form id="addByUrlForm" name="addByUrlForm" onsubmit=${this.addByUrl}>
          <!-- url input -->
          <fieldset class="w-100 ba bw1 b--black flex flex-row-ns flex-column items-center">
          <legend>URL</legend>
          <input class="w-100 w-two-thirds-ns pl2 pr2 ba bw1 bg-light-gray h3 f6" type="text" name="url" placeholder="https://editor.nautilists.com/collections/abc123">
          <input class="w-100 w-third-ns h3 pa2 bg-light-yellow bn mt2 ma0-ns" form="addByUrlForm" type="submit" value="Add to collection">
          </form>
        </fieldset>
        
        <!-- Search section -->
        <section class="w-100 mt2 mb2">
          <p>Add this project to an existing collection</p>
          <!-- Search bar -->
          <fieldset class="w-100 ba bw1 b--black flex flex-row-ns flex-column items-center">
          <legend>Search</legend>
          <input class="w-100 w-two-thirds-ns pl2 pr2 ba bw1 bg-light-gray h3 f6" type="search" placeholder="e.g. title">
          <button class="w-100 w-third-ns h3 pa2 bg-light-blue bn mt2 ma0-ns">Search</button>
        </fieldset>
         
         <!-- Search results -->
         <section>
          ${'search results'}
         </section>

        </section>
      </div>
      <!-- invisible div under the modal to capture out of modal click to close -->
      <div class="dn w-100 h-100 fixed top-0 left-0" onclick=${this.close()}></div>
    </div>
    `
  }

  update () {
    return false
  }
}

module.exports = AddToCollectionModal