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
      <div class="w-100 h-auto mw8 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>About</h2>
          <button class="bn bg-navy dark-pink bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 mt3 mb3">
          <h1 class="f1 lh-solid">Welcome to the Nautilist Editor</h1>
          <p>Nautilist is lightweight editor for putting together flexible lists of resources using markdown.<a class="link black underline" href="https://nautilist.github.io/" target="_blank">Learn more.</a></p>
          <p>Co-create and co-curate interesting links from across the web with Nautilist. Watch this video to see how it works.</p>
        </section>
        <section class="w-100 mt3 mb3">

        </section>
        <!-- simple single list -->
        <section class="w-100 mt3 mb3">
        <h2 class="f2 lh-title">Quickstart</h2>
        <p>To get get started - copy/paste this list boilerplate 👇 and press the "run" button:</p>
        <section>
        <h3>Simple list</h3>
${singleListExample()}
        </section>
        <!-- simple multi list -->
        <section>
        <h3>Simple list of lists</h3>
${multiListExample()}
        </section>
        </section>

        <section class="w-100 mt3 mb3">
        <h2 class="f2 lh-title">Acknowledgements</h2>
        <p>Nautilist is supported and maintained by NYU's Intertelecommunications Program. The project was materialized by <a class="link black underline" href="https://jk-lee.com" target="_blank">Joey Lee</a> through ITP's <a href="https://tisch.nyu.edu/itp/itp-people/faculty/somethings-in-residence-sirs" target="_blank">Something in Residence Program</a> under the supervision of Shawn Van Every, Dan Shiffman, and Dan O'Sullivan.</p>
        <p>Emojis via the <a class="link black underline" href="http://openmoji.org/index.html" target="_blank">OpenMoji Project</a> by the clever folks at <a class="link black underline" href="http://openmoji.org/about.html" target="_blank">Hfg Schwäbisch Gmünd</a>.</p>
        <p>Built with <a class="link black underline" href="https://choo.io/" target="_blank">Choo.js</a> & <a class="link black underline" href="https://feathersjs.com/" target="_blank">Feathers.js</a></p>
        </section>

        <button class="w-100 h3 bn bg-navy dark-pink pa2 mt3 mb3 pointer dn" onclick=${this.close()}>close</button>
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

module.exports = AboutModal

function copyToClipboard(_domId){
  return e => {
    let copyText = document.querySelector(_domId);
    copyText.select();
    document.execCommand('copy');
    alert("copied!")
  }
  
}

function multiListExample(){
const mdContent = `
# Nautilist Simple Boilerplate
> description: A boilerplate list of lists for nautilist

## My Special List
> description: A list 1 description

### ITP/IMA
> Website to NYU's ITP/IMA program      
- www.itp.nyu.edu
      
### Nautilist homepage
> Nautilist is a tool for ...
- url: www.nautilist.github.io/

## My Other Special List
>  A list 2 description

### name: ITP/IMA for list 2
> description: Website to NYU's ITP/IMA program
- www.itp.nyu.edu

### Nautilist homepage for list 2
> Nautilist is a tool for ...
- www.nautilist.github.io/
  `
  return html`
<pre class="mt2 bg-light-gray pl2 pr2 pb0 pt0 f6" onclick="${copyToClipboard('#multilist-example-md')}">
<textarea type="text" class="w-100 h5 bn bg-light-gray resize-none" id="multilist-example-md">
${mdContent.trim()}
</textarea>
</pre>
  `
}


function singleListExample(){
  const mdContent = `
# Nautilist Simple Boilerplate
> A boilerplate list of lists for nautilist

## My Special List
> A list 1 description

### ITP/IMA
> Website to NYU's ITP/IMA program      
- www.itp.nyu.edu
    
### Nautilist homepage
> Nautilist is a tool for ...
- url: www.nautilist.github.io/
  `
  return html`
<pre class="mt2 bg-light-gray pl2 pr2 pb0 pt0 f6" onclick="${copyToClipboard('#singlelist-example-md')}">
<textarea class="w-100 h5 bn bg-light-gray resize-none" id="singlelist-example-md">
${mdContent.trim()}
</textarea>
</pre>
  
  `
}






/**
 * 
 * 
 * 
 */