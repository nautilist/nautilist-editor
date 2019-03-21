var Component = require('choo/component')
var html = require('choo/html')

function Footer(){
  return html`
    <footer class="w-100 bg-navy hot-pink pa4 flex flex-column flex-row-ns" style="min-height:300px">
      <ul class="list pl0 w-third">
        <li>Imprint</li>
        <li>License</li>
      </ul>
      <ul class="list pl0 w-third">
      <li>Contact</li>
      <li>Contribute</li>
      </ul>

      <ul class="list pl0 w-third">
        <li>© 2019 NAUTILIST IS AN OPEN EDUCATIONAL INITIATIVE BY ITP.</li>
      </ul>
      
    </footer>
  `
}

module.exports = Footer