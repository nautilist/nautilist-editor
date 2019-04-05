var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs');


class EditableList extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      editable:false,
      toggleEditable: this.toggleEditable.bind(this),
      sortable: null,
      sortables: []
    }
    this.makeSortable = this.makeSortable.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.CreateLinkList = this.CreateLinkList.bind(this);
    this.CreateSectionList = this.CreateSectionList.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.removeBtn = this.removeBtn.bind(this);
  }

  handleRemove(prop, parentid, featureid){
    return e=>{
      let c = confirm(`are you sure you want to remove ${featureid} at ${parentid} of ${prop}?`)
      if(c === true){
        let query, params;

        if(prop === 'links'){
          query={
            "query":{
              "sections._id": parentid
            }
          }
          params={
            "$pull":{
              "sections.$.links": featureid
            }
          }
        } else if(prop === 'sections'){
          query = null,
          
          params = {
            $pull:{
              "sections": {_id: featureid }
            }
          }

        }

        this.state.api.lists.patch(this.state.selectedList._id, params, query)
          .then(result => {
            this.state.selectedList = result;
            this.emit('render');
          })
          .catch(err => {
            alert(err);
          })
        
      } else {
        return;
      }
    }
  }

  removeBtn(prop, parentid, featureid){
    let displayed = this.local.editable === true ? 'fl':'dn'
    return html`
      <button onclick=${this.handleRemove(prop,parentid,featureid)} class="${displayed} f7 bn bg-near-white red">remove</button>
    `
  }

  CreateSectionList(sections, sectionsDetails){
    if(sections && sections.length <= 0){
      return ' no sections! '
    }
    let selectedListId = this.state.selectedList._id
  
    return sections.map(section => {
      return html`
      <li class="mt4 pa3-ns pa2 bg-washed-blue dropshadow ba bw1 b--black" data-id="${section._id}">
        <p class="w-100 flex flex-row justify-end">${this.removeBtn('sections',selectedListId, section._id)}</p>
        <h2 class="f2 lh-title ma0">${section.name}</h2>
        <p class="f5 mt1">${section.description}</p>
        <ul data-sectionid=${section._id} class="list nested-sortable pl0 w-100">
          ${this.CreateLinkList(section.links, sectionsDetails, section)}
        </ul>
      </li>
      `
    })
  
  }

  CreateLinkList(links, linksDetails, section){
    if(links && links.length <= 0){
      return ' no links! '
    }
  
    return links.map(link => {
      
      let detail = linksDetails.find(item => item._id == link);
      let ensureUrl = detail.url ? detail.url: '#';
      return html`
        <li class="mt2 dropshadow pa2 ba bg-washed-red " data-id="${detail._id}">
          <a class="link black" href="${ensureUrl}" target="_blank">
          <p class="w-100 flex flex-row justify-end">${this.removeBtn('links',section._id,detail._id)}</p>
          <h3>${detail.name}</h3>
          <p>${detail.description}</p>
          </a>
        </li>
      `
    })
    
  }

  toggleEditable(e){
    this.local.editable = !this.local.editable;

    this.rerender();
    // console.log("sortable option: ", this.local.sortable.options.disabled)
    // this.local.sortables.forEach(item=> { console.log(item.options.disabled) })
    
  }

  makeSortable(el){
    // reset sortable
    // this.local.sortable = null;
    this.local.sortables = [];
    var nestedSortables = [].slice.call(el.querySelectorAll('.nested-sortable'));

    const sortableConfig = {
      animation: 150,
      direction:'vertical',
      onMove: event => {
        // return !event.related.classList.contains('disabled');
        if(this.local.editable == false){
          return false;
        } else {
          return true
        }
      },
      onSort: this.handleSorting()
    }

    // console.log(nestedSortables)
    
    nestedSortables.forEach( feature => {
      this.local.sortables.push( new Sortable( feature, sortableConfig));
    })

    this.local.sortable = new Sortable(el, sortableConfig)
  }

  handleSorting(item){
    return e => {
      
      let listOrder = this.local.sortables.map(item => {
        return {
          id:  item.el.dataset.sectionid,
          links: item.toArray()
        };
      })

      const sectionOrder = this.local.sortable.toArray()
      
      // console.log("section order: ", sectionOrder);
      // console.log("nested list order: ", listOrder);

      const newSections = sectionOrder.map(sectionid => {
        let data = this.state.selectedList.sections.find(item => item._id === sectionid);
        data.links = listOrder.find(item => item.id === sectionid).links
        return data;
      })

      
      // TODO: make a less precarious way to patch many
      // for now fully overwrite sections
      const params = {
          sections: newSections
      }

      // console.log(params)

      const {_id} = this.state.selectedList;

      this.state.api.lists.patch(_id, params, {})
        .then(result => {
          console.log("patched:", result.links)
          
          const {linksDetails, links} = result;
    
          this.state.selectedList = result;
          // this.rerender();
        })
        .catch(err => {
          alert(err);
        })
    }
  } // end handleSorting

  createElement () {
    const {selectedList} = this.state;

    if(Object.keys(selectedList).length <= 0){
      return html`<ul></ul>`
    }

    const {linksDetails, links, sections, sectionsDetails} = selectedList;
    // ${CreateLinkList(links, linksDetails)}
    return html`
      <ul class="list pl0 mt4 w-100 pt2 pb5 flex-grow-1">
        ${this.CreateSectionList(sections, sectionsDetails)}
      </ul>
    `
  }

  update () {
    return true
  }

  load(el){
    this.makeSortable(el);
  }

  afterupdate(el){
    this.makeSortable(el);
  }
}

module.exports = EditableList


  // if(this.local.editable === false){
    //   this.local.sortable.option('disabled', true);
    //   // this.local.sortable.option('sort', false);
    //   this.local.sortables.forEach(item=> {item.option('disabled', true)})
    //   // this.local.sortables.forEach(item=> {item.option('sort', false)})
    // } else {
    //   this.local.sortable.option('disabled', false);
    //   // this.local.sortable.option('sort', true);
    //   this.local.sortables.forEach(item=> {item.option('disabled', false)})
    //   // this.local.sortables.forEach(item=> {item.option('sort', true)})
    // }