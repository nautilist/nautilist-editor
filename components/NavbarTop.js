var Component = require('choo/component')
var html = require('choo/html');
const NavSelect = require('./NavSelect');

class NavbarTop extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state;
    this.emit = emit;
    this.local = state.components[id] = {
      mobileMenuToggled: 'dn',
      navSelectDisplayed: 'dn'
    }
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.showNavSelect = this.showNavSelect.bind(this);
  }


  toggleMobileMenu(e){
    console.log("clicked!")
    let {mobileMenuToggled} = this.local;
    if(mobileMenuToggled == 'dn'){
      this.local.mobileMenuToggled = 'flex'
    }
    if(mobileMenuToggled == 'flex'){
      this.local.mobileMenuToggled = 'dn'
    }
    this.rerender();
  }

  // TODO: right now we show the select always
  // Is it necessary to check the route? or show always?
  showNavSelect(){
    let routes = ['projects','users','collections', 'users/:id', 'projects/:id', 'collections/:id']
    if(routes.includes(this.state.route)){
      console.log("from navbartop:",this.state.route)
      this.local.navSelectDisplayed = 'flex';
    } else {
      this.local.navSelectDisplayed = 'flex'; // to only show at routes set 'dn'
    }
    this.rerender();
  }

  createElement () {
    return html`
      <nav class="w-100 bb bw1 b--near-white navy h3 flex flex-row justify-between items-center">
        <!-- NAVBAR LEFT -->
        <ul class="list pl0 h-100 dn flex-ns flex-row items-center">
          <li class="ml2 f2 lh-title h-100 w3 bg-white flex flex-column justify-center tc"><a class="link black" href="/"><img src="/assets/logo-wow.png"></a></li>
        </ul>
        
        <!-- NAVBAR RIGHT -->
        <ul class="list pl0 h-100 dn flex-ns flex-row items-center">
          <li class="f6 pr2">${isAuthd(this.state, this.emit)}</li>
        </ul>

        <!-- NAVBAR Mobile -->
        <ul class="w-100 list pl0 h-100 dn-ns flex flex-row justify-between items-center">
        <li class="w3 f2 lh-title h-100 bg-dark-pink flex flex-column justify-center tc"><a class="link black" href="/"><img src="/assets/logo-wow.png"></a></li>
        <li class="pr2"><span onclick=${this.toggleMobileMenu}>Menu</span>
          <ul class="w-100 ${this.local.mobileMenuToggled} fixed flex-column right-0 tr list pr2 mt2">
            <li class="f6 pt1 pb1 pr3 bg-white shadow-5 w-100"><a class="dn link black" href="/">Editor</a></li>
            <li class="f6 pt1 pb1 pr3 bg-white shadow-5 w-100"><a class="dn link black" href="/browse">Browse</a></li>
            <li class="f6 pt1 pb1 pr3 bg-white shadow-5 w-100">${isAuthd(this.state, this.emit)}</span>
          </ul>
        </li>
        </ul>
      </nav>
    `
  }

  update () {
    
    this.showNavSelect();
    return true
  }
}

module.exports = NavbarTop

/**

<li class="f6 pl3"><a class="dn link navy" href="/about">About</a></li>
<li class="f6 pl3"><a class="link navy dn" href="/editor">Editor</a></li>
<li class="f6 pl3"><a class="dn link navy dn" href="/browse">Browse</a></li>
<li class="f6 pl3 flex-row items-center ${this.local.navSelectDisplayed}">Browse by: ${this.state.cache(NavSelect, "NavSelect", this.state, this.emit).render()}</li>

 */

/**
 * logout()
 * @param {*} state 
 * @param {*} emit 
 */
function logout(state, emit) {
  return e => {
    emit(state.events.user_logout);
  }
}

/**
 * isAuthd()
 * @param {*} state 
 * @param {*} emit 
 */
function isAuthd(state, emit){
  if(state.user.authenticated === true){
    let {user} = state;
    return html`
      <span>Hello <a class="link black b pr1" href="/users/${user.username}">${user.username}</a> · <span onclick=${logout(state, emit)}>log out</span> </span>
    `
  }

  return html`
  <span><a class="link black b pr1" href="/login">log in</a> or <a class="pl1 pr2 link black b" href="/signup">sign up</a></span>
  `
}
