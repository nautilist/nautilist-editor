var Component = require('choo/component')
var html = require('choo/html')
const feathersClient = require('../../helpers/feathersClient')


function newProject(state, emit){
  return e=>{

  
  state.workspace.json = {
    name:'',
    description:'',
    features:[]
  }
  state.workspace.name = 'New Project'
  state.workspace.description = 'New project description for all to see'
  state.workspace.md = ''
  // TODO - write function to convert json to childNodes
  state.workspace.childNodes = [];
  state.workspace._id = ''
  emit('render');
  }
  
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
      json: JSON.parse(JSON.stringify(state.workspace.json)),
      name: state.workspace.name,
      description: state.workspace.description
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
        // visualEditor.rerender()
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
          // TODO - write function to convert json to childNodes
          state.workspace.childNodes = result.childNodes 
          state.workspace._id = result._id

          alert("new list created!")
          emit("json:addClientId", state.workspace.json)
          // rerender
          // visualEditor.rerender()
          
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
          // visualEditor.rerender()
        }).catch(err => {
          alert(err);
          return err;
        })
      }


    }
  }
}

class EditorMenu extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {}
  }

  createElement () {
    return html`
    <ul class="w-100 flex flex-row list justify-end items-end pr2 pl2 pt2">
      <li class="pr2"><p class="f7 ma0" id="lastUpdated"></p></li>
      <li class="pr2"><buttton class="h2 pa2 dropshadow bg-yellow navy" onclick=${saveToPublic(this.state, this.emit)}>Save Project</button></li>
      <li class="pr2"><buttton class="h2 pa2 dropshadow bg-navy yellow" onclick=${newProject(this.state, this.emit)}>New Project</button></li>
      <li class="pr2"><buttton class="dn h2 pa2 dropshadow bg-white navy">Download</button></li>
      <li><buttton class="dn h2 pa2 dropshadow bg-white navy">Open</button></li>
    </ul>
    `
  }

  update () {
    return true
  }
}

module.exports = EditorMenu