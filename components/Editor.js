var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs');
const EditorResourceSidebar = require('./EditorResourcesSidebar');
const feathersClient = require('../helpers/feathersClient');


class Editor extends Component {
  constructor (id, state, emit) {
    super(id);
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      childNodes: [],
      json:{
        name:state.workspace.name,
        description:state.workspace.description,
        features:[]
      }
    }
    this.sortableList = this.sortableList.bind(this);
    this.updateProjectName = this.updateProjectName.bind(this);
    this.updateProjectDescription = this.updateProjectDescription.bind(this);
  }

  sortableList(){
    let sortableEl = html`
      <ul class="w-100 h-100 pa2 overflow-scroll-y list">
      </ul>
    `
    // console.log(this.state.workspace.childNodes.length)
    this.state.workspace.childNodes.forEach(elm => {
      sortableEl.appendChild(elm)
    })

    let sortable =  new Sortable(sortableEl, {
      group: {
          name: 'shared',
          pull: 'clone'
      },
      animation: 150,
      onSort: (evt) => {
        console.log(evt)
        let {childNodes} = evt.target;
        console.log("updating",childNodes.length)
        
        console.log(childNodes)
        this.state.workspace.childNodes = []
        childNodes.forEach(child => {
          this.state.workspace.childNodes.push(child)
        })

        // reset each time
        // this.local.json.features = [];
        this.state.workspace.json.features = [];
        
        childNodes.forEach(item => {
          // console.log()
          let currentFeature = this.state[item.dataset.db].find(feat => {
            return feat._id == item.id
          });
          // console.log(currentFeature)
          // this.local.json.features.push(currentFeature);
          this.state.workspace.json.features.push(currentFeature);
        })

        let items = evt.item.querySelectorAll('.workspace-view')
        items.forEach(item => {
          item.classList.remove('dn');
        })

      }
    });

    console.log(sortable.el)

    return sortable.el
  }

  updateProjectName(e){
    let {value} = e.target;
    this.state.workspace.name = value;
    this.state.workspace.json.name = value;
    this.local.name = value;
  }
  updateProjectDescription(e){
    let {value} = e.target;
    this.state.workspace.description = value;
    this.state.workspace.json.description = value;
    this.local.description = value;
  }

  createElement () {
    return html`
    <section class="w-100 h-100">
      <fieldset class="w-100 h-100 bg-white ba b--black bw2">
      <legend class="pl2 pr2 ba bw2">workspace</legend>
        <div class="bn w-100 bg-near-white">
          <form class="w-100 flex flex-column">
            <input class="bn pa2 f4" type="text" value="${this.state.workspace.name}" onchange=${this.updateProjectName}>
            <textarea class="bn pa2 resize-none"  type="text" onchange=${this.updateProjectDescription}>${this.state.workspace.description}</textarea>
          </form>
        </div>
        ${this.sortableList()}
      </fieldset>
    </section>
    `
  }

  update () {
    return true 
  }

  // afterupdate(el){
  //   // after each update, rerun sortable to make sure we can keep sorting!
  //   this.makeSortable(el)
  // }

}

module.exports = Editor
