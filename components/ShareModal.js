var Component = require('choo/component')
var html = require('choo/html')

class ShareModal extends Component {
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
    <div id="shareModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(255, 215, 0,0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll">
        <header class="flex flex-row items-center justify-between">
          <h2>Share</h2>
          <button class="bn bg-navy yellow bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 mt2 mb2">
          <p>Share your list in <a class="link black underline b" href="#" target="_blank">Nautilist Public</a> or as an HTML page. More formats coming soon!</p>
        </section>
        <!-- Sharing Options -->
        <section>
         <p>🚀 Send to Nautilist Public</p>
         <p>✨ Download HTML page</p>
        </section>
        <button class="w-100 h3 bn bg-navy yellow pa2 mt3 mb3 pointer" onclick=${this.close()}>close</button>
      </div>
    </div>
    `
  }

  update () {
    return false
  }
}

module.exports = ShareModal