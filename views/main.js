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
`

module.exports = view

function view (state, emit) {
  const codeEditor = new CodeEditor(state, emit);
  const visualEditor = new VisualEditor(state, emit);
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function updateEditorView(){
    console.log(state.workspace.json)
    visualEditor.rerender()
  }

  function saveYaml(){
    console.log(state.workspace.yaml)
    let blob = new Blob([state.workspace.yaml], {type: "application/x-yaml;charset=utf-8"});
    let fileName =  slugify(state.workspace.json.name)+'.yml'
    FileSaver.saveAs(blob, fileName);
  }

  return html`
    <body class="w-100 h-100 code lh-copy">
      <main class="w-100 h-100 flex flex-column justify-start items-start">
      <header class="w-100">
        <div class="w-100 h-100 flex flex-row justify-between items-center pa2">
        <button class="ba br-pill dropshadow ba b--dark-pink bg-white dark-pink bw1 pa2 mr2">🌈 Nautilist Editor ✨</button>
        <div>
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2" onclick="${saveYaml}">Save</button>
        </div>
        </div>
      </header>
      <section class="w-100 h-100 flex flex-row justify-start items-start">
        <div class="w-60 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${visualEditor.render()}
          </div>
        </div>
        <div class="w-40 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${codeEditor.render()}
          </div>
        </div>
      </section>
      </main>
    </body>
  `

}
