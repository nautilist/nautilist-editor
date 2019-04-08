
const html = require('choo/html');

function showOwner(details){
    return html`<p class="f6 mt1 ma0">By <a class="link black underline" href="/users/${details.username}">${details.username}</a></p>`
}

module.exports = showOwner