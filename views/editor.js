const html = require('choo/html')
// const Editor = require('../components/Editor');
// const EditorMenu = require('../components/EditorMenu');
// const EditorResourcesSidebar = require('../components/EditorResourcesSidebar');
const EditorHelpModal = require("../components/Editor/EditorHelpModal");
const NavbarTop = require("../components/NavbarTop");
const AddFeatureModal = require("../components/AddFeatureModal");
const EditFeatureModal = require("../components/Editor/EditFeatureModal");

const TITLE = 'Nautilist Web Editor'


module.exports = view

// ${Editor(state, emit)}
function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html `
    <body class="w-100 h-100 code lh-copy flex flex-column">
      <!-- nav bar -->  
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <!-- main -->
      ${Editor(state, emit)}
      <!-- modals --> 
      ${state.cache(EditorHelpModal,"EditorHelpModal", state, emit).render()}
      ${state.cache(AddFeatureModal, "AddFeatureModal", state, emit).render()}
      ${state.cache(EditFeatureModal,"EditFeatureModal", state, emit).render()}
    </body>
  `

}

function Editor(state, emit){

  return html`
  <main class="w-100 flex flex-column flex-grow-1 pa2">
    ${EditorMenu(state, emit)}
    <div class="flex flex-row h-100">
      ${EditorSidebar(state, emit)}
      ${EditorWorkspace(state, emit)}
    </div>
  </main>
  `
}

function EditorMenu(state, emit){

  return html`
    <fieldset class="w-100 ma0 h-auto b--black bw1 ba">
      <legend class="f7 b--black bw1 ba pl2 pr2">edit by</legend>
      <ul class="list pl0 ma0 h-100 flex flex-row">
        <li class="h-100 mr2"><button class="bn dropshadow h-100 pl2 pr2">list</button></li>
        <li class="h-100 mr2"><button class="bn dropshadow h-100 pl2 pr2">track</button></li>
        <li class="h-100 mr2"><button class="bn dropshadow h-100 pl2 pr2">collection</button></li>
      </ul>
    </fieldset>
  `
}


function EditorSidebar(state, emit){
  
  return html`
    <section class="w-third-ns w-100 h-100 outline">
    </section>
  `
}


function EditorWorkspace(state, emit){

  return html`
    <section class="w-two-thirds-ns w-100 h-100 outline">
    </section>
  `

}




// const css = require('sheetify')
// var FileSaver = require('file-saver');
// const slugify = require('slugify')
// const md2jt = require('../helpers/md2jt');
// const CodeEditor = require("../components/CodeEditor");
// const VisualEditor = require("../components/VisualEditor");
// const ShareModal = require("../components/ShareModal");
// const SearchModal = require("../components/SearchModal");
// const EditFeatureModal = require("../components/EditFeatureModal");

// const editFeatureModal = new EditFeatureModal("EditFeatureModal", state, emit)
// ${editFeatureModal.render()}


/**
 * 
 * <div class="w-50 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${visualEditor.render()}
          </div>
        </div>
        <div class="w-50 h-100 pa1">
          <div class="ba bw2 b--black w-100 h-100">
          ${codeEditor.render()}
          </div>
        </div>
 */


 // const codeEditor = new CodeEditor("CodeEditor", state, emit);
  // const visualEditor = new VisualEditor("VisualEditor", state, emit, editFeatureModal);
  // const shareModal = new ShareModal("ShareModal", state, emit)
  // const searchModal = new SearchModal("SearchModal", state, emit)
  
  // function updateEditorView() {
  //   // add in clientIDs
  //   emit("json:addClientId", state.workspace.json)
  //   // rerender
  //   visualEditor.rerender()
  // }

  // function saveMd() {
  //   console.log(state.workspace.yaml)
  //   let blob = new Blob([state.workspace.md], {
  //     type: "application/x-markdown;charset=utf-8"
  //   });
  //   let fileName = slugify(state.workspace.json.name) + '.md'
  //   FileSaver.saveAs(blob, fileName);
  // }

  // function openFile(e) {
  //   // alert("TODO: open file!")
  //   let fileElem = document.querySelector("#fileSelect")
  //   if (fileElem) {
  //     fileElem.click();
  //   }
  // }

  // function handleFiles() {
  //   const myFile = this.files[0]; /* now you can work with the file list */
  //   const reader = new FileReader();

  //   reader.onload = (function (theFile) {
  //     return e => {
  //       try {
  //         let inputMd = e.target.result;
  //         // emit(state.events.workspace_yaml_update, yaml);
  //         emit(state.events.workspace_all_update, md2jt.md2json(inputMd));
  //         // codeEditor.editor.value = state.workspace.yaml;
  //       } catch (err) {
  //         alert("not working!")
  //       }
  //     }
  //   })(myFile)
  //   reader.readAsText(myFile);
  // }

  // function logout() {
  //   emit(state.events.user_logout);
  // }

  // function isAuthd() {
  //   if (state.user.authenticated === false || state.user.authenticated === undefined || state.user.authenticated === '') {
  //     return html `<a class="mr3 black underline" href="/login">login</a>`
  //   }
  //   return html `<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/users/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
  // }

  // function saveToPublic(state, emit) {
  //   return e => {
  //     console.log('saving to public')
  //     // emit(state.events.workspace_findOneAndUpdate);
  //     const {
  //       _id
  //     } = state.workspace;

  //     let payload = {
  //       html: '',
  //       md: state.workspace.md,
  //       json: state.workspace.json,
  //       name: state.workspace.json.name,
  //       description: state.workspace.json.description
  //     }

  //     // if there's no ID, then create a new feature
  //     if (_id === null) {
  //       // submit the payload to the server annonymously
  //       feathersClient.service("/api/projects").create(payload).then(result => {
  //         state.workspace.json = result.json
  //         state.workspace.md = result.md
  //         state.workspace._id = result._id

  //         // add in clientIDs
  //         alert("new list created!")
  //         emit("json:addClientId", state.workspace.json)
  //         // rerender
  //         visualEditor.rerender()
  //       }).catch(err => {
  //         alert(err);
  //         return err;
  //       })
  //     } else {

  //       if (state.user.authenticated === false || state.user.authenticated === '') {
  //         // submit the payload to the server annonymously
  //         feathersClient.service("/api/projects").create(payload).then(result => {
  //           state.workspace.json = result.json
  //           state.workspace.md = result.md
  //           state.workspace._id = result._id

  //           alert("new list created!")
  //           emit("json:addClientId", state.workspace.json)
  //           // rerender
  //           visualEditor.rerender()
            
  //         }).catch(err => {
  //           alert(err);
  //           return err;
  //         });

  //       } else {
  //         let data = {
  //           $set: payload
  //         }

  //         feathersClient.service('/api/projects').patch(_id, data).then(result => {
  //           console.log("🌈🌈🌈🌈", result);
  //           state.workspace.json = result.json
  //           state.workspace.md = result.md
  //           state.workspace._id = result._id

  //           document.querySelector("#lastUpdated").innerHTML = `updated: ${result.updatedAt}  `;
  //           emit("json:addClientId", state.workspace.json)
  //           // rerender
  //           visualEditor.rerender()
  //         }).catch(err => {
  //           alert(err);
  //           return err;
  //         })
  //       }


  //     }
  //   }
  // }