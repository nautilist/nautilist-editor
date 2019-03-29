const html = require('choo/html')
const css = require('sheetify')
var FileSaver = require('file-saver');
const slugify = require('slugify')
// const yaml = require('js-yaml');
const md2jt = require('../helpers/md2jt');
const feathersClient = require('../helpers/feathersClient')
const Sortable = require('sortablejs');
const Editor = require('../components/Editor');

const TITLE = 'Nautilist Web Editor'

const CodeEditor = require("../components/CodeEditor");
const VisualEditor = require("../components/VisualEditor");
const EditorHelpModal = require("../components/EditorHelpModal");
const ShareModal = require("../components/ShareModal");
const SearchModal = require("../components/SearchModal");
const EditFeatureModal = require("../components/EditFeatureModal");
const NavbarTop = require("../components/NavbarTop");

css `
html{
  width:100%;
  height:100%;
  /** padding: 1em; **/
}

.reverse-img{
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
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
  const editorHelpModal = new EditorHelpModal("EditorHelpModal", state, emit)
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
    return html `<p class="f6 ma0 black mr3">Hello, <a class="link black underline" href="/users/${state.user.username}">@${state.user.username}</a> | <span onclick="${logout}">👋</span> </p>`
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

  /**
   * <div class=" w-100 flex flex-row justify-end items-center pt1 pb1 pr2">
            <small class="f7" id="lastUpdated"></small>
          </div>
   */
  return html `
    <body class="w-100 h-100 code lh-copy flex flex-column">
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <main class="w-100 h-auto flex flex-column justify-start items-start" style="flex:1">
      
      <section class="w-100 h-100 flex flex-row-ns flex-column justify-start items-start min-height-0">
      <div class="w-100 w-third-ns h-100-ns pa1">
        ${supplyArea(state, emit)}
      </div>
      <div class="w-100 w-two-thirds-ns h-100 pa1">
        ${state.cache(Editor, 'Editor', state, emit).render()}
      </div>
      </section>
      </main>
      ${editorHelpModal.render()}
      ${editFeatureModal.render()}
    </body>
  `

}

function supplyArea(state, emit){

  function showSelected(data){
    return e=> {
    switch(data){
      case 'projects':
        feathersClient.service('/api/projects').find({}).then(result =>{
          state.projects = result.data
          state.editor.currentTab = 'projects'
          emit('render');
        }).catch(err => {
          alert(err)
        })
        break;
      case 'collections':
        feathersClient.service('/api/collections').find({}).then(result =>{
          state.collections = result.data
          state.editor.currentTab = 'collections'
          emit('render');
        }).catch(err => {
          alert(err)
        })
        break
      default:
        return [];
        break
    }

    }
  }

  function renderSelected(){
    if(!state[state.editor.currentTab].length > 0){
      showSelected(state.editor.currentTab)
    } 

    return state[state.editor.currentTab].map(feat => {
      return html`
        <li class="f7 w-100 dropshadow list mb2 ba bw1 pa2" id="${feat._id}" style="border-color:${feat.colors[feat.selectedColor]}">
          <h4 class="ma0 f7 b">${feat.name}</h4>
          <small class="f7">by ${feat.ownerDetails.username}</small>
          <p class="ma0 f7">${feat.description}</p>
        </li>
      `
    })
    
  }

  function sortableList(){
    let sortableEl = html`
      <ul class="w-100 pa2 pl0 overflow-scroll-y">
      ${renderSelected()}
      </ul>
    `

    let sortable =  new Sortable(sortableEl, {
      group: {
          name: 'shared',
          pull: 'clone'
      },
      animation: 150
    });
    return sortable.el
  }

  return html`
  <div class="bn bw1 b--black w-100 h-100 pa2">
    <ul class="pl0 list w-100 flex flex-row justify-center ma0">
      <li class="mr2"><button class="f7 bn dropshadow pa2"
        onclick=${showSelected('links')}>links</button></li>
      <li class="mr2"><button class="f7 bn dropshadow pa2"
        onclick=${showSelected('projects')}>projects</button></li>
      <li class=""><button class="f7 bn dropshadow pa2"
        onclick=${showSelected('collections')}>collections</button></li>
    </ul>
    <form class="w-100 mt3 shadow-5">
    <input class="w-100 ba bw1 b--green f7 pa2" type="search" placeholder="search">
    </form>
    <div class="w-100">
      ${sortableList()}
    </div>
  </div>
  `
}

function workspaceArea(){

  function sortableList(){
    let sortableEl = html`
      <ul class="w-100 h-100 pa2 pl0 overflow-scroll-y">

      </ul>
    `

    let sortable =  new Sortable(sortableEl, {
      group: {
          name: 'shared',
          pull: 'clone'
      },
      animation: 150
    });
    return sortable.el
  }

  return html`
  <div class="bn bw2 b--black w-100 h-100 bg-near-white">
    ${sortableList()}
  </div>
  `
}

/**
 * 
 <header class="w-100 flex flex-row justify-between items-center pl1 pt1 pb1 pr2">
        <div class="flex flex-row items-center">
          <button class="ba ba b--black dropshadow bg-white navy bw1 pa2 mr2 pointer" onclick="${editorHelpModal.open()}"> ? </button>
          <div class=" w-100 flex flex-row justify-end items-center pt1 pb1 pr2">
            <small class="f7" id="lastUpdated"></small>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <button class="ba dropshadow ba b--white bg-yellow navy bw1 pa2 mr2 pointer" onclick="${updateEditorView}">▶ Run</button>
          <button class="ba dropshadow ba b--white bg-navy dark-pink bw1 pa2 mr2 pointer" onclick="${saveToPublic(state, emit)}">Save</button>
          <button class="ba dropshadow ba b--white bg-lightest-blue dark-pink bw1 pa2 mr2 pointer" onclick="${saveMd}">Download</button>
          <button class="ba dropshadow ba b--white bg-white purple bw1 pa2 pointer" onclick="${openFile}">Open</button>
          <input class="dn" type="file" id="fileSelect" onchange="${handleFiles}">
        </div>
      </header>
 */

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