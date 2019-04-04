var Component = require('choo/component')
var html = require('choo/html')

class AddFeatureBtn extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      popup:'dn'
    }
    this.toggleButton = this.toggleButton.bind(this);
  }

  toggleButton(e){
    if(this.local.popup == 'dn'){
      this.local.popup = 'flex';
      this.rerender();
    } else {
      this.local.popup = 'dn';
      this.rerender();
    }
  }

  triggerModal(){
    
  }

  createElement () {
    return html`
      <div class="fixed bottom-0 right-0 max-z mr3 mb3">
        <div class="absolute ${this.local.popup}" style="bottom:56px; right:0px;">
          <ul class="list pl0 w4 tr dropshadow">
            <li><button class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">link</button></li>
            <li><button class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">list</button></li>
            <li><button class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">track</button></li>
            <li><button class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">collection</button></li>
          </ul>
        </div>
        <button class="absolute bottom-0 right-0 bn w3 h3 br-100 bg-dark-pink shadow-5" onclick=${this.toggleButton}>+</button>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = AddFeatureBtn