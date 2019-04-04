var Component = require('choo/component')
var html = require('choo/html')
const ShowOwner = require('./ShowOwner');
const ShowCollaborators = require('./ShowCollaborators');
const ShowFollowers = require('./ShowFollowers');

class EditableListHeader extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      editable:false,
      name:'',
      description:'',
      toggleEditable: this.toggleEditable.bind(this),
      handleSubmit: this.handleSubmit.bind(this)
    }
    this.handleChange = this.handleChange.bind(this);
  }

  toggleEditable(e){
    this.local.editable = !this.local.editable;
    if(this.local.editable === false){
      this.local.handleSubmit(this.state, this.emit).call();
    }
    
    this.rerender();
  }
  
  handleChange(e){
    this.local[e.target.name] = e.target.value
  }

  handleSubmit(state, emit){
      return e => {
      // console.log(e.target)
      // e.preventDefault();
      // let formData = new FormData(e.target);
      let payload = {
        name: this.local.name,
        description: this.local.description
      }
      console.log(payload)
      state.api.lists.patch(state.selectedList._id, payload,{})
        .then(result => {
          state.selectedList = result;
          this.rerender()
        })
        .catch(err => {
          alert(err);
        })
      }
  }

  createElement () {
    const {selectedList} = this.state;

    if(Object.keys(selectedList).length <= 0){
        return html`<section class="tc w-100">no details</section>`
    }

    const{name, description, ownerDetails, collaboratorDetails, followersDetails} = selectedList
    
    this.local.name = name;
    this.local.description = description;

    if(this.local.editable === true){
      return html`
      <section class="w-100 mt4">
        <p class="mb2 pa0 f6">${ShowFollowers(this.state, this.emit, followersDetails)}</p>
        <form class="w-100 flex flex-column" onsubmit=${this.local.handleSubmit(this.state, this.emit)}>
          <input class="bn f2 lh-title outline" type="text" value="${name}" name="name" onkeyup=${this.handleChange}>
          ${ShowOwner(ownerDetails)}
          ${ShowCollaborators(collaboratorDetails)}
          <input class="bn f4 lh-title outline" type="text" value="${description}" name="description" onkeyup=${this.handleChange}>
        </form>
      </section>
      `
    } else {
      return html`
      <section class="w-100 mt4">
        <p class="mb2 pa0 f6">${ShowFollowers(this.state, this.emit, followersDetails)}</p>
        <h2 class="f2 lh-title ma0">${name}</h2>
        ${ShowOwner(ownerDetails)}
        ${ShowCollaborators(collaboratorDetails)}
        <h4 class="f4 mt2">${description}</h4>
      </section>
      `
    }
  }

  update () {
    return true
  }
}

module.exports = EditableListHeader

/**

function headerSection(state, emit){
    const {selectedList} = state;

    if(Object.keys(selectedList).length <= 0){
        return html`<p class="tc w-100">no details</p>`
    }
    const{name, description, ownerDetails, collaboratorDetails, followersDetails} = selectedList

    return html`
        <section class="w-100 mt4">
            <p class="mb2 pa0 f6">${showFollowers(state, emit, followersDetails)}</p>
            <h2 class="f2 lh-title ma0">${name}</h2>
            ${showOwner(ownerDetails)}
            ${showCollaborators(collaboratorDetails)}
            <h4 class="f4 mt2">${description}</h4>
        </section>
    `
}


*/