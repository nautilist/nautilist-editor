var html = require('choo/html')
const NavbarTop = require('../components/NavbarTop');
const Footer = require('../components/Footer');

module.exports = view

function view (state, emit) {
  return html`
    <body class="w-100 h-100 code lh-copy">
      ${state.cache(NavbarTop, "NavbarTop", state, emit).render()}
      <header class="w-100 pa4 flex flex-column items-center">
        <div class="w-100 pa4 flex flex-row items-center justify-center">
          <img class="h3" src="/assets/1F308.png">
          <h1 class="f1 f-headline lh-solid tl pa2 tc ma0"><img class="h3" src="/assets/1F4DD.png"></h1>
          <img class="h3 reverse-img" src="/assets/1F308.png">
        </div>
        <h2 class="tc mw6 b f2 ma2">Welcome to the Nautilist Project.</h2>
        <p class="tc mw6">Have you ever had to share the same list of stuff with friends over and over again? Have you ever wished you could quickly reuse parts of syllabus or tutorial? The core principle of Nautilist is to allow curating and sharing useful lists of links, fast and easy.</p>
      </header>
      
      <main class="w-100 flex flex-column justify-start items-start mb4">
        ${gettingStartedSection(state, emit)}
        ${acknowledgementsSection(state, emit)}
      </main>
      ${Footer()}
    </body>
  `
}

function gettingStartedSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Getting Started</h2>
    <div class="w-100 flex flex-row-ns flex-column items-center justify-center tl mw7">
        Get started building lists and sharing with the creative community. Here's a few helpful tips to get you started.
    </div>
    <div class="w-100 tl mw7 mt4">
      <h3>Create an account</h3>
      <p>Create a Nautilist account at <a class="link black underline" href="https://editor.nautilists.com/signup">editor.nautilists.com/signup</a>. If you've already created an account you can also simply, <a class="link black underline" href="https://editor.nautilists.com/login">log in</a> to start making and saving lists.</p>
    </div>

    <div class="w-100 tl mw7 mt4">
      <h3>Create a new list</h3>
      <p>Start building a list of links using the <a class="link black underline" href="https://editor.nautilists.com/">Nautilist Editor</a>. You can build your lists using the visual editor or using the special markdown syntax.</p>
      <div class="w-100" style="height:380px">
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/9em72QpAsmc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

    <div class="w-100 tl mw7 mt4">
      <h3>Add Collaborators</h3>
      <p>As a creator of a list, you can add collaborators that will be able to edit and add to your list. This can be a great way to collaborate with friends or work with students.</p>
      <div class="w-100" style="height:380px">
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/A2jsRVycnYc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

    

    <div class="w-100 tl mw7 mt4">
      <h3>Organizing and following Collections</h3>
      <p>Organize projects into collections. Anyone can add a project to a collection. As a collection owner you can remove projects. You can follow collections to keep an eye on them if you think they are interesting.</p>
      <div class="w-100" style="height:380px">
      <iframe width="100%" height="100%" src="https://www.youtube.com/embed/epez9CuSKu4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

  </section>
  `
}

function acknowledgementsSection(state, emit){
  
  return html`
  <section class="w-100 pa4 flex flex-column items-center">
    <h2 class="w-100 tc f2 lh-title">Acknowledgements</h2>
    <div class="w-100 tl mw7 mt4">
    <p>Nautilist is supported and maintained by NYU's Intertelecommunications Program. The project was materialized by <a class="link black underline" href="https://jk-lee.com" target="_blank">Joey Lee</a> through ITP's <a class="link black underline"  href="https://tisch.nyu.edu/itp/itp-people/faculty/somethings-in-residence-sirs" target="_blank">Something in Residence Program</a> under the supervision of Shawn Van Every, Dan Shiffman, and Dan O'Sullivan.</p>
    <p>Emojis via the <a class="link black underline" href="http://openmoji.org/index.html" target="_blank">OpenMoji Project</a> by the clever folks at <a class="link black underline" href="http://openmoji.org/about.html" target="_blank">Hfg Schwäbisch Gmünd</a>.</p>
    <p>Built with <a class="link black underline" href="https://choo.io/" target="_blank">Choo.js</a> & <a class="link black underline" href="https://feathersjs.com/" target="_blank">Feathers.js</a></p>
    <p>Other really cool projects worth exploring: 
      <a class="link black underline" href="https://subdex.co/" target="_blank">subdex.co</a> & 
      <a class="link black underline" href="https://www.instructables.com/" target="_blank">instructables</a>  
    </p>
    </div>
    <div class="w-100 tc mt4">
      
    </div>
  </section>
  `
}