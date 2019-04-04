var Component = require('choo/component')
var html = require('choo/html')
const Sortable = require('sortablejs');

function CreateSectionList(sections, sectionsDetails){
  if(sections && sections.length <= 0){
    return ' no sections! '
  }

  return sections.map(section => {
    return html`
    <li data-id="${section._id}">
      <h2>${section.name}</h2>
      <p>${section.description}</p>
      <ul data-sectionid=${section._id} class="list nested-sortable pl0 w-100">
        ${CreateLinkList(section.links, sectionsDetails)}
      </ul>
    </li>
    `
  })

}

function CreateLinkList(links, linksDetails){
  if(links && links.length <= 0){
    return ' no links! '
  }

  return links.map(link => {
    let detail = linksDetails.find(item => item._id == link);
    return html`
      <li class="mt2 dropshadow pa2 bn bg-near-white" data-id="${detail._id}">
        <h3>${detail.name}</h3>
        <p>${detail.description}</p>
      </li>
    `
  })
  
}

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
  }

  toggleEditable(e){
    this.local.editable = !this.local.editable;
    this.rerender();
    // console.log("sortable options: ",this.local.sortable.options.disabled)
    // this.local.sortables.forEach(item=> { console.log(item.options.disabled)})
  }

  makeSortable(el){
    // reset sortable
    // this.local.sortable = null;
    this.local.sortables = [];
    var nestedSortables = [].slice.call(el.querySelectorAll('.nested-sortable'));

    const sortableConfig = {
      animation: 150,
      direction:'vertical',
      onEnd: this.handleSorting()
    }

    // console.log(nestedSortables)
    
    nestedSortables.forEach( feature => {
      this.local.sortables.push( new Sortable( feature, sortableConfig));
    })

    this.local.sortable = new Sortable(el, sortableConfig)
  }

  handleSorting(item){
    return e => {
      console.log()
      
      // let newOrder = this.local.sortable.toArray()
      
      let listOrder = this.local.sortables.map(item => {
        return {
          id:  item.el.dataset.sectionid,
          links: item.toArray()
        };
      })

      const sectionOrder = this.local.sortable.toArray()
      
      console.log("section order: ", sectionOrder);
      console.log("nested list order: ", listOrder)

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

      console.log(params)

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
    // ${CreateSectionList(sections, sectionsDetails)}
    return html`
      <ul class="list pl0 mt4 w-100 pt2 pb5 flex-grow-1">
        ${CreateSectionList(sections, sectionsDetails)}
      </ul>
    `
  }

  update () {
    // this.makeSortable(el);
    return true
  }

  load(el){
    this.makeSortable(el);

    if(this.local.editable === false){
      this.local.sortable.option('disabled', true);
      this.local.sortables.forEach(item=> {item.option('disabled', true)})
    } else {
      this.local.sortable.option('disabled', false); 
      this.local.sortables.forEach(item=> {item.option('disabled', false)})
    }

  }

  afterupdate(el){
    this.makeSortable(el);

    if(this.local.editable === false){
      this.local.sortable.option('disabled', true);
      this.local.sortables.forEach(item=> {item.option('disabled', true)})
    } else {
      this.local.sortable.option('disabled', false); 
      this.local.sortables.forEach(item=> {item.option('disabled', false)})
    }
  }
}

module.exports = EditableList


/**
 // this.makeSortable(el);
    // if(this.local.editable === true){
    //   this.local.sortable.option('disabled', false);
    // } else{
    //   this.local.sortable.option('disabled', true);
    // }

    if(this.local.editable === true){
      this.local.sortable.option('disabled', false);
    } else{
      this.local.sortable.option('disabled', true);
    }


      let newOrder = this.local.sortable.toArray()
      
      const params = {
          links: newOrder
      }

      const {_id} = this.state.selectedList;
      this.state.api.lists.patch(_id, params, {})
        .then(result => {
          console.log("patched:", result.links)
          this.state.selectedList = result;
          
          this.rerender();
        })
        .catch(err => {
          alert(err);
        })


        store:{
        get: (sortable) => {
          return this.state.selectedList.links ? this.state.selectedList.links : []
        },
        set: (sortable) => {
          var newOrder = sortable.toArray();
          this.state.selectedList.links = newOrder;
          
          const params = {
            links: newOrder
          }
    
          const {_id} = this.state.selectedList;
          this.state.api.lists.patch(_id, params, {})
            .then(result => {
              console.log("patched:", result.links)
              this.state.selectedList = result;
              // this.rerender();
            })
            .catch(err => {
              alert(err);
            })
        }
      },
 */