var Component = require('choo/component')
var html = require('choo/html')
const feathersClient = require('../helpers/feathersClient');

class BrowseSearchBar extends Component {
  constructor (id, state, emit, apiUrl, collectionName) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.apiUrl = apiUrl;
    this.collectionName = collectionName
    this.local = state.components[id] = {
      searchTerm:''
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(){
    let apiUrl;
    if(this.state.route == 'projects' || this.state.route == 'collections'){
      apiUrl = `/api/${this.state.route}`;
    } else {
      apiUrl = `/${this.state.route}`;
    }
    
    let collectionName = this.state.route
    console.log(collectionName, apiUrl)
    return e => {
      e.preventDefault()

      let searchQuery;
      
      if(this.local.searchTerm != ''){
        searchQuery = {
          "query": {
            "$text":{"$search": this.local.searchTerm}
          }
        }
      } else {
        searchQuery = {}
      }

      
      feathersClient.service(apiUrl).find(searchQuery).then(results => {
        if(results.data.length > 0){
          this.state[collectionName] = results.data
          this.emit('render')
        } else {
          alert("We couldn't find anything that matches your query - try perhaps some more specific keywords :) ")
        }
      })
      .catch(err => {
        alert('Something went wrong, returning the latest entries')
        feathersClient.service(apiUrl).find({}).then(results => {
          this.state[collectionName] = results.data
          this.emit('render')
        }).catch(err => {
          alert (err)
        })

      })
    }
  }

  onChange(e){
    e.preventDefault();
    this.local.searchTerm = e.currentTarget.value
    // console.log(this.local.searchTerm);
    // this.state.projects = this.state.projects.filter(item => {
    //   if(item.name.includes(this.local.searchTerm) || 
    //   item.ownerDetails.username.includes(this.local.searchTerm)){
    //     return item
    //   }
    // })
    // console.log(this.state.projects.length)
  }

  createElement () {
    return html`
    <section class="w-100 pa4 flex flex-column items-center">
      <form class="w-100 mw6 flex flex-row shadow-5 ba b--green" onsubmit=${this.onSubmit()}>
        <input class="input-reset h-100 w-two-thirds b--green pl2 bn" type="search" 
          value="${this.local.searchTerm}"
          onkeyup=${this.onChange}
          placeholder="search by title or description">
        <button class="input-reset pa2 h-100 w-third b--green bw1 bg-washed-green" style="border-left:1px solid #19A974; border-top:none; border-right:none; border-bottom:none">search</button>
      </form>
      </section>
    `
  }

  update () {
    return true
  }
}

module.exports = BrowseSearchBar