var Component = require('choo/component')
var html = require('choo/html')

class ProjectModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.state = state;
    this.emit = emit;
    this.open = this.open.bind(this);
    this.displayed = 'dn';
    this.rerender = this.rerender.bind(this)
    this.showProject = this.showProject.bind(this);
  }

  open(id){
    // 1. change the url!
    // 2. show the modal
    this.displayed = 'flex';
    // this.rerender();
    // 3. fetch the data
    this.emit('fetch-project', id, this);
  }
  
  close(){
    return e => {
      console.log("closing!")
      this.displayed = 'dn';
      this.rerender();
    }
  }

  showProject(){
    const selectedProject = this.state.selectedProject;
    if(!Object.keys(selectedProject).length > 0){
        return html`<div>no data! 😭</div>`
    }

    return html`
        <div class="w-100 flex flex-row">
            <section class="w-70 h-100 pr2">
                <div class="outline pa2">
                    <h1 class="mt0">${selectedProject.name}</h1>
                    <p>${selectedProject.description}</p>
                </div>
            </section>
            <section class="w-30">
                <div class="outline w-100 pa2">
                    <section>
                        <h3 class="">Actions</h3>
                        <ul class="list pl0 flex flex-column items-start">
                            <li class="mb2"><button class="pa2 bn dropshadow bg-yellow navy">Save to lists</button></li>
                            <li class="mb2"><button class="pa2 bn dropshadow bg-navy yellow">Copy Markdown</button></li>
                            <li class="mb2"><button class="pa2 bn dropshadow bg-pink navy">Add to group</button></li>
                        </ul>
                    </section>    
                    <section class="w-100">
                        <form class="w-100">
                            <fieldset class="w-100">
                                <legend>URL</legend>
                                <input type="text" class="w-100 pa2 f5">
                            </fieldset>
                            <input type="submit" class="w-100 pa2 dropshadow bn mt2 bg-green" value="Suggest">
                        </form>
                    </section>
                </div>
            </section>
        </div>
    `
  }

  createElement () {
    console.log(this.displayed)

    return html`
    <div id="projectModal" class="w-100 h-100 flex-column ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(25, 169, 116, 0.95)">
      <div class="w-100 h-100 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Project</h2>
          <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 h-100">
            ${this.showProject()}
        </section>
      </div>
      <!-- invisible div under the modal to capture out of modal click to close -->
      <div class="w-100 h-100 fixed top-0 left-0" onclick=${this.close()}></div>
    </div>
    `
  }

  update (){
    return false
  }

}

module.exports = ProjectModal