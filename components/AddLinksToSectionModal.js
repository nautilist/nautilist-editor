var Component = require('choo/component')
var html = require('choo/html')

class AddLinksToSectionModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      displayed: 'dn',
      selectedSection: '',
      selectedLinks:[],
      open: this.open.bind(this)
    }
    this.close = this.close.bind(this);
    this.showSections = this.showSections.bind(this);
    this.setSelectedSection = this.setSelectedSection.bind(this);
    this.setSelectedLinks = this.setSelectedLinks.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      this.rerender();
    }
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
        this.local.selectedLinks = this.local.selectedLinks.filter(item => item === id)
      } else {
        this.local.selectedLinks.push(id);
      }
      this.rerender();
    }
  }
  
  showSections(sections){
    
    let els = sections.map(section => {
    let highlight = section._id === this.local.selectedSection ? 'bg-light-blue dark-pink' : 'bg-white navy';

      return html`
        <div onclick=${this.setSelectedSection(section._id)} data-id=${section._id} class="h-100 w4 b--black flex flex-column ba bw1 hover-bg-washed-blue ${highlight}">
          <p class="w-100 tc f7 truncate">${section.name === '' ? 'default' : section.name}</p>
        </div>
      `
    })

    return html`
    <section class="w-100 overflow-x-scroll">
    <fieldset class="w-100 mw7 h4 pa2 ba bw1 b--black flex flex-row">
        <legend>Choose a section</legend>
        ${els}
      </fieldset>
      </section>
    `
  
  }

  showLinks(links){
    let els = links.map(link => {
      let highlight = this.local.selectedLinks.includes(link._id) ? 'bg-washed-red navy' : 'bg-white navy';
        return html`
          <div onclick=${this.setSelectedLinks(link._id)} data-id=${link._id} class="mr2 h-100 w4 b--black fl ba bw1 hover-bg-washed-blue ${highlight}">
            <p class="w-100 tc f7 truncate">${link.name === '' ? 'default' : link.name}</p>
          </div>
        `
      })
  
      return html`
        <section class="w-100 overflow-x-scroll">
        <fieldset class="w-100 mw7 h4 pa2 ba bw1 b--black flex flex-row">
          <legend>Choose some links</legend>
          ${els}
        </fieldset>
        </section>
      `
  }

  handleSubmit(e){
    e.preventDefault();
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

    this.state.api.lists.patch(this.state.selectedList._id, params, query)
      .then(result => {
        this.state.selectedList = result;
        this.close();
        this.emit('render')
      }).catch(err => {
        alert(err)
      })
  }

  createElement () {
    const { selectedList, links } = this.state;

    if(Object.keys(selectedList).length <= 0 || links.length <= 0){
      return html`<div>no sections to show </div>`
    }

    const{sections} = selectedList; 
    

    return html`
      <div id="addLinkToSectionModal" 
        class="w-100 h-100 flex-column justify-center items-center ${this.local.displayed} fixed top-0 left-0 max-z pa4" 
        style="background:rgba(25, 169, 116, 0.7)">
        <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
          <header class="flex flex-row items-center justify-between">
            <h2>Add Link to Section</h2>
            <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
          </header>

          ${this.showSections(sections)}
          ${this.showLinks(links)}
          <button onclick=${this.handleSubmit} class="pa2">Submit!</button>
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

module.exports = AddLinksToSectionModal
