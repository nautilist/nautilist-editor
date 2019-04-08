var Component = require('choo/component')
var html = require('choo/html')

class EditFeatureModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      displayed: 'dn',
      featureType: 'sections',
      tags:'',
      parentid: null,
      featureid: null,
      name:'',
      description:'',
      url:'',
      open: this.open.bind(this)
    }
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.linkDetailsForm = this.linkDetailsForm.bind(this);
  }

  open() {
    // return e => {
    console.log("opening!")
    this.local.displayed = 'flex';
    this.rerender();
    // }
  }

  close(e) {
      console.log("closing!")
      this.local.displayed = 'dn';
      this.local.name='';
      this.local.description='';
      this.local.url='';
      this.rerender();
  }


  handleSubmit(e){
    e.preventDefault();
    const {featureType} = this.local
    const formData = new FormData(e.currentTarget);
    
    let payload = {
      url: this.local.url,
      name: this.local.name,
      description: this.local.description,
      tags: this.local.tags.split(','),
    }
    if(featureType !== 'links'){
      delete payload.url;
    }
    
    if(featureType === 'links'){

      this.state.api.links.patch(this.local.featureid, payload, {})
        .then(result => {
          this.state.selectedLink = result;
          this.emit('pushState', `/lists/${this.state.selectedList._id}`);
          this.close();
        })
        .catch(err => {
          alert(err);
        })
      
    }

    if(featureType === 'sections'){
      const query = {
        query:{
          "sections._id": this.local.featureid
        }
      }
      const params = {
        "$set":{
          "sections.$.name": this.local.name,
          "sections.$.description": this.local.description
        },
        "$push":{
          "sections.$.tags": this.local.tags
        }
      }

      this.state.api.lists.patch(this.local.parentid, params, query)
        .then(result => {
          this.state.selectedList = result;
          this.emit('render');
          this.close();
        })
        .catch(err => {
          alert(err);
        })
    }

  }

  handleChange(e){
    this.local[e.target.name] = e.target.value;
  }
  

  createElement () {

    return html`
      <div id="EditFeatureModal" 
        class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
        style="background:rgba(232, 253, 245, 0.9)">
        <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
          <header class="flex flex-row items-center justify-between">
            <h2>Edit Feature</h2>
            <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close}">╳</button>
          </header>

          <!-- Add feature -->
          <section class="w-100 mt2 mb2">
          <form id="editFeatureForm" name="editFeatureForm" onsubmit=${this.handleSubmit}>
            <!-- URL -->
            <fieldset class="w-100 ba bw1 b--black ${this.local.featureType == 'links' ? 'fl':'dn'}">
            <legend>URL</legend>
            <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="url" placeholder="url" value="${this.local.url}" onkeyup=${this.handleChange}>
          </fieldset>
          <!-- NAME -->
          <fieldset class="w-100 ba bw1 b--black">
            <legend>Name</legend>
            <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="name" placeholder="name" value="${this.local.name}" onkeyup=${this.handleChange}>
          </fieldset>
          <!-- DESCRIPTION -->
          <fieldset class="w-100 ba bw1 b--black">
            <legend>Description</legend>
            <textarea class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="description" placeholder="description" onkeyup=${this.handleChange}>${this.local.description}</textarea>
          </fieldset>
          <fieldset class="w-100 ba bw1 b--black">
            <legend>Tags</legend>
            <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="text" name="tags" onkeyup=${this.handleChange} placeholder="tags, separated, by, comma">
          </fieldset>
          <input class="w-100 h3 bn bg-navy washed-green pa2 mt3 mb3 pointer tc" type="submit" value="Submit Changes">
        </form>
          </section>
        </div>
        <!-- invisible div under the modal to capture out of modal click to close -->
        <div class="dn w-100 h-100 fixed top-0 left-0" onclick=${this.close}></div>
      </div>
    `
  }

  update () {
    return false
  }
}

module.exports = EditFeatureModal
