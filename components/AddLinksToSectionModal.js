var Component = require('choo/component')
var html = require('choo/html')

class AddLinksToSectionModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      displayed: 'dn',
      name:'',
      description:'',
      url:'',
      selectedSection: '',
      selectedLinks:[],
      open: this.open.bind(this)
    }
    this.close = this.close.bind(this);
    this.showSections = this.showSections.bind(this);
    this.setSelectedSection = this.setSelectedSection.bind(this);
    this.setSelectedLinks = this.setSelectedLinks.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.linkDetailsForm = this.linkDetailsForm.bind(this);
    this.clearLocal = this.clearLocal.bind(this);
  }
  open(e) {
    console.log("opening!")
    this.local.displayed = 'flex';
    this.rerender();
  }

  clearLocal(){
      this.local.selectedSection= '';
      this.local.selectedLinks = [];
      this.local.name='';
      this.local.description='';
      this.local.url='';
  }
  close(e) {
      console.log("closing!")
      this.local.displayed = 'dn';
      this.clearLocal();
      this.rerender();
  }

  setSelectedSection(id){
    return e=> {
      // this.local.selectedSection = id;
      if(this.local.selectedSection === id ){
        this.local.selectedSection = '';
      } else {
        this.local.selectedSection = id;
      }
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
  
  showSections(sections){
    
    let els = sections.map(section => {
    let highlight = section._id === this.local.selectedSection ? 'bg-yellow dark-pink' : 'bg-white navy';

      return html`
        <div onclick=${this.setSelectedSection(section._id)} data-id=${section._id} class="mr2 h3 overflow-y-scroll dropshadow b--black fl pa2 ba bw1 grow ${highlight}" style="min-width:180px">
          <p class="w-100 tc ma0 f7">${section.name === '' ? 'default' : section.name}</p>
        </div>
      `
    })

    return html`
      <section class="w-100 mw7 mt3 h-auto overflow-hidden">
        <fieldset class="w-100 h-100 ma0 pa2 ba bw1 b--black">
        <legend class="pl2 pr2">Choose a section for your link to go into - required</legend>
          <div class="mw7 h-100 pa2 flex flex-row overflow-x-scroll">
          ${els}
          </div>
        </fieldset>
      </section>
    `
  
  }

  showLinks(links){
    let els = links.map(link => {
      let highlight = this.local.selectedLinks.includes(link._id) ? 'bg-light-green navy' : 'bg-white navy';
        return html`
          <div onclick=${this.setSelectedLinks(link._id)} data-id=${link._id} class="mr2 h3 overflow-y-scroll dropshadow b--black fl pa2 ba bw1 ${highlight}" style="min-width:180px">
            <p class="w-100 tc ma0 f7">${link.name === '' ? 'default' : link.name}</p>
          </div>
        `
      })
  
      return html`
        
      <section class="w-100 mw7 mt3 h-auto overflow-hidden">
        <fieldset class="w-100 h-100 ma0 pa2 ba bw1 b--near-grey">
          <legend class="pl2 pr2">Add additional links from the collection - optional</legend>
          <div class="mw7 h-100 pa2 flex flex-row overflow-x-scroll">
          ${els}
          </div>
        </fieldset>
      </section>
        
      `
  }

  handleChange(e){
    this.local[e.target.name] = e.target.value;
  }

  linkDetailsForm(){
    return html`
      <form class="w-100 mt3" onsubmit=${this.handleSubmit}>
        <fieldset class="w-100 ba bw1 dropshadow b--black mt2">
          <legend class="pl2 pr2">URL</legend>
          <input onkeyup=${this.handleChange} class="w-100 bn pa2 f5 bg-near-white" name="url" 
          value="${this.local.url}" placeholder="https://yourawesomelink.com">
        </fieldset>
        <fieldset class="w-100 ba bw1 dropshadow b--black mt2">
          <legend class="pl2 pr2">name</legend>
          <input onkeyup=${this.handleChange} class="w-100 bn pa2 f5 bg-near-white" name="name" 
          value="${this.local.name}" placeholder="Your super cool link name">
        </fieldset>
        <fieldset class="w-100 ba bw1 dropshadow b--black mt2">
          <legend class="pl2 pr2">description</legend>
          <textarea onkeyup=${this.handleChange} class="w-100 h4 bn pa2 f5 bg-near-white" name="description" 
          value="${this.local.description}" placeholder="A super sweet description of your new link"></textarea>
      </form>
    `
  }

  handleSubmit(e){
    e.preventDefault();
    if(this.local.selectedSection !== ''){

    
    const query = {
      "query": {
        "sections._id": this.local.selectedSection
      }
    }
    const params = {
      "$push":{
        "sections.$.links": this.local.selectedLinks
      }
    }

    if(this.local.url !== '' ){
      const newLink = {
        name: this.local.name, 
        description: this.local.description,
        url: this.local.url
      }
      this.state.api.links.create(newLink)
        .then(result => {
          this.local.selectedLinks.push(result._id);
          return this.state.api.lists.patch(this.state.selectedList._id, params, query)
        })
        .then(result => {
          this.state.selectedList = result;
          this.close()
          this.emit('render')
        }).catch(err => {
          alert(`${err}`)
        })
    } else {
      this.state.api.lists.patch(this.state.selectedList._id, params, query)
      .then(result => {
        this.state.selectedList = result;
        // this.clearLocal();
        this.local.selectedLinks = [];
        this.close()
        this.emit('render')
      }).catch(err => {
        alert(err)
      })
    }
  } else {
    alert('Make sure to selected a section to add your link to. If there are no sections in your list, make a section, then add your link')
  }
  }

  createElement () {
    const { selectedList, links } = this.state;

    if(Object.keys(selectedList).length <= 0 || links.length <= 0){
      return html`<div class="dn">no sections to show </div>`
    }

    const{sections} = selectedList; 
    

    return html`
      <div id="addLinkToSectionModal" 
        class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
        style="background:rgba(232, 253, 245, 0.9)">
        <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
          <header class="flex flex-row items-center justify-between">
            <h2>Add a link</h2>
            <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close}">╳</button>
          </header>

          <h2>Step 1 - add/select link(s)</h2>
          <h3>Add a new link...</h3>
          ${this.linkDetailsForm()}
          <h3>...or select existing ones</h3>
          ${this.showLinks(links)}

          <h2>Step 2 - select a section</h2>
          ${this.showSections(sections)}
          
          <h2>Step 3 - submit</h2>
          <section class="h3 w-100 mt4 mb4">
          <button class="h-100 bg-navy pink pl3 pr3 dropshadow bn br0" onclick=${this.handleSubmit} class="pa2">Submit!</button>
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

module.exports = AddLinksToSectionModal
