const html = require('choo/html')
const css = require('sheetify')
var FileSaver = require('file-saver');
const slugify = require('slugify')

const TITLE = 'Nautilist Web Editor'

const CodeEditor = require("../components/CodeEditor");
const VisualEditor = require("../components/VisualEditor");
const AboutModal = require("../components/AboutModal");
const ShareModal = require("../components/ShareModal");
const SearchModal = require("../components/SearchModal");

css`
html{
  width:100%;
  height:100%;
  padding: 1em;
}

.dropshadow{
  box-shadow:2px 2px black;
}

.min-height-0{
  min-height:0;
}

.max-z{
  z-index:9999;
}

.small{
  font-size:9px;
}
`

module.exports = view

function view (state, emit) {
  const codeEditor = new CodeEditor("CodeEditor", state, emit);
  const visualEditor = new VisualEditor("VisualEditor", state, emit);
  const aboutModal  = new AboutModal("AboutModal", state, emit)
  const shareModal  = new ShareModal("ShareModal", state, emit)
  const searchModal  = new SearchModal("SearchModal", state, emit)

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function updateEditorView(){
    // add in clientIDs
    emit("json:addClientId", state.workspace.json)
    // rerender
    visualEditor.rerender()
  }

  function saveYaml(){
    console.log(state.workspace.yaml)
    let blob = new Blob([state.workspace.yaml], {type: "application/x-yaml;charset=utf-8"});
    let fileName =  slugify(state.workspace.json.name)+'.yml'
    FileSaver.saveAs(blob, fileName);
  }
  function openFile(e){
    alert("TODO: open file!")
  }

  // function openSearch(e){
  //   alert("TODO: search list db ")
  // }

  return html`
    <body class="w-100 h-100 code lh-copy">
      <main class="w-100 h-100 flex flex-column justify-start items-start">
      <header class="w-100 flex flex-row justify-between items-center pa2">
        <div>
          <button class="ba br-pill dropshadow ba b--dark-pink bg-white dark-pink bw1 pa2 mr2">🌈 Nautilist Editor ✨</button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer" onclick="${aboutModal.open()}"> About </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer" onclick="${shareModal.open()}"> Share </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer" onclick="${searchModal.open()}"> 🔎 Search </button>
        </div>
        <div>
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2 pointer" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2 pointer" onclick="${saveYaml}">Save</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2 pointer dn" onclick="${openFile}">Open</button>
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
      ${aboutModal.render()}
      ${shareModal.render()}
      ${searchModal.render()}
    </body>
  `

}