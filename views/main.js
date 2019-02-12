const html = require('choo/html')
const css = require('sheetify')


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



module.exports = view

function view (state, emit) {
  const codeEditor = new CodeEditor(state, emit);
  const visualEditor = new VisualEditor();
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="w-100 h-100 code lh-copy">
      <main class="w-100 h-100 flex flex-column justify-start items-start">
      <header class="w-100">
        <div class="w-100 h-100 flex flex-row ba br2 bw2 pa2">hello!</div>
      </header>
      <section class="w-100 h-100 flex flex-row justify-start items-start">
        <div class="w-60 h-100 ba bw2 pa2">
          ${visualEditor.render()}
        </div>
        <div class="w-40 h-100 ba bw2">
          ${codeEditor.render()}
        </div>
      </section>
      </main>
    </body>
  `

}
