var Component = require('choo/component')
var html = require('choo/html')

class AboutModal extends Component {
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
    <div id="helpModal" class="w-100 h-100 flex-column justify-center items-center ${this.displayed} fixed top-0 left-0 max-z pa4" style="background:rgba(255, 65, 180,0.7)">
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll">
        <header class="flex flex-row items-center justify-between">
          <h2>About</h2>
          <button class="bn bg-navy dark-pink bw2 pa h2 w2" onclick="${this.close()}">⨉</button>
        </header>
        <section class="w-100 mt2 mb2">
          <p>Hello and welcome to the Nautlist Editor!</p>
          <p>It's a lightweight editor for putting together flexible lists of resources using YAML, a structured, human-computer readable data structure. <a class="link black underline" href="https://nautilist.github.io/" target="_blank">Learn more.</a></p>
          <p>To get get started - copy/paste this list boilerplate 👇 and press the "run" button:</p>
        </section>
        <!-- simple single list -->
        <section>
        <h3>Simple list</h3>
${singleListExample()}
        </section>
        <!-- simple multi list -->
        <section>
        <h3>Simple list of lists</h3>
${multiListExample()}
        </section>
        <button class="w-100 h3 bn bg-navy dark-pink pa2 mt3 mb3" onclick=${this.close()}>close</button>
      </div>
    </div>
    `
  }

  update () {
    return false
  }
}

module.exports = AboutModal

function multiListExample(){
  return html`
<pre class="mt2 bg-light-gray pa2 f7">
<code>
type: list
name: Nautilist Simple Boilerplate
description: A boilerplate list of lists for nautilist
features:
  - type: list
    name: My Special List
    description: A list 1 description
    features:
      - url: www.itp.nyu.edu
        name: ITP/IMA
        description: Website to NYU's ITP/IMA program
      - url: www.nautilist.github.io/
        name: Nautilist homepage
        description: Nautilist is a tool for ...
  - type: list
    name: My Other Special List
    description: A list 2 description
    features:
      - url: www.itp.nyu.edu
        name: ITP/IMA for list 2
        description: Website to NYU's ITP/IMA program
      - url: www.nautilist.github.io/
        name: Nautilist homepage for list 2
        description: Nautilist is a tool for ...
  </code>
</pre>
  `
}

function singleListExample(){
  return html`
<pre class="mt2 bg-light-gray pa2 f7">
<code>
type: list
name: Nautilist Simple Boilerplate
description: A boilerplate list for nautilist
features:
  - url: www.itp.nyu.edu
    name: ITP/IMA
    description: Website to NYU's ITP/IMA program
  - url: www.nautilist.github.io/
    name: Nautilist homepage
    description: Nautilist is a tool for ...
</code>
</pre>
  
  `
}