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
      <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll max-z">
        <header class="flex flex-row items-center justify-between">
          <h2>About</h2>
          <button class="bn bg-navy dark-pink bw2 pa2 h3 w3 f3 pointer" onclick="${this.close()}">╳</button>
        </header>
        <section class="w-100 mt2 mb2">
          <p>Hello and welcome to the Nautilist Editor!</p>
          <p>It's a lightweight editor for putting together flexible lists of resources using markdown.<a class="link black underline" href="https://nautilist.github.io/" target="_blank">Learn more.</a></p>
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