var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs');
const EditorResourceSidebar = require('./EditorResourcesSidebar');

class Editor extends Component {
  constructor (id, state, emit) {
    super(id);
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      childNodes: []
    }
    this.sortableList = this.sortableList.bind(this);
  }

  sortableList(){
    let sortableEl = html`
      <ul class="w-100 h-100 pa2 pl0 overflow-scroll-y">
      </ul>
    `

    let sortable =  new Sortable(sortableEl, {
      group: {
          name: 'shared',
          pull: 'clone'
      },
      animation: 150,
      onSort: (evt) => {
        console.log(evt)
        let {childNodes} = evt.srcElement;
        this.local.childNodes = [];
        this.local.childNodes = childNodes

        evt.item.querySelector('.expand-details').classList.remove('dn');
      }
    });
    return sortable.el
  }

  createElement () {
    return html`
    <section class="w-100 h-100">
      <h1 class="ma0">New List</h1>
      <p class="ma0">A radical description for the list of awesomeness!</p>
      <div class="bn bw2 b--black w-100 h-100 bg-near-white">
        ${this.sortableList()}
      </div>
    </section>
    `
  }

  update () {
    return false 
  }
}

module.exports = Editor