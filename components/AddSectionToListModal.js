var Component = require('choo/component')
var html = require('choo/html')

class AddSectionToListModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      displayed: 'dn',
      selectedLinks:[],
      open: this.open.bind(this),
      name:'New friendly section name',
      description:'A super nice section description.',
    }
    this.close = this.close.bind(this);
    this.setSelectedLinks = this.setSelectedLinks.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sectionDetailsForm = this.sectionDetailsForm.bind(this);
  }
  open(e) {
    console.log("opening!")
    this.local.displayed = 'flex';
    this.rerender();
  }

  close() {
    return e => {
      console.log("closing!")
      this.local.displayed = 'dn';
      this.local.name='New friendly section name';
      this.local.description='A super nice section description.';
      this.local.selectedLinks = [];
      this.rerender();
    }
  }

  setSelectedLinks(id){
    return e=> {
      if(this.local.selectedLinks.includes(id)){
        this.local.selectedLinks = this.local.selectedLinks.filter(item => item !== id)
      } else {
        this.local.selectedLinks.push(id);
      }
      this.rerender();
    }
  }
  
  
  showLinks(links){
    let els = links.map(link => {
      let highlight = this.local.selectedLinks.includes(link._id) ? 'bg-light-green navy' : 'bg-white navy';
        return html`
          <div onclick=${this.setSelectedLinks(link._id)} data-id=${link._id}  class="mr2 h3 w4 b--black fl pa2 ba bw1 grow ${highlight}">
            <p class="w-100 tc ma0 f7 truncate">${link.name === '' ? 'default' : link.name}</p>
          </div>
        `
      })
  
      return html`
      <section class="w-100 mw7 h-auto ma0 overflow-hidden">
      <fieldset class="w-100 h-100 ma0 h4 ba bw1 b--black">
      <legend>Choose some links</legend>
        <div class="mw7 h-100 pa0 flex flex-row overflow-x-scroll">
        ${els}
        </div>
      </fieldset>
    </section>
      `
  }


  handleChange(e){
    this.local[e.target.name] = e.target.value;
  }

  sectionDetailsForm(){
    return html`
      <form class="w-100 mt3" onsubmit=${this.handleSubmit}>
        <fieldset class="w-100 ba bw b--black mt1">
          <legend>name</legend>
          <input onkeyup=${this.handleChange} class="w-100 ba bw1 pa2 f3" name="name" 
          value="${this.local.name}">
        </fieldset>
        <fieldset class="w-100 ba bw b--black mt1">
          <legend>description</legend>
          <input onkeyup=${this.handleChange} class="w-100 ba bw1 pa2 f3" name="description" 
          value="${this.local.description}">
        </fieldset>
      </form>
    `
  }

  handleSubmit(e){
    e.preventDefault();
    const {selectedList} = this.state;
    
    const newSection = {
      "name": this.local.name,
      "description": this.local.description,
      "links": this.local.selectedLinks
    }

    const params = {
      "$push":{
        "sections": newSection
      }
    }

    this.state.api.lists.patch(selectedList._id, params)
      .then(result => {
        this.state.selectedList = result;
        this.close().call();
        this.emit('render')
      })
      .catch(err => {
        alert(err);
      })
  }

  createElement () {
    const { selectedList, links } = this.state;

    if(Object.keys(selectedList).length <= 0 || links.length <= 0){
      return html`<div class="dn">no sections to show </div>`
    }

    // const{sections} = selectedList; 
    

    return html`
      <div id="addSectionToListModal" 
        class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
        style="background:rgba(232, 253, 245, 0.9)">
        <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
          <header class="flex flex-row items-center justify-between">
            <h2>Add Section to List</h2>
            <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
          </header>
          ${this.showLinks(links)}
          ${this.sectionDetailsForm()}

          <button class="h2 bg-near-white dark-pink pa2 mt3 dropshadow bn br0" onclick=${this.handleSubmit} class="pa2">Submit!</button>
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

module.exports = AddSectionToListModal
