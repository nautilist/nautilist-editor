const html = require('choo/html')
const css = require('sheetify')
var FileSaver = require('file-saver');
const slugify = require('slugify')

css`
html{
  width:100%;
  height:100%;
  padding: 1em;
}
`

const TITLE = 'Nautilist Web Editor'

const CodeEditor = require("../components/CodeEditor");
const VisualEditor = require("../components/VisualEditor");

css`
.dropshadow{
  box-shadow:2px 2px black;
}

.min-height-0{
  min-height:0;
}

.max-z{
  z-index:9999;
}
`

module.exports = view

function view (state, emit) {
  const codeEditor = new CodeEditor(state, emit);
  const visualEditor = new VisualEditor(state, emit);
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function updateEditorView(){
    console.log(state.workspace.json)
    emit("json:addClientId")
    visualEditor.rerender()
  }

  function saveYaml(){
    console.log(state.workspace.yaml)
    let blob = new Blob([state.workspace.yaml], {type: "application/x-yaml;charset=utf-8"});
    let fileName =  slugify(state.workspace.json.name)+'.yml'
    FileSaver.saveAs(blob, fileName);
  }
  function openFile(e){
    // console.log("open file!",state.workspace.yaml)
    alert("TODO: open file!")
    // let blob = new Blob([state.workspace.yaml], {type: "application/x-yaml;charset=utf-8"});
    // let fileName =  slugify(state.workspace.json.name)+'.yml'
    // FileSaver.saveAs(blob, fileName);
  }

  function HelpModal(){
    return html`
      <div id="helpModal" class="w-100 h-100 flex-column justify-center items-center dn fixed top-0 left-0 max-z pa4" style="background:rgba(255, 65, 180,0.7)">
        <div class="w-100 h-auto mw7 pa4 ba dropshadow br2 bg-white overflow-y-scroll">
          <header class="flex flex-row items-center justify-between">
            <h2>About</h2>
            <button class="bn bg-purple white bw2 pa2" onclick="${closeHelp}">⨉</button>
          </header>
          <p>Hello and welcome to the Nautlist Editor!</p>
          <p>It's a lightweight editor for putting together flexible lists of resources using YAML, a structured, human-computer readable data structure. <a class="link black underline" href="https://nautilist.github.io/" target="_blank">Learn more.</a></p>
          <p>To get get started - copy/paste this list boilerplate 👇 and press the "run" button:</p>
          
          <h3>Simple list</h3>
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

          <h3>Simple list of lists</h3>
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

          <button class="w-100 h3 br2 bn bg-purple white pa2 mt3 mb3" onclick=${closeHelp}>close</button>
        </div>
      </div>
    `
  }

  function closeHelp(){
      document.querySelector('#helpModal').classList.toggle('flex')
  }


  function openHelp(e){
      // alert("copy and paste into the editor to start:\n\n\ntype: list\nname:my title\ndescription: list description\nfeatures:\n- url:")
    document.querySelector('#helpModal').classList.toggle('flex')
  }

  function openShare(e){
    alert("TODO: share ")
  }

  function openSearch(e){
    alert("TODO: search list db ")
  }

  return html`
    <body class="w-100 h-100 code lh-copy">
      <main class="w-100 h-100 flex flex-column justify-start items-start">
      <header class="w-100 flex flex-row justify-between items-center pa2">
        <div>
          <button class="ba br-pill dropshadow ba b--dark-pink bg-white dark-pink bw1 pa2 mr2">🌈 Nautilist Editor ✨</button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openHelp}"> About </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openShare}"> Share </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openSearch}"> 🔎 Search </button>
        </div>
        <div>
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2" onclick="${saveYaml}">Save</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2" onclick="${openFile}">Open</button>
        </div>
      </header>
      <section class="w-100 h-100 flex flex-row justify-start items-start min-height-0">
        <div class="w-50 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${visualEditor.render()}
          </div>
        </div>
        <div class="w-50 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${codeEditor.render()}
          </div>
        </div>
      </section>
      </main>
      ${HelpModal()}
    </body>
  `

}

// 
/**
<header class="w-100">
        <div class="w-100 h-100 flex flex-row justify-between items-center pa2">
        <div>
        <button class="ba br-pill dropshadow ba b--dark-pink bg-white dark-pink bw1 pa2 mr2">🌈 Nautilist Editor ✨</button>
        <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openHelp}"> About </button>
        <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openShare}"> Share </button>
        <button class="ba ba b--white bg-white navy bw1 pa2 mr2" onclick="${openSearch}"> 🔎 Search </button>
        </div>
        <div>
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2" onclick="${saveYaml}">Save</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2" onclick="${openFile}">Open</button>
        </div>
        </div>
      </header>
 */