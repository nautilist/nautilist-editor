var Component = require('choo/component')
var html = require('choo/html')

class AddFeatureBtn extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      popup:'dn'
    }
    this.toggleButton = this.toggleButton.bind(this);
    this.triggerModal = this.triggerModal.bind(this);
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

  triggerModal(feature){
    return e =>{
      this.state.components.AddFeatureModal.featureType = feature;
      this.state.components.AddFeatureModal.open();
    }
  }

  createElement () {
    return html`
      <div class="fixed bottom-0 right-0 max-z mr3 mb3">
        <div class="absolute ${this.local.popup}" style="bottom:56px; right:0px;">
          <ul class="list pl0 w4 tr dropshadow">
            <li>
              <button 
                onclick=${this.triggerModal('links')}
                class="button-reset w-100 tc grow ba bw1 bg-light-green b--white pa1"> <p class="w-100 h1"><img class="h1" src="/assets/1F517.png"> link</p>
              </button>
            </li>
            <li>
              <button 
                onclick=${this.triggerModal('lists')}
                class="button-reset w-100 tc grow ba bw1 bg-yellow b--white pa1"> <p class="w-100 h1"><img class="h1" src="/assets/1F4A5.png"> list</p>
              </button>
            </li>
            <li class="dn">
              <button 
                onclick=${this.triggerModal('tracks')}
                class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">track
              </button>
            </li>
            <li class="dn">
              <button 
                onclick=${this.triggerModal('collections')}
                class="button-reset bg-near-white w-100 tr grow ba bw1 b--white pa1">collection
              </button>
            </li>
          </ul>
        </div>
        <button class="absolute bottom-0 right-0 bn w3 h3 br-100 bg-light-pink shadow-5" onclick=${this.toggleButton}>+</button>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = AddFeatureBtn