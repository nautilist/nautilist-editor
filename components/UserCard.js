const html = require('choo/html');
const staticAssetsUrl = "https://nautilist-public.herokuapp.com/images/user_placeholders/"

module.exports = function(user){
    return html`
        <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/users/${user.username}">
            <div class="h-100 dropshadow bg-near-white ma2 tc pa3">
                <img src="${staticAssetsUrl}${user.emojis[user.selectedEmoji]}" class="br-100 h4 w4 dib pa2">
                <h1 class="f3 mb2">${user.username}</h1>
            </div>
        </a>
    `
}