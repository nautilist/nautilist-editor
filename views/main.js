const html = require('choo/html')
const css = require('sheetify')
var FileSaver = require('file-saver');
const slugify = require('slugify')
// const yaml = require('js-yaml');
const md2jt = require('../helpers/md2jt');

const TITLE = 'Nautilist Web Editor'

const CodeEditor = require("../components/CodeEditor");
const VisualEditor = require("../components/VisualEditor");
const AboutModal = require("../components/AboutModal");
const ShareModal = require("../components/ShareModal");
const SearchModal = require("../components/SearchModal");
const EditFeatureModal = require("../components/EditFeatureModal");

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

.resize-none{
  resize:none;
}
`

module.exports = view

function view (state, emit) {
  const codeEditor = new CodeEditor("CodeEditor", state, emit);
  const editFeatureModal  = new EditFeatureModal("EditFeatureModal", state, emit)
  const visualEditor = new VisualEditor("VisualEditor", state, emit, editFeatureModal);
  const aboutModal  = new AboutModal("AboutModal", state, emit)
  const shareModal  = new ShareModal("ShareModal", state, emit)
  const searchModal  = new SearchModal("SearchModal", state, emit)
  
  // const editFeatureModal = state.cache( EditFeatureModal, "EditFeatureModal", state, emit)

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function updateEditorView(){
    // add in clientIDs
    emit("json:addClientId", state.workspace.json)
    // rerender
    visualEditor.rerender()
  }

  function saveMd(){
    console.log(state.workspace.yaml)
    let blob = new Blob([state.workspace.md], {type: "application/x-markdown;charset=utf-8"});
    let fileName =  slugify(state.workspace.json.name)+'.md'
    FileSaver.saveAs(blob, fileName);
  }
  function openFile(e){
    // alert("TODO: open file!")
    let fileElem = document.querySelector("#fileSelect")
    if (fileElem) {
      fileElem.click();
    }
  }
  function handleFiles(){
    const myFile = this.files[0]; /* now you can work with the file list */
    const reader = new FileReader();

    reader.onload = (function(theFile){
      return e => {
        try{
          let inputMd = e.target.result;
          // emit(state.events.workspace_yaml_update, yaml);
          emit(state.events.workspace_all_update, md2jt.md2json(inputMd) );
          // codeEditor.editor.value = state.workspace.yaml;
        } catch(err){
          alert("not working!")
        }
      }
    })(myFile)
    reader.readAsText(myFile);
  }

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
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2 pointer" onclick="${saveMd}">Save</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2 pointer" onclick="${openFile}">open</button>
          <input class="dn" type="file" id="fileSelect" onchange="${handleFiles}">
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
      ${editFeatureModal.render()}
    </body>
  `

}