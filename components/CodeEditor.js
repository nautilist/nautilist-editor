var Component = require('choo/component')
const css = require('sheetify')
var html = require('choo/html')

if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  
  require("../node_modules/codemirror/mode/yaml/yaml.js")
  require("../node_modules/codemirror/addon/selection/active-line.js")
  require("../node_modules/codemirror/addon/lint/yaml-lint.js")
  css('../node_modules/codemirror/lib/codemirror.css')
  css('../node_modules/codemirror/theme/tomorrow-night-bright.css')
  var codeMirror = require("codemirror/lib/codemirror.js");

}
// // require("../node_modules/codemirror/mode/yaml/yaml.js")
// // require("../node_modules/codemirror/addon/selection/active-line.js")
// // require("../node_modules/codemirror/addon/lint/yaml-lint.js")
// css('../node_modules/codemirror/lib/codemirror.css')
// css('../node_modules/codemirror/theme/tomorrow-night-bright.css')
// var codeMirror = require("codemirror/lib/codemirror.js");

css`
.CodeMirror { height:100%; }
`


class CodeEditor extends Component {
  constructor (state, emit) {
    super()
    this.state = state;
    this.emit = emit;
    // this.local = state.components[id] = {}
  }

  createElement () {
    const cm =  html`<textarea class="h-100 pa0 ma0" name="code" id="code">${this.state.workspace.yaml}</textarea>`;

    return html`
      <div class="w-100 h-100">
          ${cm}   
      </div>
    `
  }

  load(el){
    // const editor = codeMirror.fromTextArea(el.querySelector("#code"),{
    //   styleActiveLine: true,
    //   mode: "text/x-yaml",
    //   theme: "tomorrow-night-bright",
    //   viewportMargin: Infinity
    // });
    const editor = codeMirror.fromTextArea(el.querySelector("#code"),{});
    // lineNumbers: true,
    editor.on('change',(cMirror) => {
      // get value right from instance
      console.log(cMirror.getValue());
      // TODO: create STORE to set vlaues 
      this.emit(this.state.events.workspace_yaml_update, cMirror.getValue())
    });
  }

  update () {
    return true
  }
}

module.exports = CodeEditor