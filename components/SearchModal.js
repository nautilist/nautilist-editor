var Component = require('choo/component')
var html = require('choo/html')

class SearchModal extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.state = state;
    this.emit = emit;
    this.open = this.open.bind(this);
    this.displayed = 'dn';
    this.rerender = this.rerender.bind(this)
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

  createElement () {
    return html`
    <div id="searchModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(25, 169, 116, 0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>Search</h2>
          <button class="bn bg-navy washed-green bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 mt2 mb2">
          <p>Quick search <a class="link black underline b" href="#" target="_blank">Nautilist Public</a> for the list of your dreams. Or go to the <a class="link black underline b" href="#" target="_blank">main site</a> for more.</p>
        </section>
        <!-- Search section -->
        <section>
          <!-- Search bar -->
         <fieldset class="w-100 ba bw1 b--black">
          <legend>Search</legend>
          <input class="w-100 pa2 ba bw1 bg-light-gray h3 f6" type="search" placeholder="e.g. by keywords">
         </fieldset>
         <!-- Search results -->
        </section>
        <button class="w-100 h3 bn bg-navy washed-green pa2 mt3 mb3 pointer" onclick=${this.close()}>close</button>
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

module.exports = SearchModal