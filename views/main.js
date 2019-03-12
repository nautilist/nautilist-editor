const html = require('choo/html')
const css = require('sheetify')
var FileSaver = require('file-saver');
const slugify = require('slugify')
// const yaml = require('js-yaml');
const md2jt = require('../helpers/md2jt');
const feathersClient = require('../helpers/feathersClient')

const TITLE = 'Nautilist Web Editor'

const CodeEditor = require("../components/CodeEditor");
const VisualEditor = require("../components/VisualEditor");
const AboutModal = require("../components/AboutModal");
const ShareModal = require("../components/ShareModal");
const SearchModal = require("../components/SearchModal");
const EditFeatureModal = require("../components/EditFeatureModal");

css `
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

function view(state, emit) {
  const codeEditor = new CodeEditor("CodeEditor", state, emit);
  const editFeatureModal = new EditFeatureModal("EditFeatureModal", state, emit)
  const visualEditor = new VisualEditor("VisualEditor", state, emit, editFeatureModal);
  const aboutModal = new AboutModal("AboutModal", state, emit)
  const shareModal = new ShareModal("ShareModal", state, emit)
  const searchModal = new SearchModal("SearchModal", state, emit)

  // const editFeatureModal = state.cache( EditFeatureModal, "EditFeatureModal", state, emit)

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function updateEditorView() {
    // add in clientIDs
    emit("json:addClientId", state.workspace.json)
    // rerender
    visualEditor.rerender()
  }

  function saveMd() {
    console.log(state.workspace.yaml)
    let blob = new Blob([state.workspace.md], {
      type: "application/x-markdown;charset=utf-8"
    });
    let fileName = slugify(state.workspace.json.name) + '.md'
    FileSaver.saveAs(blob, fileName);
  }

  function openFile(e) {
    // alert("TODO: open file!")
    let fileElem = document.querySelector("#fileSelect")
    if (fileElem) {
      fileElem.click();
    }
  }

  function handleFiles() {
    const myFile = this.files[0]; /* now you can work with the file list */
    const reader = new FileReader();

    reader.onload = (function (theFile) {
      return e => {
        try {
          let inputMd = e.target.result;
          // emit(state.events.workspace_yaml_update, yaml);
          emit(state.events.workspace_all_update, md2jt.md2json(inputMd));
          // codeEditor.editor.value = state.workspace.yaml;
        } catch (err) {
          alert("not working!")
        }
      }
    })(myFile)
    reader.readAsText(myFile);
  }

  function logout() {
    emit(state.events.user_logout);
  }

  function isAuthd() {
    if (state.user.authenticated === false || state.user.authenticated === undefined || state.user.authenticated === '') {
      return html `<a class="mr3 black underline" href="/login">login</a>`
    }
    return html `<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  }

  function saveToPublic(state, emit) {
    return e => {
      console.log('saving to public')
      // emit(state.events.workspace_findOneAndUpdate);
      const {
        _id
      } = state.workspace;

      let payload = {
        html: '',
        md: state.workspace.md,
        json: state.workspace.json,
        name: state.workspace.json.name,
        description: state.workspace.json.description
      }

      // if there's no ID, then create a new feature
      if (_id === null) {
        // submit the payload to the server annonymously
        feathersClient.service("/api/projects").create(payload).then(result => {
          state.workspace.json = result.json
          state.workspace.md = result.md
          state.workspace._id = result._id
          // this.emit('pushState', '/public');
          // add in clientIDs
          alert("new list created!")
          emit("json:addClientId", state.workspace.json)
          // rerender
          visualEditor.rerender()
        }).catch(err => {
          alert(err);
          return err;
        })
      } else {

        if (state.user.authenticated === false || state.user.authenticated === '') {
          // submit the payload to the server annonymously
          feathersClient.service("/api/projects").create(payload).then(result => {
            state.workspace.json = result.json
            state.workspace.md = result.md
            state.workspace._id = result._id
            // this.emit('pushState', '/public');
            alert("new list created!")
            emit("json:addClientId", state.workspace.json)
            // rerender
            visualEditor.rerender()
            
          }).catch(err => {
            alert(err);
            return err;
          });

        } else {
          let data = {
            $set: payload
          }

          feathersClient.service('/api/projects').patch(_id, data).then(result => {
            console.log("🌈🌈🌈🌈", result);
            state.workspace.json = result.json
            state.workspace.md = result.md
            state.workspace._id = result._id
            // this.emit('pushState', '/public');
            document.querySelector("#lastUpdated").innerHTML = `updated: ${result.updatedAt}  `;
            emit("json:addClientId", state.workspace.json)
            // rerender
            visualEditor.rerender()
          }).catch(err => {
            alert(err);
            return err;
          })
        }


      }
    }
  }

  return html `
    <body class="w-100 h-100 code lh-copy">
      <main class="w-100 h-100 flex flex-column justify-start items-start">
      <header class="w-100 flex flex-row justify-between items-center pa2">
        <div>
          <button class="ba br-pill dropshadow ba b--dark-pink bg-white dark-pink bw1 pa2 mr2"> Nautilist Editor </button>
          <a class="link ba ba b--white bg-white navy bw1 pa2 mr2 pointer" href="/public"> Public </a>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer" onclick="${aboutModal.open()}"> About </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer dn" onclick="${shareModal.open()}"> Share </button>
          <button class="ba ba b--white bg-white navy bw1 pa2 mr2 pointer dn" onclick="${searchModal.open()}"> 🔎 Search </button>
        </div>
        <div class="flex flex-row items-center">
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2 pointer" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2 pointer" onclick="${saveToPublic(state, emit)}">Save</button>
          <button class="ba dropshadow ba b--white bg-lightest-blue dark-pink bw1 pa2 mr2 pointer" onclick="${saveMd}">Download</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2 pointer" onclick="${openFile}">Open</button>
          <input class="dn" type="file" id="fileSelect" onchange="${handleFiles}">
        </div>
      </header>
      <div class=" w-100 flex flex-row justify-end items-center pa2">
        <small class="f7" id="lastUpdated"></small>
        ${isAuthd()}
      </div>
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