var Component = require('choo/component')
var html = require('choo/html')

function Footer(){
  return html`
    <footer class="w-100 bg-navy hot-pink pa4 flex flex-column flex-row-ns" style="min-height:300px">
      <ul class="list pl0 w-third-ns w-100">
        <li>Imprint</li>
        <li>License</li>
        <li><a class="link hot-pink" href="https://github.com/nautilist" target="_blank">Contribute</a></li>
        <li><a class="link hot-pink" href="https://github.com/nautilist/nautilist-editor" target="_blank">Issues/Reporting</a></li>
      </ul>

      <ul class="list pl0 w-two-thirds-ns w-100">
        <li>© 2019 NAUTILIST IS AN OPEN EDUCATIONAL INITIATIVE BY ITP.</li>
        <li>Contact: hello.nautilist at gmail dot com</li>
      </ul>
      
    </footer>
  `
}

module.exports = Footer