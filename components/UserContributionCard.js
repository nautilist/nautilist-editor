const html = require('choo/html');

module.exports = function(route, feature){
    const {_id, name, description, colors, selectedColor} = feature
    return html`
        <li class="w-100 dropshadow mb3">
        <a class="link black" href="/${route}/${_id}">
          <div class="flex pa3-ns pa1 bg-light-gray flex flex-row-ns flex-column items-center">
            <div class="h1 w-100 h2-ns w2-ns mr4-ns mr0" style="background-color:${colors[selectedColor]}"></div>
            <div class="flex flex-column w-80-ns w-100">
              <h3 class="ma0">${name}</h3>
              <p class="ma0 truncate f6">${description}</p>
            </div>
          </div>
        </a>
        </li>
      `
}