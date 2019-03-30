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
      <ul class="w-100 h-100 pa2 overflow-scroll-y">
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
      <fieldset class="w-100 h-100 bg-white ba b--black bw2">
      <legend class="pl2 pr2 ba bw2">workspace</legend>
        <div class="bn w-100 bg-near-white">
          <form class="w-100 flex flex-column">
            <input class="bn pa2 f4" type="text" value="New Title">
            <textarea class="bn pa2 resize-none"  type="text">New Project description</textarea>
          </form>
        </div>
        ${this.sortableList()}
      </fieldset>
    </section>
    `
  }

  update () {
    return false 
  }
}

module.exports = Editor