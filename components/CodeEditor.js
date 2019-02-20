var Component = require('choo/component')
const css = require('sheetify')
var html = require('choo/html')

let codeMirror;
// let jsyaml
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {  
  // jsyaml = require('js-yaml')
  require("codemirror/mode/yaml/yaml.js")
  require("codemirror/addon/selection/active-line.js")
  // require("codemirror/addon/lint/lint.js")
  // require("codemirror/addon/lint/yaml-lint.js")
  css('codemirror/lib/codemirror.css')
  css('codemirror/theme/tomorrow-night-bright.css')
  // css('codemirror/addon/lint/lint.css')
  codeMirror = require("codemirror/lib/codemirror.js");
}

css`
.CodeMirror { 
  height:100%; 
  min-height: 223px;
  font-size: 16px;
}

`


class CodeEditor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
    this.editor = null
  }

  createElement () {
    const cm =  html`<textarea class="h-100 w-100 pa0 ma0" name="code" id="code">${this.state.workspace.yaml}</textarea>`;
    const errorConsole = html`<div class="w-100 h3" id="errorConsole"></div>`
    return html`
      <div class="w-100 h-100">
          ${cm}   
      </div>
    `
  }

  load(el){
    this.editor = codeMirror.fromTextArea(el.querySelector("#code"),{
      styleActiveLine: true,
      mode: "text/x-yaml",
      theme: "tomorrow-night-bright",
      viewportMargin: Infinity,
      lineNumbers: true,
      tabSize: 2,
      indentUnit:2,
      indentWithTabs: true,
      // gutters: ["CodeMirror-lint-markers"],
      lint: false
    });

    this.editor.on('change',(cMirror) => {
      // get value right from instance
      // console.log(cMirror.getValue());
      // TODO: create STORE to set vlaues 
      this.emit(this.state.events.workspace_yaml_update, cMirror.getValue())
    });
    
    // TODO: Seems that when rendering in hidden state, the editor must be refreshed
    // to handle the lineNumbers issues
    // see: https://codemirror.net/doc/manual.html#addon_autorefresh
    setTimeout( () => {
      this.editor.refresh();
    }, 250)
    
  }

  update () {
    return true
  }
}

module.exports = CodeEditor